import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_URL } from '@/config/url';
import type { RootState } from '@/config/store';
import type { ApiResponse, ApiResponseWithPagination } from '@/common/models/response.model';
import type { User, UserFilters, UserStats, Organization, Role } from '../models/user.model';
import type { CreateUserData, UpdateUserData } from '../models/user.model';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}/users`,
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
  tagTypes: ['User', 'UserStats', 'Organization', 'Role'],
  endpoints: (builder) => ({
    // Get users with filters
    getUsers: builder.query<ApiResponseWithPagination<User[]>, UserFilters>({
      query: (filters) => ({
        url: '/',
        params: filters,
      }),
      providesTags: ['User'],
    }),

    // Get single user
    getUser: builder.query<ApiResponse<User>, number>({
      query: (id) => `/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'User', id }],
    }),

    // Create user
    createUser: builder.mutation<ApiResponse<User>, CreateUserData>({
      query: (data) => ({
        url: '/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['User', 'UserStats'],
    }),

    // Update user
    updateUser: builder.mutation<ApiResponse<User>, { id: number; data: UpdateUserData }>({
      query: ({ id, data }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'User', id },
        'User',
        'UserStats',
      ],
    }),

    // Activate user
    activateUser: builder.mutation<ApiResponse<User>, number>({
      query: (id) => ({
        url: `/${id}/activate`,
        method: 'POST',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'User', id },
        'User',
        'UserStats',
      ],
    }),

    // Deactivate user
    deactivateUser: builder.mutation<ApiResponse<User>, number>({
      query: (id) => ({
        url: `/${id}/deactivate`,
        method: 'POST',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'User', id },
        'User',
        'UserStats',
      ],
    }),

    // Reset password
    resetPassword: builder.mutation<ApiResponse<null>, { id: number; password: string }>({
      query: ({ id, password }) => ({
        url: `/${id}/reset-password`,
        method: 'POST',
        body: { password },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'User', id },
        'User',
      ],
    }),

    // Delete user
    deleteUser: builder.mutation<ApiResponse<null>, number>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'User', id },
        'User',
        'UserStats',
      ],
    }),

    // Get user statistics
    getUserStats: builder.query<ApiResponse<UserStats>, void>({
      query: () => '/stats',
      providesTags: ['UserStats'],
    }),

    // Get organizations
    getOrganizations: builder.query<ApiResponse<Organization[]>, void>({
      query: () => '/organizations',
      providesTags: ['Organization'],
    }),

    // Get roles
    getRoles: builder.query<ApiResponse<Role[]>, void>({
      query: () => '/roles',
      providesTags: ['Role'],
    }),

    // Get user activity logs
    getUserActivityLogs: builder.query<ApiResponse<{ sessions: any[]; audit_logs: any[] }>, number>({
      query: (id) => `/${id}/activity`,
      providesTags: (_result, _error, id) => [{ type: 'User', id }],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useActivateUserMutation,
  useDeactivateUserMutation,
  useResetPasswordMutation,
  useDeleteUserMutation,
  useGetUserStatsQuery,
  useGetOrganizationsQuery,
  useGetRolesQuery,
  useGetUserActivityLogsQuery,
} = userApi;

