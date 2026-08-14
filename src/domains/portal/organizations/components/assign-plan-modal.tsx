import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { X, CreditCard, Calendar, DollarSign, Loader2 } from 'lucide-react';
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import { Label } from '@/common/components/ui/label';
import {
  useGetPlansQuery,
  useCreateSubscriptionMutation,
  useUpdateSubscriptionMutation,
} from '../../subscriptions/apis/subscription.api';
import { toast } from 'sonner';
import type { Subscription } from '@/common/models/subscription.model';
import type { Plan } from '@/common/models/plan.model';
import {
  hasYearlyDiscount,
  normalizeDiscountPercent,
  yearlyTotal,
} from '../../plans/utils/yearlyPricing';

interface AssignPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  organizationId: number;
  currentSubscription?: Subscription | null;
}

const validationSchema = Yup.object({
  plan_id: Yup.number().required('Please select a plan'),
  billing_cycle: Yup.string()
    .oneOf(['monthly', 'yearly'], 'Invalid billing cycle')
    .required('Billing cycle is required'),
  status: Yup.string()
    .oneOf(['active', 'trial'], 'Invalid status')
    .required('Status is required'),
  amount: Yup.number().min(0, 'Amount must be positive').required('Amount is required'),
  starts_at: Yup.string().required('Start date is required'),
});

