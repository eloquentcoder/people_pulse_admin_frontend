import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { BillingInterfaceToggle } from './billing-interface-toggle';

const updateBillingInterface = vi.fn();

const organization = (settings: Record<string, unknown>) => ({
  id: 7,
  name: 'Acme',
  email: 'hello@acme.test',
  status: 'active' as const,
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
  settings,
});

vi.mock('../apis/organization.api', () => ({
  useUpdateBillingInterfaceMutation: () => [updateBillingInterface, { isLoading: false }],
}));

describe('BillingInterfaceToggle', () => {
  beforeEach(() => {
    updateBillingInterface.mockReset();
    updateBillingInterface.mockReturnValue({
      unwrap: vi.fn().mockResolvedValue({}),
    });
  });

  it('shows billing enabled by default and persists an off toggle', async () => {
    const onSuccess = vi.fn();

    render(
      <BillingInterfaceToggle
        organization={organization({})}
        onSuccess={onSuccess}
      />,
    );

    const toggle = screen.getByRole('switch', { name: /billing interface/i });
    expect(toggle).toBeChecked();

    fireEvent.click(toggle);

    await waitFor(() => {
      expect(updateBillingInterface).toHaveBeenCalledWith({ id: 7, enabled: false });
      expect(onSuccess).toHaveBeenCalledOnce();
    });
  });

  it('renders a previously disabled organization as off', () => {
    render(
      <BillingInterfaceToggle
        organization={organization({ billing_interface_enabled: false })}
      />,
    );

    expect(screen.getByRole('switch', { name: /billing interface/i })).not.toBeChecked();
  });
});
