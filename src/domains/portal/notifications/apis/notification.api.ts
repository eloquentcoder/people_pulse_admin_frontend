import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_URL } from '@/config/url';
import type { RootState } from '@/config/store';
import type { ApiResponse, ApiResponseWithPagination } from '@/common/models/response.model';
import type { 
  Notification, 
  NotificationFilters, 
  NotificationStats,
  MarkAsReadData,
  MarkAsUnreadData
} from '../models/notification.model';

export const notificationApi = createApi({
  reducerPath: 'notificationApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}/notifications`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      headers.set('accept', 'application/json');
      headers.set('content-type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Notification', 'NotificationStats'],
  endpoints: (builder) => ({
    // Get notifications with filters
    getNotifications: builder.query<ApiResponseWithPagination<Notification[]>, NotificationFilters>({
      query: (filters) => ({
        url: '/',
        params: filters,
      }),
      providesTags: ['Notification'],
    }),

    // Get single notification
    getNotification: builder.query<ApiResponse<Notification>, string>({
      query: (id) => `/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Notification', id }],
    }),

    // Mark notification as read
    markAsRead: builder.mutation<ApiResponse<{ updated: number }>, MarkAsReadData>({
      query: (data) => ({
        url: '/mark-as-read',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Notification', 'NotificationStats'],
    }),

    // Mark notification as unread
    markAsUnread: builder.mutation<ApiResponse<{ updated: number }>, MarkAsUnreadData>({
      query: (data) => ({
        url: '/mark-as-unread',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Notification', 'NotificationStats'],
    }),

    // Mark all as read
    markAllAsRead: builder.mutation<ApiResponse<{ updated: number }>, void>({
      query: () => ({
        url: '/mark-all-as-read',
        method: 'POST',
      }),
      invalidatesTags: ['Notification', 'NotificationStats'],
    }),

    // Delete notification
    deleteNotification: builder.mutation<ApiResponse<null>, string>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Notification', id },
        'Notification',
        'NotificationStats',
      ],
    }),

    // Delete multiple notifications
    deleteNotifications: builder.mutation<ApiResponse<{ deleted: number }>, { ids: string[] }>({
      query: (data) => ({
        url: '/bulk-delete',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Notification', 'NotificationStats'],
    }),

    // Get notification statistics
    getNotificationStats: builder.query<ApiResponse<NotificationStats>, void>({
      query: () => '/stats',
      providesTags: ['NotificationStats'],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useGetNotificationQuery,
  useMarkAsReadMutation,
  useMarkAsUnreadMutation,
  useMarkAllAsReadMutation,
  useDeleteNotificationMutation,
  useDeleteNotificationsMutation,
  useGetNotificationStatsQuery,
} = notificationApi;

