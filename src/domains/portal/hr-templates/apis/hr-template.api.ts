import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_URL } from '@/config/url';
import type { RootState } from '@/config/store';
import type { ApiResponse, ApiResponseWithPagination } from '@/common/models/response.model';
import type {
  HRTemplate,
  HRTemplateCategory,
  HRTemplateFilters,
  HRTemplateCategoryFilters,
  HRTemplateStats,
  CreateHRTemplateData,
  UpdateHRTemplateData,
  CreateHRTemplateCategoryData,
  UpdateHRTemplateCategoryData,
} from '../models/hr-template.model';

export const hrTemplateApi = createApi({
  reducerPath: 'hrTemplateApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}/hr-templates`,
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
  tagTypes: ['HRTemplate', 'HRTemplateCategory', 'HRTemplateStats'],
  endpoints: (builder) => ({
    // Templates
    getHRTemplates: builder.query<ApiResponseWithPagination<HRTemplate[]>, HRTemplateFilters>({
      query: (filters) => ({
        url: '/',
        params: filters,
      }),
      providesTags: ['HRTemplate'],
    }),
    getHRTemplate: builder.query<ApiResponse<HRTemplate>, number>({
      query: (id) => `/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'HRTemplate', id }],
    }),
    createHRTemplate: builder.mutation<ApiResponse<HRTemplate>, CreateHRTemplateData>({
      query: (data) => ({
        url: '/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['HRTemplate', 'HRTemplateStats'],
    }),
    updateHRTemplate: builder.mutation<ApiResponse<HRTemplate>, { id: number; data: UpdateHRTemplateData }>({
      query: ({ id, data }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'HRTemplate', id },
        'HRTemplate',
        'HRTemplateStats',
      ],
    }),
    deleteHRTemplate: builder.mutation<ApiResponse<null>, number>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['HRTemplate', 'HRTemplateStats'],
    }),
    duplicateHRTemplate: builder.mutation<ApiResponse<HRTemplate>, number>({
      query: (id) => ({
        url: `/${id}/duplicate`,
        method: 'POST',
      }),
      invalidatesTags: ['HRTemplate', 'HRTemplateStats'],
    }),

    // Categories
    getHRTemplateCategories: builder.query<ApiResponseWithPagination<HRTemplateCategory[]>, HRTemplateCategoryFilters>({
      query: (filters) => ({
        url: '/categories',
        params: filters,
      }),
      providesTags: ['HRTemplateCategory'],
    }),
    getHRTemplateCategory: builder.query<ApiResponse<HRTemplateCategory>, number>({
      query: (id) => `/categories/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'HRTemplateCategory', id }],
    }),
    createHRTemplateCategory: builder.mutation<ApiResponse<HRTemplateCategory>, CreateHRTemplateCategoryData>({
      query: (data) => ({
        url: '/categories',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['HRTemplateCategory', 'HRTemplateStats'],
    }),
    updateHRTemplateCategory: builder.mutation<ApiResponse<HRTemplateCategory>, { id: number; data: UpdateHRTemplateCategoryData }>({
      query: ({ id, data }) => ({
        url: `/categories/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'HRTemplateCategory', id },
        'HRTemplateCategory',
        'HRTemplateStats',
      ],
    }),
    deleteHRTemplateCategory: builder.mutation<ApiResponse<null>, number>({
      query: (id) => ({
        url: `/categories/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['HRTemplateCategory', 'HRTemplateStats'],
    }),

    // Stats
    getHRTemplateStats: builder.query<ApiResponse<HRTemplateStats>, void>({
      query: () => '/stats',
      providesTags: ['HRTemplateStats'],
    }),
  }),
});

export const {
  useGetHRTemplatesQuery,
  useGetHRTemplateQuery,
  useCreateHRTemplateMutation,
  useUpdateHRTemplateMutation,
  useDeleteHRTemplateMutation,
  useDuplicateHRTemplateMutation,
  useGetHRTemplateCategoriesQuery,
  useGetHRTemplateCategoryQuery,
  useCreateHRTemplateCategoryMutation,
  useUpdateHRTemplateCategoryMutation,
  useDeleteHRTemplateCategoryMutation,
  useGetHRTemplateStatsQuery,
} = hrTemplateApi;


