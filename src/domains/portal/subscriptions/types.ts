// Shared types for the subscriptions domain.
//
// - `Plan` is the plans-domain plan (string id, supports 'one-time') because the
//   SubscriptionForm dropdown is populated from `fetchPlans`.
// - `Organization` re-exports the canonical organization model.
// - `Subscription` is a local view-model: a superset of the canonical subscription
//   that also carries the optional `billing_transactions` relationship returned by
//   the platform `show` endpoint and the wider status/billing_cycle unions used in
//   the detail view. The canonical (RTK Query) Subscription is assignable to it.

import type { Plan as CommonPlan } from "@/common/models/plan.model";

export type { Plan } from "@/domains/portal/plans/types";
export type { Organization } from "@/domains/portal/organizations/models/organization.model";
import type { Organization } from "@/domains/portal/organizations/models/organization.model";

export interface BillingTransaction {
  id: number;
  subscription_id: number;
  amount: number;
  status: "pending" | "completed" | "failed" | "refunded";
  transaction_type?: string;
  description?: string;
  payment_method?: string;
  transaction_id?: string;
  transaction_date?: string;
  processed_at?: string;
  created_at: string;
  updated_at?: string;
}

export interface Subscription {
  id: number;
  organization_id: number;
  plan_id: number;
  status: "active" | "past_due" | "cancelled" | "trial" | "suspended" | "expired";
  trial_ends_at?: string;
  starts_at?: string;
  ends_at?: string;
  cancelled_at?: string;
  amount: number;
  billing_cycle: "monthly" | "yearly" | "quarterly" | "one-time";
  plan?: CommonPlan;
  features?: string[];
  organization?: Organization;
  billing_transactions?: BillingTransaction[];
  created_at: string;
  updated_at: string;
}

export interface SubscriptionFormData {
  organization_id: string;
  plan_id: string;
  status: "trial" | "active";
  trial_ends_at: string | null;
  starts_at: string;
  ends_at: string | null;
  amount: number;
  billing_cycle: "monthly" | "yearly" | "one-time";
  features: string[];
}
