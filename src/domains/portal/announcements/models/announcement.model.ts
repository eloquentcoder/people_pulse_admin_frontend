export type AnnouncementType = 'urgent' | 'general' | 'maintenance' | 'feature' | 'policy';
export type AnnouncementPriority = 'low' | 'medium' | 'high' | 'critical';
export type AnnouncementStatus = 'draft' | 'scheduled' | 'published' | 'expired' | 'archived';

export interface PlatformAnnouncement {
  id: number;
  title: string;
  content: string;
  type: AnnouncementType;
  priority: AnnouncementPriority;
  status: AnnouncementStatus;
  scheduled_at: string | null;
  published_at: string | null;
  expires_at: string | null;
  send_email: boolean;
  send_notification: boolean;
  email_sent: boolean;
  email_sent_count: number;
  views_count: number;
  created_by: number;
  updated_by: number | null;
  created_at: string;
  updated_at: string;
  creator?: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
  updater?: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  } | null;
}

export interface AnnouncementFilters {
  search?: string;
  type?: AnnouncementType | 'all' | '';
  priority?: AnnouncementPriority | 'all' | '';
  status?: AnnouncementStatus | 'all' | '';
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  per_page?: number;
  page?: number;
}

export interface AnnouncementStats {
  total: number;
  published: number;
  draft: number;
  scheduled: number;
  expired: number;
  archived: number;
  by_type: Record<string, number>;
  by_priority: Record<string, number>;
  total_views: number;
  total_emails_sent: number;
}

export interface CreateAnnouncementData {
  title: string;
  content: string;
  type: AnnouncementType;
  priority: AnnouncementPriority;
  status?: 'draft' | 'scheduled';
  scheduled_at?: string | null;
  expires_at?: string | null;
  send_email: boolean;
  send_notification: boolean;
}

export interface UpdateAnnouncementData extends Partial<CreateAnnouncementData> {}

export const ANNOUNCEMENT_TYPES: { value: AnnouncementType; label: string; color: string }[] = [
  { value: 'urgent', label: 'Urgent', color: '#dc2626' },
  { value: 'general', label: 'General', color: '#4469e5' },
  { value: 'maintenance', label: 'Maintenance', color: '#f59e0b' },
  { value: 'feature', label: 'New Feature', color: '#10b981' },
  { value: 'policy', label: 'Policy Update', color: '#8b5cf6' },
];

export const ANNOUNCEMENT_PRIORITIES: { value: AnnouncementPriority; label: string; color: string }[] = [
  { value: 'low', label: 'Low', color: '#6b7280' },
  { value: 'medium', label: 'Medium', color: '#3b82f6' },
  { value: 'high', label: 'High', color: '#f59e0b' },
  { value: 'critical', label: 'Critical', color: '#dc2626' },
];

export const ANNOUNCEMENT_STATUSES: { value: AnnouncementStatus; label: string; color: string }[] = [
  { value: 'draft', label: 'Draft', color: '#6b7280' },
  { value: 'scheduled', label: 'Scheduled', color: '#8b5cf6' },
  { value: 'published', label: 'Published', color: '#10b981' },
  { value: 'expired', label: 'Expired', color: '#f59e0b' },
  { value: 'archived', label: 'Archived', color: '#6b7280' },
];
