import { render, screen, waitFor } from "@testing-library/react";
import { vi, describe, it, expect } from "vitest";
import { SubscriptionForm } from "./SubscriptionForm";
import type { Subscription } from "../types";

vi.mock("@/domains/portal/plans/apis", () => ({
  fetchPlans: () => Promise.resolve([]),
}));

describe("SubscriptionForm", () => {
  it("mounts without crashing when closed (types module resolves)", () => {
    render(
      <SubscriptionForm open={false} onClose={() => {}} onSubmit={() => {}} />
    );
  });

  it("prefills the form when editing an existing subscription (UAC-2)", async () => {
    const subscription = {
      id: 1,
      organization_id: 5,
      plan_id: 2,
      status: "active",
      amount: 2500,
      billing_cycle: "yearly",
      features: ["A"],
      starts_at: "2026-05-01",
    } as unknown as Subscription;

    render(
      <SubscriptionForm
        open
        onClose={() => {}}
        onSubmit={() => {}}
        subscription={subscription}
        organizations={[
          { id: 5, name: "Acme Corp", email: "ops@acme.test" },
        ] as never}
      />
    );

    await waitFor(() => {
      expect(screen.getByText(/edit subscription/i)).toBeInTheDocument();
    });
    // Amount is prefilled from the subscription being edited.
    expect((screen.getByLabelText(/amount/i) as HTMLInputElement).value).toBe(
      "2500"
    );
    // The selected organization's name is shown in the trigger.
    expect(screen.getByText("Acme Corp")).toBeInTheDocument();
  });
});
