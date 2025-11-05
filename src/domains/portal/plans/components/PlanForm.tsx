import { useFormik } from 'formik';
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
import { Textarea } from '@/common/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/common/components/ui/select';
import { Switch } from '@/common/components/ui/switch';
import { Badge } from '@/common/components/ui/badge';
import { Plan, PlanFormData } from '../types';
import { planValidationSchema } from '../validations';
import { useState } from 'react';
import { X, Plus } from 'lucide-react';

interface PlanFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: PlanFormData) => void;
  plan?: Plan | null;
  loading?: boolean;
}

export function PlanForm({ open, onClose, onSubmit, plan, loading }: PlanFormProps) {
  const [featureInput, setFeatureInput] = useState('');

  const formik = useFormik<PlanFormData>({
    initialValues: {
      name: plan?.name || '',
      slug: plan?.slug || '',
      description: plan?.description || '',
      price: plan?.price || 0,
      billing_cycle: plan?.billing_cycle || 'monthly',
      max_employees: plan?.max_employees || 10,
      max_storage_gb: plan?.max_storage_gb || 10,
      features: plan?.features || [],
      is_active: plan?.is_active ?? true,
      is_popular: plan?.is_popular || false,
      trial_days: plan?.trial_days || 14,
    },
    validationSchema: planValidationSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
    enableReinitialize: true,
  });

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

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    formik.setFieldValue('name', name);
    if (!plan) {
      formik.setFieldValue('slug', generateSlug(name));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{plan ? 'Edit Plan' : 'Create New Plan'}</DialogTitle>
          <DialogDescription>
            {plan ? 'Update the subscription plan details.' : 'Add a new subscription plan to your platform.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Plan Name</Label>
              <Input
                id="name"
                name="name"
                value={formik.values.name}
                onChange={handleNameChange}
                onBlur={formik.handleBlur}
                placeholder="e.g., Professional"
              />
              {formik.touched.name && formik.errors.name && (
                <p className="text-sm text-destructive">{formik.errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                name="slug"
                value={formik.values.slug}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="e.g., professional"
              />
              {formik.touched.slug && formik.errors.slug && (
                <p className="text-sm text-destructive">{formik.errors.slug}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Describe this plan..."
              rows={3}
            />
            {formik.touched.description && formik.errors.description && (
              <p className="text-sm text-destructive">{formik.errors.description}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                value={formik.values.price}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="99.99"
              />
              {formik.touched.price && formik.errors.price && (
                <p className="text-sm text-destructive">{formik.errors.price}</p>
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
              <Label htmlFor="max_employees">Max Employees</Label>
              <Input
                id="max_employees"
                name="max_employees"
                type="number"
                value={formik.values.max_employees}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.max_employees && formik.errors.max_employees && (
                <p className="text-sm text-destructive">{formik.errors.max_employees}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="max_storage_gb">Storage (GB)</Label>
              <Input
                id="max_storage_gb"
                name="max_storage_gb"
                type="number"
                value={formik.values.max_storage_gb}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.max_storage_gb && formik.errors.max_storage_gb && (
                <p className="text-sm text-destructive">{formik.errors.max_storage_gb}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="trial_days">Trial Days</Label>
              <Input
                id="trial_days"
                name="trial_days"
                type="number"
                value={formik.values.trial_days}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.trial_days && formik.errors.trial_days && (
                <p className="text-sm text-destructive">{formik.errors.trial_days}</p>
              )}
            </div>
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

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="is_active">Active Status</Label>
                <p className="text-sm text-muted-foreground">
                  Enable this plan for new subscriptions
                </p>
              </div>
              <Switch
                id="is_active"
                checked={formik.values.is_active}
                onCheckedChange={(checked) => formik.setFieldValue('is_active', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="is_popular">Popular Badge</Label>
                <p className="text-sm text-muted-foreground">
                  Show this plan as popular/recommended
                </p>
              </div>
              <Switch
                id="is_popular"
                checked={formik.values.is_popular}
                onCheckedChange={(checked) => formik.setFieldValue('is_popular', checked)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : plan ? 'Update Plan' : 'Create Plan'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}