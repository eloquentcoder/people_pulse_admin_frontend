import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { API_URL } from '@/config/url'
import type { RootState } from '@/config/store'
import type { ApiResponse, ApiResponseWithPagination } from '@/common/models/response.model'
import type { UserRole } from '@/common/models/user.model'

export interface PlatformAdmin {
  id: number
  first_name: string
  last_name: string
  email: string
  user_type: 'platform_admin'
  is_active: boolean
  roles: UserRole[]
  created_at?: string
}

export interface PlatformAdminPayload {
  first_name: string
  last_name: string
  email: string
  role_ids: number[]
  password?: string
}

export const platformAdminsApi = createApi({
  reducerPath: 'platformAdminsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token
      if (token) headers.set('Authorization', `Bearer ${token}`)
      headers.set('Accept', 'application/json')
      headers.set('Content-Type', 'application/json')
      return headers
    },
  }),
  tagTypes: ['PlatformAdmins'],
  endpoints: (builder) => ({
    getPlatformAdmins: builder.query<ApiResponseWithPagination<PlatformAdmin[]>, { search?: string; page?: number }>({
      query: (params) => ({ url: '/platform-admins', params }),
      providesTags: ['PlatformAdmins'],
    }),
    createPlatformAdmin: builder.mutation<ApiResponse<PlatformAdmin>, PlatformAdminPayload>({
      query: (body) => ({ url: '/platform-admins', method: 'POST', body }),
      invalidatesTags: ['PlatformAdmins'],
    }),
    invitePlatformAdmin: builder.mutation<ApiResponse<unknown>, Omit<PlatformAdminPayload, 'password'>>({
      query: (body) => ({ url: '/platform-admins/invitations', method: 'POST', body }),
      invalidatesTags: ['PlatformAdmins'],
    }),
    updatePlatformAdmin: builder.mutation<ApiResponse<PlatformAdmin>, { id: number; data: Partial<PlatformAdminPayload> & { is_active?: boolean } }>({
      query: ({ id, data }) => ({ url: `/platform-admins/${id}`, method: 'PATCH', body: data }),
      invalidatesTags: ['PlatformAdmins'],
    }),
  }),
})

export const {
  useGetPlatformAdminsQuery,
  useCreatePlatformAdminMutation,
  useInvitePlatformAdminMutation,
  useUpdatePlatformAdminMutation,
} = platformAdminsApi
