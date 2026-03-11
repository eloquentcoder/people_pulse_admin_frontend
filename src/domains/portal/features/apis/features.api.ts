import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_URL } from '@/config/url';
import type { RootState } from '@/config/store';
import type { ApiResponse } from '@/common/models/response.model';
import type { Feature, FeatureFormData } from '../types';

export interface FeatureFilters {
  category?: string;
  is_active?: boolean;
  search?: string;
}

export const featuresApi = createApi({
  reducerPath: 'featuresApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}/platform/features`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth?.token;
      
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      
      return headers;
    },
  }),
  tagTypes: ['Feature'],
  endpoints: (builder) => ({
    // Get features with filters
    getFeatures: builder.query<ApiResponse<Feature[]>, FeatureFilters | void>({
      query: (filters = {}) => ({
        url: '',
        params: filters,
      }),
      providesTags: ['Feature'],
    }),

    // Create feature
    createFeature: builder.mutation<ApiResponse<Feature>, FeatureFormData>({
      query: (data) => ({
        url: '',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Feature'],
    }),

    // Get single feature
    getFeature: builder.query<ApiResponse<Feature>, string>({
      query: (id) => `/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Feature', id }],
    }),

    // Update feature
    updateFeature: builder.mutation<ApiResponse<Feature>, { id: string; data: Partial<FeatureFormData> }>({
      query: ({ id, data }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Feature', id },
        'Feature',
      ],
    }),

    // Delete feature
    deleteFeature: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Feature', id },
        'Feature',
      ],
    }),
  }),
});

export const {
  useGetFeaturesQuery,
  useCreateFeatureMutation,
  useGetFeatureQuery,
  useUpdateFeatureMutation,
  useDeleteFeatureMutation,
} = featuresApi;
