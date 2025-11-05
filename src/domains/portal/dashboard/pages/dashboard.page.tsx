import { 
    Building2, 
    Users, 
    CreditCard, 
    TrendingUp, 
    DollarSign, 
    Activity,
    ArrowUp,
    ArrowDown,
    Clock,
    Shield,
    AlertTriangle,
    CheckCircle,
    XCircle,
    Zap,
    Database,
    BarChart3,
    UserCheck,
    AlertCircle,
    Star,
    MessageSquare,
    FileText,
    Settings,
    Bell
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/common/components/ui/card';
import { Badge } from '@/common/components/ui/badge';
import { Button } from '@/common/components/ui/button';
import { 
    LineChart as RechartsLineChart, 
    Line, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    PieChart as RechartsPieChart,
    Cell,
    AreaChart,
    Area,
    Pie
} from 'recharts';
// import { 
//     useGetOverviewQuery,
//     useGetCompanyRegistrationsTrendQuery,
//     useGetRevenueTrendQuery,
//     useGetSubscriptionPlanDistributionQuery,
//     useGetTopActiveOrganizationsQuery,
//     useGetRecentActivityQuery
// } from '../apis/dashboard.api';
import type { DashboardOverview, ChartData, TopOrganization, RecentActivity } from '../models/dashboard.model';

interface StatCard {
    title: string;
    value: string;
    change: string;
    trend: 'up' | 'down';
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    description?: string;
}



export const DashboardPage = () => {
    // API Queries - COMMENTED OUT
    // const { data: overviewData, isLoading: overviewLoading } = useGetOverviewQuery();
    // const { data: companyTrendData, isLoading: companyTrendLoading } = useGetCompanyRegistrationsTrendQuery();
    // const { data: revenueDataResponse, isLoading: revenueLoading } = useGetRevenueTrendQuery();
    // const { data: subscriptionDataResponse, isLoading: subscriptionLoading } = useGetSubscriptionPlanDistributionQuery();
    // const { data: topOrgsData, isLoading: topOrgsLoading } = useGetTopActiveOrganizationsQuery();
    // const { data: activityData, isLoading: activityLoading } = useGetRecentActivityQuery();

    // Mock data
    const mockOverview: DashboardOverview = {
        company_metrics: {
            total_companies: 245,
            active_companies: 198,
            inactive_companies: 35,
            new_companies_this_month: 12,
            trial_vs_paid_ratio: 68.5,
        },
        user_metrics: {
            total_users: 5420,
            active_users_this_week: 3240,
            avg_session_duration: '45m 23s',
            user_growth_rate: 12.5,
        },
        financial_metrics: {
            total_revenue: 1250000,
            mrr: 85000,
            revenue_growth: 18.3,
            failed_transactions: 23,
        },
        system_metrics: {
            api_calls_today: 12450,
            system_uptime: 99.8,
            storage_used: '2.4 TB',
            avg_response_time: '145ms',
        },
        security_metrics: {
            login_attempts_today: 1240,
            failed_logins: 45,
            audit_logs: 890,
            reported_issues: 12,
        },
        engagement_metrics: {
            open_support_tickets: 34,
            avg_response_time: '2h 15m',
            customer_retention: 94.2,
            customer_satisfaction: 4.6,
        },
    };

    const mockCompanyRegistrations: ChartData[] = [
        { name: 'Jan', value: 45, companies: 45 },
        { name: 'Feb', value: 52, companies: 52 },
        { name: 'Mar', value: 48, companies: 48 },
        { name: 'Apr', value: 61, companies: 61 },
        { name: 'May', value: 55, companies: 55 },
        { name: 'Jun', value: 67, companies: 67 },
    ];

    const mockRevenueData: ChartData[] = [
        { name: 'Jan', value: 72000, mrr: 72000 },
        { name: 'Feb', value: 75000, mrr: 75000 },
        { name: 'Mar', value: 78000, mrr: 78000 },
        { name: 'Apr', value: 82000, mrr: 82000 },
        { name: 'May', value: 85000, mrr: 85000 },
        { name: 'Jun', value: 88000, mrr: 88000 },
    ];

    const mockSubscriptionPlanData: ChartData[] = [
        { name: 'Basic', value: 120, color: '#4469e5' },
        { name: 'Professional', value: 85, color: '#ee9807' },
        { name: 'Enterprise', value: 40, color: '#10b981' },
    ];

    const mockTopOrganizations: TopOrganization[] = [
        { id: 1, name: 'Acme Corp', users: 250, plan: 'Enterprise', mrr: '$2,500', status: 'active', activity: 95 },
        { id: 2, name: 'Tech Solutions', users: 180, plan: 'Professional', mrr: '$1,800', status: 'active', activity: 88 },
        { id: 3, name: 'Global Industries', users: 320, plan: 'Enterprise', mrr: '$3,200', status: 'active', activity: 92 },
        { id: 4, name: 'Startup Inc', users: 45, plan: 'Basic', mrr: '$450', status: 'trial', activity: 65 },
        { id: 5, name: 'Mega Corp', users: 500, plan: 'Enterprise', mrr: '$5,000', status: 'active', activity: 98 },
    ];

    const mockRecentActivities: RecentActivity[] = [
        { id: 1, action: 'New organization registered', org: 'Startup Inc', time: '2 minutes ago', type: 'success' },
        { id: 2, action: 'Payment failed', org: 'Tech Solutions', time: '15 minutes ago', type: 'error' },
        { id: 3, action: 'Subscription upgraded', org: 'Acme Corp', time: '1 hour ago', type: 'success' },
        { id: 4, action: 'System maintenance scheduled', org: 'Platform', time: '2 hours ago', type: 'warning' },
        { id: 5, action: 'New user onboarded', org: 'Global Industries', time: '3 hours ago', type: 'info' },
    ];

    // Use mock data
    const overview = mockOverview;
    const companyRegistrationsData = mockCompanyRegistrations;
    const revenueData = mockRevenueData;
    const subscriptionPlanData = mockSubscriptionPlanData;
    const topOrganizations = mockTopOrganizations;
    const recentActivities = mockRecentActivities;

    // Company Stats
    const companyStats: StatCard[] = overview ? [
        {
            title: 'Total Companies',
            value: overview.company_metrics.total_companies.toString(),
            change: '+12.5%',
            trend: 'up',
            icon: Building2,
            color: 'from-blue-500 to-blue-600',
            description: 'All registered companies'
        },
        {
            title: 'Active Companies',
            value: overview.company_metrics.active_companies.toString(),
            change: '+8.2%',
            trend: 'up',
            icon: CheckCircle,
            color: 'from-green-500 to-green-600',
            description: 'Active in last 30 days'
        },
        {
            title: 'Inactive Companies',
            value: overview.company_metrics.inactive_companies.toString(),
            change: '-3.1%',
            trend: 'down',
            icon: XCircle,
            color: 'from-gray-500 to-gray-600',
            description: 'No activity recently'
        },
        {
            title: 'New This Month',
            value: overview.company_metrics.new_companies_this_month.toString(),
            change: '+15.3%',
            trend: 'up',
            icon: TrendingUp,
            color: 'from-purple-500 to-purple-600',
            description: 'New registrations'
        },
        {
            title: 'Trial vs Paid',
            value: `${overview.company_metrics.trial_vs_paid_ratio}%`,
            change: '+2.1%',
            trend: 'up',
            icon: Activity,
            color: 'from-orange-500 to-orange-600',
            description: 'Conversion rate'
        },
    ] : [];

    // User Stats
    const userStats: StatCard[] = overview ? [
        {
            title: 'Total Users',
            value: overview.user_metrics.total_users.toString(),
            change: `+${overview.user_metrics.user_growth_rate}%`,
            trend: overview.user_metrics.user_growth_rate >= 0 ? 'up' : 'down',
            icon: Users,
            color: 'from-blue-500 to-blue-600',
            description: 'All registered users'
        },
        {
            title: 'Active This Week',
            value: overview.user_metrics.active_users_this_week.toString(),
            change: '+5.2%',
            trend: 'up',
            icon: UserCheck,
            color: 'from-green-500 to-green-600',
            description: 'Weekly active users'
        },
        {
            title: 'Avg. Session',
            value: overview.user_metrics.avg_session_duration,
            change: '+12m',
            trend: 'up',
            icon: Clock,
            color: 'from-purple-500 to-purple-600',
            description: 'Average duration'
        },
        {
            title: 'User Growth',
            value: `${overview.user_metrics.user_growth_rate}%`,
            change: `+${overview.user_metrics.user_growth_rate}%`,
            trend: overview.user_metrics.user_growth_rate >= 0 ? 'up' : 'down',
            icon: TrendingUp,
            color: 'from-orange-500 to-orange-600',
            description: 'Monthly growth rate'
        },
    ] : [];

    // Financial Stats
    const financialStats: StatCard[] = overview ? [
        {
            title: 'Total Revenue',
            value: `$${(overview.financial_metrics.total_revenue / 1000).toFixed(1)}k`,
            change: `+${overview.financial_metrics.revenue_growth}%`,
            trend: overview.financial_metrics.revenue_growth >= 0 ? 'up' : 'down',
            icon: DollarSign,
            color: 'from-green-500 to-green-600',
            description: 'All-time revenue'
        },
        {
            title: 'MRR',
            value: `$${(overview.financial_metrics.mrr / 1000).toFixed(1)}k`,
            change: '+8.3%',
            trend: 'up',
            icon: TrendingUp,
            color: 'from-blue-500 to-blue-600',
            description: 'Monthly recurring'
        },
        {
            title: 'Revenue Growth',
            value: `${overview.financial_metrics.revenue_growth}%`,
            change: `+${overview.financial_metrics.revenue_growth}%`,
            trend: overview.financial_metrics.revenue_growth >= 0 ? 'up' : 'down',
            icon: BarChart3,
            color: 'from-purple-500 to-purple-600',
            description: 'Month over month'
        },
        {
            title: 'Failed Transactions',
            value: overview.financial_metrics.failed_transactions.toString(),
            change: '-2.4%',
            trend: 'down',
            icon: AlertTriangle,
            color: 'from-red-500 to-red-600',
            description: 'This month'
        },
    ] : [];

    // System Stats
    const systemStats: StatCard[] = overview ? [
        {
            title: 'API Calls',
            value: overview.system_metrics.api_calls_today.toString(),
            change: '+15.2%',
            trend: 'up',
            icon: Zap,
            color: 'from-blue-500 to-blue-600',
            description: 'Today'
        },
        {
            title: 'System Uptime',
            value: `${overview.system_metrics.system_uptime}%`,
            change: '+0.1%',
            trend: 'up',
            icon: Activity,
            color: 'from-green-500 to-green-600',
            description: 'Last 30 days'
        },
        {
            title: 'Storage Used',
            value: overview.system_metrics.storage_used,
            change: '+2.3GB',
            trend: 'up',
            icon: Database,
            color: 'from-purple-500 to-purple-600',
            description: 'Total usage'
        },
        {
            title: 'Avg. Response',
            value: overview.system_metrics.avg_response_time,
            change: '-5ms',
            trend: 'down',
            icon: Clock,
            color: 'from-orange-500 to-orange-600',
            description: 'Last 7 days'
        },
    ] : [];

    // Security Stats
    const securityStats: StatCard[] = overview ? [
        {
            title: 'Login Attempts',
            value: overview.security_metrics.login_attempts_today.toString(),
            change: '+8.1%',
            trend: 'up',
            icon: Shield,
            color: 'from-blue-500 to-blue-600',
            description: 'Today'
        },
        {
            title: 'Failed Logins',
            value: overview.security_metrics.failed_logins.toString(),
            change: '-12.5%',
            trend: 'down',
            icon: XCircle,
            color: 'from-red-500 to-red-600',
            description: 'Today'
        },
        {
            title: 'Audit Logs',
            value: overview.security_metrics.audit_logs.toString(),
            change: '+5.2%',
            trend: 'up',
            icon: FileText,
            color: 'from-purple-500 to-purple-600',
            description: 'Today'
        },
        {
            title: 'Open Issues',
            value: overview.security_metrics.reported_issues.toString(),
            change: '-3.1%',
            trend: 'down',
            icon: AlertTriangle,
            color: 'from-orange-500 to-orange-600',
            description: 'High priority'
        },
    ] : [];

    // Engagement Stats
    const engagementStats: StatCard[] = overview ? [
        {
            title: 'Support Tickets',
            value: overview.engagement_metrics.open_support_tickets.toString(),
            change: '-5.2%',
            trend: 'down',
            icon: MessageSquare,
            color: 'from-blue-500 to-blue-600',
            description: 'Open tickets'
        },
        {
            title: 'Avg. Response',
            value: overview.engagement_metrics.avg_response_time,
            change: '-30m',
            trend: 'down',
            icon: Clock,
            color: 'from-green-500 to-green-600',
            description: 'Support response'
        },
        {
            title: 'Retention Rate',
            value: `${overview.engagement_metrics.customer_retention}%`,
            change: '+1.8%',
            trend: 'up',
            icon: UserCheck,
            color: 'from-purple-500 to-purple-600',
            description: '3-month retention'
        },
        {
            title: 'Satisfaction',
            value: `${overview.engagement_metrics.customer_satisfaction}/5.0`,
            change: '+0.3',
            trend: 'up',
            icon: Star,
            color: 'from-yellow-500 to-yellow-600',
            description: 'Customer rating'
        },
    ] : [];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                    Platform Dashboard
                </h1>
                <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-1">
                    Welcome back! Here's what's happening with your platform today.
                </p>
            </div>

            {/* AI Summary Card */}
            <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                <CardContent>
                    <div className="flex items-start gap-4">
                        <div className="p-3 rounded-lg bg-[#4469e5]">
                            <Zap className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                This Month's Summary
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                {overview ? (
                                    `${overview.company_metrics.new_companies_this_month} new companies joined, revenue up ${overview.financial_metrics.revenue_growth}%, user engagement increased by ${overview.user_metrics.user_growth_rate}%. System uptime at ${overview.system_metrics.system_uptime}% with ${overview.system_metrics.api_calls_today} API calls processed today.`
                                ) : (
                                    'Loading platform insights...'
                                )}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Company Metrics */}
            <div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {companyStats.map((stat) => (
                        <Card key={stat.title} className="relative overflow-hidden hover:shadow-lg transition-shadow">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color}`}>
                                        <stat.icon className="w-5 h-5 text-white" />
                                    </div>
                                    {stat.trend === 'up' ? (
                                        <ArrowUp className="w-4 h-4 text-green-500" />
                                    ) : (
                                        <ArrowDown className="w-4 h-4 text-red-500" />
                                    )}
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                                    {stat.value}
                                </h3>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                    {stat.title}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-500 mb-2">
                                    {stat.description}
                                </p>
                                <div className="flex items-center gap-1">
                                    <span className={`text-sm font-medium ${
                                        stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
                                    }`}>
                                        {stat.change}
                                    </span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                        vs last month
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* User Activity Metrics */}
            <div>
               
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {userStats.map((stat) => (
                        <Card key={stat.title} className="relative overflow-hidden hover:shadow-lg transition-shadow">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color}`}>
                                        <stat.icon className="w-5 h-5 text-white" />
                                    </div>
                                    {stat.trend === 'up' ? (
                                        <ArrowUp className="w-4 h-4 text-green-500" />
                                    ) : (
                                        <ArrowDown className="w-4 h-4 text-red-500" />
                                    )}
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                                    {stat.value}
                                </h3>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                    {stat.title}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-500 mb-2">
                                    {stat.description}
                                </p>
                                <div className="flex items-center gap-1">
                                    <span className={`text-sm font-medium ${
                                        stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
                                    }`}>
                                        {stat.change}
                                    </span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                        vs last month
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Financial Metrics */}
            <div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {financialStats.map((stat) => (
                        <Card key={stat.title} className="relative overflow-hidden hover:shadow-lg transition-shadow">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color}`}>
                                        <stat.icon className="w-5 h-5 text-white" />
                                    </div>
                                    {stat.trend === 'up' ? (
                                        <ArrowUp className="w-4 h-4 text-green-500" />
                                    ) : (
                                        <ArrowDown className="w-4 h-4 text-red-500" />
                                    )}
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                                    {stat.value}
                                </h3>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                    {stat.title}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-500 mb-2">
                                    {stat.description}
                                </p>
                                <div className="flex items-center gap-1">
                                    <span className={`text-sm font-medium ${
                                        stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
                                    }`}>
                                        {stat.change}
                                    </span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                        vs last month
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* System Performance & Security */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* System Performance */}
                <div>
                   
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {systemStats.map((stat) => (
                            <Card key={stat.title} className="relative overflow-hidden hover:shadow-lg transition-shadow">
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color}`}>
                                            <stat.icon className="w-5 h-5 text-white" />
                                        </div>
                                        {stat.trend === 'up' ? (
                                            <ArrowUp className="w-4 h-4 text-green-500" />
                                        ) : (
                                            <ArrowDown className="w-4 h-4 text-red-500" />
                                        )}
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                                        {stat.value}
                                    </h3>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                        {stat.title}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-500 mb-2">
                                        {stat.description}
                                    </p>
                                    <div className="flex items-center gap-1">
                                        <span className={`text-sm font-medium ${
                                            stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
                                        }`}>
                                            {stat.change}
                                        </span>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                            vs last month
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Security & Compliance */}
                <div>
                  
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {securityStats.map((stat) => (
                            <Card key={stat.title} className="relative overflow-hidden hover:shadow-lg transition-shadow">
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color}`}>
                                            <stat.icon className="w-5 h-5 text-white" />
                                        </div>
                                        {stat.trend === 'up' ? (
                                            <ArrowUp className="w-4 h-4 text-green-500" />
                                        ) : (
                                            <ArrowDown className="w-4 h-4 text-red-500" />
                                        )}
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                                        {stat.value}
                                    </h3>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                        {stat.title}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-500 mb-2">
                                        {stat.description}
                                    </p>
                                    <div className="flex items-center gap-1">
                                        <span className={`text-sm font-medium ${
                                            stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
                                        }`}>
                                            {stat.change}
                                        </span>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                            vs last month
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>

            {/* Engagement & Retention */}
            <div>
               
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {engagementStats.map((stat) => (
                        <Card key={stat.title} className="relative overflow-hidden hover:shadow-lg transition-shadow">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color}`}>
                                        <stat.icon className="w-5 h-5 text-white" />
                                    </div>
                                    {stat.trend === 'up' ? (
                                        <ArrowUp className="w-4 h-4 text-green-500" />
                                    ) : (
                                        <ArrowDown className="w-4 h-4 text-red-500" />
                                    )}
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                                    {stat.value}
                                </h3>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                    {stat.title}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-500 mb-2">
                                    {stat.description}
                                </p>
                                <div className="flex items-center gap-1">
                                    <span className={`text-sm font-medium ${
                                        stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
                                    }`}>
                                        {stat.change}
                                    </span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                        vs last month
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Company Registrations Trend */}
                <Card>
                    <CardHeader>
                        <CardTitle>Company Registrations</CardTitle>
                        <CardDescription>Monthly trend of new company registrations</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <RechartsLineChart data={companyRegistrationsData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line 
                                        type="monotone" 
                                        dataKey="companies" 
                                        stroke="#4469e5" 
                                        strokeWidth={3}
                                        dot={{ fill: '#4469e5', strokeWidth: 2, r: 4 }}
                                    />
                                </RechartsLineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Revenue Over Time */}
                <Card>
                    <CardHeader>
                        <CardTitle>Revenue Over Time</CardTitle>
                        <CardDescription>Monthly recurring revenue trends</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={revenueData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Area 
                                        type="monotone" 
                                        dataKey="mrr" 
                                        stroke="#ee9807" 
                                        fill="#ee9807"
                                        fillOpacity={0.3}
                                        strokeWidth={3}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Subscription Plan Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle>Subscription Plans</CardTitle>
                        <CardDescription>Distribution of subscription plans</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <RechartsPieChart>
                                    <Pie
                                        data={subscriptionPlanData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {subscriptionPlanData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color as string} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </RechartsPieChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Top Active Organizations */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Top Active Organizations</CardTitle>
                        <CardDescription>Organizations with highest activity levels</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {topOrganizations.map((org) => (
                                <div key={org.id} className="flex items-center justify-between p-4 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#4469e5] to-[#ee9807] flex items-center justify-center text-white font-semibold">
                                            {org.name[0]}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-white">
                                                {org.name}
                                            </p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {org.users} users · {org.plan}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <p className="font-semibold text-gray-900 dark:text-white">
                                                {org.mrr}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                MRR
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                                {org.activity}%
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                Activity
                                            </p>
                                        </div>
                                        <Badge
                                            variant={org.status === 'active' ? 'default' : 'outline'}
                                            className="capitalize"
                                        >
                                            {org.status}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions & Alerts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Quick Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>Common administrative tasks</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-3">
                            <Button className="h-20 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-[#4469e5] to-[#4469e5]/80 hover:from-[#4469e5]/90 hover:to-[#4469e5]/70">
                                <Bell className="w-5 h-5" />
                                <span className="text-sm font-medium">Send Announcement</span>
                            </Button>
                            <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2">
                                <FileText className="w-5 h-5" />
                                <span className="text-sm font-medium">View Logs</span>
                            </Button>
                            <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2">
                                <CreditCard className="w-5 h-5" />
                                <span className="text-sm font-medium">Manage Subscriptions</span>
                            </Button>
                            <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2">
                                <Settings className="w-5 h-5" />
                                <span className="text-sm font-medium">System Settings</span>
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>Latest platform activities and events</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {recentActivities.length > 0 ? (
                                recentActivities.slice(0, 5).map((activity) => {
                                    const getActivityIcon = (type: string) => {
                                        switch (type) {
                                            case 'error': return <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />;
                                            case 'warning': return <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5" />;
                                            case 'success': return <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />;
                                            default: return <Bell className="w-5 h-5 text-blue-500 mt-0.5" />;
                                        }
                                    };

                                    const getActivityStyles = (type: string) => {
                                        switch (type) {
                                            case 'error': return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
                                            case 'warning': return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
                                            case 'success': return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
                                            default: return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
                                        }
                                    };

                                    const getTextStyles = (type: string) => {
                                        switch (type) {
                                            case 'error': return {
                                                title: 'text-red-900 dark:text-red-100',
                                                description: 'text-red-700 dark:text-red-300',
                                                time: 'text-red-600 dark:text-red-400'
                                            };
                                            case 'warning': return {
                                                title: 'text-yellow-900 dark:text-yellow-100',
                                                description: 'text-yellow-700 dark:text-yellow-300',
                                                time: 'text-yellow-600 dark:text-yellow-400'
                                            };
                                            case 'success': return {
                                                title: 'text-green-900 dark:text-green-100',
                                                description: 'text-green-700 dark:text-green-300',
                                                time: 'text-green-600 dark:text-green-400'
                                            };
                                            default: return {
                                                title: 'text-blue-900 dark:text-blue-100',
                                                description: 'text-blue-700 dark:text-blue-300',
                                                time: 'text-blue-600 dark:text-blue-400'
                                            };
                                        }
                                    };

                                    const styles = getTextStyles(activity.type);

                                    return (
                                        <div key={activity.id} className={`flex items-start gap-3 p-3 rounded-lg border ${getActivityStyles(activity.type)}`}>
                                            {getActivityIcon(activity.type)}
                                            <div className="flex-1">
                                                <p className={`text-sm font-medium ${styles.title}`}>
                                                    {activity.action}
                                                </p>
                                                <p className={`text-xs ${styles.description}`}>
                                                    {activity.org}
                                                </p>
                                                <p className={`text-xs ${styles.time} mt-1`}>
                                                    {activity.time}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="text-center py-8">
                                    <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-500 dark:text-gray-400">No recent activity</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
