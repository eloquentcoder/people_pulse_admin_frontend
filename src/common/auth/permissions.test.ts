import { describe, expect, it } from 'vitest'
import { canAccess, effectivePermissions } from './permissions'

describe('platform permissions', () => {
  it('allows the protected platform administrator to access everything', () => {
    expect(canAccess({ user_type: 'platform_admin', roles: [{ slug: 'platform-admin' }], permissions: [] }, 'delete-users')).toBe(true)
  })

  it('allows an assigned permission and denies an unassigned permission', () => {
    const user = { user_type: 'platform_admin' as const, roles: [{ slug: 'support-operator' }], permissions: ['view-all-tickets'] }

    expect(canAccess(user, 'view-all-tickets')).toBe(true)
    expect(canAccess(user, 'delete-users')).toBe(false)
  })

  it('keeps platform-admin management permission separate from organization users', () => {
    const user = { user_type: 'platform_admin' as const, roles: [{ slug: 'platform-support' }], permissions: ['view-platform-admins'] }

    expect(canAccess(user, 'view-platform-admins')).toBe(true)
    expect(canAccess(user, 'view-all-users')).toBe(false)
  })

  it('checks each action independently from the page view permission', () => {
    const user = { user_type: 'platform_admin' as const, permissions: ['view-plans', 'edit-plans'] }

    expect(canAccess(user, 'view-plans')).toBe(true)
    expect(canAccess(user, 'edit-plans')).toBe(true)
    expect(canAccess(user, 'create-plans')).toBe(false)
    expect(canAccess(user, 'delete-plans')).toBe(false)
  })

  it('combines permissions without duplicating them', () => {
    expect(effectivePermissions({ permissions: ['view-users'], roles: [{ permissions: ['view-users', 'edit-users'] }] })).toEqual(['view-users', 'edit-users'])
  })
})
