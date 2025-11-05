export interface Notification {
  id: string; // UUID
  type: string;
  notifiable_type: string;
  notifiable_id: number;
  data: NotificationData;
  read_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface NotificationData {
  title: string;
  message: string;
  action_url?: string;
  action_text?: string;
  icon?: string;
  type?: 'info' | 'success' | 'warning' | 'error' | 'system';
  priority?: 'low' | 'medium' | 'high';
  metadata?: Record<string, any>;
}

export interface NotificationFilters {
  search?: string;
  type?: string;
  is_read?: boolean;
  priority?: string;
  created_from?: string;
  created_to?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  per_page?: number;
  page?: number;
}

export interface NotificationStats {
  total_notifications: number;
  unread_notifications: number;
  read_notifications: number;
  notifications_today: number;
  notifications_this_week: number;
  notifications_this_month: number;
  by_type: Record<string, number>;
  by_priority: Record<string, number>;
}

export interface MarkAsReadData {
  notification_ids: string[];
}

export interface MarkAsUnreadData {
  notification_ids: string[];
}

