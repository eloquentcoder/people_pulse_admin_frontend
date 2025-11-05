import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_URL } from '@/config/url';
import type { RootState } from '@/config/store';
import type { ApiResponse, ApiResponseWithPagination } from '@/common/models/response.model';
import type {  SubscriptionFilters, SubscriptionStats } from '../models/subscription.model';
import type { CreateSubscriptionData, UpdateSubscriptionData } from '../models/subscription.model';
import type { Subscription } from '@/common/models/subscription.model';
import type { Plan } from '@/common/models/plan.model';

export const subscriptionApi = createApi({
  reducerPath: 'subscriptionApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}/subscriptions`,
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
  tagTypes: ['Subscription', 'SubscriptionStats', 'Plan'],
  endpoints: (builder) => ({
    // Get subscriptions with filters
    getSubscriptions: builder.query<ApiResponseWithPagination<Subscription[]>, SubscriptionFilters>({
      query: (filters) => ({
        url: '/',
        params: filters,
      }),
      providesTags: ['Subscription'],
    }),

    // Get single subscription
    getSubscription: builder.query<ApiResponse<Subscription>, number>({
      query: (id) => `/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Subscription', id }],
    }),

    // Create subscription
    createSubscription: builder.mutation<ApiResponse<Subscription>, CreateSubscriptionData>({
      query: (data) => ({
        url: '/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Subscription', 'SubscriptionStats'],
    }),

    // Update subscription
    updateSubscription: builder.mutation<ApiResponse<Subscription>, { id: number; data: UpdateSubscriptionData }>({
      query: ({ id, data }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Subscription', id },
        'Subscription',
        'SubscriptionStats',
      ],
    }),

    // Cancel subscription
    cancelSubscription: builder.mutation<ApiResponse<Subscription>, number>({
      query: (id) => ({
        url: `/${id}/cancel`,
        method: 'POST',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Subscription', id },
        'Subscription',
        'SubscriptionStats',
      ],
    }),

    // Renew subscription
    renewSubscription: builder.mutation<ApiResponse<Subscription>, number>({
      query: (id) => ({
        url: `/${id}/renew`,
        method: 'POST',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Subscription', id },
        'Subscription',
        'SubscriptionStats',
      ],
    }),

    // Delete subscription
    deleteSubscription: builder.mutation<ApiResponse<null>, number>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Subscription', id },
        'Subscription',
        'SubscriptionStats',
      ],
    }),

    // Get subscription statistics
    getSubscriptionStats: builder.query<ApiResponse<SubscriptionStats>, void>({
      query: () => '/stats',
      providesTags: ['SubscriptionStats'],
    }),

    // Get plans
    getPlans: builder.query<ApiResponse<Plan[]>, void>({
      query: () => '/plans',
      providesTags: ['Plan'],
    }),
  }),
});

export const {
  useGetSubscriptionsQuery,
  useGetSubscriptionQuery,
  useCreateSubscriptionMutation,
  useUpdateSubscriptionMutation,
  useCancelSubscriptionMutation,
  useRenewSubscriptionMutation,
  useDeleteSubscriptionMutation,
  useGetSubscriptionStatsQuery,
  useGetPlansQuery,
} = subscriptionApi;
