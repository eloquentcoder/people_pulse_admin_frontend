import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { SubscriptionForm } from "./SubscriptionForm";
import type { Subscription } from "../types";

// Stable references only — mocked RTK Query hooks that return fresh objects on
// every render send the component into an infinite render loop.
const h = vi.hoisted(() => ({
  plansResult: {
    data: {
      success: true,
      message: "ok",
      data: [
        {
          id: 2,
          name: "Pro Plan",
          slug: "pro",
          price: 1000,
          billing_cycle: "monthly",
          is_active: true,
          is_popular: false,
          trial_days: 14,
          features: ["Feature A"],
        },
      ],
    },
    isFetching: false,
    isError: false,
  } as Record<string, unknown>,
}));

const errorMock = vi.fn();

vi.mock("sonner", () => ({ toast: { error: (...args: unknown[]) => errorMock(...args) } }));

vi.mock("../apis/subscription.api", () => ({
  useGetPlansQuery: () => h.plansResult,
}));

const editableSubscription = {
  id: 1,
  organization_id: 5,
  plan_id: 2,
  status: "trial",
  amount: 2500,
  billing_cycle: "monthly",
  features: ["A"],
  starts_at: "2026-06-24T00:00:00.000000Z",
  trial_ends_at: "2026-07-24T00:00:00.000000Z",
  ends_at: "2026-07-24T00:00:00.000000Z",
} as unknown as Subscription;

const organizations = [
  { id: 5, name: "Acme Corp", email: "ops@acme.test" },
] as never;

beforeEach(() => {
  vi.clearAllMocks();
  h.plansResult = {
    data: {
      success: true,
      message: "ok",
      data: [
        {
          id: 2,
          name: "Pro Plan",
          slug: "pro",
          price: 1000,
          billing_cycle: "monthly",
          is_active: true,
          is_popular: false,
          trial_days: 14,
          features: ["Feature A"],
        },
      ],
    },
    isFetching: false,
    isError: false,
  };
});

describe("SubscriptionForm", () => {
  it("mounts without crashing when closed (types module resolves)", () => {
    render(
      <SubscriptionForm open={false} onClose={() => {}} onSubmit={() => {}} />
    );
  });

  it("prefills the form when editing an existing subscription (UAC-2)", async () => {
    render(
      <SubscriptionForm
        open
        onClose={() => {}}
        onSubmit={() => {}}
        subscription={{ ...editableSubscription, status: "active", amount: 2500 }}
        organizations={organizations}
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

  it("loads plans from the authenticated platform endpoint without an error toast (UAC-1)", async () => {
    render(
      <SubscriptionForm
        open
        onClose={() => {}}
        onSubmit={() => {}}
        subscription={editableSubscription}
        organizations={organizations}
      />
    );

    await waitFor(() => {
      expect(screen.getByText(/edit subscription/i)).toBeInTheDocument();
    });
    expect(errorMock).not.toHaveBeenCalled();
  });

  it("surfaces a toast when the plans request fails (UAC-1)", async () => {
    h.plansResult = { data: undefined, isFetching: false, isError: true };

    render(
      <SubscriptionForm
        open
        onClose={() => {}}
        onSubmit={() => {}}
        subscription={editableSubscription}
        organizations={organizations}
      />
    );

    await waitFor(() => {
      expect(errorMock).toHaveBeenCalledWith("Failed to load plans");
    });
  });

  it("shows the subscription's current plan in the plan trigger (UAC-2)", async () => {
    render(
      <SubscriptionForm
        open
        onClose={() => {}}
        onSubmit={() => {}}
        subscription={editableSubscription}
        organizations={organizations}
      />
    );

    await waitFor(() => {
      expect(screen.getByText("Pro Plan")).toBeInTheDocument();
    });
  });

  it("prefills the date inputs from API datetimes (UAC-3)", async () => {
    render(
      <SubscriptionForm
        open
        onClose={() => {}}
        onSubmit={() => {}}
        subscription={editableSubscription}
        organizations={organizations}
      />
    );

    await waitFor(() => {
      expect(screen.getByText(/edit subscription/i)).toBeInTheDocument();
    });

    expect((screen.getByLabelText(/start date/i) as HTMLInputElement).value).toBe(
      "2026-06-24"
    );
    expect((screen.getByLabelText(/trial ends/i) as HTMLInputElement).value).toBe(
      "2026-07-24"
    );
    expect((screen.getByLabelText(/end date/i) as HTMLInputElement).value).toBe(
      "2026-07-24"
    );
  });

  it("blocks saving a trial whose trial end is in the past (UAC-4)", async () => {
    const onSubmit = vi.fn();

    render(
      <SubscriptionForm
        open
        onClose={() => {}}
        onSubmit={onSubmit}
        subscription={{
          ...editableSubscription,
          trial_ends_at: "2020-01-01T00:00:00.000000Z",
        }}
        organizations={organizations}
      />
    );

    await waitFor(() => {
      expect(screen.getByText(/edit subscription/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: /update subscription/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/trial end date must be in the future/i)
      ).toBeInTheDocument();
    });
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
