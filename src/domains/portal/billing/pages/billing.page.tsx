import { useState } from 'react'
import {
  DollarSign,
  CreditCard,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Filter,
  Eye,
  Download,
  FileText,
  Building2,
  Calendar,
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  RefreshCw,
  ExternalLink,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/common/components/ui/card'
import { Badge } from '@/common/components/ui/badge'
import { Button } from '@/common/components/ui/button'
import { Input } from '@/common/components/ui/input'
import { Label } from '@/common/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/common/components/ui/select'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/common/components/ui/table'
import type { BillingTransaction, BillingFilters, BillingStats } from '../models/billing.model'
import { BillingTransactionModal } from '../components/billing-transaction-modal'

const BillingPage = () => {
  const [filters, setFilters] = useState<BillingFilters>({
    search: '',
    status: '',
    payment_status: '',
    type: '',
    billing_date_from: '',
    billing_date_to: '',
    sort_by: 'billing_date',
    sort_order: 'desc',
    per_page: 15,
    page: 1,
  })
  const [showFilters, setShowFilters] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState<BillingTransaction | null>(null)

  // Mock data - replace with actual API calls
  const billingStats: BillingStats = {
    total_revenue: 2456789.50,
    total_transactions: 1247,
    pending_payments: 234567.50,
    failed_payments: 12345.00,
    refunded_amount: 45678.25,
    monthly_revenue: 189234.75,
    success_rate: 96.5,
  }

  const transactions: BillingTransaction[] = [
    {
      id: 1,
      organization_id: 1,
      subscription_id: 1,
      payment_gateway_id: 1,
      transaction_id: 'TXN-2025-001',
      type: 'subscription',
      amount: 299.99,
      refunded_amount: 0,
      currency: 'USD',
      status: 'completed',
      payment_status: 'succeeded',
      payment_method: 'credit_card',
      gateway_transaction_id: 'ch_1234567890',
      description: 'Monthly subscription payment',
      billing_date: '2025-01-15',
      customer_email: 'admin@techcorp.com',
      customer_name: 'TechCorp Inc.',
      invoice_url: 'https://example.com/invoice/1',
      receipt_url: 'https://example.com/receipt/1',
      retry_count: 0,
      created_at: '2025-01-15T10:30:00Z',
      updated_at: '2025-01-15T10:30:00Z',
      organization: { id: 1, name: 'TechCorp Inc.' },
      subscription: { id: 1, plan_name: 'Professional Plan' },
      payment_gateway: { id: 1, name: 'Stripe', type: 'stripe' },
    },
    {
      id: 2,
      organization_id: 2,
      subscription_id: 2,
      payment_gateway_id: 2,
      transaction_id: 'TXN-2025-002',
      type: 'upgrade',
      amount: 150.00,
      refunded_amount: 0,
      currency: 'USD',
      status: 'completed',
      payment_status: 'succeeded',
      payment_method: 'credit_card',
      gateway_transaction_id: 'PAYPAL-123456',
      description: 'Plan upgrade to Enterprise',
      billing_date: '2025-01-14',
      customer_email: 'admin@globalsolutions.com',
      customer_name: 'Global Solutions',
      invoice_url: 'https://example.com/invoice/2',
      receipt_url: 'https://example.com/receipt/2',
      retry_count: 0,
      created_at: '2025-01-14T14:20:00Z',
      updated_at: '2025-01-14T14:20:00Z',
      organization: { id: 2, name: 'Global Solutions' },
      subscription: { id: 2, plan_name: 'Enterprise Plan' },
      payment_gateway: { id: 2, name: 'PayPal', type: 'paypal' },
    },
    {
      id: 3,
      organization_id: 3,
      subscription_id: 3,
      payment_gateway_id: 1,
      transaction_id: 'TXN-2025-003',
      type: 'subscription',
      amount: 99.99,
      refunded_amount: 0,
      currency: 'USD',
      status: 'pending',
      payment_status: 'processing',
      payment_method: 'credit_card',
      gateway_transaction_id: 'ch_0987654321',
      description: 'Monthly subscription payment',
      billing_date: '2025-01-16',
      customer_email: 'admin@innovationlabs.com',
      customer_name: 'Innovation Labs',
      retry_count: 0,
      created_at: '2025-01-16T09:15:00Z',
      updated_at: '2025-01-16T09:15:00Z',
      organization: { id: 3, name: 'Innovation Labs' },
      subscription: { id: 3, plan_name: 'Starter Plan' },
      payment_gateway: { id: 1, name: 'Stripe', type: 'stripe' },
    },
    {
      id: 4,
      organization_id: 4,
      subscription_id: 4,
      payment_gateway_id: 1,
      transaction_id: 'TXN-2025-004',
      type: 'refund',
      amount: 299.99,
      refunded_amount: 299.99,
      currency: 'USD',
      status: 'refunded',
      payment_status: 'refunded',
      payment_method: 'credit_card',
      gateway_transaction_id: 'ch_1111111111',
      refund_id: 're_1234567890',
      description: 'Full refund for cancelled subscription',
      billing_date: '2025-01-13',
      customer_email: 'admin@digitaldynamics.com',
      customer_name: 'Digital Dynamics',
      receipt_url: 'https://example.com/receipt/4',
      retry_count: 0,
      created_at: '2025-01-13T16:45:00Z',
      updated_at: '2025-01-13T16:45:00Z',
      organization: { id: 4, name: 'Digital Dynamics' },
      subscription: { id: 4, plan_name: 'Professional Plan' },
      payment_gateway: { id: 1, name: 'Stripe', type: 'stripe' },
    },
    {
      id: 5,
      organization_id: 5,
      subscription_id: 5,
      payment_gateway_id: 1,
      transaction_id: 'TXN-2025-005',
      type: 'subscription',
      amount: 449.99,
      refunded_amount: 0,
      currency: 'USD',
      status: 'failed',
      payment_status: 'failed',
      payment_method: 'credit_card',
      gateway_transaction_id: 'ch_failed_123',
      description: 'Monthly subscription payment',
      billing_date: '2025-01-12',
      failure_code: 'card_declined',
      failure_message: 'Your card was declined.',
      customer_email: 'admin@futuresystems.com',
      customer_name: 'Future Systems',
      retry_count: 2,
      next_retry_at: '2025-01-17T10:00:00Z',
      created_at: '2025-01-12T11:00:00Z',
      updated_at: '2025-01-12T11:05:00Z',
      organization: { id: 5, name: 'Future Systems' },
      subscription: { id: 5, plan_name: 'Enterprise Plan' },
      payment_gateway: { id: 1, name: 'Stripe', type: 'stripe' },
    },
  ]

  const handleFilterChange = (key: keyof BillingFilters, value: string | number | undefined) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }))
  }

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }))
  }

  const handleSort = (sortBy: string) => {
    setFilters((prev) => ({
      ...prev,
      sort_by: sortBy,
      sort_order: prev.sort_by === sortBy && prev.sort_order === 'asc' ? 'desc' : 'asc',
    }))
  }

  // Filter transactions
  let filteredTransactions = transactions.filter((txn) => {
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      if (
        !txn.transaction_id.toLowerCase().includes(searchLower) &&
        !txn.organization?.name.toLowerCase().includes(searchLower) &&
        !txn.customer_email?.toLowerCase().includes(searchLower) &&
        !txn.description?.toLowerCase().includes(searchLower)
      ) {
        return false
      }
    }
    if (filters.status && txn.status !== filters.status) return false
    if (filters.payment_status && txn.payment_status !== filters.payment_status) return false
    if (filters.type && txn.type !== filters.type) return false
    if (filters.billing_date_from && txn.billing_date < filters.billing_date_from) return false
    if (filters.billing_date_to && txn.billing_date > filters.billing_date_to) return false
    return true
  })

  // Sort transactions
  filteredTransactions = filteredTransactions.sort((a, b) => {
    const aVal = (a as any)[filters.sort_by || 'billing_date']
    const bVal = (b as any)[filters.sort_by || 'billing_date']
    const aStr = String(aVal || '').toLowerCase()
    const bStr = String(bVal || '').toLowerCase()
    if (aStr < bStr) return filters.sort_order === 'asc' ? -1 : 1
    if (aStr > bStr) return filters.sort_order === 'asc' ? 1 : -1
    return 0
  })

  const pageCount = Math.max(1, Math.ceil(filteredTransactions.length / (filters.per_page || 15)))
  const pageItems = filteredTransactions.slice(
    ((filters.page || 1) - 1) * (filters.per_page || 15),
    (filters.page || 1) * (filters.per_page || 15)
  )

  const formatCurrency = (amount: number, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        )
      case 'pending':
        return (
          <Badge variant="outline" className="text-orange-600">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        )
      case 'failed':
        return (
          <Badge variant="destructive">
            <XCircle className="w-3 h-3 mr-1" />
            Failed
          </Badge>
        )
      case 'refunded':
        return (
          <Badge variant="outline" className="text-purple-600">
            <RefreshCw className="w-3 h-3 mr-1" />
            Refunded
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'succeeded':
        return <Badge className="bg-green-100 text-green-800">Succeeded</Badge>
      case 'processing':
        return <Badge className="bg-blue-100 text-blue-800">Processing</Badge>
      case 'pending':
        return <Badge className="bg-orange-100 text-orange-800">Pending</Badge>
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>
      case 'cancelled':
        return <Badge className="bg-gray-100 text-gray-800">Cancelled</Badge>
      case 'refunded':
        return <Badge className="bg-purple-100 text-purple-800">Refunded</Badge>
      case 'partially_refunded':
        return <Badge className="bg-yellow-100 text-yellow-800">Partially Refunded</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      subscription: 'bg-blue-100 text-blue-800',
      upgrade: 'bg-green-100 text-green-800',
      downgrade: 'bg-yellow-100 text-yellow-800',
      addon: 'bg-purple-100 text-purple-800',
      refund: 'bg-red-100 text-red-800',
      adjustment: 'bg-gray-100 text-gray-800',
    }
    return (
      <Badge className={colors[type] || 'bg-gray-100 text-gray-800'}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Billing</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage billing transactions and payment records
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(billingStats.total_revenue)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-green-600 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" /> 12% from last month
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{billingStats.total_transactions.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">All time transactions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(billingStats.pending_payments)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {((billingStats.pending_payments / billingStats.total_revenue) * 100).toFixed(1)}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{billingStats.success_rate}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-red-600">
                {formatCurrency(billingStats.failed_payments)} failed
              </span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Failed Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-red-600">{formatCurrency(billingStats.failed_payments)}</div>
            <p className="text-xs text-gray-600 mt-1">Requires attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Refunded Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-purple-600">{formatCurrency(billingStats.refunded_amount)}</div>
            <p className="text-xs text-gray-600 mt-1">Total refunds processed</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      {showFilters && (
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={filters.status || ''}
                  onValueChange={(value) => handleFilterChange('status', value || undefined)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="refunded">Refunded</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Payment Status</Label>
                <Select
                  value={filters.payment_status || ''}
                  onValueChange={(value) => handleFilterChange('payment_status', value || undefined)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All payment statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All payment statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="succeeded">Succeeded</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="refunded">Refunded</SelectItem>
                    <SelectItem value="partially_refunded">Partially Refunded</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Transaction Type</Label>
                <Select
                  value={filters.type || ''}
                  onValueChange={(value) => handleFilterChange('type', value || undefined)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All types</SelectItem>
                    <SelectItem value="subscription">Subscription</SelectItem>
                    <SelectItem value="upgrade">Upgrade</SelectItem>
                    <SelectItem value="downgrade">Downgrade</SelectItem>
                    <SelectItem value="addon">Addon</SelectItem>
                    <SelectItem value="refund">Refund</SelectItem>
                    <SelectItem value="adjustment">Adjustment</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Billing Date From</Label>
                <Input
                  type="date"
                  value={filters.billing_date_from || ''}
                  onChange={(e) => handleFilterChange('billing_date_from', e.target.value || undefined)}
                />
              </div>

              <div className="space-y-2">
                <Label>Billing Date To</Label>
                <Input
                  type="date"
                  value={filters.billing_date_to || ''}
                  onChange={(e) => handleFilterChange('billing_date_to', e.target.value || undefined)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search */}
      <div className="border rounded-md bg-white p-3">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              value={filters.search || ''}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              placeholder="Search by transaction ID, organization, email, or description"
              className="pl-9"
            />
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="border rounded-md bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <button onClick={() => handleSort('billing_date')} className="inline-flex items-center gap-1">
                  Date <ChevronsUpDown className="h-3 w-3" />
                </button>
              </TableHead>
              <TableHead>
                <button onClick={() => handleSort('transaction_id')} className="inline-flex items-center gap-1">
                  Transaction ID <ChevronsUpDown className="h-3 w-3" />
                </button>
              </TableHead>
              <TableHead>Organization</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>
                <button onClick={() => handleSort('amount')} className="inline-flex items-center gap-1">
                  Amount <ChevronsUpDown className="h-3 w-3" />
                </button>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment Status</TableHead>
              <TableHead>Gateway</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                  <CreditCard className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p>No transactions found</p>
                  <p className="text-xs mt-1">
                    {filters.search || filters.status || filters.type
                      ? 'Try adjusting your filters'
                      : 'No billing transactions available'}
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              pageItems.map((txn) => (
                <TableRow key={txn.id}>
                  <TableCell>{formatDate(txn.billing_date)}</TableCell>
                  <TableCell className="font-mono text-sm">{txn.transaction_id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-gray-400" />
                      <div>
                        <div className="font-medium">{txn.organization?.name || 'N/A'}</div>
                        {txn.customer_email && (
                          <div className="text-xs text-gray-500">{txn.customer_email}</div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getTypeBadge(txn.type)}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{formatCurrency(txn.amount, txn.currency)}</div>
                      {txn.refunded_amount > 0 && (
                        <div className="text-xs text-red-600">
                          Refunded: {formatCurrency(txn.refunded_amount, txn.currency)}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(txn.status)}</TableCell>
                  <TableCell>{getPaymentStatusBadge(txn.payment_status)}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {typeof txn.payment_gateway === 'string' 
                        ? txn.payment_gateway 
                        : txn.payment_gateway?.name || 'N/A'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedTransaction(txn)
                          setShowDetailsModal(true)
                        }}
                        title="View details"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {txn.invoice_url && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(txn.invoice_url, '_blank')}
                          title="View invoice"
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        {pageCount > 1 && (
          <div className="flex items-center justify-between px-3 py-2 border-t text-sm">
            <div className="text-xs text-gray-600">
              Showing {pageItems.length > 0 ? (filters.page || 1) * (filters.per_page || 15) - (filters.per_page || 15) + 1 : 0}–
              {(filters.page || 1) * (filters.per_page || 15) > filteredTransactions.length
                ? filteredTransactions.length
                : (filters.page || 1) * (filters.per_page || 15)}{' '}
              of {filteredTransactions.length} transactions
            </div>
            <div className="flex items-center gap-1">
              <button
                disabled={(filters.page || 1) === 1}
                onClick={() => handlePageChange(1)}
                className="h-8 w-8 rounded-md border text-xs disabled:opacity-40"
              >
                «
              </button>
              <button
                disabled={(filters.page || 1) === 1}
                onClick={() => handlePageChange((filters.page || 1) - 1)}
                className="h-8 w-8 rounded-md border text-xs disabled:opacity-40"
              >
                ‹
              </button>
              {Array.from({ length: Math.min(5, pageCount) }).map((_, i) => {
                const p = i + 1
                return (
                  <button
                    key={p}
                    onClick={() => handlePageChange(p)}
                    className={`h-8 w-8 rounded-md border text-xs ${
                      (filters.page || 1) === p ? 'bg-gray-100 font-medium' : ''
                    }`}
                  >
                    {p}
                  </button>
                )
              })}
              <button
                disabled={(filters.page || 1) === pageCount}
                onClick={() => handlePageChange((filters.page || 1) + 1)}
                className="h-8 w-8 rounded-md border text-xs disabled:opacity-40"
              >
                ›
              </button>
              <button
                disabled={(filters.page || 1) === pageCount}
                onClick={() => handlePageChange(pageCount)}
                className="h-8 w-8 rounded-md border text-xs disabled:opacity-40"
              >
                »
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Transaction Details Modal */}
      {selectedTransaction && (
        <BillingTransactionModal
          open={showDetailsModal}
          onClose={() => {
            setShowDetailsModal(false)
            setSelectedTransaction(null)
          }}
          transaction={selectedTransaction}
        />
      )}
    </div>
  )
}

export default BillingPage

