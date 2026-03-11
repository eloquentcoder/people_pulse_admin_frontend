import { useState } from 'react'
import {
  DollarSign,
  CreditCard,
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Filter,
  Eye,
  Download,
  FileText,
  Building2,
  ChevronsUpDown,
  RefreshCw,
  Loader2,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/common/components/ui/card'
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
import type { BillingTransaction, BillingFilters } from '../models/billing.model'
import { BillingTransactionModal } from '../components/billing-transaction-modal'
import { useGetTransactionsQuery, useGetStatsQuery } from '../apis/billing.api'

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

  // API queries
  const { data: statsResponse, isLoading: statsLoading } = useGetStatsQuery()
  const { data: transactionsResponse, isLoading: transactionsLoading } = useGetTransactionsQuery(filters)

  // Extract data from API responses
  const billingStats = statsResponse?.data || {
    total_revenue: 0,
    total_transactions: 0,
    pending_payments: 0,
    failed_payments: 0,
    refunded_amount: 0,
    monthly_revenue: 0,
    success_rate: 0,
  }

  const transactions: BillingTransaction[] = transactionsResponse?.data?.data || []
  const pagination = transactionsResponse?.data || {
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0,
  }

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

  // Server-side pagination values
  const pageCount = pagination.last_page || 1
  const pageItems = transactions
  const isLoading = statsLoading || transactionsLoading

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
            {statsLoading ? (
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            ) : (
              <>
                <div className="text-2xl font-bold">{formatCurrency(billingStats.total_revenue)}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-600 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" /> Monthly: {formatCurrency(billingStats.monthly_revenue)}
                  </span>
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            ) : (
              <>
                <div className="text-2xl font-bold">{billingStats.total_transactions.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1">All time transactions</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            ) : (
              <>
                <div className="text-2xl font-bold">{formatCurrency(billingStats.pending_payments)}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {billingStats.total_revenue > 0
                    ? `${((billingStats.pending_payments / billingStats.total_revenue) * 100).toFixed(1)}% of total`
                    : '0% of total'}
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            ) : (
              <>
                <div className="text-2xl font-bold">{billingStats.success_rate}%</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-red-600">
                    {formatCurrency(billingStats.failed_payments)} failed
                  </span>
                </p>
              </>
            )}
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
            {transactionsLoading ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto text-[#4469e5]" />
                  <p className="text-gray-500 mt-2">Loading transactions...</p>
                </TableCell>
              </TableRow>
            ) : pageItems.length === 0 ? (
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
              Showing {pageItems.length > 0 ? ((pagination.current_page - 1) * pagination.per_page) + 1 : 0}–
              {Math.min(pagination.current_page * pagination.per_page, pagination.total)}{' '}
              of {pagination.total} transactions
            </div>
            <div className="flex items-center gap-1">
              <button
                disabled={pagination.current_page === 1 || transactionsLoading}
                onClick={() => handlePageChange(1)}
                className="h-8 w-8 rounded-md border text-xs disabled:opacity-40"
              >
                «
              </button>
              <button
                disabled={pagination.current_page === 1 || transactionsLoading}
                onClick={() => handlePageChange(pagination.current_page - 1)}
                className="h-8 w-8 rounded-md border text-xs disabled:opacity-40"
              >
                ‹
              </button>
              {Array.from({ length: Math.min(5, pageCount) }).map((_, i) => {
                // Calculate page numbers to show around current page
                let startPage = Math.max(1, pagination.current_page - 2)
                const endPage = Math.min(pageCount, startPage + 4)
                if (endPage - startPage < 4) {
                  startPage = Math.max(1, endPage - 4)
                }
                const p = startPage + i
                if (p > endPage) return null
                return (
                  <button
                    key={p}
                    disabled={transactionsLoading}
                    onClick={() => handlePageChange(p)}
                    className={`h-8 w-8 rounded-md border text-xs ${
                      pagination.current_page === p ? 'bg-gray-100 font-medium' : ''
                    } disabled:opacity-40`}
                  >
                    {p}
                  </button>
                )
              })}
              <button
                disabled={pagination.current_page === pageCount || transactionsLoading}
                onClick={() => handlePageChange(pagination.current_page + 1)}
                className="h-8 w-8 rounded-md border text-xs disabled:opacity-40"
              >
                ›
              </button>
              <button
                disabled={pagination.current_page === pageCount || transactionsLoading}
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

