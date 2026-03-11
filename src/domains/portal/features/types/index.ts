export interface Feature {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category: string;
  is_active: boolean;
  display_order: number;
  icon: string | null;
  created_at: string;
  updated_at: string;
}

export interface FeatureFormData {
  name: string;
  slug: string;
  description: string;
  category: string;
  is_active: boolean;
  display_order: number;
  icon: string | null;
}

export interface FeatureCategory {
  name: string;
  features: Feature[];
}

export interface FeaturesState {
  features: Feature[];
  currentFeature: Feature | null;
  loading: boolean;
  error: string | null;
  filters: {
    category?: string;
    is_active?: boolean;
    search?: string;
  };
}
