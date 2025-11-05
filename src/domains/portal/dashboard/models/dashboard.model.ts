export interface DashboardOverview {
    company_metrics: {
      total_companies: number;
      active_companies: number;
      inactive_companies: number;
      new_companies_this_month: number;
      trial_vs_paid_ratio: number;
    };
    user_metrics: {
      total_users: number;
      active_users_this_week: number;
      avg_session_duration: string;
      user_growth_rate: number;
    };
    financial_metrics: {
      total_revenue: number;
      mrr: number;
      revenue_growth: number;
      failed_transactions: number;
    };
    system_metrics: {
      api_calls_today: number;
      system_uptime: number;
      storage_used: string;
      avg_response_time: string;
    };
    security_metrics: {
      login_attempts_today: number;
      failed_logins: number;
      audit_logs: number;
      reported_issues: number;
    };
    engagement_metrics: {
      open_support_tickets: number;
      avg_response_time: string;
      customer_retention: number;
      customer_satisfaction: number;
    };
  }
  
  export interface ChartData {
    name: string;
    value: number;
    [key: string]: string | number;
  }
  
  export interface TopOrganization {
    id: number;
    name: string;
    users: number;
    plan: string;
    mrr: string;
    status: 'active' | 'trial' | 'inactive';
    activity: number;
  }
  
  export interface RecentActivity {
    id: number;
    action: string;
    org: string;
    time: string;
    type: 'success' | 'error' | 'warning' | 'info';
  }