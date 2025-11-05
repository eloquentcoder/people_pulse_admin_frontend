export interface User {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    user_type: 'platform_admin' | 'organization_admin' | 'employee';
    is_active: boolean;
    organization_id: number | null;
  }