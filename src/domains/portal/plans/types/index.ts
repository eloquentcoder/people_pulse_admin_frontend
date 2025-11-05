export interface Plan {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  billing_cycle: 'monthly' | 'yearly' | 'one-time';
  max_employees: number;
  max_storage_gb: number;
  features: string[];
  is_active: boolean;
  is_popular: boolean;
  trial_days: number;
  created_at: string;
  updated_at: string;
  subscriptions_count?: number;
  active_subscriptions_count?: number;
}

export interface PlanFormData {
  name: string;
  slug: string;
  description: string;
  price: number;
  billing_cycle: 'monthly' | 'yearly' | 'one-time';
  max_employees: number;
  max_storage_gb: number;
  features: string[];
  is_active: boolean;
  is_popular: boolean;
  trial_days: number;
}

export interface PlansState {
  plans: Plan[];
  currentPlan: Plan | null;
  loading: boolean;
  error: string | null;
  filters: {
    billing_cycle?: 'monthly' | 'yearly' | 'one-time';
    is_active?: boolean;
    search?: string;
  };
}