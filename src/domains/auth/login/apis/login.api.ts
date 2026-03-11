import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_URL } from '@/config/url';
import type { User } from '@/common/models/user.model';
import type { LoginFormValues } from '../schemas/login.schema';
import type { ApiResponse } from '@/common/models/response.model';
import type { RootState } from '@/config/store';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  expires_in: number;
}



export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: async (args, api, extraOptions) => {
    const baseQuery = fetchBaseQuery({
      baseUrl: API_URL,
      prepareHeaders: (headers, { getState }) => {
        // Get token from state
        const token = (getState() as RootState).auth?.token;
        
        if (token) {
          headers.set('Authorization', `Bearer ${token}`);
        }
        
        headers.set('Accept', 'application/json');
        headers.set('Content-Type', 'application/json');
        
        return headers;
      },
    });

    const result = await baseQuery(args, api, extraOptions);

    // Handle 401 Unauthorized - clear credentials and redirect to login
    if (result.error && 'status' in result.error && result.error.status === 401) {
      // Clear auth state
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      
      // Only redirect if not already on login page
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    return result;
  },
  tagTypes: ['User', 'Auth'],
  endpoints: (builder) => ({
    login: builder.mutation<ApiResponse<LoginResponse>, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: {
          email: credentials.email,
          password: credentials.password,
        },
      }),
      invalidatesTags: ['Auth', 'User'],
    }),
    logout: builder.mutation<ApiResponse<{ message: string }>, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['Auth', 'User'],
    }),
    getCurrentUser: builder.query<ApiResponse<User>, void>({
      query: () => '/auth/me',
      providesTags: ['User'],
    }),
    refreshToken: builder.mutation<ApiResponse<{
        user: User;
        token: string;
        expires_in: number;
    }>, void>({
      query: () => ({
        url: '/auth/refresh',
        method: 'POST',
      }),
      invalidatesTags: ['Auth'],
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useGetCurrentUserQuery,
  useRefreshTokenMutation,
} = authApi;

