

export interface BillingTransaction {
  id: number;
  subscription_id: number;
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  transaction_type: 'subscription' | 'upgrade' | 'downgrade' | 'refund';
  description: string;
  payment_method?: string;
  transaction_id?: string;
  processed_at?: string;
  created_at: string;
  updated_at: string;
}


export interface SubscriptionFilters {
  search?: string;
  status?: string;
  plan_id?: number;
  organization_id?: number;
  created_from?: string;
  created_to?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  per_page?: number;
  page?: number;
}

export interface CreateSubscriptionData {
  organization_id: number;
  plan_id: number;
  status: 'active' | 'trial' | 'cancelled' | 'past_due';
  trial_ends_at?: string;
  starts_at?: string;
  ends_at?: string;
  amount: number;
  billing_cycle: 'monthly' | 'yearly';
  features?: string[];
}

export interface UpdateSubscriptionData {
  plan_id?: number;
  status?: 'active' | 'trial' | 'cancelled' | 'past_due';
  trial_ends_at?: string;
  starts_at?: string;
  ends_at?: string;
  amount?: number;
  billing_cycle?: 'monthly' | 'yearly';
  features?: string[];
}

export interface SubscriptionStats {
  total_subscriptions: number;
  active_subscriptions: number;
  trial_subscriptions: number;
  cancelled_subscriptions: number;
  past_due_subscriptions: number;
  monthly_revenue: number;
  yearly_revenue: number;
  total_revenue: number;
  new_this_month: number;
  new_this_week: number;
}
