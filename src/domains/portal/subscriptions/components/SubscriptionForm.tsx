import { useFormik } from 'formik';
import { useState, useEffect, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/common/components/ui/dialog';
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import { Label } from '@/common/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/common/components/ui/select';
import { Badge } from '@/common/components/ui/badge';
import { Subscription, SubscriptionFormData, Organization } from '../types';
import type { Plan } from '@/common/models/plan.model';
import { subscriptionValidationSchema } from '../validations';
import {
  buildInitialFormValues,
  computePeriodEnd,
  computeTrialEnd,
  findPlanById,
  toFormCycle,
} from '../utils/formValues';
import { useGetPlansQuery } from '../apis/subscription.api';
import { X, Plus, Calendar, Banknote, Building2, Package } from 'lucide-react';
import { toast } from 'sonner';

interface SubscriptionFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: SubscriptionFormData) => void;
  subscription?: Subscription | null;
  loading?: boolean;
  organizations?: Organization[];
}

export function SubscriptionForm({
  open,
  onClose,
  onSubmit,
  subscription,
  loading,
  organizations = []
}: SubscriptionFormProps) {
  const [featureInput, setFeatureInput] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  // Plans must come through the platform API slice so the request carries the
  // admin's bearer token and the configured API base url.
  const {
    data: plansResponse,
    isFetching: loadingPlans,
    isError: plansFailed,
  } = useGetPlansQuery(undefined, { skip: !open });

  const plans = useMemo(() => plansResponse?.data ?? [], [plansResponse]);

  useEffect(() => {
    if (plansFailed) {
      toast.error('Failed to load plans');
    }
  }, [plansFailed]);

  const formik = useFormik<SubscriptionFormData>({
    initialValues: buildInitialFormValues(subscription),
    validationSchema: subscriptionValidationSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
    enableReinitialize: true,
  });

  // Keep the trigger label and every plan-driven recalculation working when the
  // form is opened on an existing subscription (the plan is not re-picked).
  const currentPlanId = formik.values.plan_id;
  useEffect(() => {
    const plan = findPlanById(plans, currentPlanId);
    setSelectedPlan(plan ?? null);
  }, [plans, currentPlanId]);

  const handlePlanChange = (planId: string) => {
    // Radix fires onValueChange('') on mount under jsdom; ignore it so the
    // pre-selected plan is not wiped.
    if (!planId) return;

    formik.setFieldValue('plan_id', planId);
    const plan = findPlanById(plans, planId);
    setSelectedPlan(plan || null);

    if (plan) {
      // Auto-fill form fields based on selected plan
      formik.setFieldValue('amount', Number(plan.price));
      formik.setFieldValue('billing_cycle', toFormCycle(plan.billing_cycle));
      formik.setFieldValue('features', plan.features ?? []);

      // Calculate end date based on billing cycle and start date
      if (formik.values.starts_at) {
        formik.setFieldValue('ends_at', computePeriodEnd(formik.values.starts_at, plan.billing_cycle));
      }

      // Set trial end date if trial status and plan has trial days
      if (formik.values.status === 'trial' && plan.trial_days > 0) {
        formik.setFieldValue('trial_ends_at', computeTrialEnd(formik.values.starts_at, plan.trial_days));
      }
    }
  };

  const handleStatusChange = (status: 'trial' | 'active') => {
    formik.setFieldValue('status', status);

    if (status === 'active') {
      formik.setFieldValue('trial_ends_at', null);
    } else if (status === 'trial' && selectedPlan && selectedPlan.trial_days > 0) {
      formik.setFieldValue('trial_ends_at', computeTrialEnd(formik.values.starts_at, selectedPlan.trial_days));
    }
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const startDate = e.target.value;
    formik.setFieldValue('starts_at', startDate);

    // Recalculate end date and trial end date
    if (selectedPlan && startDate) {
      formik.setFieldValue('ends_at', computePeriodEnd(startDate, selectedPlan.billing_cycle));

      // Update trial end date if in trial status
      if (formik.values.status === 'trial' && selectedPlan.trial_days > 0) {
        formik.setFieldValue('trial_ends_at', computeTrialEnd(startDate, selectedPlan.trial_days));
      }
    }
  };

  const handleAddFeature = () => {
    if (featureInput.trim()) {
      formik.setFieldValue('features', [...formik.values.features, featureInput.trim()]);
      setFeatureInput('');
    }
  };

  const handleRemoveFeature = (index: number) => {
    const newFeatures = formik.values.features.filter((_, i) => i !== index);
    formik.setFieldValue('features', newFeatures);
  };

  const filteredOrganizations = organizations.filter(org =>
    org.name.toLowerCase().includes('')
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{subscription ? 'Edit Subscription' : 'Create New Subscription'}</DialogTitle>
          <DialogDescription>
            {subscription ? 'Update the subscription details.' : 'Add a new subscription for an organization.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="organization_id">Organization</Label>
              <Select
                value={formik.values.organization_id}
                onValueChange={(value) => formik.setFieldValue('organization_id', value)}
                disabled={!!subscription}
              >
                <SelectTrigger id="organization_id">
                  <SelectValue placeholder="Select organization">
                    {formik.values.organization_id && (
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        {organizations.find(org => String(org.id) === formik.values.organization_id)?.name}
                      </div>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {filteredOrganizations.map((org) => (
                    <SelectItem key={org.id} value={String(org.id)}>
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        <div>
                          <div>{org.name}</div>
                          <div className="text-xs text-muted-foreground">{org.email}</div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formik.touched.organization_id && formik.errors.organization_id && (
                <p className="text-sm text-destructive">{formik.errors.organization_id}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="plan_id">Plan</Label>
              <Select
                value={formik.values.plan_id}
                onValueChange={handlePlanChange}
                disabled={loadingPlans}
              >
                <SelectTrigger id="plan_id">
                  <SelectValue placeholder={loadingPlans ? "Loading plans..." : "Select plan"}>
                    {formik.values.plan_id && selectedPlan && (
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        {selectedPlan.name}
                      </div>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {plans.map((plan) => (
                    <SelectItem key={plan.id} value={String(plan.id)}>
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        <div>
                          <div className="flex items-center gap-2">
                            {plan.name}
                            <Badge variant="outline">{plan.billing_cycle}</Badge>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {/* price arrives as a decimal string from the API */}
                            ₦{Number(plan.price).toLocaleString()}/{toFormCycle(plan.billing_cycle) === 'monthly' ? 'mo' : toFormCycle(plan.billing_cycle) === 'yearly' ? 'yr' : 'once'}
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formik.touched.plan_id && formik.errors.plan_id && (
                <p className="text-sm text-destructive">{formik.errors.plan_id}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formik.values.status}
                onValueChange={handleStatusChange}
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="trial">Trial</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                </SelectContent>
              </Select>
              {formik.touched.status && formik.errors.status && (
                <p className="text-sm text-destructive">{formik.errors.status}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="billing_cycle">Billing Cycle</Label>
              <Select
                value={formik.values.billing_cycle}
                onValueChange={(value) => formik.setFieldValue('billing_cycle', value)}
              >
                <SelectTrigger id="billing_cycle">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                  <SelectItem value="one-time">One-time</SelectItem>
                </SelectContent>
              </Select>
              {formik.touched.billing_cycle && formik.errors.billing_cycle && (
                <p className="text-sm text-destructive">{formik.errors.billing_cycle}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="starts_at">Start Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="starts_at"
                  name="starts_at"
                  type="date"
                  value={formik.values.starts_at}
                  onChange={handleStartDateChange}
                  onBlur={formik.handleBlur}
                  className="pl-10"
                />
              </div>
              {formik.touched.starts_at && formik.errors.starts_at && (
                <p className="text-sm text-destructive">{formik.errors.starts_at}</p>
              )}
            </div>

            {formik.values.status === 'trial' && (
              <div className="space-y-2">
                <Label htmlFor="trial_ends_at">Trial Ends</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="trial_ends_at"
                    name="trial_ends_at"
                    type="date"
                    value={formik.values.trial_ends_at || ''}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="pl-10"
                  />
                </div>
                {formik.touched.trial_ends_at && formik.errors.trial_ends_at && (
                  <p className="text-sm text-destructive">{formik.errors.trial_ends_at}</p>
                )}
              </div>
            )}

            {formik.values.billing_cycle !== 'one-time' && (
              <div className="space-y-2">
                <Label htmlFor="ends_at">End Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="ends_at"
                    name="ends_at"
                    type="date"
                    value={formik.values.ends_at || ''}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="pl-10"
                  />
                </div>
                {formik.touched.ends_at && formik.errors.ends_at && (
                  <p className="text-sm text-destructive">{formik.errors.ends_at}</p>
                )}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount (₦)</Label>
            <div className="relative">
              <Banknote className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                value={formik.values.amount}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="99.99"
                className="pl-10"
              />
            </div>
            {formik.touched.amount && formik.errors.amount && (
              <p className="text-sm text-destructive">{formik.errors.amount}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Features</Label>
            <div className="flex gap-2">
              <Input
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddFeature();
                  }
                }}
                placeholder="Add a feature..."
              />
              <Button
                type="button"
                onClick={handleAddFeature}
                variant="secondary"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formik.values.features.map((feature, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {feature}
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(index)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            {formik.touched.features && formik.errors.features && (
              <p className="text-sm text-destructive">{formik.errors.features as string}</p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : subscription ? 'Update Subscription' : 'Create Subscription'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}