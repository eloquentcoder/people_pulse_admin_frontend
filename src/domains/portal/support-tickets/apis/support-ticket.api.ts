import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_URL } from '@/config/url';
import type { RootState } from '@/config/store';
import type { ApiResponse, ApiResponseWithPagination } from '@/common/models/response.model';
import type { 
  SupportTicket, 
  SupportTicketFilters, 
  SupportTicketStats,
  CreateSupportTicketData,
  UpdateSupportTicketData,
  CreateTicketReplyData,
  SupportTicketReply
} from '../models/support-ticket.model';

export const supportTicketApi = createApi({
  reducerPath: 'supportTicketApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}/support-tickets`,
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
  tagTypes: ['SupportTicket', 'SupportTicketStats', 'SupportTicketReply'],
  endpoints: (builder) => ({
    // Get support tickets with filters
    getSupportTickets: builder.query<ApiResponseWithPagination<SupportTicket[]>, SupportTicketFilters>({
      query: (filters) => ({
        url: '/',
        params: filters,
      }),
      providesTags: ['SupportTicket'],
    }),

    // Get single support ticket
    getSupportTicket: builder.query<ApiResponse<SupportTicket>, number>({
      query: (id) => `/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'SupportTicket', id }],
    }),

    // Create support ticket
    createSupportTicket: builder.mutation<ApiResponse<SupportTicket>, CreateSupportTicketData>({
      query: (data) => ({
        url: '/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['SupportTicket', 'SupportTicketStats'],
    }),

    // Update support ticket
    updateSupportTicket: builder.mutation<ApiResponse<SupportTicket>, { id: number; data: UpdateSupportTicketData }>({
      query: ({ id, data }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'SupportTicket', id },
        'SupportTicket',
        'SupportTicketStats',
      ],
    }),

    // Update ticket status
    updateTicketStatus: builder.mutation<ApiResponse<SupportTicket>, { id: number; status: string }>({
      query: ({ id, status }) => ({
        url: `/${id}/status`,
        method: 'PUT',
        body: { status },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'SupportTicket', id },
        'SupportTicket',
        'SupportTicketStats',
      ],
    }),

    // Assign ticket
    assignTicket: builder.mutation<ApiResponse<SupportTicket>, { id: number; assigned_to: number }>({
      query: ({ id, assigned_to }) => ({
        url: `/${id}/assign`,
        method: 'POST',
        body: { assigned_to },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'SupportTicket', id },
        'SupportTicket',
        'SupportTicketStats',
      ],
    }),

    // Add reply to ticket
    addTicketReply: builder.mutation<ApiResponse<SupportTicketReply>, CreateTicketReplyData>({
      query: (data) => {
        const formData = new FormData();
        formData.append('ticket_id', data.ticket_id.toString());
        formData.append('message', data.message);
        formData.append('is_internal', (data.is_internal || false).toString());
        
        if (data.attachments && data.attachments.length > 0) {
          data.attachments.forEach((file) => {
            formData.append('attachments[]', file);
          });
        }

        return {
          url: `/${data.ticket_id}/replies`,
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: (_result, _error, { ticket_id }) => [
        { type: 'SupportTicket', id: ticket_id },
        'SupportTicketReply',
      ],
    }),

    // Delete support ticket
    deleteSupportTicket: builder.mutation<ApiResponse<null>, number>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'SupportTicket', id },
        'SupportTicket',
        'SupportTicketStats',
      ],
    }),

    // Get support ticket statistics
    getSupportTicketStats: builder.query<ApiResponse<SupportTicketStats>, void>({
      query: () => '/stats',
      providesTags: ['SupportTicketStats'],
    }),
  }),
});

export const {
  useGetSupportTicketsQuery,
  useGetSupportTicketQuery,
  useCreateSupportTicketMutation,
  useUpdateSupportTicketMutation,
  useUpdateTicketStatusMutation,
  useAssignTicketMutation,
  useAddTicketReplyMutation,
  useDeleteSupportTicketMutation,
  useGetSupportTicketStatsQuery,
} = supportTicketApi;

