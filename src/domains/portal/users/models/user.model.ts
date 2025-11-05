export interface Organization {
  id: number;
  name: string;
  slug: string;
  status: 'active' | 'inactive' | 'suspended';
  created_at: string;
  updated_at: string;
}

export interface Role {
  id: number;
  name: string;
  slug: string;
  description?: string;
  permissions?: Permission[];
  created_at: string;
  updated_at: string;
}

export interface Permission {
  id: number;
  name: string;
  slug: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Employee {
  id: number;
  user_id: number;
  employee_id: string;
  department?: string;
  position?: string;
  hire_date?: string;
  salary?: number;
  status: 'active' | 'inactive' | 'terminated';
  created_at: string;
  updated_at: string;
}

export interface UserSession {
  id: number;
  user_id: number;
  ip_address: string;
  user_agent: string;
  is_active: boolean;
  last_activity: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  organization_id: number;
  first_name: string;
  last_name: string;
  email: string;
  user_type: 'platform_admin' | 'organization_admin' | 'employee';
  is_active: boolean;
  email_verified_at?: string;
  full_name: string;
  organization?: Organization;
  employee?: Employee;
  roles?: Role[];
  sessions?: UserSession[];
  roles_count?: number;
  sessions_count?: number;
  created_at: string;
  updated_at: string;
}

export interface UserFilters {
  search?: string;
  user_type?: string;
  organization_id?: number;
  is_active?: boolean;
  role_id?: number;
  created_from?: string;
  created_to?: string;
  last_login_from?: string;
  last_login_to?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  per_page?: number;
  page?: number;
}

export interface CreateUserData {
  organization_id: number;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  user_type: 'platform_admin' | 'organization_admin' | 'employee';
  is_active?: boolean;
  role_ids?: number[];
}

export interface UpdateUserData {
  organization_id?: number;
  first_name?: string;
  last_name?: string;
  email?: string;
  password?: string;
  user_type?: 'platform_admin' | 'organization_admin' | 'employee';
  is_active?: boolean;
  role_ids?: number[];
}

export interface UserStats {
  total_users: number;
  active_users: number;
  inactive_users: number;
  platform_admins: number;
  organization_admins: number;
  employees: number;
  new_this_month: number;
  new_this_week: number;
  users_with_sessions: number;
  users_without_sessions: number;
}

