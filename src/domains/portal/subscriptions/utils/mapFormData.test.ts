import { describe, it, expect } from "vitest";
import { toUpdatePayload, toCreatePayload } from "./mapFormData";
import type { SubscriptionFormData } from "../types";

const base: SubscriptionFormData = {
  organization_id: "5",
  plan_id: "2",
  status: "trial",
  trial_ends_at: "2026-06-15",
  starts_at: "2026-05-01",
  ends_at: null,
  amount: 1000,
  billing_cycle: "monthly",
  features: ["A", "B"],
};

describe("toUpdatePayload", () => {
  it("coerces string ids to numbers", () => {
    const payload = toUpdatePayload(base);
    expect(payload.plan_id).toBe(2);
    expect(typeof payload.plan_id).toBe("number");
  });

  it("omits null date fields rather than sending null", () => {
    const payload = toUpdatePayload(base);
    expect(payload.ends_at).toBeUndefined();
    expect(payload.trial_ends_at).toBe("2026-06-15");
  });

  it("does not include organization_id (immutable on update)", () => {
    const payload = toUpdatePayload(base) as Record<string, unknown>;
    expect(payload.organization_id).toBeUndefined();
  });
});

describe("toCreatePayload", () => {
  it("coerces organization_id and plan_id to numbers", () => {
    const payload = toCreatePayload(base);
    expect(payload.organization_id).toBe(5);
    expect(payload.plan_id).toBe(2);
  });

  it("carries status, amount and features through", () => {
    const payload = toCreatePayload(base);
    expect(payload.status).toBe("trial");
    expect(payload.amount).toBe(1000);
    expect(payload.features).toEqual(["A", "B"]);
  });
});
