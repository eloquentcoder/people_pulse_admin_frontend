import { X, FileText, Receipt, AlertCircle } from 'lucide-react'
import { Badge } from '@/common/components/ui/badge'
import { Button } from '@/common/components/ui/button'
import type { BillingTransaction } from '../models/billing.model'

interface BillingTransactionModalProps {
  open: boolean
  onClose: () => void
  transaction: BillingTransaction
}

export const BillingTransactionModal = ({ open, onClose, transaction }: BillingTransactionModalProps) => {
  if (!open) return null

  const formatCurrency = (amount: number, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Completed
          </Badge>
        )
      case 'pending':
        return (
          <Badge variant="outline" className="text-orange-600">
            Pending
          </Badge>
        )
      case 'failed':
        return (
          <Badge variant="destructive">
            Failed
          </Badge>
        )
      case 'refunded':
        return (
          <Badge variant="outline" className="text-purple-600">
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-3xl rounded-lg bg-white shadow-xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h3 className="font-medium text-lg">Transaction Details</h3>
          <button
            onClick={onClose}
            className="h-8 w-8 grid place-items-center rounded-md hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Header Info */}
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-semibold">{transaction.transaction_id}</h4>
                <p className="text-sm text-gray-600">{transaction.description}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{formatCurrency(transaction.amount, transaction.currency)}</div>
                {transaction.refunded_amount > 0 && (
                  <div className="text-sm text-red-600 mt-1">
                    Refunded: {formatCurrency(transaction.refunded_amount, transaction.currency)}
                  </div>
                )}
              </div>
            </div>

            {/* Status Badges */}
            <div className="flex items-center gap-3">
              {getStatusBadge(transaction.status)}
              {getPaymentStatusBadge(transaction.payment_status)}
              <Badge variant="outline">{transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}</Badge>
            </div>

            {/* Transaction Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-3">Transaction Information</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Transaction ID:</span>
                      <span className="font-mono font-medium">{transaction.transaction_id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Billing Date:</span>
                      <span>{formatDate(transaction.billing_date)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Created:</span>
                      <span>{formatDate(transaction.created_at)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Updated:</span>
                      <span>{formatDate(transaction.updated_at)}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-3">Organization</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-medium">{transaction.organization?.name || 'N/A'}</span>
                    </div>
                    {transaction.customer_name && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Customer:</span>
                        <span>{transaction.customer_name}</span>
                      </div>
                    )}
                    {transaction.customer_email && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email:</span>
                        <span>{transaction.customer_email}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-3">Payment Details</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Gateway:</span>
                      <Badge variant="outline">
                        {typeof transaction.payment_gateway === 'string' 
                          ? transaction.payment_gateway 
                          : (transaction.payment_gateway && 'name' in transaction.payment_gateway)
                            ? transaction.payment_gateway.name 
                            : 'N/A'}  
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Method:</span>
                      <span>{transaction.payment_method || 'N/A'}</span>
                    </div>
                    {transaction.gateway_transaction_id && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Gateway TXN ID:</span>
                        <span className="font-mono text-xs">{transaction.gateway_transaction_id}</span>
                      </div>
                    )}
                    {transaction.payment_intent_id && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Payment Intent:</span>
                        <span className="font-mono text-xs">{transaction.payment_intent_id}</span>
                      </div>
                    )}
                    {transaction.refund_id && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Refund ID:</span>
                        <span className="font-mono text-xs">{transaction.refund_id}</span>
                      </div>
                    )}
                  </div>
                </div>

                {transaction.subscription && (
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-3">Subscription</h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Plan:</span>
                        <span className="font-medium">{transaction.subscription.plan_name}</span>
                      </div>
                      {transaction.subscription_id && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Subscription ID:</span>
                          <span className="font-mono">{transaction.subscription_id}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Failure Information */}
            {transaction.status === 'failed' && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                  <div className="flex-1">
                    <h5 className="text-sm font-medium text-red-900 mb-2">Payment Failure</h5>
                    {transaction.failure_code && (
                      <div className="text-sm text-red-800 mb-1">
                        <strong>Code:</strong> {transaction.failure_code}
                      </div>
                    )}
                    {transaction.failure_message && (
                      <div className="text-sm text-red-800">
                        <strong>Message:</strong> {transaction.failure_message}
                      </div>
                    )}
                    {transaction.retry_count > 0 && (
                      <div className="text-sm text-red-800 mt-2">
                        <strong>Retry Count:</strong> {transaction.retry_count}
                        {transaction.next_retry_at && (
                          <span className="ml-2">
                            (Next retry: {formatDate(transaction.next_retry_at)})
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Webhook Information */}
            {transaction.webhook_id && (
              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-3">Webhook Information</h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Webhook ID:</span>
                    <span className="font-mono text-xs">{transaction.webhook_id}</span>
                  </div>
                  {transaction.webhook_received_at && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Received At:</span>
                      <span>{formatDate(transaction.webhook_received_at)}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Metadata */}
            {transaction.metadata && Object.keys(transaction.metadata).length > 0 && (
              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-3">Metadata</h5>
                <div className="bg-gray-50 rounded-md p-3">
                  <pre className="text-xs text-gray-700 overflow-x-auto">
                    {JSON.stringify(transaction.metadata, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-4 py-3 border-t bg-gray-50">
          <div className="flex items-center gap-2">
            {transaction.invoice_url && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(transaction.invoice_url, '_blank')}
              >
                <FileText className="h-4 w-4 mr-2" />
                View Invoice
              </Button>
            )}
            {transaction.receipt_url && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(transaction.receipt_url, '_blank')}
              >
                <Receipt className="h-4 w-4 mr-2" />
                View Receipt
              </Button>
            )}
          </div>
          <Button onClick={onClose} style={{ backgroundColor: '#4469e5' }} className="text-white">
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}

