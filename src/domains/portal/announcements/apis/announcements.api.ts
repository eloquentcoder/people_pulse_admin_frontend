import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_URL } from '@/config/url';
import type { RootState } from '@/config/store';
import type { ApiResponse } from '@/common/models/response.model';
import type {
  PlatformAnnouncement,
  AnnouncementFilters,
  AnnouncementStats,
  CreateAnnouncementData,
  UpdateAnnouncementData,
} from '../models/announcement.model';

interface PaginatedResponse<T> {
  data: T;
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

export const announcementsApi = createApi({
  reducerPath: 'announcementsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}/announcements`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth?.token;

      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }

      headers.set('Accept', 'application/json');
      headers.set('Content-Type', 'application/json');

      return headers;
    },
  }),
  tagTypes: ['Announcement', 'AnnouncementStats'],
  endpoints: (builder) => ({
    getAnnouncements: builder.query<ApiResponse<PaginatedResponse<PlatformAnnouncement[]>>, AnnouncementFilters>({
      query: (filters) => {
        const params = new URLSearchParams();

        if (filters.search) params.append('search', filters.search);
        if (filters.type && filters.type !== 'all') params.append('type', filters.type);
        if (filters.priority && filters.priority !== 'all') params.append('priority', filters.priority);
        if (filters.status && filters.status !== 'all') params.append('status', filters.status);
        if (filters.sort_by) params.append('sort_by', filters.sort_by);
        if (filters.sort_order) params.append('sort_order', filters.sort_order);
        if (filters.per_page) params.append('per_page', filters.per_page.toString());
        if (filters.page) params.append('page', filters.page.toString());

        return `/?${params.toString()}`;
      },
      providesTags: ['Announcement'],
    }),

    getAnnouncement: builder.query<ApiResponse<PlatformAnnouncement>, number>({
      query: (id) => `/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Announcement', id }],
    }),

    getAnnouncementStats: builder.query<ApiResponse<AnnouncementStats>, void>({
      query: () => '/stats',
      providesTags: ['AnnouncementStats'],
    }),

    createAnnouncement: builder.mutation<ApiResponse<PlatformAnnouncement>, CreateAnnouncementData>({
      query: (data) => ({
        url: '/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Announcement', 'AnnouncementStats'],
    }),

    updateAnnouncement: builder.mutation<ApiResponse<PlatformAnnouncement>, { id: number; data: UpdateAnnouncementData }>({
      query: ({ id, data }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Announcement', id },
        'Announcement',
        'AnnouncementStats',
      ],
    }),

    deleteAnnouncement: builder.mutation<ApiResponse<null>, number>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Announcement', 'AnnouncementStats'],
    }),

    publishAnnouncement: builder.mutation<ApiResponse<PlatformAnnouncement>, number>({
      query: (id) => ({
        url: `/${id}/publish`,
        method: 'POST',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Announcement', id },
        'Announcement',
        'AnnouncementStats',
      ],
    }),

    unpublishAnnouncement: builder.mutation<ApiResponse<PlatformAnnouncement>, number>({
      query: (id) => ({
        url: `/${id}/unpublish`,
        method: 'POST',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Announcement', id },
        'Announcement',
        'AnnouncementStats',
      ],
    }),

    sendAnnouncementEmails: builder.mutation<ApiResponse<{ queued: boolean }>, number>({
      query: (id) => ({
        url: `/${id}/send-emails`,
        method: 'POST',
      }),
      invalidatesTags: (_result, _error, id) => [{ type: 'Announcement', id }],
    }),
  }),
});

export const {
  useGetAnnouncementsQuery,
  useGetAnnouncementQuery,
  useGetAnnouncementStatsQuery,
  useCreateAnnouncementMutation,
  useUpdateAnnouncementMutation,
  useDeleteAnnouncementMutation,
  usePublishAnnouncementMutation,
  useUnpublishAnnouncementMutation,
  useSendAnnouncementEmailsMutation,
} = announcementsApi;
