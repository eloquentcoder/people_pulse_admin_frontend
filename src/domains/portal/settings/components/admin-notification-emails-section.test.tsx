import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AdminNotificationEmailsSection } from './admin-notification-emails-section';

const updateAdminNotificationEmails = vi.fn();
const hookData = vi.hoisted(() => ({ data: { data: { emails: ['compliance@example.test'] } } }));

vi.mock('../apis/settings.api', () => ({
  useGetAdminNotificationEmailsQuery: () => ({
    data: hookData.data,
    isLoading: false,
  }),
  useUpdateAdminNotificationEmailsMutation: () => [updateAdminNotificationEmails, { isLoading: false }],
}));

describe('AdminNotificationEmailsSection', () => {
  beforeEach(() => {
    updateAdminNotificationEmails.mockReset();
    updateAdminNotificationEmails.mockReturnValue({ unwrap: vi.fn().mockResolvedValue({}) });
  });

  it('loads and saves the list of platform-admin notification email addresses', async () => {
    render(<AdminNotificationEmailsSection />);

    const emails = screen.getByLabelText(/admin notification emails/i);
    await waitFor(() => expect(emails).toHaveValue('compliance@example.test'));

    fireEvent.change(emails, { target: { value: 'compliance@example.test\naudit@example.test' } });
    fireEvent.click(screen.getByRole('button', { name: /save notification emails/i }));

    await waitFor(() => {
      expect(updateAdminNotificationEmails).toHaveBeenCalledWith({
        emails: ['compliance@example.test', 'audit@example.test'],
      });
    });
  });
});
