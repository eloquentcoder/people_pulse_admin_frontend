import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_URL } from '@/config/url';
import type { RootState } from '@/config/store';
import type { ApiResponse, ApiResponseWithPagination } from '@/common/models/response.model';
import type {
  OrganizationWithCompliance,
  ComplianceDocument,
  ComplianceReviewFilters,
  ComplianceReviewStats,
  ApproveDocumentData,
  RejectDocumentData,
  DocumentViewResponse,
} from '../models/compliance.model';

export const complianceApi = createApi({
  reducerPath: 'complianceApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}/compliance-review`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth?.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      headers.set('Accept', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['ComplianceOrganization', 'ComplianceStats', 'ComplianceDocument'],
  endpoints: (builder) => ({
    // Get organizations pending compliance review
    getComplianceOrganizations: builder.query<ApiResponseWithPagination<OrganizationWithCompliance[]>, ComplianceReviewFilters>({
      query: (filters) => ({
        url: '',
        params: filters,
      }),
      providesTags: ['ComplianceOrganization'],
    }),

    // Get compliance review statistics
    getComplianceStats: builder.query<ApiResponse<ComplianceReviewStats>, void>({
      query: () => '/stats',
      providesTags: ['ComplianceStats'],
    }),

    // Get organization documents for review
    getOrganizationComplianceDocuments: builder.query<ApiResponse<OrganizationWithCompliance>, number>({
      query: (organizationId) => `/organizations/${organizationId}`,
      providesTags: (_result, _error, id) => [{ type: 'ComplianceOrganization', id }],
    }),

    // Approve document
    approveDocument: builder.mutation<ApiResponse<ComplianceDocument>, { documentId: number; data?: ApproveDocumentData }>({
      query: ({ documentId, data }) => ({
        url: `/documents/${documentId}/approve`,
        method: 'POST',
        body: data || {},
      }),
      invalidatesTags: ['ComplianceOrganization', 'ComplianceStats', 'ComplianceDocument'],
    }),

    // Reject document
    rejectDocument: builder.mutation<ApiResponse<ComplianceDocument>, { documentId: number; data: RejectDocumentData }>({
      query: ({ documentId, data }) => ({
        url: `/documents/${documentId}/reject`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['ComplianceOrganization', 'ComplianceStats', 'ComplianceDocument'],
    }),

    // View document (get URL)
    viewDocument: builder.query<ApiResponse<DocumentViewResponse>, number>({
      query: (documentId) => `/documents/${documentId}/view`,
    }),

    // Bulk approve all pending documents
    bulkApproveDocuments: builder.mutation<ApiResponse<{ approved_count: number; organization: OrganizationWithCompliance }>, number>({
      query: (organizationId) => ({
        url: `/organizations/${organizationId}/bulk-approve`,
        method: 'POST',
      }),
      invalidatesTags: ['ComplianceOrganization', 'ComplianceStats'],
    }),

    // Final organization compliance approval
    approveOrganizationCompliance: builder.mutation<ApiResponse<OrganizationWithCompliance>, number>({
      query: (organizationId) => ({
        url: `/organizations/${organizationId}/approve`,
        method: 'POST',
      }),
      invalidatesTags: ['ComplianceOrganization', 'ComplianceStats'],
    }),
  }),
});

export const {
  useGetComplianceOrganizationsQuery,
  useGetComplianceStatsQuery,
  useGetOrganizationComplianceDocumentsQuery,
  useApproveDocumentMutation,
  useRejectDocumentMutation,
  useViewDocumentQuery,
  useLazyViewDocumentQuery,
  useBulkApproveDocumentsMutation,
  useApproveOrganizationComplianceMutation,
} = complianceApi;
