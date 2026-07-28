import type { ReactNode } from 'react'
import { useAppSelector } from '@/common/hooks/useAppSelector'
import { canAccess } from '@/common/auth/permissions'

export function PermissionGate({ permission, children, fallback = null }: { permission: string; children: ReactNode; fallback?: ReactNode }) {
  const user = useAppSelector((state) => state.auth.user)
  return canAccess(user, permission) ? <>{children}</> : <>{fallback}</>
}

export function ForbiddenPage({ permission }: { permission?: string }) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="max-w-md border-l-4 border-[#ee9807] bg-white p-8 shadow-sm">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#ee9807]">Access boundary</p>
        <h1 className="text-2xl font-semibold text-slate-900">This area is restricted</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">Your administrator account does not have the permission required to view this area.</p>
        {permission && <p className="mt-4 font-mono text-xs text-slate-400">Required: {permission}</p>}
      </div>
    </div>
  )
}
