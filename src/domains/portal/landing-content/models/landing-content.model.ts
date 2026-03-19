export interface HeroContent {
  headline: string;
  subheadline: string;
  demo_video_url: string;
  cta_text: string;
  cta_secondary_text: string;
}

export interface TrustContent {
  title: string;
  subtitle: string;
  company_count: string;
}

export interface FeatureItem {
  icon: string;
  title: string;
  description: string;
}

export interface FeaturesContent {
  title: string;
  subtitle: string;
  features: FeatureItem[];
}

export interface TestimonialItem {
  quote: string;
  author: string;
  role: string;
  company: string;
  rating: number;
}

export interface TestimonialsContent {
  title: string;
  subtitle: string;
  testimonials: TestimonialItem[];
}

export interface MetricsContent {
  satisfaction_percent: string;
  companies_count: string;
  employees_managed: string;
  average_rating: string;
}

export interface TrustedCompany {
  id: number;
  name: string;
  logo_path: string;
  logo_url: string;
  display_order: number;
  is_active: boolean;
}

export interface SectionData<T> {
  id: number;
  section: string;
  content: T;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface LandingContentResponse {
  sections: {
    hero?: SectionData<HeroContent>;
    trust?: SectionData<TrustContent>;
    features?: SectionData<FeaturesContent>;
    testimonials?: SectionData<TestimonialsContent>;
    metrics?: SectionData<MetricsContent>;
  };
  trusted_companies: TrustedCompany[];
}

// Available icons for features
export const AVAILABLE_ICONS = [
  { value: 'Users', label: 'Users' },
  { value: 'Calendar', label: 'Calendar' },
  { value: 'FileText', label: 'File Text' },
  { value: 'Target', label: 'Target' },
  { value: 'Briefcase', label: 'Briefcase' },
  { value: 'Brain', label: 'Brain' },
  { value: 'Building', label: 'Building' },
  { value: 'Shield', label: 'Shield' },
  { value: 'Clock', label: 'Clock' },
  { value: 'Star', label: 'Star' },
  { value: 'Award', label: 'Award' },
  { value: 'TrendingUp', label: 'Trending Up' },
  { value: 'Zap', label: 'Zap' },
  { value: 'MessageSquare', label: 'Message' },
  { value: 'BarChart', label: 'Bar Chart' },
];
