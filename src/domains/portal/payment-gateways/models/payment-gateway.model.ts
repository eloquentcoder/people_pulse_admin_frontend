export interface PaymentGateway {
  id: number;
  name: string;
  slug: string;
  description?: string;
  provider_class: string;
  is_active: boolean;
  is_default: boolean;
  supported_currencies: string[];
  supported_payment_methods: string[];
  configuration?: Record<string, any>;
  transaction_fee_percentage: number;
  transaction_fee_fixed: number;
  logo_url?: string;
  priority: number;
  countries?: string[];
  supports_subscriptions: boolean;
  supports_refunds: boolean;
  supports_payouts: boolean;
  webhook_secret?: string;
  created_at: string;
  updated_at: string;
}

export interface PaymentGatewayFilters {
  search?: string;
  is_active?: boolean;
  supports_subscriptions?: boolean;
  supports_refunds?: boolean;
  supports_payouts?: boolean;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  per_page?: number;
  page?: number;
}

export interface CreatePaymentGatewayData {
  name: string;
  slug: string;
  description?: string;
  provider_class: string;
  is_active?: boolean;
  is_default?: boolean;
  supported_currencies: string[];
  supported_payment_methods: string[];
  configuration?: Record<string, any>;
  transaction_fee_percentage: number;
  transaction_fee_fixed: number;
  logo_url?: string;
  priority?: number;
  countries?: string[];
  supports_subscriptions?: boolean;
  supports_refunds?: boolean;
  supports_payouts?: boolean;
  webhook_secret?: string;
}

export interface UpdatePaymentGatewayData {
  name?: string;
  slug?: string;
  description?: string;
  provider_class?: string;
  is_active?: boolean;
  is_default?: boolean;
  supported_currencies?: string[];
  supported_payment_methods?: string[];
  configuration?: Record<string, any>;
  transaction_fee_percentage?: number;
  transaction_fee_fixed?: number;
  logo_url?: string;
  priority?: number;
  countries?: string[];
  supports_subscriptions?: boolean;
  supports_refunds?: boolean;
  supports_payouts?: boolean;
  webhook_secret?: string;
}

export interface PaymentGatewayStats {
  total_gateways: number;
  active_gateways: number;
  default_gateways: number;
  gateways_with_subscriptions: number;
  gateways_with_refunds: number;
  gateways_with_payouts: number;
  total_transactions: number;
  successful_transactions: number;
  failed_transactions: number;
}

