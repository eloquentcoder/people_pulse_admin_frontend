import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_URL } from '@/config/url';
import type { RootState } from '@/config/store';
import type { ApiResponse, ApiResponseWithPagination } from '@/common/models/response.model';
import type { BillingTransaction, BillingFilters, BillingStats } from '../models/billing.model';

export const billingApi = createApi({
  reducerPath: 'billingApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}/billing`,
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
  tagTypes: ['BillingTransaction', 'BillingStats'],
  endpoints: (builder) => ({
    getTransactions: builder.query<ApiResponseWithPagination<BillingTransaction[]>, BillingFilters>({
      query: (filters) => {
        const params = new URLSearchParams();

        if (filters.search) params.append('search', filters.search);
        if (filters.status) params.append('status', filters.status);
        if (filters.payment_status) params.append('payment_status', filters.payment_status);
        if (filters.type) params.append('type', filters.type);
        if (filters.organization_id) params.append('organization_id', filters.organization_id.toString());
        if (filters.billing_date_from) params.append('billing_date_from', filters.billing_date_from);
        if (filters.billing_date_to) params.append('billing_date_to', filters.billing_date_to);
        if (filters.sort_by) params.append('sort_by', filters.sort_by);
        if (filters.sort_order) params.append('sort_order', filters.sort_order);
        if (filters.per_page) params.append('per_page', filters.per_page.toString());
        if (filters.page) params.append('page', filters.page.toString());

        return `/?${params.toString()}`;
      },
      providesTags: ['BillingTransaction'],
    }),

    getTransaction: builder.query<ApiResponse<BillingTransaction>, number>({
      query: (id) => `/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'BillingTransaction', id }],
    }),

    getStats: builder.query<ApiResponse<BillingStats>, void>({
      query: () => '/stats',
      providesTags: ['BillingStats'],
    }),

    refundTransaction: builder.mutation<ApiResponse<BillingTransaction>, { id: number; amount?: number }>({
      query: ({ id, amount }) => ({
        url: `/${id}/refund`,
        method: 'POST',
        body: amount ? { amount } : {},
      }),
      invalidatesTags: ['BillingTransaction', 'BillingStats'],
    }),

    retryTransaction: builder.mutation<ApiResponse<BillingTransaction>, number>({
      query: (id) => ({
        url: `/${id}/retry`,
        method: 'POST',
      }),
      invalidatesTags: ['BillingTransaction', 'BillingStats'],
    }),
  }),
});

export const {
  useGetTransactionsQuery,
  useGetTransactionQuery,
  useGetStatsQuery,
  useRefundTransactionMutation,
  useRetryTransactionMutation,
} = billingApi;
