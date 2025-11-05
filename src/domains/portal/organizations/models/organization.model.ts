import type { Subscription } from "@/common/models/subscription.model";
import type { User } from "@/common/models/user.model";

export interface Organization {
    id: number;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    postal_code?: string;
    website?: string;
    industry?: string;
    company_size?: string;
    description?: string;
    status: 'active' | 'inactive' | 'suspended';
    trial_ends_at?: string;
    created_at: string;
    updated_at: string;
    users_count?: number;
    users?: User[];
    active_subscription?: Subscription;
  }
  
  export interface OrganizationFilters {
    search?: string;
    status?: string;
    subscription_status?: string;
    created_from?: string;
    created_to?: string;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
    per_page?: number;
    page?: number;
  }
  
  export interface OrganizationStats {
    total_organizations: number;
    active_organizations: number;
    inactive_organizations: number;
    suspended_organizations: number;
    organizations_with_subscription: number;
    organizations_without_subscription: number;
    new_this_month: number;
    new_this_week: number;
  }
  
  export interface OnboardAdminData {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    phone?: string;
  }
  
  export interface UploadResult {
    imported_count: number;
    errors: Array<{
      row: number;
      errors: Record<string, string[]>;
    }>;
  }