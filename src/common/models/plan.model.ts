
export interface Plan {
    id: number;
    name: string;
    slug: string;
    description?: string;
    price: number;
    billing_cycle: 'monthly' | 'yearly' | 'quarterly';
    max_employees?: number;
    max_storage_gb?: number;
    features?: string[];
    is_active: boolean;
    is_popular: boolean;
    trial_days: number;
}

