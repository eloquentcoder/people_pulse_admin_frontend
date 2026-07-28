export interface User {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    user_type: 'platform_admin' | 'organization_admin' | 'employee';
    is_active: boolean;
    organization_id: number | null;
    roles?: UserRole[];
    permissions?: string[];
    permissions_count?: number;
  }

export interface UserRole {
    id?: number;
    name?: string;
    slug: string;
    is_system_role?: boolean;
    permissions?: string[];
  }
