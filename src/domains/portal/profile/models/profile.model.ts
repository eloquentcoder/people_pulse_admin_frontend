export interface Profile {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  user_type: 'platform_admin' | 'organization_admin' | 'employee';
  is_active: boolean;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface UpdateProfileData {
  first_name: string;
  last_name: string;
  email: string;
}

export interface UpdatePasswordData {
  current_password: string;
  password: string;
  password_confirmation: string;
}
