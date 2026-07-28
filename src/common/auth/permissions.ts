export interface PermissionRole {
  slug?: string
  permissions?: string[]
}

export interface PermissionUser {
  user_type?: string
  roles?: PermissionRole[]
  permissions?: string[]
}

const PROTECTED_ROLES = new Set(['platform-admin', 'super_admin'])

export function effectivePermissions(user: PermissionUser): string[] {
  return Array.from(new Set([
    ...(user.permissions ?? []),
    ...(user.roles ?? []).flatMap((role) => role.permissions ?? []),
  ]))
}

export function canAccess(user: PermissionUser | null | undefined, permission: string): boolean {
  if (!user || user.user_type !== 'platform_admin') return false
  if ((user.roles ?? []).some((role) => role.slug && PROTECTED_ROLES.has(role.slug))) return true
  return effectivePermissions(user).includes(permission)
}
