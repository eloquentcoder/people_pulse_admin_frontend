import { render, screen, fireEvent, within, waitFor } from "@testing-library/react";
import { vi, beforeEach, describe, it, expect } from "vitest";
import type { Subscription } from "../types";

// Mutable subscription list so individual tests can supply trial / active rows.
const h = vi.hoisted(() => ({ subs: [] as unknown[] }));

const updateMock = vi.fn(() => ({ unwrap: () => Promise.resolve({}) }));
const cancelMock = vi.fn(() => ({ unwrap: () => Promise.resolve({}) }));
const renewMock = vi.fn(() => ({ unwrap: () => Promise.resolve({}) }));
const deleteMock = vi.fn(() => ({ unwrap: () => Promise.resolve({}) }));
const createMock = vi.fn(() => ({ unwrap: () => Promise.resolve({}) }));

const plan = {
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
} as Subscription["plan"];

const organization = {
  id: 5,
  name: "Acme Corp",
  email: "ops@acme.test",
} as Subscription["organization"];

const makeSub = (overrides: Partial<Subscription>): Subscription => ({
  id: 1,
  organization_id: 5,
  plan_id: 2,
  status: "trial",
  trial_ends_at: "2099-06-15T00:00:00Z",
  starts_at: "2026-05-01T00:00:00Z",
  amount: 1000,
  billing_cycle: "monthly",
  features: ["Feature A"],
  organization,
  plan,
  created_at: "2026-05-01T00:00:00Z",
  updated_at: "2026-05-01T00:00:00Z",
  ...overrides,
});

vi.mock("../apis/subscription.api", () => ({
  useGetSubscriptionsQuery: () => ({
    data: {
      data: {
        data: h.subs,
        current_page: 1,
        last_page: 1,
        per_page: 15,
        total: h.subs.length,
      },
    },
    isLoading: false,
    refetch: vi.fn(),
  }),
  useGetSubscriptionStatsQuery: () => ({ data: undefined }),
  useUpdateSubscriptionMutation: () => [updateMock, { isLoading: false }],
  useCreateSubscriptionMutation: () => [createMock, { isLoading: false }],
  useCancelSubscriptionMutation: () => [cancelMock, {}],
  useRenewSubscriptionMutation: () => [renewMock, {}],
  useDeleteSubscriptionMutation: () => [deleteMock, {}],
}));

vi.mock("@/domains/portal/plans/apis", () => ({
  fetchPlans: () => Promise.resolve([]),
}));

vi.mock("@/domains/portal/organizations/apis/organization.api", () => ({
  useGetOrganizationsQuery: () => ({ data: { data: { data: [] } } }),
}));

import SubscriptionManagementPage from "./subscription-management.page";

beforeEach(() => {
  vi.clearAllMocks();
  h.subs = [makeSub({ status: "trial" })];
});

describe("SubscriptionManagementPage – view & edit", () => {
  it("opens the details modal when the View action is clicked (UAC-1)", () => {
    render(<SubscriptionManagementPage />);

    fireEvent.click(screen.getByRole("button", { name: /view subscription/i }));

    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getByText(/subscription details/i)).toBeInTheDocument();
    expect(within(dialog).getByText("Acme Corp")).toBeInTheDocument();
  });

  it("opens the edit form when the Edit action is clicked (UAC-2)", async () => {
    render(<SubscriptionManagementPage />);

    fireEvent.click(screen.getByRole("button", { name: /edit subscription/i }));

    await waitFor(() => {
      const dialog = screen.getByRole("dialog");
      expect(within(dialog).getByText(/edit subscription/i)).toBeInTheDocument();
    });
  });
});

describe("SubscriptionManagementPage – disable & delete (UAC-4)", () => {
  it("disables (cancels) an active subscription only after confirmation", async () => {
    h.subs = [makeSub({ status: "active" })];
    render(<SubscriptionManagementPage />);

    fireEvent.click(screen.getByRole("button", { name: /disable subscription/i }));
    // Not cancelled until the user confirms.
    expect(cancelMock).not.toHaveBeenCalled();

    const confirm = screen.getByRole("alertdialog");
    fireEvent.click(within(confirm).getByRole("button", { name: /^disable$/i }));

    await waitFor(() => expect(cancelMock).toHaveBeenCalledWith(1));
  });

  it("deletes a subscription only after confirmation", async () => {
    h.subs = [makeSub({ status: "active" })];
    render(<SubscriptionManagementPage />);

    fireEvent.click(screen.getByRole("button", { name: /delete subscription/i }));
    expect(deleteMock).not.toHaveBeenCalled();

    const confirm = screen.getByRole("alertdialog");
    fireEvent.click(within(confirm).getByRole("button", { name: /^delete$/i }));

    await waitFor(() => expect(deleteMock).toHaveBeenCalledWith(1));
  });
});

describe("SubscriptionManagementPage – extend trial (UAC-3)", () => {
  it("shows the Extend Trial action only for trial subscriptions", () => {
    h.subs = [makeSub({ status: "active" })];
    render(<SubscriptionManagementPage />);

    expect(
      screen.queryByRole("button", { name: /extend trial/i })
    ).not.toBeInTheDocument();
  });

  it("extends the trial via the dialog and calls update with the new date", async () => {
    render(<SubscriptionManagementPage />);

    fireEvent.click(screen.getByRole("button", { name: /extend trial/i }));
    fireEvent.click(screen.getByRole("button", { name: /14 days/i }));
    fireEvent.click(
      within(screen.getByRole("dialog")).getByRole("button", {
        name: /^extend trial$/i,
      })
    );

    await waitFor(() => {
      expect(updateMock).toHaveBeenCalledWith({
        id: 1,
        data: { trial_ends_at: "2099-06-29" },
      });
    });
  });
});
