import { describe, it, expect } from "vitest";
import { buildInitialFormValues, findPlanById } from "./formValues";
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

describe("findPlanById", () => {
  it("matches a numeric plan id against the string Select value", () => {
    const plans = [
      { id: 2, name: "Pro" },
      { id: 3, name: "Enterprise" },
    ] as unknown as Plan[];

    expect(findPlanById(plans, "3")?.name).toBe("Enterprise");
  });
});
