import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_URL } from '@/config/url';
import type { RootState } from '@/config/store';
import type { ApiResponse, ApiResponseWithPagination } from '@/common/models/response.model';

// Types
export interface Permission {
  id: number;
  name: string;
  slug: string;
  module: string;
  description?: string;
}

export interface Role {
  id: number;
  name: string;
  slug: string;
  description?: string;
  is_system_role: boolean;
  organization_id?: number;
  permissions?: Permission[];
  permissions_by_module?: Record<string, Permission[]>;
  users_count?: number;
  permissions_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface PermissionGroup {
  module: string;
  permissions: Permission[];
}

export interface PermissionsResponse {
  permissions: PermissionGroup[];
  total: number;
  modules: string[];
}

export interface RoleStats {
  total_roles: number;
  system_roles: number;
  custom_roles: number;
  most_used_role: {
    name: string;
    users_count: number;
  } | null;
  most_permissive_role: {
    name: string;
    permissions_count: number;
  } | null;
}

export interface PermissionStats {
  total_permissions: number;
  total_modules: number;
  permissions_by_module: { module: string; count: number }[];
  most_assigned: { name: string; module: string; roles_count: number }[];
}

export interface RoleParams {
  search?: string;
  is_system_role?: boolean;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  per_page?: number;
  page?: number;
}

export interface CreateRoleRequest {
  name: string;
  description?: string;
  permissions?: number[];
}

export interface UpdateRoleRequest {
  name: string;
  description?: string;
}

export interface UpdatePermissionsRequest {
  permissions: number[];
}

export interface CloneRoleRequest {
  name: string;
  description?: string;
}

export const rolesApi = createApi({
  reducerPath: 'rolesApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth?.token;

      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }

      headers.set('Accept', 'application/json');
      headers.set('Content-Type', 'application/json');

      return headers;
    },
  }),
  tagTypes: ['Roles', 'Role', 'Permissions'],
  endpoints: (builder) => ({
    // Role endpoints
    getRoles: builder.query<ApiResponseWithPagination<Role[]>, RoleParams>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.search) queryParams.append('search', params.search);
        if (params?.is_system_role !== undefined) queryParams.append('is_system_role', String(params.is_system_role));
        if (params?.sort_by) queryParams.append('sort_by', params.sort_by);
        if (params?.sort_order) queryParams.append('sort_order', params.sort_order);
        if (params?.per_page) queryParams.append('per_page', String(params.per_page));
        if (params?.page) queryParams.append('page', String(params.page));
        return `/roles?${queryParams.toString()}`;
      },
      providesTags: ['Roles'],
    }),

    getRole: builder.query<ApiResponse<Role>, number>({
      query: (id) => `/roles/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Role', id }],
    }),

    createRole: builder.mutation<ApiResponse<Role>, CreateRoleRequest>({
      query: (data) => ({
        url: '/roles',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Roles'],
    }),

    updateRole: builder.mutation<ApiResponse<Role>, { id: number; data: UpdateRoleRequest }>({
      query: ({ id, data }) => ({
        url: `/roles/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => ['Roles', { type: 'Role', id }],
    }),

    deleteRole: builder.mutation<ApiResponse<void>, number>({
      query: (id) => ({
        url: `/roles/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Roles'],
    }),

    updateRolePermissions: builder.mutation<ApiResponse<Role>, { id: number; data: UpdatePermissionsRequest }>({
      query: ({ id, data }) => ({
        url: `/roles/${id}/permissions`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => ['Roles', { type: 'Role', id }],
    }),

    cloneRole: builder.mutation<ApiResponse<Role>, { id: number; data: CloneRoleRequest }>({
      query: ({ id, data }) => ({
        url: `/roles/${id}/clone`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Roles'],
    }),

    getRoleStats: builder.query<ApiResponse<RoleStats>, void>({
      query: () => '/roles/stats',
      providesTags: ['Roles'],
    }),

    // Permission endpoints
    getPermissions: builder.query<ApiResponse<PermissionsResponse>, { search?: string; module?: string }>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.search) queryParams.append('search', params.search);
        if (params?.module) queryParams.append('module', params.module);
        return `/permissions?${queryParams.toString()}`;
      },
      providesTags: ['Permissions'],
    }),

    getPermissionModules: builder.query<ApiResponse<string[]>, void>({
      query: () => '/permissions/modules',
      providesTags: ['Permissions'],
    }),

    getPermissionStats: builder.query<ApiResponse<PermissionStats>, void>({
      query: () => '/permissions/stats',
      providesTags: ['Permissions'],
    }),

    getPermissionsByModule: builder.query<ApiResponse<Permission[]>, string>({
      query: (module) => `/permissions/module/${module}`,
      providesTags: ['Permissions'],
    }),
  }),
});

export const {
  useGetRolesQuery,
  useGetRoleQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
  useUpdateRolePermissionsMutation,
  useCloneRoleMutation,
  useGetRoleStatsQuery,
  useGetPermissionsQuery,
  useGetPermissionModulesQuery,
  useGetPermissionStatsQuery,
  useGetPermissionsByModuleQuery,
} = rolesApi;
