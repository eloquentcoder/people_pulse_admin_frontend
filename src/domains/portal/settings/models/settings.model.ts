export interface PlatformSettings {
  general: GeneralSettings;
  security: SecuritySettings;
  email: EmailSettings;
  system: SystemSettings;
  branding: BrandingSettings;
  features: FeatureFlags;
  integrations: IntegrationSettings;
  maintenance: MaintenanceSettings;
}

export interface GeneralSettings {
  platform_name: string;
  platform_url: string;
  timezone: string;
  default_currency: string;
  date_format: string;
  time_format: '12h' | '24h';
  language: string;
  week_starts_on: 'monday' | 'sunday';
  fiscal_year_start: string;
  support_email: string;
  support_phone?: string;
}

export interface SecuritySettings {
  password_policy: {
    min_length: number;
    require_uppercase: boolean;
    require_lowercase: boolean;
    require_numbers: boolean;
    require_special_chars: boolean;
    expiry_days: number;
    prevent_reuse: number; // number of previous passwords to prevent reuse
  };
  session_timeout: number; // minutes
  max_login_attempts: number;
  lockout_duration: number; // minutes
  require_mfa_for_admins: boolean;
  require_mfa_for_all: boolean;
  audit_log_retention: number; // days
  ip_whitelist: string[];
  enforce_https: boolean;
  api_rate_limit: number;
}

export interface EmailSettings {
  mail_driver: 'smtp' | 'sendmail' | 'mailgun' | 'ses' | 'postmark';
  mail_host?: string;
  mail_port?: number;
  mail_username?: string;
  mail_password?: string;
  mail_encryption?: 'tls' | 'ssl' | null;
  mail_from_address: string;
  mail_from_name: string;
  mail_reply_to?: string;
  test_email_address?: string;
}

export interface SystemSettings {
  maintenance_mode: boolean;
  maintenance_message?: string;
  log_level: 'debug' | 'info' | 'warning' | 'error';
  log_retention_days: number;
  enable_api_logging: boolean;
  enable_query_logging: boolean;
  max_upload_size: number; // MB
  allowed_file_types: string[];
  cache_driver: 'file' | 'redis' | 'memcached';
  queue_driver: 'sync' | 'database' | 'redis' | 'sqs';
  session_driver: 'file' | 'database' | 'redis' | 'memcached';
}

export interface BrandingSettings {
  logo_url?: string;
  favicon_url?: string;
  primary_color: string;
  secondary_color: string;
  custom_css?: string;
  footer_text?: string;
  show_powered_by: boolean;
}

export interface FeatureFlags {
  enable_registration: boolean;
  enable_trials: boolean;
  enable_ai_features: boolean;
  enable_analytics: boolean;
  enable_audit_logs: boolean;
  enable_two_factor: boolean;
  enable_sso: boolean;
  enable_webhooks: boolean;
  enable_api_access: boolean;
}

export interface IntegrationSettings {
  google_analytics_id?: string;
  intercom_app_id?: string;
  sentry_dsn?: string;
  slack_webhook_url?: string;
  custom_webhooks: Array<{
    id: string;
    name: string;
    url: string;
    events: string[];
    is_active: boolean;
  }>;
}

export interface MaintenanceSettings {
  auto_backup_enabled: boolean;
  backup_frequency: 'daily' | 'weekly' | 'monthly';
  backup_retention_days: number;
  backup_storage: 'local' | 's3' | 'gcs';
  cleanup_old_data: boolean;
  cleanup_after_days: number;
}

export interface UpdateSettingsData {
  general?: Partial<GeneralSettings>;
  security?: Partial<SecuritySettings>;
  email?: Partial<EmailSettings>;
  system?: Partial<SystemSettings>;
  branding?: Partial<BrandingSettings>;
  features?: Partial<FeatureFlags>;
  integrations?: Partial<IntegrationSettings>;
  maintenance?: Partial<MaintenanceSettings>;
}


