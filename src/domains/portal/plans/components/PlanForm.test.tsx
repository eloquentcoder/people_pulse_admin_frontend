import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { PlanForm } from './PlanForm';
import type { Plan } from '../types';

// Stable references only — mocked RTK Query hooks that return fresh objects on
// every render send the component into an infinite render loop.
const h = vi.hoisted(() => ({
  plansResult: { data: { success: true, message: 'ok', data: { data: [] } } } as Record<string, unknown>,
  featuresResult: { data: { success: true, message: 'ok', data: [] }, isLoading: false } as Record<string, unknown>,
}));

vi.mock('../apis/plans.api', () => ({
  useGetPlansQuery: () => h.plansResult,
}));

vi.mock('@/domains/portal/features/apis/features.api', () => ({
  useGetFeaturesQuery: () => h.featuresResult,
}));

const growthPlan = {
  id: '7',
  name: 'Growth',
  slug: 'professional',
  description: 'Ideal for growing businesses.',
  price: 2500,
  currency: 'NGN',
  billing_cycle: 'monthly',
  yearly_discount_percent: 16.67,
  max_employees: 50,
  max_storage_gb: 100,
  trial_days: 14,
  display_order: 2,
  is_active: true,
  is_popular: false,
  parent_plan_id: null,
  created_at: '2026-08-01T00:00:00.000000Z',
  updated_at: '2026-08-01T00:00:00.000000Z',
} as unknown as Plan;

const discountInput = () => screen.getByLabelText(/yearly discount/i) as HTMLInputElement;

beforeEach(() => {
  vi.clearAllMocks();
});

describe('PlanForm yearly discount', () => {
  it('prefills the stored yearly discount when editing a plan (UAC-1)', () => {
    render(<PlanForm open onClose={vi.fn()} onSubmit={vi.fn()} plan={growthPlan} />);

    expect(discountInput().value).toBe('16.67');
  });

  it('shows the resulting annual total and saving in the plan currency (UAC-2)', () => {
    render(<PlanForm open onClose={vi.fn()} onSubmit={vi.fn()} plan={growthPlan} />);

    // 2,500 x 12 = 30,000 less 16.67% = 24,999, saving 5,001
    const hint = screen.getByTestId('yearly-discount-hint');
    expect(hint.textContent).toContain('24,999');
    expect(hint.textContent).toContain('5,001');
  });

  it('tells the admin that a blank discount means no yearly discount', () => {
    render(
      <PlanForm
        open
        onClose={vi.fn()}
        onSubmit={vi.fn()}
        plan={{ ...growthPlan, yearly_discount_percent: null } as unknown as Plan}
      />,
    );

    expect(screen.getByTestId('yearly-discount-hint').textContent).toMatch(/no yearly discount/i);
  });

  it('recomputes the hint as the admin types a new discount', async () => {
    render(<PlanForm open onClose={vi.fn()} onSubmit={vi.fn()} plan={growthPlan} />);

    fireEvent.change(discountInput(), { target: { value: '25' } });

    await waitFor(() => {
      expect(screen.getByTestId('yearly-discount-hint').textContent).toContain('22,500');
    });
  });

  it('rejects a discount above 100% (UAC-3)', async () => {
    const onSubmit = vi.fn();
    render(<PlanForm open onClose={vi.fn()} onSubmit={onSubmit} plan={growthPlan} />);

    fireEvent.change(discountInput(), { target: { value: '120' } });
    fireEvent.blur(discountInput());
    fireEvent.click(screen.getByRole('button', { name: /update plan/i }));

    await waitFor(() => {
      expect(screen.getByText(/discount cannot exceed 100%/i)).toBeInTheDocument();
    });
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('rejects a negative discount (UAC-3)', async () => {
    const onSubmit = vi.fn();
    render(<PlanForm open onClose={vi.fn()} onSubmit={onSubmit} plan={growthPlan} />);

    fireEvent.change(discountInput(), { target: { value: '-5' } });
    fireEvent.blur(discountInput());
    fireEvent.click(screen.getByRole('button', { name: /update plan/i }));

    await waitFor(() => {
      expect(screen.getByText(/discount cannot be negative/i)).toBeInTheDocument();
    });
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('submits the yearly discount with the rest of the plan', async () => {
    const onSubmit = vi.fn();
    render(<PlanForm open onClose={vi.fn()} onSubmit={onSubmit} plan={growthPlan} />);

    fireEvent.change(discountInput(), { target: { value: '25' } });
    fireEvent.click(screen.getByRole('button', { name: /update plan/i }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
    expect(onSubmit.mock.calls[0][0]).toMatchObject({
      name: 'Growth',
      price: 2500,
      yearly_discount_percent: 25,
    });
  });

  it('submits a cleared discount as null rather than NaN', async () => {
    const onSubmit = vi.fn();
    render(<PlanForm open onClose={vi.fn()} onSubmit={onSubmit} plan={growthPlan} />);

    fireEvent.change(discountInput(), { target: { value: '' } });
    fireEvent.click(screen.getByRole('button', { name: /update plan/i }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
    expect(onSubmit.mock.calls[0][0].yearly_discount_percent).toBeNull();
  });

  it('defaults a new plan to no yearly discount', () => {
    render(<PlanForm open onClose={vi.fn()} onSubmit={vi.fn()} />);

    expect(discountInput().value).toBe('');
  });
});
