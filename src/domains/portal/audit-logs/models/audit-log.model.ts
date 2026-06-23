export type AuditActionType = 'created' | 'updated' | 'deleted' | 'auth' | 'other';

export interface AuditLogUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

export interface AuditLogOrganization {
  id: number;
  name: string;
}

export interface AuditLogEntry {
  id: number;
  organization_id: number | null;
  user_id: number | null;
  event: string;
  action_type: AuditActionType;
  auditable_type: string | null;
  auditable_id: number | null;
  description: string | null;
  old_values: Record<string, unknown> | null;
  new_values: Record<string, unknown> | null;
  ip_address: string | null;
  user_agent: string | null;
  url: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
  user?: AuditLogUser | null;
  organization?: AuditLogOrganization | null;
}

export interface AuditLogFilters {
  search?: string;
  organization_id?: number | string | '';
  user_id?: number | string | '';
  event?: string;
  action_type?: AuditActionType | 'all' | '';
  auditable_type?: string;
  date_from?: string;
  date_to?: string;
  per_page?: number;
  page?: number;
}

export interface AuditLogStats {
  total: number;
  today: number;
  this_week: number;
  top_events: { event: string; count: number }[];
  active_users: number;
  active_organizations: number;
}

export interface AuditLogFilterOptions {
  events: string[];
  organizations: AuditLogOrganization[];
}

export const AUDIT_ACTION_TYPES: { value: AuditActionType; label: string; color: string }[] = [
  { value: 'created', label: 'Created', color: '#10b981' },
  { value: 'updated', label: 'Updated', color: '#3b82f6' },
  { value: 'deleted', label: 'Deleted', color: '#dc2626' },
  { value: 'auth', label: 'Auth', color: '#8b5cf6' },
  { value: 'other', label: 'Other', color: '#6b7280' },
];

export const auditActionColor = (actionType: AuditActionType): string =>
  AUDIT_ACTION_TYPES.find((a) => a.value === actionType)?.color ?? '#6b7280';
