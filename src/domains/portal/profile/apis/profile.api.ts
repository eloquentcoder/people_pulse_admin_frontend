import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_URL } from '@/config/url';
import type { RootState } from '@/config/store';
import type { ApiResponse } from '@/common/models/response.model';
import type { Profile, UpdateProfileData, UpdatePasswordData } from '../models/profile.model';

export const profileApi = createApi({
  reducerPath: 'profileApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}/profile`,
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
  tagTypes: ['Profile'],
  endpoints: (builder) => ({
    // Get current user's profile
    getProfile: builder.query<ApiResponse<Profile>, void>({
      query: () => '/',
      providesTags: ['Profile'],
    }),

    // Update profile information
    updateProfile: builder.mutation<ApiResponse<Profile>, UpdateProfileData>({
      query: (data) => ({
        url: '/',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Profile'],
    }),

    // Update password
    updatePassword: builder.mutation<ApiResponse<null>, UpdatePasswordData>({
      query: (data) => ({
        url: '/password',
        method: 'PUT',
        body: data,
      }),
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useUpdatePasswordMutation,
} = profileApi;
