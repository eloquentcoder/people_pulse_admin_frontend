export interface SupportTicket {
  id: number;
  organization_id: number;
  user_id: number;
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  assigned_to?: number;
  organization?: {
    id: number;
    name: string;
  };
  user?: {
    id: number;
    full_name: string;
    email: string;
  };
  assigned_user?: {
    id: number;
    full_name: string;
    email: string;
  };
  replies?: SupportTicketReply[];
  replies_count?: number;
  created_at: string;
  updated_at: string;
  resolved_at?: string;
  closed_at?: string;
}

export interface SupportTicketReply {
  id: number;
  ticket_id: number;
  user_id: number;
  message: string;
  is_internal: boolean;
  attachments?: SupportTicketAttachment[];
  user?: {
    id: number;
    full_name: string;
    email: string;
  };
  created_at: string;
  updated_at: string;
}

export interface SupportTicketAttachment {
  id: number;
  reply_id: number;
  file_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  created_at: string;
}

export interface SupportTicketFilters {
  search?: string;
  status?: string;
  priority?: string;
  category?: string;
  organization_id?: number;
  assigned_to?: number;
  created_from?: string;
  created_to?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  per_page?: number;
  page?: number;
}

export interface CreateSupportTicketData {
  organization_id: number;
  subject: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  assigned_to?: number;
}

export interface UpdateSupportTicketData {
  subject?: string;
  description?: string;
  status?: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  category?: string;
  assigned_to?: number;
}

export interface CreateTicketReplyData {
  ticket_id: number;
  message: string;
  is_internal?: boolean;
  attachments?: File[];
}

export interface SupportTicketStats {
  total_tickets: number;
  open_tickets: number;
  in_progress_tickets: number;
  resolved_tickets: number;
  closed_tickets: number;
  urgent_tickets: number;
  high_priority_tickets: number;
  avg_response_time: string;
  avg_resolution_time: string;
  tickets_this_week: number;
  tickets_this_month: number;
}

