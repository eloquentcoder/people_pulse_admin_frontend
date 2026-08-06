import type { Subscription, SubscriptionFormData } from "../types";

const today = () => new Date().toISOString().split("T")[0];

// The API serialises date columns as Laravel datetime casts
// ("2026-06-24T00:00:00.000000Z"), which `<input type="date">` refuses to
// display — the field silently renders empty and the stale value is submitted
// back unchanged. Normalise everything to `yyyy-mm-dd`, taking the leading date
// part verbatim so no timezone shift is introduced.
export const toDateInputValue = (
  value: string | null | undefined
): string | null => {
  if (!value) return null;

  const leadingDate = /^\d{4}-\d{2}-\d{2}/.exec(value);
  if (leadingDate) return leadingDate[0];

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime())
    ? null
    : parsed.toISOString().split("T")[0];
};

// The form only offers monthly / yearly / one-time; any other stored cycle
// (e.g. quarterly) falls back to monthly.
export const toFormCycle = (
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
  trial_ends_at: toDateInputValue(subscription?.trial_ends_at),
  starts_at: toDateInputValue(subscription?.starts_at) || today(),
  ends_at: toDateInputValue(subscription?.ends_at),
  amount: subscription?.amount || 0,
  billing_cycle: toFormCycle(subscription?.billing_cycle),
  features: subscription?.features || [],
});

// End of the first billing period for a start date + cycle, as `yyyy-mm-dd`.
// One-time plans have no period end. UTC arithmetic keeps a date-only input from
// drifting a day in negative-offset timezones.
export const computePeriodEnd = (
  startsAt: string | null | undefined,
  cycle: Subscription["billing_cycle"] | undefined
): string | null => {
  const start = toDateInputValue(startsAt);
  if (!start) return null;

  const formCycle = toFormCycle(cycle);
  if (formCycle === "one-time") return null;

  const end = new Date(start);
  if (formCycle === "monthly") {
    end.setUTCMonth(end.getUTCMonth() + 1);
  } else {
    end.setUTCFullYear(end.getUTCFullYear() + 1);
  }

  return end.toISOString().split("T")[0];
};

// Trial end for a start date + the plan's trial length, as `yyyy-mm-dd`.
export const computeTrialEnd = (
  startsAt: string | null | undefined,
  trialDays: number | undefined
): string | null => {
  const start = toDateInputValue(startsAt);
  if (!start || !trialDays || trialDays <= 0) return null;

  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + trialDays);

  return end.toISOString().split("T")[0];
};

// Plan ids coming back from the API are numeric while Select values are strings,
// so compare them as strings. Kept structural so it works with either the
// plans-domain plan (string id) or the canonical plan model (numeric id).
export const findPlanById = <T extends { id: string | number }>(
  plans: T[],
  id: string
): T | undefined => plans.find((plan) => String(plan.id) === id);
