import { render, screen, fireEvent, within, waitFor } from '@testing-library/react';
import { vi, beforeEach, describe, it, expect } from 'vitest';
import type { AuditLogEntry } from '../models/audit-log.model';

const h = vi.hoisted(() => ({ logs: [] as AuditLogEntry[] }));

// Spy that records the filters passed to the list query on each render.
const getLogsSpy = vi.fn();
const exportTrigger = vi.fn(() => ({ unwrap: () => Promise.resolve(new Blob()) }));

const makeLog = (overrides: Partial<AuditLogEntry> = {}): AuditLogEntry => ({
  id: 1,
  organization_id: 5,
  user_id: 9,
  event: 'employees.updated',
  action_type: 'updated',
  auditable_type: null,
  auditable_id: 42,
  description: 'Ada Lovelace updated employees #42',
  old_values: { title: 'Engineer' },
  new_values: { title: 'Senior Engineer' },
  ip_address: '127.0.0.1',
  user_agent: 'vitest',
  url: 'https://app.test/api/organization/admin/employees/42',
  metadata: { method: 'PUT' },
  created_at: '2026-06-23T10:00:00Z',
  updated_at: '2026-06-23T10:00:00Z',
  user: { id: 9, first_name: 'Ada', last_name: 'Lovelace', email: 'ada@acme.test' },
  organization: { id: 5, name: 'Acme Corp' },
  ...overrides,
});

vi.mock('../apis/audit-logs.api', () => ({
  useGetAuditLogsQuery: (filters: unknown) => {
    getLogsSpy(filters);
    return {
      data: {
        success: true,
        message: 'ok',
        data: {
          data: h.logs,
          current_page: 1,
          last_page: 2,
          per_page: 15,
          total: h.logs.length,
          from: 1,
          to: h.logs.length,
        },
      },
      isLoading: false,
      isFetching: false,
      refetch: vi.fn(),
    };
  },
  useGetAuditLogStatsQuery: () => ({
    data: {
      success: true,
      message: 'ok',
      data: {
        total: 128,
        today: 12,
        this_week: 40,
        top_events: [{ event: 'employees.updated', count: 30 }],
        active_users: 7,
        active_organizations: 3,
      },
    },
  }),
  useGetAuditLogFilterOptionsQuery: () => ({
    data: {
      success: true,
      message: 'ok',
      data: {
        events: ['employees.updated', 'employees.created'],
        organizations: [{ id: 5, name: 'Acme Corp' }],
      },
    },
  }),
  useLazyExportAuditLogsQuery: () => [exportTrigger, { isLoading: false }],
}));

import AuditLogsPage from './audit-logs.page';

vi.mock('@/common/components/permission-gate', () => ({
  PermissionGate: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

beforeEach(() => {
  vi.clearAllMocks();
  h.logs = [makeLog()];
});

describe('AuditLogsPage', () => {
  it('renders stats cards and a table of entries (UAC-8)', () => {
    render(<AuditLogsPage />);

    // Stat card total.
    expect(screen.getByText('128')).toBeInTheDocument();
    // Row content.
    expect(screen.getByText('Acme Corp')).toBeInTheDocument();
    expect(screen.getByText('Ada Lovelace')).toBeInTheDocument();
    expect(screen.getByText('employees.updated')).toBeInTheDocument();
  });

  it('opens a detail modal with old and new values when a row is clicked (UAC-9)', async () => {
    render(<AuditLogsPage />);

    fireEvent.click(screen.getByRole('button', { name: /view audit log/i }));

    const dialog = await screen.findByRole('dialog');
    // The diff renders each value in its own cell (exact match disambiguates).
    expect(within(dialog).getByText('Engineer')).toBeInTheDocument();
    expect(within(dialog).getByText('Senior Engineer')).toBeInTheDocument();
  });

  it('refetches with the search term and resets to page 1 when a filter changes (UAC-10)', async () => {
    render(<AuditLogsPage />);

    // Go to page 2 first.
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    await waitFor(() => {
      expect(getLogsSpy.mock.calls.at(-1)?.[0]).toMatchObject({ page: 2 });
    });

    // Changing the search filter resets to page 1 and includes the term.
    fireEvent.change(screen.getByPlaceholderText(/search/i), { target: { value: 'payroll' } });

    await waitFor(() => {
      expect(getLogsSpy.mock.calls.at(-1)?.[0]).toMatchObject({ search: 'payroll', page: 1 });
    });
  });
});
