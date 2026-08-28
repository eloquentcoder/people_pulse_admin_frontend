import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ReactNode } from 'react';
import { AnnouncementDetailsModal } from './announcement-details-modal';
import type { PlatformAnnouncement } from '../models/announcement.model';

const h = vi.hoisted(() => ({ allowed: new Set<string>() }));

vi.mock('@/common/components/permission-gate', () => ({
  PermissionGate: ({ permission, children }: { permission: string; children: ReactNode }) =>
    h.allowed.has(permission) ? <>{children}</> : null,
}));

const announcement: PlatformAnnouncement = {
  id: 1,
  title: 'Planned maintenance',
  content: 'The platform will be unavailable briefly.',
  type: 'maintenance',
  priority: 'medium',
  status: 'published',
  scheduled_at: null,
  published_at: '2026-08-28T10:00:00Z',
  expires_at: null,
  send_email: true,
  send_notification: true,
  email_sent: false,
  email_sent_count: 0,
  views_count: 4,
  created_by: 1,
  updated_by: null,
  created_at: '2026-08-28T09:00:00Z',
  updated_at: '2026-08-28T09:00:00Z',
};

describe('AnnouncementDetailsModal permissions', () => {
  beforeEach(() => h.allowed.clear());

  it('hides mutating actions for a view-only platform admin', () => {
    render(
      <AnnouncementDetailsModal
        isOpen
        onClose={() => {}}
        announcement={announcement}
        onEdit={() => {}}
        onPublish={() => {}}
        onUnpublish={() => {}}
        onSendEmails={() => {}}
      />,
    );

    expect(screen.queryByRole('button', { name: 'Edit' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Unpublish' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Send Emails' })).not.toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: 'Close' }).length).toBeGreaterThan(0);
  });
});
