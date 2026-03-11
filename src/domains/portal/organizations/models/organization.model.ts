import type { Subscription } from "@/common/models/subscription.model";
import type { User } from "@/common/models/user.model";

export interface Department {
  id: number;
  organization_id: number;
  parent_id?: number;
  name: string;
  code?: string;
  description?: string;
  manager_id?: number;
  manager?: Employee;
  parent?: Department;
  children?: Department[];
  is_active: boolean;
  employees_count?: number;
  created_at: string;
  updated_at: string;
}

export interface Branch {
  id: number;
  organization_id: number;
  name: string;
  code?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zip_code?: string;
  phone?: string;
  email?: string;
  description?: string;
  is_headquarters: boolean;
  is_active: boolean;
  employees_count?: number;
  created_at: string;
  updated_at: string;
}

export interface Position {
  id: number;
  organization_id: number;
  department_id?: number;
  title: string;
  code?: string;
  description?: string;
  level?: 'entry' | 'junior' | 'mid' | 'senior' | 'lead' | 'manager' | 'director' | 'executive';
  min_salary?: number;
  max_salary?: number;
  is_active: boolean;
  employees_count?: number;
  created_at: string;
  updated_at: string;
}

export interface Employee {
  id: number;
  organization_id: number;
  user_id: number;
  employee_number: string;
  department_id?: number;
  position_id?: number;
  branch_id?: number;
  manager_id?: number;
  hire_date?: string;
  employment_type: 'full_time' | 'part_time' | 'contract' | 'intern';
  employment_status: 'active' | 'probation' | 'terminated';
  user?: User;
  department?: Department;
  position?: Position;
  branch?: Branch;
  created_at: string;
  updated_at: string;
}

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
  departments_count?: number;
  branches_count?: number;
  positions_count?: number;
  employees_count?: number;
  users?: User[];
  departments?: Department[];
  branches?: Branch[];
  positions?: Position[];
  employees?: Employee[];
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