import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_URL } from '@/config/url';
import type { RootState } from '@/config/store';
import type { ApiResponse, ApiResponseWithPagination } from '@/common/models/response.model';
import type { Plan, PlanFormData } from '../types';

export interface PlanFilters {
  search?: string;
  billing_cycle?: string;
  is_active?: string;
  sort_by?: string;
  sort_order?: string;
  per_page?: number;
  page?: number;
}

export interface PlanStats {
  total_plans: number;
  active_plans: number;
  popular_plans: number;
  total_subscriptions: number;
}

export const plansApi = createApi({
  reducerPath: 'plansApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}/plans`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth?.token;
      
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      
      return headers;
    },
  }),
  tagTypes: ['Plan', 'PlanStats'],
  endpoints: (builder) => ({
    // Get plans with filters
    getPlans: builder.query<ApiResponseWithPagination<Plan[]>, PlanFilters>({
      query: (filters) => ({
        url: '',
        params: filters,
      }),
      providesTags: ['Plan'],
    }),

    // Create plan
    createPlan: builder.mutation<ApiResponse<Plan>, PlanFormData>({
      query: (data) => ({
        url: '',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Plan', 'PlanStats'],
    }),

    // Get single plan
    getPlan: builder.query<ApiResponse<Plan>, string>({
      query: (id) => `/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Plan', id }],
    }),

    // Update plan
    updatePlan: builder.mutation<ApiResponse<Plan>, { id: string; data: Partial<PlanFormData> }>({
      query: ({ id, data }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Plan', id },
        'Plan',
        'PlanStats',
      ],
    }),

    // Delete plan
    deletePlan: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Plan', id },
        'Plan',
        'PlanStats',
      ],
    }),

    // Get plan statistics
    getPlanStats: builder.query<ApiResponse<PlanStats>, void>({
      query: () => '/stats',
      providesTags: ['PlanStats'],
    }),

  }),
});

export const {
  useGetPlansQuery,
  useCreatePlanMutation,
  useGetPlanQuery,
  useUpdatePlanMutation,
  useDeletePlanMutation,
  useGetPlanStatsQuery,
} = plansApi;
