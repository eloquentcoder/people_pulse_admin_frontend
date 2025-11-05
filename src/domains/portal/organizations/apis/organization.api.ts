import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_URL } from '@/config/url';
import type { RootState } from '@/config/store';
import type { ApiResponse, ApiResponseWithPagination } from '@/common/models/response.model';
import type { Organization, OrganizationFilters, UploadResult } from '../models/organization.model';
import type { OnboardAdminData } from '../models/organization.model';
import type { OrganizationStats } from '../models/organization.model';


export const organizationApi = createApi({
  reducerPath: 'organizationApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}/organizations`,
    prepareHeaders: (headers, { getState }) => {
        const token = (getState() as RootState).auth?.token;
        
        if (token) {
          headers.set('Authorization', `Bearer ${token}`);
        }
        
        
        return headers;
      },
  }),
  tagTypes: ['Organization', 'OrganizationStats'],
  endpoints: (builder) => ({
    // Get organizations with filters
    getOrganizations: builder.query<ApiResponseWithPagination<Organization[]>, OrganizationFilters>({
      query: (filters) => ({
        url: '',
        params: filters,
      }),
      providesTags: ['Organization'],
    }),

    // Create organization
    createOrganization: builder.mutation<ApiResponse<Organization>, Partial<Organization>>({
      query: (data) => ({
        url: '',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Organization', 'OrganizationStats'],
    }),

    // Get single organization
    getOrganization: builder.query<ApiResponse<Organization>, number>({
      query: (id) => `/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Organization', id }],
    }),

    // Update organization
    updateOrganization: builder.mutation<ApiResponse<Organization>, { id: number; data: Partial<Organization> }>({
      query: ({ id, data }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Organization', id },
        'Organization',
        'OrganizationStats',
      ],
    }),

    // Activate organization
    activateOrganization: builder.mutation<ApiResponse<Organization>, number>({
      query: (id) => ({
        url: `/${id}/activate`,
        method: 'POST',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Organization', id },
        'Organization',
        'OrganizationStats',
      ],
    }),

    // Deactivate organization
    deactivateOrganization: builder.mutation<ApiResponse<Organization>, number>({
      query: (id) => ({
        url: `/${id}/deactivate`,
        method: 'POST',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Organization', id },
        'Organization',
        'OrganizationStats',
      ],
    }),

    // Onboard organization admin
    onboardAdmin: builder.mutation<ApiResponse<Organization>, { id: number; data: OnboardAdminData }>({
      query: ({ id, data }) => ({
        url: `/${id}/onboard-admin`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Organization', id },
        'Organization',
      ],
    }),

    // Get organization statistics
    getOrganizationStats: builder.query<ApiResponse<OrganizationStats>, void>({
      query: () => '/stats',
      providesTags: ['OrganizationStats'],
    }),

    // Upload organizations from Excel
    uploadOrganizations: builder.mutation<ApiResponse<UploadResult>, FormData>({
      query: (formData) => ({
        url: '/upload',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Organization', 'OrganizationStats'],
    }),

  }),
});

export const {
  useGetOrganizationsQuery,
  useCreateOrganizationMutation,
  useGetOrganizationQuery,
  useUpdateOrganizationMutation,
  useActivateOrganizationMutation,
  useDeactivateOrganizationMutation,
  useOnboardAdminMutation,
  useGetOrganizationStatsQuery,
  useUploadOrganizationsMutation,
} = organizationApi;
