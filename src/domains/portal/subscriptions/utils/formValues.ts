import type { Plan, Subscription, SubscriptionFormData } from "../types";

const today = () => new Date().toISOString().split("T")[0];

// The form only offers monthly / yearly / one-time; any other stored cycle
// (e.g. quarterly) falls back to monthly.
const toFormCycle = (
  cycle: Subscription["billing_cycle"] | undefined
): SubscriptionFormData["billing_cycle"] =>
  cycle === "yearly" ? "yearly" : cycle === "one-time" ? "one-time" : "monthly";

export const buildInitialFormValues = (
  subscription: Subscription | null | undefined
): SubscriptionFormData => ({
  organization_id: subscription?.organization_id
    ? String(subscription.organization_id)
    : "",
  plan_id: subscription?.plan_id ? String(subscription.plan_id) : "",
  status:
    subscription?.status === "trial" || subscription?.status === "active"
      ? subscription.status
      : "trial",
  trial_ends_at: subscription?.trial_ends_at || null,
  starts_at: subscription?.starts_at || today(),
  ends_at: subscription?.ends_at || null,
  amount: subscription?.amount || 0,
  billing_cycle: toFormCycle(subscription?.billing_cycle),
  features: subscription?.features || [],
});

// Plan ids coming back from the API are numeric while Select values are strings,
// so compare them as strings.
export const findPlanById = (
  plans: Plan[],
  id: string
): Plan | undefined => plans.find((plan) => String(plan.id) === id);
