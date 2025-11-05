import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_URL } from '@/config/url';
import type { RootState } from '@/config/store';
import type { ApiResponse } from '@/common/models/response.model';
import type { DashboardOverview, ChartData } from '../models/dashboard.model';
import type { TopOrganization } from '../models/dashboard.model';
import type { RecentActivity } from '../models/dashboard.model';





export const dashboardApi = createApi({
  reducerPath: 'dashboardApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}/dashboard`,
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
  tagTypes: ['Dashboard', 'Overview', 'Charts', 'Organizations', 'Activity'],
  endpoints: (builder) => ({
    getOverview: builder.query<ApiResponse<DashboardOverview>, void>({
      query: () => '/overview',
      providesTags: ['Overview'],
    }),
    getCompanyRegistrationsTrend: builder.query<ApiResponse<ChartData[]>, void>({
      query: () => '/company-registrations-trend',
      providesTags: ['Charts'],
    }),
    getRevenueTrend: builder.query<ApiResponse<ChartData[]>, void>({
      query: () => '/revenue-trend',
      providesTags: ['Charts'],
    }),
    getSubscriptionPlanDistribution: builder.query<ApiResponse<ChartData[]>, void>({
      query: () => '/subscription-plan-distribution',
      providesTags: ['Charts'],
    }),
    getTopActiveOrganizations: builder.query<ApiResponse<TopOrganization[]>, void>({
      query: () => '/top-active-organizations',
      providesTags: ['Organizations'],
    }),
    getRecentActivity: builder.query<ApiResponse<RecentActivity[]>, void>({
      query: () => '/recent-activity',
      providesTags: ['Activity'],
    }),
  }),
});

export const {
  useGetOverviewQuery,
  useGetCompanyRegistrationsTrendQuery,
  useGetRevenueTrendQuery,
  useGetSubscriptionPlanDistributionQuery,
  useGetTopActiveOrganizationsQuery,
  useGetRecentActivityQuery,
} = dashboardApi;
