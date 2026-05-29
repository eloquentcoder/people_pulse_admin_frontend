import type { SubscriptionFormData } from "../types";
import type {
  CreateSubscriptionData,
  UpdateSubscriptionData,
} from "../models/subscription.model";

// Form inputs use string ids (Select values) and `null` for empty dates.
// The API payloads use numeric ids and omit empty optional dates.

const cycle = (c: SubscriptionFormData["billing_cycle"]) =>
  c as UpdateSubscriptionData["billing_cycle"];

const dateOrUndefined = (value: string | null): string | undefined =>
  value ? value : undefined;

export const toUpdatePayload = (
  data: SubscriptionFormData
): UpdateSubscriptionData => ({
  plan_id: Number(data.plan_id),
  status: data.status,
  trial_ends_at: dateOrUndefined(data.trial_ends_at),
  starts_at: data.starts_at || undefined,
  ends_at: dateOrUndefined(data.ends_at),
  amount: data.amount,
  billing_cycle: cycle(data.billing_cycle),
  features: data.features,
});

export const toCreatePayload = (
  data: SubscriptionFormData
): CreateSubscriptionData => ({
  organization_id: Number(data.organization_id),
  plan_id: Number(data.plan_id),
  status: data.status,
  trial_ends_at: dateOrUndefined(data.trial_ends_at),
  starts_at: data.starts_at || undefined,
  ends_at: dateOrUndefined(data.ends_at),
  amount: data.amount,
  billing_cycle: cycle(data.billing_cycle),
  features: data.features,
});
