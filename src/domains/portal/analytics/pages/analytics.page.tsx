import {
  Users,
  Building2,
  CreditCard,
  DollarSign,
  Activity,
  Database,
  CheckCircle,
  ArrowUp,
  ArrowDown,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/common/components/ui/card'
import { Badge } from '@/common/components/ui/badge'
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Cell,
  Pie,
  Legend,
  LineChart,
} from 'recharts'
import { useState } from 'react'

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

export const AnalyticsPage = () => {
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d')

  // Mock data - replace with actual API calls
  const systemStats = {
    totalOrganizations: 1247,
    totalUsers: 15689,
    totalSubscriptions: 1189,
    activeSubscriptions: 1098,
    totalRevenue: 2456789.50,
    monthlyRevenue: 189234.75,
    systemUptime: 99.97,
    apiRequests: 2345678,
    databaseSize: 45.6,
    activeUsers24h: 3421,
    failedRequests: 234,
    successRate: 99.99,
  }

  const revenueData = [
    { month: 'Jan', revenue: 185000, transactions: 234 },
    { month: 'Feb', revenue: 192000, transactions: 267 },
    { month: 'Mar', revenue: 201000, transactions: 289 },
    { month: 'Apr', revenue: 189000, transactions: 245 },
    { month: 'May', revenue: 215000, transactions: 312 },
    { month: 'Jun', revenue: 223000, transactions: 334 },
    { month: 'Jul', revenue: 189234, transactions: 298 },
  ]

  const subscriptionGrowth = [
    { month: 'Jan', new: 45, total: 890 },
    { month: 'Feb', new: 52, total: 942 },
    { month: 'Mar', new: 48, total: 990 },
    { month: 'Apr', new: 56, total: 1046 },
    { month: 'May', new: 61, total: 1107 },
    { month: 'Jun', new: 58, total: 1165 },
    { month: 'Jul', new: 54, total: 1219 },
  ]

  const planDistribution = [
    { name: 'Starter', value: 342, percentage: 28.7 },
    { name: 'Professional', value: 567, percentage: 47.6 },
    { name: 'Enterprise', value: 189, percentage: 15.9 },
    { name: 'Custom', value: 99, percentage: 8.3 },
  ]

  const apiUsageData = [
    { day: 'Mon', requests: 234567, errors: 234 },
    { day: 'Tue', requests: 245678, errors: 189 },
    { day: 'Wed', requests: 267890, errors: 267 },
    { day: 'Thu', requests: 256789, errors: 198 },
    { day: 'Fri', requests: 278901, errors: 245 },
    { day: 'Sat', requests: 189234, errors: 156 },
    { day: 'Sun', requests: 167890, errors: 134 },
  ]

  const topOrganizations = [
    { name: 'TechCorp Inc.', users: 1245, plan: 'Enterprise', revenue: 45678 },
    { name: 'Global Solutions', users: 987, plan: 'Professional', revenue: 34567 },
    { name: 'Innovation Labs', users: 756, plan: 'Professional', revenue: 28901 },
    { name: 'Digital Dynamics', users: 634, plan: 'Starter', revenue: 12345 },
    { name: 'Future Systems', users: 523, plan: 'Enterprise', revenue: 56789 },
  ]

  const systemHealth = [
    { metric: 'API Response Time', value: '145ms', status: 'good', trend: 'down' },
    { metric: 'Database Query Time', value: '23ms', status: 'good', trend: 'down' },
    { metric: 'Error Rate', value: '0.01%', status: 'good', trend: 'down' },
    { metric: 'Active Connections', value: '2,341', status: 'good', trend: 'up' },
  ]

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">System Analytics</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Comprehensive insights into platform performance and usage
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as any)}
            className="h-9 px-3 rounded-md border text-sm"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Organizations</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(systemStats.totalOrganizations)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-green-600 flex items-center gap-1">
                <ArrowUp className="h-3 w-3" /> 12% from last month
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(systemStats.totalUsers)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-green-600 flex items-center gap-1">
                <ArrowUp className="h-3 w-3" /> 8% from last month
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(systemStats.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-green-600 flex items-center gap-1">
                <ArrowUp className="h-3 w-3" /> 15% from last month
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.systemUptime}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-green-600 flex items-center gap-1">
                <CheckCircle className="h-3 w-3" /> All systems operational
              </span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue and Subscription Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Monthly revenue and transaction count</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsLineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Revenue ($)"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="transactions"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Transactions"
                />
              </RechartsLineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Subscription Growth</CardTitle>
            <CardDescription>New subscriptions and total count over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={subscriptionGrowth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="new"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  name="New Subscriptions"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="total"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  name="Total Subscriptions"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Plan Distribution and API Usage */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Subscription Plan Distribution</CardTitle>
            <CardDescription>Current plan breakdown across all organizations</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={planDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {planDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {planDistribution.map((plan, index) => (
                <div key={plan.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span>{plan.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-gray-600">{plan.value} orgs</span>
                    <span className="font-medium">{plan.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>API Usage & Performance</CardTitle>
            <CardDescription>Daily API requests and error rates</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={apiUsageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="requests" fill="#3b82f6" name="Requests" />
                <Bar yAxisId="right" dataKey="errors" fill="#ef4444" name="Errors" />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded-md">
                <div className="text-2xl font-bold text-blue-600">
                  {formatNumber(systemStats.apiRequests)}
                </div>
                <div className="text-xs text-gray-600 mt-1">Total API Requests</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-md">
                <div className="text-2xl font-bold text-green-600">
                  {systemStats.successRate}%
                </div>
                <div className="text-xs text-gray-600 mt-1">Success Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Health and Top Organizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>System Health Metrics</CardTitle>
            <CardDescription>Real-time system performance indicators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {systemHealth.map((health, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-md">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        health.status === 'good' ? 'bg-green-500' : 'bg-red-500'
                      }`}
                    />
                    <span className="text-sm font-medium">{health.metric}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold">{health.value}</span>
                    {health.trend === 'down' ? (
                      <ArrowDown className="h-4 w-4 text-green-600" />
                    ) : (
                      <ArrowUp className="h-4 w-4 text-blue-600" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Organizations by Usage</CardTitle>
            <CardDescription>Organizations with highest user counts and revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topOrganizations.map((org, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-md">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{org.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {org.plan}
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {formatNumber(org.users)} users
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold">{formatCurrency(org.revenue)}</div>
                    <div className="text-xs text-gray-600">Monthly</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users (24h)</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(systemStats.activeUsers24h)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Active in the last 24 hours
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Database Size</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.databaseSize} GB</div>
            <p className="text-xs text-muted-foreground mt-1">
              Total database storage used
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(systemStats.activeSubscriptions)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {((systemStats.activeSubscriptions / systemStats.totalSubscriptions) * 100).toFixed(1)}% of total
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

