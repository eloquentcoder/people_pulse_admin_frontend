
export interface Plan {
    id: number;
    name: string;
    slug: string;
    description?: string;
    price: number;
    billing_cycle: 'monthly' | 'yearly' | 'quarterly';
    currency?: string;
    /** Discount applied to the 12-month total when the plan is paid yearly. Null = none. */
    yearly_discount_percent?: number | string | null;
    max_employees?: number;
    max_storage_gb?: number;
    features?: string[];
    is_active: boolean;
    is_popular: boolean;
    trial_days: number;
}

