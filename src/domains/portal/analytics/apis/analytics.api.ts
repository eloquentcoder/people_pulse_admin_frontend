import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_URL } from '@/config/url';
import type { RootState } from '@/config/store';
import type { ApiResponse } from '@/common/models/response.model';

// Analytics types
export interface AnalyticsOverview {
  revenue: {
    total: number;
    growth_percentage: number;
    previous_period: number;
  };
  users: {
    total: number;
    active: number;
  };
  organizations: {
    total: number;
    active: number;
  };
  subscriptions: {
    active: number;
    trial: number;
  };
  date_range: {
    from: string;
    to: string;
  };
}

export interface RevenueByPeriod {
  period: string;
  revenue: number;
  transaction_count: number;
}

export interface RevenueByPlan {
  plan_name: string;
  revenue: number;
  transaction_count: number;
}

export interface RevenueAnalytics {
  by_period: RevenueByPeriod[];
  by_plan: RevenueByPlan[];
  by_type: { type: string; revenue: number; transaction_count: number }[];
  mrr: number;
  date_range: {
    from: string;
    to: string;
  };
}

export interface RevenueForecast {
  historical: Record<string, number>;
  forecast: {
    month: string;
    projected_revenue: number;
    confidence: number;
  }[];
  average_growth_rate: number;
}

export interface UserGrowth {
  month: string;
  new_users: number;
  total_users: number;
}

export interface UserAnalytics {
  growth: UserGrowth[];
  by_type: { type: string; count: number }[];
  avg_users_per_org: number;
  total_organizations_with_users: number;
  date_range: {
    from: string;
    to: string;
  };
}

export interface MonthlyChurn {
  month: string;
  start_subscriptions: number;
  churned: number;
  churn_rate: number;
}

export interface ChurnAnalytics {
  monthly_churn: MonthlyChurn[];
  by_plan: { plan_name: string; churned_count: number }[];
  average_churn_rate: number;
  date_range: {
    from: string;
    to: string;
  };
}

export interface CohortRetention {
  month: number;
  active: number;
  retention_rate: number;
}

export interface Cohort {
  cohort_month: string;
  cohort_size: number;
  retention: CohortRetention[];
}

export interface CohortAnalytics {
  cohorts: Cohort[];
  months_analyzed: number;
}

export interface FeatureAnalytics {
  by_plan: {
    plan_name: string;
    feature_count: number;
    features: string;
  }[];
  popular_features: {
    name: string;
    slug: string;
    plan_count: number;
  }[];
  by_category: {
    category: string;
    count: number;
  }[];
  date_range: {
    from: string;
    to: string;
  };
}

export interface MonthlyRetention {
  month: string;
  start_count: number;
  end_count: number;
  new_count: number;
  retained: number;
  retention_rate: number;
}

export interface RetentionAnalytics {
  monthly_retention: MonthlyRetention[];
  average_retention_rate: number;
}

export interface DateRangeParams {
  date_from?: string;
  date_to?: string;
}

export const analyticsApi = createApi({
  reducerPath: 'analyticsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}/analytics`,
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
  tagTypes: ['Analytics'],
  endpoints: (builder) => ({
    getOverview: builder.query<ApiResponse<AnalyticsOverview>, DateRangeParams>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.date_from) queryParams.append('date_from', params.date_from);
        if (params?.date_to) queryParams.append('date_to', params.date_to);
        return `/overview?${queryParams.toString()}`;
      },
      providesTags: ['Analytics'],
    }),

    getRevenue: builder.query<ApiResponse<RevenueAnalytics>, DateRangeParams & { group_by?: string }>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.date_from) queryParams.append('date_from', params.date_from);
        if (params?.date_to) queryParams.append('date_to', params.date_to);
        if (params?.group_by) queryParams.append('group_by', params.group_by);
        return `/revenue?${queryParams.toString()}`;
      },
      providesTags: ['Analytics'],
    }),

    getRevenueForecast: builder.query<ApiResponse<RevenueForecast>, { months?: number }>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.months) queryParams.append('months', params.months.toString());
        return `/revenue/forecast?${queryParams.toString()}`;
      },
      providesTags: ['Analytics'],
    }),

    getUsers: builder.query<ApiResponse<UserAnalytics>, DateRangeParams>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.date_from) queryParams.append('date_from', params.date_from);
        if (params?.date_to) queryParams.append('date_to', params.date_to);
        return `/users?${queryParams.toString()}`;
      },
      providesTags: ['Analytics'],
    }),

    getChurn: builder.query<ApiResponse<ChurnAnalytics>, DateRangeParams>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.date_from) queryParams.append('date_from', params.date_from);
        if (params?.date_to) queryParams.append('date_to', params.date_to);
        return `/churn?${queryParams.toString()}`;
      },
      providesTags: ['Analytics'],
    }),

    getCohorts: builder.query<ApiResponse<CohortAnalytics>, { months?: number }>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.months) queryParams.append('months', params.months.toString());
        return `/cohorts?${queryParams.toString()}`;
      },
      providesTags: ['Analytics'],
    }),

    getFeatures: builder.query<ApiResponse<FeatureAnalytics>, DateRangeParams>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.date_from) queryParams.append('date_from', params.date_from);
        if (params?.date_to) queryParams.append('date_to', params.date_to);
        return `/features?${queryParams.toString()}`;
      },
      providesTags: ['Analytics'],
    }),

    getRetention: builder.query<ApiResponse<RetentionAnalytics>, { months?: number }>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.months) queryParams.append('months', params.months.toString());
        return `/retention?${queryParams.toString()}`;
      },
      providesTags: ['Analytics'],
    }),

    exportAnalytics: builder.query<ApiResponse<any>, { type: string; format?: string } & DateRangeParams>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        queryParams.append('type', params.type);
        if (params?.format) queryParams.append('format', params.format);
        if (params?.date_from) queryParams.append('date_from', params.date_from);
        if (params?.date_to) queryParams.append('date_to', params.date_to);
        return `/export?${queryParams.toString()}`;
      },
    }),
  }),
});

export const {
  useGetOverviewQuery,
  useGetRevenueQuery,
  useGetRevenueForecastQuery,
  useGetUsersQuery,
  useGetChurnQuery,
  useGetCohortsQuery,
  useGetFeaturesQuery,
  useGetRetentionQuery,
  useLazyExportAnalyticsQuery,
} = analyticsApi;
