import * as Yup from 'yup';

export const planValidationSchema = Yup.object({
  name: Yup.string()
    .required('Plan name is required')
    .min(3, 'Plan name must be at least 3 characters')
    .max(100, 'Plan name must be at most 100 characters'),

  slug: Yup.string()
    .required('Plan slug is required')
    .matches(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers, and hyphens only')
    .min(3, 'Slug must be at least 3 characters')
    .max(50, 'Slug must be at most 50 characters'),

  description: Yup.string()
    .required('Description is required')
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must be at most 500 characters'),

  price: Yup.number()
    .required('Price is required')
    .min(0, 'Price must be non-negative')
    .max(999999.99, 'Price is too high'),

  billing_cycle: Yup.string()
    .required('Billing cycle is required')
    .oneOf(['monthly', 'yearly', 'quarterly', 'one-time'], 'Invalid billing cycle'),

  max_employees: Yup.number()
    .required('Maximum employees is required')
    .integer('Must be a whole number')
    .min(1, 'Must allow at least 1 employee')
    .max(999999, 'Maximum employees is too high'),

  max_storage_gb: Yup.number()
    .required('Maximum storage is required')
    .integer('Must be a whole number')
    .min(1, 'Must allow at least 1 GB')
    .max(999999, 'Maximum storage is too high'),

  features: Yup.array()
    .of(Yup.string().min(1, 'Feature cannot be empty'))
    .optional(),

  feature_ids: Yup.array()
    .of(Yup.string())
    .optional(),

  currency: Yup.string()
    .optional()
    .max(3, 'Currency code must be 3 characters'),

  display_order: Yup.number()
    .optional()
    .integer('Must be a whole number')
    .min(0, 'Display order cannot be negative'),

  parent_plan_id: Yup.string()
    .nullable()
    .optional(),

  is_active: Yup.boolean()
    .required('Active status is required'),

  is_popular: Yup.boolean()
    .required('Popular status is required'),

  trial_days: Yup.number()
    .required('Trial days is required')
    .integer('Must be a whole number')
    .min(0, 'Trial days cannot be negative')
    .max(365, 'Trial days cannot exceed 365'),
});