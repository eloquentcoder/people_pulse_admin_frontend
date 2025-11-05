import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { CreditCard, Loader2, Save, X } from 'lucide-react';
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import { Label } from '@/common/components/ui/label';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/common/components/ui/dialog';
import { 
  useCreatePaymentGatewayMutation,
  useUpdatePaymentGatewayMutation,
} from '../apis/payment-gateway.api';
import type { PaymentGateway, CreatePaymentGatewayData, UpdatePaymentGatewayData } from '../models/payment-gateway.model';
import { toast } from 'sonner';

interface PaymentGatewayFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  gateway?: PaymentGateway | null;
}

const commonCurrencies = ['USD', 'EUR', 'GBP', 'NGN', 'KES', 'GHS', 'ZAR', 'CAD', 'AUD', 'JPY'];
const commonPaymentMethods = ['card', 'bank_account', 'mobile_money', 'wallet', 'bank_transfer'];

const validationSchema = Yup.object({
  name: Yup.string().required('Gateway name is required').max(255, 'Name must be less than 255 characters'),
  slug: Yup.string()
    .required('Slug is required')
    .matches(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens')
    .max(100, 'Slug must be less than 100 characters'),
  provider_class: Yup.string().required('Provider class is required'),
  transaction_fee_percentage: Yup.number().min(0, 'Fee percentage must be 0 or greater').max(100, 'Fee percentage cannot exceed 100'),
  transaction_fee_fixed: Yup.number().min(0, 'Fixed fee must be 0 or greater'),
  supported_currencies: Yup.array().of(Yup.string()).min(1, 'At least one currency must be selected'),
  supported_payment_methods: Yup.array().of(Yup.string()).min(1, 'At least one payment method must be selected'),
});

export const PaymentGatewayFormModal = ({ isOpen, onClose, onSuccess, gateway }: PaymentGatewayFormModalProps) => {
  const [createGateway, { isLoading: isCreating }] = useCreatePaymentGatewayMutation();
  const [updateGateway, { isLoading: isUpdating }] = useUpdatePaymentGatewayMutation();

  const isLoading = isCreating || isUpdating;

  const formik = useFormik<CreatePaymentGatewayData & { supported_currencies: string[]; supported_payment_methods: string[] }>({
    initialValues: {
      name: gateway?.name || '',
      slug: gateway?.slug || '',
      description: gateway?.description || '',
      provider_class: gateway?.provider_class || '',
      is_active: gateway?.is_active ?? true,
      is_default: gateway?.is_default ?? false,
      supported_currencies: gateway?.supported_currencies || [],
      supported_payment_methods: gateway?.supported_payment_methods || [],
      transaction_fee_percentage: gateway?.transaction_fee_percentage || 0,
      transaction_fee_fixed: gateway?.transaction_fee_fixed || 0,
      logo_url: gateway?.logo_url || '',
      priority: gateway?.priority || 0,
      countries: gateway?.countries || [],
      supports_subscriptions: gateway?.supports_subscriptions ?? true,
      supports_refunds: gateway?.supports_refunds ?? true,
      supports_payouts: gateway?.supports_payouts ?? false,
      webhook_secret: gateway?.webhook_secret || '',
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        if (gateway) {
          // Update existing gateway
          const updateData: UpdatePaymentGatewayData = {
            name: values.name,
            slug: values.slug,
            description: values.description,
            provider_class: values.provider_class,
            is_active: values.is_active,
            is_default: values.is_default,
            supported_currencies: values.supported_currencies,
            supported_payment_methods: values.supported_payment_methods,
            transaction_fee_percentage: values.transaction_fee_percentage,
            transaction_fee_fixed: values.transaction_fee_fixed,
            logo_url: values.logo_url,
            priority: values.priority,
            countries: values.countries,
            supports_subscriptions: values.supports_subscriptions,
            supports_refunds: values.supports_refunds,
            supports_payouts: values.supports_payouts,
            webhook_secret: values.webhook_secret,
          };

          await updateGateway({
            id: gateway.id,
            data: updateData,
          }).unwrap();
          toast.success('Payment gateway updated successfully');
        } else {
          // Create new gateway
          const createData: CreatePaymentGatewayData = {
            name: values.name,
            slug: values.slug,
            description: values.description,
            provider_class: values.provider_class,
            is_active: values.is_active,
            is_default: values.is_default,
            supported_currencies: values.supported_currencies,
            supported_payment_methods: values.supported_payment_methods,
            transaction_fee_percentage: values.transaction_fee_percentage,
            transaction_fee_fixed: values.transaction_fee_fixed,
            logo_url: values.logo_url,
            priority: values.priority,
            countries: values.countries,
            supports_subscriptions: values.supports_subscriptions,
            supports_refunds: values.supports_refunds,
            supports_payouts: values.supports_payouts,
            webhook_secret: values.webhook_secret,
          };

          await createGateway(createData).unwrap();
          toast.success('Payment gateway created successfully');
        }

        onSuccess?.();
        onClose();
        formik.resetForm();
      } catch (error: any) {
        console.error('Failed to save payment gateway:', error);
        toast.error(error?.data?.message || error?.message || 'Failed to save payment gateway');
      }
    },
  });

  useEffect(() => {
    if (gateway && isOpen) {
      formik.setValues({
        name: gateway.name || '',
        slug: gateway.slug || '',
        description: gateway.description || '',
        provider_class: gateway.provider_class || '',
        is_active: gateway.is_active ?? true,
        is_default: gateway.is_default ?? false,
        supported_currencies: gateway.supported_currencies || [],
        supported_payment_methods: gateway.supported_payment_methods || [],
        transaction_fee_percentage: gateway.transaction_fee_percentage || 0,
        transaction_fee_fixed: gateway.transaction_fee_fixed || 0,
        logo_url: gateway.logo_url || '',
        priority: gateway.priority || 0,
        countries: gateway.countries || [],
        supports_subscriptions: gateway.supports_subscriptions ?? true,
        supports_refunds: gateway.supports_refunds ?? true,
        supports_payouts: gateway.supports_payouts ?? false,
        webhook_secret: gateway.webhook_secret || '',
      });
    } else if (!gateway && isOpen) {
      formik.resetForm();
    }
  }, [gateway, isOpen]);

  if (!isOpen) return null;

  const toggleCurrency = (currency: string) => {
    const current = formik.values.supported_currencies || [];
    if (current.includes(currency)) {
      formik.setFieldValue('supported_currencies', current.filter(c => c !== currency));
    } else {
      formik.setFieldValue('supported_currencies', [...current, currency]);
    }
  };

  const togglePaymentMethod = (method: string) => {
    const current = formik.values.supported_payment_methods || [];
    if (current.includes(method)) {
      formik.setFieldValue('supported_payment_methods', current.filter(m => m !== method));
    } else {
      formik.setFieldValue('supported_payment_methods', [...current, method]);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white">
            {gateway ? 'Edit Payment Gateway' : 'Create New Payment Gateway'}
          </DialogTitle>
          <DialogDescription>
            {gateway ? 'Update payment gateway configuration and settings.' : 'Add a new payment gateway to your platform.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Gateway Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="e.g., Stripe"
                  disabled={isLoading}
                />
                {formik.touched.name && formik.errors.name && (
                  <p className="text-sm text-destructive">{formik.errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  name="slug"
                  value={formik.values.slug}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="e.g., stripe"
                  disabled={isLoading}
                />
                {formik.touched.slug && formik.errors.slug && (
                  <p className="text-sm text-destructive">{formik.errors.slug}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                name="description"
                value={formik.values.description || ''}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Brief description of the payment gateway"
                rows={3}
                disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4469e5] focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="provider_class">Provider Class *</Label>
              <Input
                id="provider_class"
                name="provider_class"
                value={formik.values.provider_class}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="e.g., App\Services\Payment\Gateways\StripeGateway"
                disabled={isLoading}
              />
              {formik.touched.provider_class && formik.errors.provider_class && (
                <p className="text-sm text-destructive">{formik.errors.provider_class}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="logo_url">Logo URL</Label>
              <Input
                id="logo_url"
                name="logo_url"
                value={formik.values.logo_url || ''}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="https://example.com/logo.png"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Supported Currencies */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Supported Currencies *</h3>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
              {commonCurrencies.map((currency) => (
                <label
                  key={currency}
                  className="flex items-center gap-2 p-2 rounded border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={formik.values.supported_currencies?.includes(currency) || false}
                    onChange={() => toggleCurrency(currency)}
                    disabled={isLoading}
                    className="rounded border-gray-300 text-[#4469e5] focus:ring-[#4469e5]"
                  />
                  <span className="text-sm text-gray-900 dark:text-white">{currency}</span>
                </label>
              ))}
            </div>
            {formik.touched.supported_currencies && formik.errors.supported_currencies && (
              <p className="text-sm text-destructive">{formik.errors.supported_currencies}</p>
            )}
          </div>

          {/* Supported Payment Methods */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Supported Payment Methods *</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {commonPaymentMethods.map((method) => (
                <label
                  key={method}
                  className="flex items-center gap-2 p-2 rounded border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={formik.values.supported_payment_methods?.includes(method) || false}
                    onChange={() => togglePaymentMethod(method)}
                    disabled={isLoading}
                    className="rounded border-gray-300 text-[#4469e5] focus:ring-[#4469e5]"
                  />
                  <span className="text-sm text-gray-900 dark:text-white capitalize">{method.replace('_', ' ')}</span>
                </label>
              ))}
            </div>
            {formik.touched.supported_payment_methods && formik.errors.supported_payment_methods && (
              <p className="text-sm text-destructive">{formik.errors.supported_payment_methods}</p>
            )}
          </div>

          {/* Transaction Fees */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Transaction Fees</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="transaction_fee_percentage">Fee Percentage (%)</Label>
                <Input
                  id="transaction_fee_percentage"
                  name="transaction_fee_percentage"
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  value={formik.values.transaction_fee_percentage}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="2.9"
                  disabled={isLoading}
                />
                {formik.touched.transaction_fee_percentage && formik.errors.transaction_fee_percentage && (
                  <p className="text-sm text-destructive">{formik.errors.transaction_fee_percentage}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="transaction_fee_fixed">Fixed Fee ($)</Label>
                <Input
                  id="transaction_fee_fixed"
                  name="transaction_fee_fixed"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formik.values.transaction_fee_fixed}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="0.30"
                  disabled={isLoading}
                />
                {formik.touched.transaction_fee_fixed && formik.errors.transaction_fee_fixed && (
                  <p className="text-sm text-destructive">{formik.errors.transaction_fee_fixed}</p>
                )}
              </div>
            </div>
          </div>

          {/* Features & Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Features & Settings</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formik.values.supports_subscriptions}
                  onChange={(e) => formik.setFieldValue('supports_subscriptions', e.target.checked)}
                  disabled={isLoading}
                  className="rounded border-gray-300 text-[#4469e5] focus:ring-[#4469e5]"
                />
                <span className="text-sm text-gray-900 dark:text-white">Supports Subscriptions</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formik.values.supports_refunds}
                  onChange={(e) => formik.setFieldValue('supports_refunds', e.target.checked)}
                  disabled={isLoading}
                  className="rounded border-gray-300 text-[#4469e5] focus:ring-[#4469e5]"
                />
                <span className="text-sm text-gray-900 dark:text-white">Supports Refunds</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formik.values.supports_payouts}
                  onChange={(e) => formik.setFieldValue('supports_payouts', e.target.checked)}
                  disabled={isLoading}
                  className="rounded border-gray-300 text-[#4469e5] focus:ring-[#4469e5]"
                />
                <span className="text-sm text-gray-900 dark:text-white">Supports Payouts</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formik.values.is_active}
                  onChange={(e) => formik.setFieldValue('is_active', e.target.checked)}
                  disabled={isLoading}
                  className="rounded border-gray-300 text-[#4469e5] focus:ring-[#4469e5]"
                />
                <span className="text-sm text-gray-900 dark:text-white">Active</span>
              </label>
              {!gateway && (
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formik.values.is_default}
                    onChange={(e) => formik.setFieldValue('is_default', e.target.checked)}
                    disabled={isLoading}
                    className="rounded border-gray-300 text-[#4469e5] focus:ring-[#4469e5]"
                  />
                  <span className="text-sm text-gray-900 dark:text-white">Set as Default</span>
                </label>
              )}
            </div>
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Input
              id="priority"
              name="priority"
              type="number"
              min="0"
              value={formik.values.priority}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="0"
              disabled={isLoading}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">Lower numbers appear first in lists</p>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-[#4469e5] hover:bg-[#4469e5]/90"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {gateway ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {gateway ? 'Update Gateway' : 'Create Gateway'}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

