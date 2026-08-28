import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

vi.mock('@/common/components/permission-gate', () => ({
  PermissionGate: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));
import { SubscriptionDetails } from "./SubscriptionDetails";
import type { Subscription } from "../types";

const subscription: Subscription = {
  id: 1,
  organization_id: 5,
  plan_id: 2,
  status: "trial",
  trial_ends_at: "2026-06-15T00:00:00Z",
  starts_at: "2026-05-01T00:00:00Z",
  amount: 1000,
  billing_cycle: "monthly",
  features: ["Feature A"],
  organization: {
    id: 5,
    name: "Acme Corp",
    email: "ops@acme.test",
    industry: "Manufacturing",
    employees_count: 120,
    address: "1 Market St",
    city: "Lagos",
    state: "LA",
    postal_code: "100001",
    country: "NG",
  } as Subscription["organization"],
  plan: {
    id: 2,
    name: "Pro Plan",
    slug: "pro",
    description: "Pro tier",
    price: 1000,
    billing_cycle: "monthly",
    max_employees: 50,
    max_storage_gb: 100,
    trial_days: 14,
    is_active: true,
    is_popular: false,
  } as Subscription["plan"],
  created_at: "2026-05-01T00:00:00Z",
  updated_at: "2026-05-01T00:00:00Z",
};

describe("SubscriptionDetails – organization fields", () => {
  it("shows the organization's industry, employee count and postal code", () => {
    render(
      <SubscriptionDetails open onClose={() => {}} subscription={subscription} />
    );

    expect(screen.getByText("Manufacturing")).toBeInTheDocument();
    expect(screen.getByText(/120 employees/)).toBeInTheDocument();
    expect(screen.getByText(/100001/)).toBeInTheDocument();
  });
});
