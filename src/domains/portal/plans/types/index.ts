export interface PlanFeature {
  id: string;
  name: string;
  slug: string;
  description?: string;
  category?: string;
}

export interface Plan {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  billing_cycle: 'monthly' | 'yearly' | 'quarterly' | 'one-time';
  max_employees: number;
  max_storage_gb: number;
  features?: PlanFeature[] | string[]; // Can be feature objects or legacy string array
  feature_ids?: string[]; // Feature IDs for form submission
  features_data?: PlanFeature[]; // From accessor - feature objects
  feature_relations?: PlanFeature[]; // From eager loaded relationship (snake_case)
  is_active: boolean;
  is_popular: boolean;
  trial_days: number;
  currency?: string;
  display_order?: number;
  parent_plan_id?: string | null;
  parent_plan?: Plan | null;
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
  billing_cycle: 'monthly' | 'yearly' | 'quarterly' | 'one-time';
  max_employees: number;
  max_storage_gb: number;
  features?: string[]; // Legacy support
  feature_ids?: string[]; // New feature IDs
  is_active: boolean;
  is_popular: boolean;
  trial_days: number;
  currency?: string;
  display_order?: number;
  parent_plan_id?: string | null;
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