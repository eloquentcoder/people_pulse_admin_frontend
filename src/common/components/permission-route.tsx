import { Navigate } from 'react-router-dom'
import { useAppSelector } from '@/common/hooks/useAppSelector'
import { canAccess } from '@/common/auth/permissions'
import { ForbiddenPage } from './permission-gate'

export function PermissionRoute({ permission, children }: { permission: string; children: React.ReactNode }) {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth)
  if (!isAuthenticated || !user) return <Navigate to="/login" replace />
  return canAccess(user, permission) ? <>{children}</> : <ForbiddenPage permission={permission} />
}
