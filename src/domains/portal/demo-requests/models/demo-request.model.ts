export interface DemoRequest {
  id: number;
  name: string;
  email: string;
  company_name: string;
  phone: string | null;
  preferred_date: string | null;
  preferred_time: string | null;
  status: 'pending' | 'contacted' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface DemoRequestFilters {
  search?: string;
  status?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  per_page?: number;
  page?: number;
}

export interface DemoRequestStats {
  total: number;
  pending: number;
  contacted: number;
  completed: number;
  cancelled: number;
  today: number;
  this_week: number;
  this_month: number;
}
