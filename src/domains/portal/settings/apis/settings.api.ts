import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_URL } from '@/config/url';
import type { RootState } from '@/config/store';
import type { ApiResponse } from '@/common/models/response.model';
import type { 
  PlatformSettings,
  UpdateSettingsData,
  GeneralSettings,
  SecuritySettings,
  EmailSettings,
  SystemSettings,
  BrandingSettings,
  FeatureFlags,
  IntegrationSettings,
  MaintenanceSettings
} from '../models/settings.model';

export const settingsApi = createApi({
  reducerPath: 'settingsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}/settings`,
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
  tagTypes: ['Settings'],
  endpoints: (builder) => ({
    // Get all platform settings
    getSettings: builder.query<ApiResponse<PlatformSettings>, void>({
      query: () => '/',
      providesTags: ['Settings'],
    }),

    // Get specific settings section
    getGeneralSettings: builder.query<ApiResponse<GeneralSettings>, void>({
      query: () => '/general',
      providesTags: ['Settings'],
    }),

    getSecuritySettings: builder.query<ApiResponse<SecuritySettings>, void>({
      query: () => '/security',
      providesTags: ['Settings'],
    }),

    getEmailSettings: builder.query<ApiResponse<EmailSettings>, void>({
      query: () => '/email',
      providesTags: ['Settings'],
    }),

    getSystemSettings: builder.query<ApiResponse<SystemSettings>, void>({
      query: () => '/system',
      providesTags: ['Settings'],
    }),

    getBrandingSettings: builder.query<ApiResponse<BrandingSettings>, void>({
      query: () => '/branding',
      providesTags: ['Settings'],
    }),

    getFeatureFlags: builder.query<ApiResponse<FeatureFlags>, void>({
      query: () => '/features',
      providesTags: ['Settings'],
    }),

    getIntegrationSettings: builder.query<ApiResponse<IntegrationSettings>, void>({
      query: () => '/integrations',
      providesTags: ['Settings'],
    }),

    getMaintenanceSettings: builder.query<ApiResponse<MaintenanceSettings>, void>({
      query: () => '/maintenance',
      providesTags: ['Settings'],
    }),

    // Update settings
    updateSettings: builder.mutation<ApiResponse<PlatformSettings>, UpdateSettingsData>({
      query: (data) => ({
        url: '/',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Settings'],
    }),

    // Update specific section
    updateGeneralSettings: builder.mutation<ApiResponse<GeneralSettings>, Partial<GeneralSettings>>({
      query: (data) => ({
        url: '/general',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Settings'],
    }),

    updateSecuritySettings: builder.mutation<ApiResponse<SecuritySettings>, Partial<SecuritySettings>>({
      query: (data) => ({
        url: '/security',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Settings'],
    }),

    updateEmailSettings: builder.mutation<ApiResponse<EmailSettings>, Partial<EmailSettings>>({
      query: (data) => ({
        url: '/email',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Settings'],
    }),

    updateSystemSettings: builder.mutation<ApiResponse<SystemSettings>, Partial<SystemSettings>>({
      query: (data) => ({
        url: '/system',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Settings'],
    }),

    updateBrandingSettings: builder.mutation<ApiResponse<BrandingSettings>, Partial<BrandingSettings>>({
      query: (data) => ({
        url: '/branding',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Settings'],
    }),

    updateFeatureFlags: builder.mutation<ApiResponse<FeatureFlags>, Partial<FeatureFlags>>({
      query: (data) => ({
        url: '/features',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Settings'],
    }),

    updateIntegrationSettings: builder.mutation<ApiResponse<IntegrationSettings>, Partial<IntegrationSettings>>({
      query: (data) => ({
        url: '/integrations',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Settings'],
    }),

    updateMaintenanceSettings: builder.mutation<ApiResponse<MaintenanceSettings>, Partial<MaintenanceSettings>>({
      query: (data) => ({
        url: '/maintenance',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Settings'],
    }),

    // Test email
    testEmail: builder.mutation<ApiResponse<{ sent: boolean }>, { to: string }>({
      query: (data) => ({
        url: '/email/test',
        method: 'POST',
        body: data,
      }),
    }),

    // Clear cache
    clearCache: builder.mutation<ApiResponse<{ cleared: boolean }>, void>({
      query: () => ({
        url: '/cache/clear',
        method: 'POST',
      }),
      invalidatesTags: ['Settings'],
    }),
  }),
});

export const {
  useGetSettingsQuery,
  useGetGeneralSettingsQuery,
  useGetSecuritySettingsQuery,
  useGetEmailSettingsQuery,
  useGetSystemSettingsQuery,
  useGetBrandingSettingsQuery,
  useGetFeatureFlagsQuery,
  useGetIntegrationSettingsQuery,
  useGetMaintenanceSettingsQuery,
  useUpdateSettingsMutation,
  useUpdateGeneralSettingsMutation,
  useUpdateSecuritySettingsMutation,
  useUpdateEmailSettingsMutation,
  useUpdateSystemSettingsMutation,
  useUpdateBrandingSettingsMutation,
  useUpdateFeatureFlagsMutation,
  useUpdateIntegrationSettingsMutation,
  useUpdateMaintenanceSettingsMutation,
  useTestEmailMutation,
  useClearCacheMutation,
} = settingsApi;


