import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_URL } from '@/config/url';
import type { RootState } from '@/config/store';
import type { ApiResponse } from '@/common/models/response.model';
import type {
  LandingContentResponse,
  HeroContent,
  TrustContent,
  FeaturesContent,
  TestimonialsContent,
  MetricsContent,
  TrustedCompany,
  SectionData,
} from '../models/landing-content.model';

type SectionContent = HeroContent | TrustContent | FeaturesContent | TestimonialsContent | MetricsContent;

export const landingContentApi = createApi({
  reducerPath: 'landingContentApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}/landing-content`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth?.token;
      headers.set('Accept', 'application/json');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['LandingContent', 'TrustedCompanies'],
  endpoints: (builder) => ({
    // Get all landing content
    getLandingContent: builder.query<ApiResponse<LandingContentResponse>, void>({
      query: () => '',
      providesTags: ['LandingContent', 'TrustedCompanies'],
    }),

    // Update a section
    updateSection: builder.mutation<
      ApiResponse<SectionData<SectionContent>>,
      { section: string; content: SectionContent }
    >({
      query: ({ section, content }) => ({
        url: `/sections/${section}`,
        method: 'PUT',
        body: { content },
      }),
      invalidatesTags: ['LandingContent'],
    }),

    // Add trusted company
    addCompany: builder.mutation<ApiResponse<TrustedCompany>, FormData>({
      query: (formData) => ({
        url: '/companies',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['TrustedCompanies'],
    }),

    // Update trusted company
    updateCompany: builder.mutation<ApiResponse<TrustedCompany>, { id: number; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `/companies/${id}`,
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: ['TrustedCompanies'],
    }),

    // Delete trusted company
    deleteCompany: builder.mutation<ApiResponse<void>, number>({
      query: (id) => ({
        url: `/companies/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['TrustedCompanies'],
    }),

    // Reorder trusted companies
    reorderCompanies: builder.mutation<ApiResponse<void>, { id: number; display_order: number }[]>({
      query: (order) => ({
        url: '/companies/reorder',
        method: 'POST',
        body: { order },
      }),
      invalidatesTags: ['TrustedCompanies'],
    }),
  }),
});

export const {
  useGetLandingContentQuery,
  useUpdateSectionMutation,
  useAddCompanyMutation,
  useUpdateCompanyMutation,
  useDeleteCompanyMutation,
  useReorderCompaniesMutation,
} = landingContentApi;
