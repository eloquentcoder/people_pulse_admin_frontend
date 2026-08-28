import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ReactNode } from 'react';
import { HRTemplateDetailsModal } from './hr-template-details-modal';
import type { HRTemplate } from '../models/hr-template.model';

const h = vi.hoisted(() => ({ allowed: new Set<string>() }));

vi.mock('@/common/components/permission-gate', () => ({
  PermissionGate: ({ permission, children }: { permission: string; children: ReactNode }) =>
    h.allowed.has(permission) ? <>{children}</> : null,
}));

const template: HRTemplate = {
  id: 1,
  category_id: 1,
  title: 'Offer letter',
  slug: 'offer-letter',
  content: 'Dear {{employee_name}}',
  is_active: true,
  is_default: false,
  created_at: '2026-08-28T09:00:00Z',
  updated_at: '2026-08-28T09:00:00Z',
};

describe('HRTemplateDetailsModal permissions', () => {
  beforeEach(() => h.allowed.clear());

  it('hides edit, duplicate, and delete actions for a view-only platform admin', () => {
    render(
      <HRTemplateDetailsModal
        isOpen
        onClose={() => {}}
        template={template}
        onEdit={() => {}}
        onDuplicate={() => {}}
        onDelete={() => {}}
      />,
    );

    expect(screen.queryByRole('button', { name: /edit/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /duplicate/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /delete/i })).not.toBeInTheDocument();
  });
});
