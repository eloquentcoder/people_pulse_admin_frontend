import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { UserFormModal } from './user-form-modal'

vi.mock('../apis/user.api', () => ({
  useCreateUserMutation: () => [vi.fn(), { isLoading: false }],
  useUpdateUserMutation: () => [vi.fn(), { isLoading: false }],
  useGetOrganizationsQuery: () => ({ data: { data: [{ id: 1, name: 'Acme', slug: 'acme', status: 'active' }] } }),
  useGetRolesQuery: () => ({
    data: {
      data: [{ id: 4, name: 'HR Manager', slug: 'hr-manager', organization_id: 1 }],
    },
  }),
}))

describe('UserFormModal', () => {
  it('does not offer Platform Admin as an organization user type', () => {
    render(<UserFormModal isOpen onClose={vi.fn()} />)

    expect(screen.queryByRole('option', { name: 'Platform Admin' })).not.toBeInTheDocument()
  })
})
