import { describe, it, expect } from "vitest";
import {
  buildInitialFormValues,
  computePeriodEnd,
  computeTrialEnd,
  findPlanById,
} from "./formValues";
import type { Subscription } from "../types";
import type { Plan } from "../types";

describe("buildInitialFormValues", () => {
  it("returns create defaults when there is no subscription", () => {
    const values = buildInitialFormValues(null);
    expect(values.organization_id).toBe("");
    expect(values.plan_id).toBe("");
    expect(values.status).toBe("trial");
    expect(values.features).toEqual([]);
  });

  it("coerces numeric ids to strings for the Select inputs", () => {
    const subscription = {
      id: 1,
      organization_id: 5,
      plan_id: 2,
      status: "active",
      amount: 1000,
      billing_cycle: "yearly",
      features: ["A"],
      starts_at: "2026-05-01",
      trial_ends_at: "2026-06-01",
    } as unknown as Subscription;

    const values = buildInitialFormValues(subscription);
    expect(values.organization_id).toBe("5");
    expect(values.plan_id).toBe("2");
    expect(values.status).toBe("active");
    expect(values.billing_cycle).toBe("yearly");
  });

  it("normalises API datetimes to yyyy-mm-dd so date inputs render them (UAC-3)", () => {
    const subscription = {
      organization_id: 5,
      plan_id: 2,
      status: "trial",
      amount: 1000,
      billing_cycle: "monthly",
      starts_at: "2026-06-24T00:00:00.000000Z",
      trial_ends_at: "2026-07-24T00:00:00.000000Z",
      ends_at: "2026-07-24T23:59:59.000000Z",
    } as unknown as Subscription;

    const values = buildInitialFormValues(subscription);
    expect(values.starts_at).toBe("2026-06-24");
    expect(values.trial_ends_at).toBe("2026-07-24");
    expect(values.ends_at).toBe("2026-07-24");
  });

  it("leaves already date-only values untouched and unparseable ones empty", () => {
    const subscription = {
      organization_id: 5,
      plan_id: 2,
      status: "trial",
      amount: 0,
      billing_cycle: "monthly",
      starts_at: "2026-05-01",
      trial_ends_at: "not-a-date",
    } as unknown as Subscription;

    const values = buildInitialFormValues(subscription);
    expect(values.starts_at).toBe("2026-05-01");
    expect(values.trial_ends_at).toBeNull();
  });

  it("maps an unsupported billing cycle (quarterly) to monthly", () => {
    const subscription = {
      organization_id: 5,
      plan_id: 2,
      status: "trial",
      amount: 0,
      billing_cycle: "quarterly",
    } as unknown as Subscription;

    expect(buildInitialFormValues(subscription).billing_cycle).toBe("monthly");
  });
});

describe("computePeriodEnd", () => {
  it("adds one month for monthly plans", () => {
    expect(computePeriodEnd("2026-01-31", "monthly")).toBe("2026-03-03");
    expect(computePeriodEnd("2026-06-24", "monthly")).toBe("2026-07-24");
  });

  it("adds one year for yearly plans", () => {
    expect(computePeriodEnd("2026-06-24", "yearly")).toBe("2027-06-24");
  });

  it("treats quarterly as monthly (the form's fallback cycle)", () => {
    expect(computePeriodEnd("2026-06-24", "quarterly")).toBe("2026-07-24");
  });

  it("has no period end for one-time plans or missing start dates", () => {
    expect(computePeriodEnd("2026-06-24", "one-time")).toBeNull();
    expect(computePeriodEnd(null, "monthly")).toBeNull();
  });

  it("accepts an API datetime start date without drifting a day", () => {
    expect(computePeriodEnd("2026-06-24T00:00:00.000000Z", "monthly")).toBe(
      "2026-07-24"
    );
  });
});

describe("computeTrialEnd", () => {
  it("adds the plan's trial days to the start date", () => {
    expect(computeTrialEnd("2026-06-24", 14)).toBe("2026-07-08");
  });

  it("returns null without a start date or trial length", () => {
    expect(computeTrialEnd(null, 14)).toBeNull();
    expect(computeTrialEnd("2026-06-24", 0)).toBeNull();
    expect(computeTrialEnd("2026-06-24", undefined)).toBeNull();
  });
});

describe("findPlanById", () => {
  it("matches a numeric plan id against the string Select value", () => {
    const plans = [
      { id: 2, name: "Pro" },
      { id: 3, name: "Enterprise" },
    ] as unknown as Plan[];

    expect(findPlanById(plans, "3")?.name).toBe("Enterprise");
  });
});
