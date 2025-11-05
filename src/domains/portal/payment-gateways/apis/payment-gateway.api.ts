import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_URL } from '@/config/url';
import type { RootState } from '@/config/store';
import type { ApiResponse, ApiResponseWithPagination } from '@/common/models/response.model';
import type { 
  PaymentGateway, 
  PaymentGatewayFilters, 
  PaymentGatewayStats,
  CreatePaymentGatewayData,
  UpdatePaymentGatewayData
} from '../models/payment-gateway.model';

export const paymentGatewayApi = createApi({
  reducerPath: 'paymentGatewayApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}/payment-gateways`,
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
  tagTypes: ['PaymentGateway', 'PaymentGatewayStats'],
  endpoints: (builder) => ({
    // Get payment gateways with filters
    getPaymentGateways: builder.query<ApiResponseWithPagination<PaymentGateway[]>, PaymentGatewayFilters>({
      query: (filters) => ({
        url: '/',
        params: filters,
      }),
      providesTags: ['PaymentGateway'],
    }),

    // Get single payment gateway
    getPaymentGateway: builder.query<ApiResponse<PaymentGateway>, number>({
      query: (id) => `/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'PaymentGateway', id }],
    }),

    // Create payment gateway
    createPaymentGateway: builder.mutation<ApiResponse<PaymentGateway>, CreatePaymentGatewayData>({
      query: (data) => ({
        url: '/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['PaymentGateway', 'PaymentGatewayStats'],
    }),

    // Update payment gateway
    updatePaymentGateway: builder.mutation<ApiResponse<PaymentGateway>, { id: number; data: UpdatePaymentGatewayData }>({
      query: ({ id, data }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'PaymentGateway', id },
        'PaymentGateway',
        'PaymentGatewayStats',
      ],
    }),

    // Activate payment gateway
    activatePaymentGateway: builder.mutation<ApiResponse<PaymentGateway>, number>({
      query: (id) => ({
        url: `/${id}/activate`,
        method: 'POST',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'PaymentGateway', id },
        'PaymentGateway',
        'PaymentGatewayStats',
      ],
    }),

    // Deactivate payment gateway
    deactivatePaymentGateway: builder.mutation<ApiResponse<PaymentGateway>, number>({
      query: (id) => ({
        url: `/${id}/deactivate`,
        method: 'POST',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'PaymentGateway', id },
        'PaymentGateway',
        'PaymentGatewayStats',
      ],
    }),

    // Set as default gateway
    setDefaultGateway: builder.mutation<ApiResponse<PaymentGateway>, number>({
      query: (id) => ({
        url: `/${id}/set-default`,
        method: 'POST',
      }),
      invalidatesTags: ['PaymentGateway', 'PaymentGatewayStats'],
    }),

    // Delete payment gateway
    deletePaymentGateway: builder.mutation<ApiResponse<null>, number>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'PaymentGateway', id },
        'PaymentGateway',
        'PaymentGatewayStats',
      ],
    }),

    // Get payment gateway statistics
    getPaymentGatewayStats: builder.query<ApiResponse<PaymentGatewayStats>, void>({
      query: () => '/stats',
      providesTags: ['PaymentGatewayStats'],
    }),
  }),
});

export const {
  useGetPaymentGatewaysQuery,
  useGetPaymentGatewayQuery,
  useCreatePaymentGatewayMutation,
  useUpdatePaymentGatewayMutation,
  useActivatePaymentGatewayMutation,
  useDeactivatePaymentGatewayMutation,
  useSetDefaultGatewayMutation,
  useDeletePaymentGatewayMutation,
  useGetPaymentGatewayStatsQuery,
} = paymentGatewayApi;

