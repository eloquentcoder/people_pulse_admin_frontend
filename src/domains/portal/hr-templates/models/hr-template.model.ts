export interface HRTemplateCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
  is_active: boolean;
  templates_count?: number;
  created_at: string;
  updated_at: string;
}

export interface HRTemplate {
  id: number;
  category_id: number;
  category?: HRTemplateCategory;
  title: string;
  slug: string;
  description?: string;
  content: string;
  variables?: string[]; // Array of variable names that can be replaced (e.g., {{employee_name}}, {{date}})
  is_active: boolean;
  is_default: boolean;
  usage_count?: number;
  last_used_at?: string;
  created_by_id?: number;
  created_by?: {
    id: number;
    name: string;
    email: string;
  };
  created_at: string;
  updated_at: string;
}

export interface HRTemplateFilters {
  search?: string;
  category_id?: number;
  is_active?: boolean;
  is_default?: boolean;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  per_page?: number;
  page?: number;
}

export interface CreateHRTemplateData {
  category_id: number;
  title: string;
  slug: string;
  description?: string;
  content: string;
  variables?: string[];
  is_active?: boolean;
  is_default?: boolean;
}

export interface UpdateHRTemplateData {
  category_id?: number;
  title?: string;
  slug?: string;
  description?: string;
  content?: string;
  variables?: string[];
  is_active?: boolean;
  is_default?: boolean;
}

export interface HRTemplateCategoryFilters {
  search?: string;
  is_active?: boolean;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  per_page?: number;
  page?: number;
}

export interface CreateHRTemplateCategoryData {
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
  is_active?: boolean;
}

export interface UpdateHRTemplateCategoryData {
  name?: string;
  slug?: string;
  description?: string;
  icon?: string;
  color?: string;
  is_active?: boolean;
}

export interface HRTemplateStats {
  total_templates: number;
  active_templates: number;
  total_categories: number;
  active_categories: number;
  most_used_template?: HRTemplate;
  templates_by_category?: Array<{
    category_id: number;
    category_name: string;
    templates_count: number;
  }>;
}


