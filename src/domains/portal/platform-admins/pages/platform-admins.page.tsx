import { useMemo, useState } from 'react'
import { KeyRound, Mail, Pencil, Plus, ShieldCheck, UserRound, UserRoundX } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/common/components/ui/button'
import { Input } from '@/common/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/common/components/ui/card'
import { Badge } from '@/common/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/common/components/ui/dialog'
import { useGetRolesQuery } from '@/domains/portal/roles-permissions/apis/roles.api'
import { PermissionGate } from '@/common/components/permission-gate'
import { useGetPlatformAdminsQuery, useCreatePlatformAdminMutation, useInvitePlatformAdminMutation, useUpdatePlatformAdminMutation, type PlatformAdmin } from '../apis/platform-admins.api'

const PlatformAdminsPage = () => {
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<'password' | 'invite'>('invite')
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', password: '', role_ids: [] as number[] })
  const [roleEditorAdmin, setRoleEditorAdmin] = useState<PlatformAdmin | null>(null)
  const [roleEditorSelection, setRoleEditorSelection] = useState<number[]>([])
  const { data, isLoading } = useGetPlatformAdminsQuery({ search })
  const { data: rolesResponse } = useGetRolesQuery({ per_page: 100 })
  const [createAdmin, { isLoading: creating }] = useCreatePlatformAdminMutation()
  const [inviteAdmin, { isLoading: inviting }] = useInvitePlatformAdminMutation()
  const [updateAdmin, { isLoading: updating }] = useUpdatePlatformAdminMutation()
  const admins = data?.data?.data ?? []
  const roles = useMemo(() => (rolesResponse?.data?.data ?? []).filter((role) => !role.is_system_role), [rolesResponse])

  const reset = () => setForm({ first_name: '', last_name: '', email: '', password: '', role_ids: [] })
  const toggleRole = (id: number) => setForm((current) => ({ ...current, role_ids: current.role_ids.includes(id) ? current.role_ids.filter((roleId) => roleId !== id) : [...current.role_ids, id] }))
  const openRoleEditor = (admin: PlatformAdmin) => {
    setRoleEditorAdmin(admin)
    setRoleEditorSelection(admin.roles?.map((role) => role.id).filter((id): id is number => typeof id === 'number') ?? [])
  }
  const toggleRoleEditorRole = (id: number) => setRoleEditorSelection((current) => current.includes(id) ? current.filter((roleId) => roleId !== id) : [...current, id])

  const save = async () => {
    if (!form.first_name || !form.last_name || !form.email || (mode === 'password' && form.password.length < 8)) {
      toast.error(mode === 'invite' ? 'Enter the admin details' : 'Enter a password with at least 8 characters')
      return
    }
    try {
      if (mode === 'invite') await inviteAdmin({ first_name: form.first_name, last_name: form.last_name, email: form.email, role_ids: form.role_ids }).unwrap()
      else await createAdmin(form).unwrap()
      toast.success(mode === 'invite' ? 'Invitation sent' : 'Platform admin created')
      setOpen(false)
      reset()
    } catch { toast.error('Could not save this platform admin') }
  }

  const toggleActive = async (id: number, isActive: boolean) => {
    try {
      await updateAdmin({ id, data: { is_active: !isActive } }).unwrap()
      toast.success(isActive ? 'Admin deactivated' : 'Admin activated')
    } catch { toast.error('This account could not be updated') }
  }

  const saveRoleEditor = async () => {
    if (!roleEditorAdmin) return
    try {
      await updateAdmin({ id: roleEditorAdmin.id, data: { role_ids: roleEditorSelection } }).unwrap()
      toast.success('Platform admin roles updated')
      setRoleEditorAdmin(null)
    } catch (error: any) {
      toast.error(error?.data?.message || 'These platform roles could not be updated')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#ee9807]">Access control</p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Platform admins</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-500">Create PeoplePulse operators and assign platform roles. Organization users and roles stay in their own workspace.</p>
        </div>
        <PermissionGate permission="create-platform-admins">
          <Button className="bg-[#4469e5] text-white hover:bg-[#3458d4]" onClick={() => { reset(); setOpen(true) }}><Plus className="h-4 w-4" /> Add platform admin</Button>
        </PermissionGate>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardContent className="p-5"><p className="text-xs uppercase tracking-wide text-slate-400">Total operators</p><p className="mt-2 text-3xl font-semibold text-slate-900">{admins.length}</p></CardContent></Card>
        <Card><CardContent className="p-5"><p className="text-xs uppercase tracking-wide text-slate-400">Active now</p><p className="mt-2 text-3xl font-semibold text-emerald-600">{admins.filter((admin) => admin.is_active).length}</p></CardContent></Card>
        <Card><CardContent className="p-5"><p className="text-xs uppercase tracking-wide text-slate-400">Custom roles</p><p className="mt-2 text-3xl font-semibold text-[#4469e5]">{roles.length}</p></CardContent></Card>
      </div>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="flex flex-col gap-4 border-b bg-slate-50/70 md:flex-row md:items-center md:justify-between">
          <CardTitle className="text-base">Operator directory</CardTitle>
          <Input className="max-w-sm bg-white" placeholder="Search by name or email" value={search} onChange={(event) => setSearch(event.target.value)} />
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? <div className="p-8 text-sm text-slate-500">Loading operators…</div> : admins.length === 0 ? <div className="p-8 text-sm text-slate-500">No platform admins match this search.</div> : <div className="divide-y divide-slate-100">
            {admins.map((admin) => {
              const protectedAdmin = admin.roles?.some((role) => role.is_system_role)
              return <div key={admin.id} className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
                <div className="flex items-start gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-white"><UserRound className="h-4 w-4" /></div><div><p className="font-medium text-slate-900">{admin.first_name} {admin.last_name}</p><p className="text-sm text-slate-500">{admin.email}</p><div className="mt-2 flex flex-wrap gap-1.5">{admin.roles?.length ? admin.roles.map((role) => <Badge key={role.slug} variant="secondary" className="font-normal">{role.name ?? role.slug}</Badge>) : <span className="text-xs text-amber-600">No role assigned</span>}{protectedAdmin && <Badge className="bg-slate-900 text-white"><ShieldCheck className="mr-1 h-3 w-3" /> Protected</Badge>}</div></div></div>
                <div className="flex items-center gap-3"><Badge className={admin.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}>{admin.is_active ? 'Active' : 'Inactive'}</Badge><PermissionGate permission="edit-platform-admins"><Button variant="outline" size="sm" disabled={protectedAdmin} onClick={() => openRoleEditor(admin)}><Pencil className="h-4 w-4" /> Edit roles</Button><Button variant="outline" size="sm" disabled={protectedAdmin} onClick={() => toggleActive(admin.id, admin.is_active)}>{admin.is_active ? <><UserRoundX className="h-4 w-4" /> Deactivate</> : 'Activate'}</Button></PermissionGate></div>
              </div>
            })}
          </div>}
        </CardContent>
      </Card>

      <Dialog open={Boolean(roleEditorAdmin)} onOpenChange={(nextOpen) => !nextOpen && setRoleEditorAdmin(null)}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Edit platform admin roles</DialogTitle>
            <DialogDescription>Choose the platform permissions this operator receives through their roles.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="max-h-64 space-y-2 overflow-y-auto rounded-md border p-3">
              {roles.length ? roles.map((role) => (
                <label key={role.id} className="flex cursor-pointer items-start gap-2 rounded-md p-2 text-sm hover:bg-slate-50">
                  <input type="checkbox" aria-label={role.name} checked={role.id ? roleEditorSelection.includes(role.id) : false} onChange={() => role.id && toggleRoleEditorRole(role.id)} />
                  <span><span className="font-medium text-slate-800">{role.name}</span><span className="block text-xs text-slate-500">{role.permissions_count ?? role.permissions?.length ?? 0} permissions</span></span>
                </label>
              )) : <p className="text-sm text-slate-500">No assignable platform roles are available. Seed platform operator roles before creating an admin.</p>}
            </div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setRoleEditorAdmin(null)}>Cancel</Button><PermissionGate permission="edit-platform-admins"><Button className="bg-[#4469e5] text-white" disabled={updating} onClick={saveRoleEditor}>Save roles</Button></PermissionGate></DialogFooter>
        </DialogContent>
      </Dialog>

    <Dialog open={open} onOpenChange={setOpen}><DialogContent className="max-w-xl"><DialogHeader><DialogTitle>New platform admin</DialogTitle><DialogDescription>Choose a platform role for this PeoplePulse operator. Organization roles are not available here.</DialogDescription></DialogHeader><div className="space-y-4"><div className="grid gap-4 md:grid-cols-2"><Input placeholder="First name" value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} /><Input placeholder="Last name" value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} /></div><Input type="email" placeholder="Work email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /><div className="grid grid-cols-2 gap-2"><Button type="button" variant={mode === 'invite' ? 'default' : 'outline'} className={mode === 'invite' ? 'bg-[#4469e5] text-white' : ''} onClick={() => setMode('invite')}><Mail className="h-4 w-4" /> Email invite</Button><Button type="button" variant={mode === 'password' ? 'default' : 'outline'} className={mode === 'password' ? 'bg-[#4469e5] text-white' : ''} onClick={() => setMode('password')}><KeyRound className="h-4 w-4" /> Set password</Button></div>{mode === 'password' && <Input type="password" placeholder="Initial password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />}<div><p className="mb-2 text-sm font-medium text-slate-700">Assign platform roles</p><div className="max-h-48 space-y-2 overflow-y-auto rounded-md border p-3">{roles.length ? roles.map((role) => <label key={role.id} className="flex cursor-pointer items-start gap-2 text-sm"><input type="checkbox" aria-label={role.name} checked={role.id ? form.role_ids.includes(role.id) : false} onChange={() => role.id && toggleRole(role.id)} /><span><span className="font-medium text-slate-800">{role.name}</span><span className="block text-xs text-slate-500">{role.permissions_count ?? role.permissions?.length ?? 0} permissions</span></span></label>) : <p className="text-sm text-slate-500">No assignable platform roles are available. Seed platform operator roles before creating an admin.</p>}</div></div></div><DialogFooter><Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button><PermissionGate permission="create-platform-admins"><Button className="bg-[#4469e5] text-white" disabled={creating || inviting} onClick={save}>{mode === 'invite' ? 'Send invitation' : 'Create admin'}</Button></PermissionGate></DialogFooter></DialogContent></Dialog>
    </div>
  )
}

export default PlatformAdminsPage
