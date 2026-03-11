import { useState, useMemo } from 'react'
import {
  Users,
  Building2,
  CreditCard,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Activity,
  ArrowUp,
  ArrowDown,
  Loader2,
  Download,
  BarChart3,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/common/components/ui/card'
import { Badge } from '@/common/components/ui/badge'
import { Button } from '@/common/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/common/components/ui/tabs'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
} from 'recharts'
import {
  useGetOverviewQuery,
  useGetRevenueQuery,
  useGetRevenueForecastQuery,
  useGetUsersQuery,
  useGetChurnQuery,
  useGetRetentionQuery,
  useGetFeaturesQuery,
} from '../apis/analytics.api'

const COLORS = ['#4469e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

export const AnalyticsPage = () => {
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | '1y'>('1y')

  // Calculate date range
  const dateParams = useMemo(() => {
    const now = new Date()
    const to = now.toISOString().split('T')[0]
    let from: string

    switch (dateRange) {
      case '7d':
        from = new Date(now.setDate(now.getDate() - 7)).toISOString().split('T')[0]
        break
      case '30d':
        from = new Date(now.setDate(now.getDate() - 30)).toISOString().split('T')[0]
        break
      case '90d':
        from = new Date(now.setDate(now.getDate() - 90)).toISOString().split('T')[0]
        break
      case '1y':
      default:
        from = new Date(now.setFullYear(now.getFullYear() - 1)).toISOString().split('T')[0]
        break
    }

    return { date_from: from, date_to: to }
  }, [dateRange])

  // API queries
  const { data: overviewResponse, isLoading: overviewLoading } = useGetOverviewQuery(dateParams)
  const { data: revenueResponse, isLoading: revenueLoading } = useGetRevenueQuery(dateParams)
  const { data: forecastResponse, isLoading: forecastLoading } = useGetRevenueForecastQuery({ months: 6 })
  const { data: usersResponse, isLoading: usersLoading } = useGetUsersQuery(dateParams)
  const { data: churnResponse, isLoading: churnLoading } = useGetChurnQuery(dateParams)
  const { data: retentionResponse, isLoading: retentionLoading } = useGetRetentionQuery({ months: 12 })
  const { data: featuresResponse, isLoading: featuresLoading } = useGetFeaturesQuery(dateParams)

  // Extract data
  const overview = overviewResponse?.data
  const revenue = revenueResponse?.data
  const forecast = forecastResponse?.data
  const users = usersResponse?.data
  const churn = churnResponse?.data
  const retention = retentionResponse?.data
  const features = featuresResponse?.data

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num)
  }

  const LoadingSkeleton = () => (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="w-8 h-8 animate-spin text-[#4469e5]" />
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Advanced Analytics</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Comprehensive insights into platform performance, revenue, and user behavior
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as typeof dateRange)}
            className="h-9 px-3 rounded-md border text-sm bg-white dark:bg-gray-800"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {overviewLoading ? (
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            ) : (
              <>
                <div className="text-2xl font-bold">{formatCurrency(overview?.revenue?.total || 0)}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className={`flex items-center gap-1 ${(overview?.revenue?.growth_percentage || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {(overview?.revenue?.growth_percentage || 0) >= 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                    {Math.abs(overview?.revenue?.growth_percentage || 0)}% from previous period
                  </span>
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Organizations</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {overviewLoading ? (
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            ) : (
              <>
                <div className="text-2xl font-bold">{formatNumber(overview?.organizations?.total || 0)}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {overview?.organizations?.active || 0} active
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {overviewLoading ? (
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            ) : (
              <>
                <div className="text-2xl font-bold">{formatNumber(overview?.users?.total || 0)}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {overview?.users?.active || 0} active
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {overviewLoading ? (
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            ) : (
              <>
                <div className="text-2xl font-bold">{formatNumber(overview?.subscriptions?.active || 0)}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {overview?.subscriptions?.trial || 0} in trial
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tabbed Analytics Sections */}
      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
          <TabsTrigger value="revenue" className="gap-2">
            <DollarSign className="h-4 w-4" />
            Revenue
          </TabsTrigger>
          <TabsTrigger value="users" className="gap-2">
            <Users className="h-4 w-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="retention" className="gap-2">
            <Activity className="h-4 w-4" />
            Retention
          </TabsTrigger>
          <TabsTrigger value="features" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Features
          </TabsTrigger>
        </TabsList>

        {/* Revenue Tab */}
        <TabsContent value="revenue" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
                <CardDescription>Revenue over time with transaction count</CardDescription>
              </CardHeader>
              <CardContent>
                {revenueLoading ? (
                  <LoadingSkeleton />
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={revenue?.by_period || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="period" />
                      <YAxis />
                      <Tooltip formatter={(value: number) => formatCurrency(value)} />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="#4469e5"
                        fill="#4469e5"
                        fillOpacity={0.2}
                        strokeWidth={2}
                        name="Revenue"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            {/* Revenue Forecast */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Forecast</CardTitle>
                <CardDescription>Projected revenue for next 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                {forecastLoading ? (
                  <LoadingSkeleton />
                ) : (
                  <>
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart data={forecast?.forecast || []}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value: number) => formatCurrency(value)} />
                        <Line
                          type="monotone"
                          dataKey="projected_revenue"
                          stroke="#10b981"
                          strokeWidth={2}
                          strokeDasharray="5 5"
                          name="Projected Revenue"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                    <div className="mt-4 flex items-center justify-center gap-4 text-sm">
                      <Badge variant="outline" className="text-green-600">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {forecast?.average_growth_rate || 0}% avg growth rate
                      </Badge>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue by Plan */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue by Plan</CardTitle>
                <CardDescription>Revenue breakdown by subscription plan</CardDescription>
              </CardHeader>
              <CardContent>
                {revenueLoading ? (
                  <LoadingSkeleton />
                ) : (
                  <>
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={revenue?.by_plan || []}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ plan_name, percent }) => `${plan_name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          dataKey="revenue"
                          nameKey="plan_name"
                        >
                          {(revenue?.by_plan || []).map((_entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => formatCurrency(value)} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="mt-4 space-y-2">
                      {(revenue?.by_plan || []).map((plan, index) => (
                        <div key={plan.plan_name} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: COLORS[index % COLORS.length] }}
                            />
                            <span>{plan.plan_name}</span>
                          </div>
                          <span className="font-medium">{formatCurrency(plan.revenue)}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* MRR Card */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Recurring Revenue</CardTitle>
                <CardDescription>Current MRR and revenue by type</CardDescription>
              </CardHeader>
              <CardContent>
                {revenueLoading ? (
                  <LoadingSkeleton />
                ) : (
                  <>
                    <div className="text-center mb-6">
                      <div className="text-4xl font-bold text-[#4469e5]">
                        {formatCurrency(revenue?.mrr || 0)}
                      </div>
                      <p className="text-sm text-gray-500">Current MRR</p>
                    </div>
                    <div className="space-y-3">
                      {(revenue?.by_type || []).map((item) => (
                        <div key={item.type} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div>
                            <p className="font-medium capitalize">{item.type}</p>
                            <p className="text-xs text-gray-500">{item.transaction_count} transactions</p>
                          </div>
                          <span className="font-bold">{formatCurrency(item.revenue)}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* User Growth */}
            <Card>
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
                <CardDescription>New users and cumulative total over time</CardDescription>
              </CardHeader>
              <CardContent>
                {usersLoading ? (
                  <LoadingSkeleton />
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={users?.growth || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="new_users"
                        stroke="#4469e5"
                        strokeWidth={2}
                        name="New Users"
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="total_users"
                        stroke="#10b981"
                        strokeWidth={2}
                        name="Total Users"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            {/* Users by Type */}
            <Card>
              <CardHeader>
                <CardTitle>Users by Type</CardTitle>
                <CardDescription>Distribution of user types</CardDescription>
              </CardHeader>
              <CardContent>
                {usersLoading ? (
                  <LoadingSkeleton />
                ) : (
                  <>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={users?.by_type || []} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="type" type="category" width={100} />
                        <Tooltip />
                        <Bar dataKey="count" fill="#4469e5" />
                      </BarChart>
                    </ResponsiveContainer>
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="text-2xl font-bold">{users?.avg_users_per_org?.toFixed(1) || 0}</div>
                        <p className="text-xs text-gray-500">Avg users/org</p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="text-2xl font-bold">{users?.total_organizations_with_users || 0}</div>
                        <p className="text-xs text-gray-500">Orgs with users</p>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Retention Tab */}
        <TabsContent value="retention" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Retention Rate */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Retention Rate</CardTitle>
                <CardDescription>Subscription retention over time</CardDescription>
              </CardHeader>
              <CardContent>
                {retentionLoading ? (
                  <LoadingSkeleton />
                ) : (
                  <>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={retention?.monthly_retention || []}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip formatter={(value: number) => `${value}%`} />
                        <Line
                          type="monotone"
                          dataKey="retention_rate"
                          stroke="#10b981"
                          strokeWidth={2}
                          name="Retention Rate"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                    <div className="mt-4 text-center">
                      <Badge variant="outline" className="text-lg py-2 px-4">
                        Average Retention: {retention?.average_retention_rate || 0}%
                      </Badge>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Churn Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>Churn Analysis</CardTitle>
                <CardDescription>Monthly churn rate and churned subscriptions</CardDescription>
              </CardHeader>
              <CardContent>
                {churnLoading ? (
                  <LoadingSkeleton />
                ) : (
                  <>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={churn?.monthly_churn || []}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="churn_rate" fill="#ef4444" name="Churn Rate (%)" />
                      </BarChart>
                    </ResponsiveContainer>
                    <div className="mt-4 flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <span className="text-sm font-medium">Average Churn Rate</span>
                      <Badge variant="destructive">{churn?.average_churn_rate || 0}%</Badge>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Churn by Plan */}
          <Card>
            <CardHeader>
              <CardTitle>Churn by Plan</CardTitle>
              <CardDescription>Which plans have the highest churn</CardDescription>
            </CardHeader>
            <CardContent>
              {churnLoading ? (
                <LoadingSkeleton />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {(churn?.by_plan || []).map((plan) => (
                    <div key={plan.plan_name} className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-red-600">{plan.churned_count}</div>
                      <p className="text-sm text-gray-500 mt-1">{plan.plan_name}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Features Tab */}
        <TabsContent value="features" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Popular Features */}
            <Card>
              <CardHeader>
                <CardTitle>Most Popular Features</CardTitle>
                <CardDescription>Features included in the most plans</CardDescription>
              </CardHeader>
              <CardContent>
                {featuresLoading ? (
                  <LoadingSkeleton />
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={(features?.popular_features || []).slice(0, 8)} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={120} />
                      <Tooltip />
                      <Bar dataKey="plan_count" fill="#4469e5" name="Plans" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            {/* Features by Category */}
            <Card>
              <CardHeader>
                <CardTitle>Features by Category</CardTitle>
                <CardDescription>Distribution of features across categories</CardDescription>
              </CardHeader>
              <CardContent>
                {featuresLoading ? (
                  <LoadingSkeleton />
                ) : (
                  <>
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={features?.by_category || []}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ category, percent }) => `${category}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          dataKey="count"
                          nameKey="category"
                        >
                          {(features?.by_category || []).map((_entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Features by Plan */}
          <Card>
            <CardHeader>
              <CardTitle>Features by Plan</CardTitle>
              <CardDescription>Feature count per subscription plan</CardDescription>
            </CardHeader>
            <CardContent>
              {featuresLoading ? (
                <LoadingSkeleton />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {(features?.by_plan || []).map((plan, index) => (
                    <div key={plan.plan_name} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{plan.plan_name}</span>
                        <Badge style={{ backgroundColor: COLORS[index % COLORS.length] }}>
                          {plan.feature_count} features
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500 line-clamp-2">{plan.features}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
