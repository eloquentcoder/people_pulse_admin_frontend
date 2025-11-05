import * as Yup from 'yup';

export const subscriptionValidationSchema = Yup.object({
  organization_id: Yup.string()
    .required('Organization is required'),

  plan_id: Yup.string()
    .required('Plan is required'),

  status: Yup.string()
    .required('Status is required')
    .oneOf(['trial', 'active'], 'Invalid status'),

  trial_ends_at: Yup.date()
    .nullable()
    .when('status', {
      is: 'trial',
      then: (schema) => schema.required('Trial end date is required for trial subscriptions'),
      otherwise: (schema) => schema.nullable(),
    }),

  starts_at: Yup.date()
    .required('Start date is required'),

  ends_at: Yup.date()
    .nullable()
    .when('billing_cycle', {
      is: (billing_cycle: string) => billing_cycle !== 'one-time',
      then: (schema) => schema.required('End date is required for recurring subscriptions'),
      otherwise: (schema) => schema.nullable(),
    }),

  amount: Yup.number()
    .required('Amount is required')
    .min(0, 'Amount must be non-negative')
    .max(999999.99, 'Amount is too high'),

  billing_cycle: Yup.string()
    .required('Billing cycle is required')
    .oneOf(['monthly', 'yearly', 'one-time'], 'Invalid billing cycle'),

  features: Yup.array()
    .of(Yup.string().min(1, 'Feature cannot be empty'))
    .min(1, 'At least one feature is required'),
});

export const subscriptionUpdateValidationSchema = Yup.object({
  status: Yup.string()
    .required('Status is required')
    .oneOf(['trial', 'active', 'past_due', 'cancelled', 'expired'], 'Invalid status'),

  trial_ends_at: Yup.date()
    .nullable(),

  ends_at: Yup.date()
    .nullable(),

  amount: Yup.number()
    .min(0, 'Amount must be non-negative')
    .max(999999.99, 'Amount is too high'),

  features: Yup.array()
    .of(Yup.string().min(1, 'Feature cannot be empty')),
});