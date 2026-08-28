import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import PlatformAdminsPage from './platform-admins.page'

const updatePlatformAdmin = vi.fn(() => ({ unwrap: vi.fn().mockResolvedValue({}) }))

vi.mock('@/common/components/permission-gate', () => ({
  PermissionGate: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

vi.mock('@/domains/portal/roles-permissions/apis/roles.api', () => ({
  useGetRolesQuery: () => ({
    data: {
      data: {
        data: [{ id: 7, name: 'Support Operator', slug: 'support-operator', is_system_role: false, permissions_count: 3 }],
      },
    },
  }),
}))

vi.mock('../apis/platform-admins.api', () => ({
  useGetPlatformAdminsQuery: () => ({
    data: {
      data: {
        data: [{
          id: 11,
          first_name: 'Ada',
          last_name: 'Lovelace',
          email: 'ada@example.com',
          user_type: 'platform_admin',
          is_active: true,
          roles: [{ id: 7, name: 'Support Operator', slug: 'support-operator', is_system_role: false }],
        }],
      },
    },
    isLoading: false,
  }),
  useCreatePlatformAdminMutation: () => [vi.fn(), { isLoading: false }],
  useInvitePlatformAdminMutation: () => [vi.fn(), { isLoading: false }],
  useUpdatePlatformAdminMutation: () => [updatePlatformAdmin, { isLoading: false }],
}))

describe('PlatformAdminsPage', () => {
  beforeEach(() => updatePlatformAdmin.mockClear())

  it('allows editing a platform admin role assignment', async () => {
    render(<PlatformAdminsPage />)

    fireEvent.click(screen.getByRole('button', { name: /edit roles/i }))

    expect(screen.getByRole('dialog')).toHaveTextContent('Edit platform admin roles')
    expect(screen.getByLabelText('Support Operator')).toBeChecked()

    fireEvent.click(screen.getByRole('button', { name: 'Save roles' }))

    await waitFor(() => expect(updatePlatformAdmin).toHaveBeenCalledWith({ id: 11, data: { role_ids: [7] } }))
  })
})
