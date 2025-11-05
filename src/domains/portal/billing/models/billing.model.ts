export interface BillingTransaction {
  id: number
  organization_id: number
  subscription_id?: number
  payment_gateway_id?: number
  payment_method_id?: number
  transaction_id: string
  type: 'subscription' | 'upgrade' | 'downgrade' | 'addon' | 'refund' | 'adjustment'
  amount: number
  refunded_amount: number
  currency: string
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  payment_status: 'pending' | 'processing' | 'succeeded' | 'failed' | 'cancelled' | 'refunded' | 'partially_refunded'
  payment_method?: string
  gateway_transaction_id?: string
  payment_intent_id?: string
  refund_id?: string
  description?: string
  billing_date: string
  failure_code?: string
  failure_message?: string
  retry_count: number
  next_retry_at?: string
  webhook_id?: string
  webhook_received_at?: string
  customer_email?: string
  customer_name?: string
  invoice_url?: string
  receipt_url?: string
  metadata?: Record<string, any>
  created_at: string
  updated_at: string
  organization?: {
    id: number
    name: string
  }
  subscription?: {
    id: number
    plan_name: string
  }
  payment_gateway?: {
    id: number
    name: string
    type: string
  }
}

export interface BillingFilters {
  search?: string
  organization_id?: number
  subscription_id?: number
  status?: 'pending' | 'completed' | 'failed' | 'refunded' | ''
  payment_status?: 'pending' | 'processing' | 'succeeded' | 'failed' | 'cancelled' | 'refunded' | 'partially_refunded' | ''
  type?: 'subscription' | 'upgrade' | 'downgrade' | 'addon' | 'refund' | 'adjustment' | ''
  payment_gateway_id?: number
  billing_date_from?: string
  billing_date_to?: string
  sort_by?: string
  sort_order?: 'asc' | 'desc'
  per_page?: number
  page?: number
}

export interface BillingStats {
  total_revenue: number
  total_transactions: number
  pending_payments: number
  failed_payments: number
  refunded_amount: number
  monthly_revenue: number
  success_rate: number
}