export const AssignPlanModal = ({
  isOpen,
  onClose,
  onSuccess,
  organizationId,
  currentSubscription,
}: AssignPlanModalProps) => {
  const { data: plansData, isLoading: plansLoading } = useGetPlansQuery();
  const [createSubscription, { isLoading: isCreating }] = useCreateSubscriptionMutation();
  const [updateSubscription, { isLoading: isUpdating }] = useUpdateSubscriptionMutation();

  const plans = plansData?.data || [];
  const isUpgrade = !!currentSubscription && currentSubscription.status !== 'cancelled';
  const isSubmitting = isCreating || isUpdating;

  const today = new Date().toISOString().split('T')[0];

  const formik = useFormik({
    initialValues: {
      plan_id: currentSubscription?.plan_id || 0,
      billing_cycle: (currentSubscription?.billing_cycle || 'monthly') as 'monthly' | 'yearly',
      status: 'active' as 'active' | 'trial',
      amount: currentSubscription?.amount || 0,
      starts_at: today,
      trial_ends_at: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        if (isUpgrade && currentSubscription) {
          await updateSubscription({
            id: currentSubscription.id,
            data: {
              plan_id: values.plan_id,
              billing_cycle: values.billing_cycle,
              amount: values.amount,
              status: values.status,
            },
          }).unwrap();
          toast.success('Plan changed successfully');
        } else {
          await createSubscription({
            organization_id: organizationId,
            plan_id: values.plan_id,
            billing_cycle: values.billing_cycle,
            amount: values.amount,
            status: values.status,
            starts_at: values.starts_at,
            trial_ends_at: values.status === 'trial' ? values.trial_ends_at : undefined,
          }).unwrap();
          toast.success('Plan assigned successfully');
        }
        onSuccess?.();
        onClose();
      } catch (error: any) {
        const message = error?.data?.message || 'Failed to update subscription';
        toast.error(message);
      }
    },
  });

  // Auto-fill amount when plan changes
  useEffect(() => {
    if (formik.values.plan_id) {
      const selectedPlan = plans.find((p) => p.id === formik.values.plan_id);
      if (selectedPlan) {
        const amount =
          formik.values.billing_cycle === 'yearly'
            ? yearlyTotal(selectedPlan.price, selectedPlan.yearly_discount_percent)
            : selectedPlan.price;
        formik.setFieldValue('amount', amount);
      }
    }
  }, [formik.values.plan_id, formik.values.billing_cycle, plans]);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      formik.resetForm({
        values: {
          plan_id: currentSubscription?.plan_id || 0,
          billing_cycle: (currentSubscription?.billing_cycle || 'monthly') as 'monthly' | 'yearly',
          status: 'active',
          amount: currentSubscription?.amount || 0,
          starts_at: today,
          trial_ends_at: '',
        },
      });
    }
  }, [isOpen, currentSubscription]);

  if (!isOpen) return null;

  const selectedPlan = plans.find((p) => p.id === formik.values.plan_id);
  const currentPlan = currentSubscription?.plan;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold">
              {isUpgrade ? 'Change Plan' : 'Assign Plan'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={formik.handleSubmit} className="p-4 space-y-4">
          {/* Current Plan Info (if upgrading) */}
          {isUpgrade && currentPlan && (
            <div className="bg-gray-50 rounded-lg p-3 border">
              <p className="text-sm text-gray-500">Current Plan</p>
              <p className="font-medium">{currentPlan.name}</p>
              <p className="text-sm text-gray-600">
                ${currentSubscription?.amount}/{currentSubscription?.billing_cycle}
              </p>
            </div>
          )}

          {/* Plan Selection */}
          <div className="space-y-2">
            <Label htmlFor="plan_id">Select Plan *</Label>
            {plansLoading ? (
              <div className="flex items-center gap-2 text-gray-500">
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading plans...
              </div>
            ) : (
              <select
                id="plan_id"
                name="plan_id"
                value={formik.values.plan_id}
                onChange={(e) => formik.setFieldValue('plan_id', Number(e.target.value))}
                onBlur={formik.handleBlur}
                className="w-full h-10 px-3 rounded-md border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              >
                <option value={0}>Select a plan...</option>
                {plans
                  .filter((plan) => plan.is_active)
                  .map((plan) => (
                    <option key={plan.id} value={plan.id}>
                      {plan.name} - ${plan.price}/{plan.billing_cycle}
                      {plan.is_popular && ' (Popular)'}
                    </option>
                  ))}
              </select>
            )}
            {formik.touched.plan_id && formik.errors.plan_id && (
              <p className="text-sm text-red-500">{formik.errors.plan_id}</p>
            )}
          </div>

          {/* Selected Plan Details */}
          {selectedPlan && (
            <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-blue-900">{selectedPlan.name}</p>
                  <p className="text-sm text-blue-700">{selectedPlan.description}</p>
                </div>
                {selectedPlan.is_popular && (
                  <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">
                    Popular
                  </span>
                )}
              </div>
              {selectedPlan.features && selectedPlan.features.length > 0 && (
                <div className="mt-2 text-sm text-blue-800">
                  <p className="font-medium">Features:</p>
                  <ul className="list-disc list-inside">
                    {selectedPlan.features.slice(0, 3).map((feature, idx) => (
                      <li key={idx}>{feature}</li>
                    ))}
                    {selectedPlan.features.length > 3 && (
                      <li>+{selectedPlan.features.length - 3} more</li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Billing Cycle */}
          <div className="space-y-2">
            <Label>Billing Cycle *</Label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => formik.setFieldValue('billing_cycle', 'monthly')}
                className={`flex-1 py-2 px-4 rounded-md border transition-colors ${
                  formik.values.billing_cycle === 'monthly'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => formik.setFieldValue('billing_cycle', 'yearly')}
                className={`flex-1 py-2 px-4 rounded-md border transition-colors ${
                  formik.values.billing_cycle === 'yearly'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                Yearly
                {hasYearlyDiscount(selectedPlan?.yearly_discount_percent) && (
                  <span className="ml-1 text-xs text-green-600">
                    (Save {normalizeDiscountPercent(selectedPlan?.yearly_discount_percent)}%)
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">Status *</Label>
            <select
              id="status"
              name="status"
              value={formik.values.status}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full h-10 px-3 rounded-md border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            >
              <option value="active">Active</option>
              <option value="trial">Trial</option>
            </select>
          </div>

          {/* Trial End Date (if trial) */}
          {formik.values.status === 'trial' && (
            <div className="space-y-2">
              <Label htmlFor="trial_ends_at">Trial Ends At</Label>
              <Input
                id="trial_ends_at"
                name="trial_ends_at"
                type="date"
                value={formik.values.trial_ends_at}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                min={today}
              />
            </div>
          )}

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Amount *</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                min="0"
                value={formik.values.amount}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="pl-8"
              />
            </div>
            {formik.touched.amount && formik.errors.amount && (
              <p className="text-sm text-red-500">{formik.errors.amount}</p>
            )}
          </div>

          {/* Start Date (only for new subscriptions) */}
          {!isUpgrade && (
            <div className="space-y-2">
              <Label htmlFor="starts_at">Start Date *</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="starts_at"
                  name="starts_at"
                  type="date"
                  value={formik.values.starts_at}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="pl-8"
                  min={today}
                />
              </div>
              {formik.touched.starts_at && formik.errors.starts_at && (
                <p className="text-sm text-red-500">{formik.errors.starts_at}</p>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !formik.isValid}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {isUpgrade ? 'Changing...' : 'Assigning...'}
                </>
              ) : isUpgrade ? (
                'Change Plan'
              ) : (
                'Assign Plan'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
