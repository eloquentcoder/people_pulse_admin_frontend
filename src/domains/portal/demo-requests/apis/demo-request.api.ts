import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_URL } from '@/config/url';
import type { RootState } from '@/config/store';
import type { ApiResponse, ApiResponseWithPagination } from '@/common/models/response.model';
import type {
  DemoRequest,
  DemoRequestFilters,
  DemoRequestStats
} from '../models/demo-request.model';

export const demoRequestApi = createApi({
  reducerPath: 'demoRequestApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}/demo-requests`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      headers.set('accept', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['DemoRequest', 'DemoRequestStats'],
  endpoints: (builder) => ({
    // Get demo requests with filters
    getDemoRequests: builder.query<ApiResponseWithPagination<DemoRequest[]>, DemoRequestFilters>({
      query: (filters) => ({
        url: '/',
        params: filters,
      }),
      providesTags: ['DemoRequest'],
    }),

    // Get single demo request
    getDemoRequest: builder.query<ApiResponse<DemoRequest>, number>({
      query: (id) => `/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'DemoRequest', id }],
    }),

    // Update demo request status
    updateDemoRequestStatus: builder.mutation<ApiResponse<DemoRequest>, { id: number; status: string }>({
      query: ({ id, status }) => ({
        url: `/${id}/status`,
        method: 'PUT',
        body: { status },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'DemoRequest', id },
        'DemoRequest',
        'DemoRequestStats',
      ],
    }),

    // Delete demo request
    deleteDemoRequest: builder.mutation<ApiResponse<null>, number>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'DemoRequest', id },
        'DemoRequest',
        'DemoRequestStats',
      ],
    }),

    // Get demo request statistics
    getDemoRequestStats: builder.query<ApiResponse<DemoRequestStats>, void>({
      query: () => '/stats',
      providesTags: ['DemoRequestStats'],
    }),
  }),
});

export const {
  useGetDemoRequestsQuery,
  useGetDemoRequestQuery,
  useUpdateDemoRequestStatusMutation,
  useDeleteDemoRequestMutation,
  useGetDemoRequestStatsQuery,
} = demoRequestApi;
