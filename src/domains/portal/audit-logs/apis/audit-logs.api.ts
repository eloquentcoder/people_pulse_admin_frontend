import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_URL } from '@/config/url';
import type { RootState } from '@/config/store';
import type { ApiResponse, ApiResponseWithPagination } from '@/common/models/response.model';
import type {
  AuditLogEntry,
  AuditLogFilters,
  AuditLogStats,
  AuditLogFilterOptions,
} from '../models/audit-log.model';

const buildParams = (filters: AuditLogFilters): string => {
  const params = new URLSearchParams();

  if (filters.search) params.append('search', filters.search);
  if (filters.organization_id) params.append('organization_id', String(filters.organization_id));
  if (filters.user_id) params.append('user_id', String(filters.user_id));
  if (filters.event) params.append('event', filters.event);
  if (filters.action_type && filters.action_type !== 'all') params.append('action_type', filters.action_type);
  if (filters.auditable_type) params.append('auditable_type', filters.auditable_type);
  if (filters.date_from) params.append('date_from', filters.date_from);
  if (filters.date_to) params.append('date_to', filters.date_to);
  if (filters.per_page) params.append('per_page', String(filters.per_page));
  if (filters.page) params.append('page', String(filters.page));

  return params.toString();
};

export const auditLogsApi = createApi({
  reducerPath: 'auditLogsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}/audit-logs`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth?.token;

      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }

      headers.set('Accept', 'application/json');

      return headers;
    },
  }),
  tagTypes: ['AuditLog', 'AuditLogStats'],
  endpoints: (builder) => ({
    getAuditLogs: builder.query<ApiResponseWithPagination<AuditLogEntry[]>, AuditLogFilters>({
      query: (filters) => `/?${buildParams(filters)}`,
      providesTags: ['AuditLog'],
    }),

    getAuditLog: builder.query<ApiResponse<AuditLogEntry>, number>({
      query: (id) => `/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'AuditLog', id }],
    }),

    getAuditLogStats: builder.query<ApiResponse<AuditLogStats>, void>({
      query: () => '/stats',
      providesTags: ['AuditLogStats'],
    }),

    getAuditLogFilterOptions: builder.query<ApiResponse<AuditLogFilterOptions>, void>({
      query: () => '/filter-options',
    }),

    exportAuditLogs: builder.query<Blob, AuditLogFilters>({
      query: (filters) => ({
        url: `/export?${buildParams(filters)}`,
        responseHandler: (response) => response.blob(),
      }),
    }),
  }),
});

export const {
  useGetAuditLogsQuery,
  useGetAuditLogQuery,
  useGetAuditLogStatsQuery,
  useGetAuditLogFilterOptionsQuery,
  useLazyExportAuditLogsQuery,
} = auditLogsApi;
