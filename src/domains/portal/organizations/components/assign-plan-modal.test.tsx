import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { AssignPlanModal } from './assign-plan-modal';

// Stable references only — mocked RTK Query hooks that return fresh objects on
// every render send the component into an infinite render loop.
const h = vi.hoisted(() => ({
  plansResult: {
    data: {
      success: true,
      message: 'ok',
      data: [
        {
          id: 2,
          name: 'Growth',
          slug: 'growth',
          description: 'Ideal for growing businesses.',
          price: 2500,
          currency: 'NGN',
          billing_cycle: 'monthly',
          yearly_discount_percent: 16.67,
          is_active: true,
          is_popular: false,
          trial_days: 14,
        },
        {
          id: 3,
          name: 'Starter',
          slug: 'starter',
          description: 'For small teams.',
          price: 1000,
          currency: 'NGN',
          billing_cycle: 'monthly',
          yearly_discount_percent: null,
          is_active: true,
          is_popular: false,
          trial_days: 14,
        },
      ],
    },
    isLoading: false,
  } as Record<string, unknown>,
}));

const createMock = vi.fn(() => ({ unwrap: () => Promise.resolve({}) }));
const updateMock = vi.fn(() => ({ unwrap: () => Promise.resolve({}) }));

vi.mock('../../subscriptions/apis/subscription.api', () => ({
  useGetPlansQuery: () => h.plansResult,
  useCreateSubscriptionMutation: () => [createMock, { isLoading: false }],
  useUpdateSubscriptionMutation: () => [updateMock, { isLoading: false }],
}));

vi.mock('sonner', () => ({ toast: { error: vi.fn(), success: vi.fn() } }));

const amountInput = () => screen.getByLabelText(/amount/i) as HTMLInputElement;

const selectPlan = (planId: string) => {
  fireEvent.change(screen.getByLabelText(/plan/i), { target: { value: planId } });
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('AssignPlanModal yearly amount', () => {
  it("uses the plan's stored yearly discount rather than a hardcoded 20% (UAC-8)", async () => {
    render(<AssignPlanModal isOpen onClose={vi.fn()} organizationId={5} />);

    selectPlan('2');
    fireEvent.click(screen.getByRole('button', { name: /yearly/i }));

    // 2,500 x 12 = 30,000 less 16.67% = 24,999 (the old rule gave 24,000)
    await waitFor(() => expect(amountInput().value).toBe('24999'));
  });

  it('shows the actual discount percentage on the yearly toggle', async () => {
    render(<AssignPlanModal isOpen onClose={vi.fn()} organizationId={5} />);

    selectPlan('2');

    await waitFor(() => expect(screen.getByText(/save 16\.67%/i)).toBeInTheDocument());
  });

  it('bills twelve full months and shows no badge for a plan without a discount', async () => {
    render(<AssignPlanModal isOpen onClose={vi.fn()} organizationId={5} />);

    selectPlan('3');
    fireEvent.click(screen.getByRole('button', { name: /yearly/i }));

    await waitFor(() => expect(amountInput().value).toBe('12000'));
    expect(screen.queryByText(/save \d/i)).not.toBeInTheDocument();
  });

  it('leaves the monthly amount at the plan price', async () => {
    render(<AssignPlanModal isOpen onClose={vi.fn()} organizationId={5} />);

    selectPlan('2');

    await waitFor(() => expect(amountInput().value).toBe('2500'));
  });
});
