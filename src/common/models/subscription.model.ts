import type { Organization } from "@/domains/portal/organizations/models/organization.model";
import type { Plan } from "./plan.model";


export interface Subscription {
    id: number;
    organization_id: number;
    plan_id: number;
    status: 'active' | 'past_due' | 'cancelled' | 'trial' | 'suspended';
    trial_ends_at?: string;
    starts_at?: string;
    ends_at?: string;
    cancelled_at?: string;
    amount: number;
    billing_cycle: 'monthly' | 'yearly' | 'quarterly';
    plan?: Plan;
    features?: string[];
    organization?: Organization;
    created_at: string;
    updated_at: string;
}

