import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { BillingInterfaceSection } from './billing-interface-section';

const updateBillingInterface = vi.fn();

vi.mock('../apis/settings.api', () => ({
  useGetBillingInterfaceSettingQuery: () => ({
    data: { data: { enabled: true } },
    isLoading: false,
  }),
  useUpdateBillingInterfaceSettingMutation: () => [updateBillingInterface, { isLoading: false }],
}));

describe('BillingInterfaceSection', () => {
  beforeEach(() => {
    updateBillingInterface.mockReset();
    updateBillingInterface.mockReturnValue({
      unwrap: vi.fn().mockResolvedValue({}),
    });
  });

  it('persists the global billing switch when turned off', async () => {
    render(<BillingInterfaceSection />);

    const toggle = screen.getByRole('switch', { name: /billing for all organizations/i });
    expect(toggle).toBeChecked();

    fireEvent.click(toggle);

    await waitFor(() => {
      expect(updateBillingInterface).toHaveBeenCalledWith({ enabled: false });
    });
  });
});
