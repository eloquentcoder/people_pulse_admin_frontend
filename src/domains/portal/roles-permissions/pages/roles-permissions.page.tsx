import { Plus, Pencil, Trash2, Search, ChevronsUpDown, Shield, Users, Key, Loader2, Copy, ChevronDown, ChevronRight, Check } from 'lucide-react'
import { useState, useMemo } from 'react'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/common/components/ui/table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/common/components/ui/card'
import { Badge } from '@/common/components/ui/badge'
import { Button } from '@/common/components/ui/button'
import { Input } from '@/common/components/ui/input'
import { Checkbox } from '@/common/components/ui/checkbox'
import { Label } from '@/common/components/ui/label'
import { Textarea } from '@/common/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/common/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/common/components/ui/alert-dialog'
import { toast } from 'sonner'
import {
  useGetRolesQuery,
  useGetRoleQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
  useUpdateRolePermissionsMutation,
  useCloneRoleMutation,
  useGetRoleStatsQuery,
  useGetPermissionsQuery,
  type Role,
  type Permission,
  type PermissionGroup,
} from '../apis/roles.api'

const RolesPermissionsPage = () => {
  // Tab state
  const [tab, setTab] = useState<'roles' | 'permissions'>('roles')

  // Filter states
  const [query, setQuery] = useState('')
  const [sortKey, setSortKey] = useState<string>('name')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
  const [page, setPage] = useState(1)
  const pageSize = 10

  // Modal states
  const [roleModalOpen, setRoleModalOpen] = useState(false)
  const [permissionModalOpen, setPermissionModalOpen] = useState(false)
  const [cloneModalOpen, setCloneModalOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null)

  // Form state for create/edit role
  const [roleName, setRoleName] = useState('')
  const [roleDescription, setRoleDescription] = useState('')
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([])
  const [expandedModules, setExpandedModules] = useState<string[]>([])

  // Clone form state
  const [cloneName, setCloneName] = useState('')
  const [cloneDescription, setCloneDescription] = useState('')

  // API hooks
  const { data: rolesData, isLoading: rolesLoading, isFetching: rolesFetching } = useGetRolesQuery({
    search: query,
    sort_by: sortKey,
    sort_order: sortDir,
    page,
    per_page: pageSize,
  })

  const { data: statsData } = useGetRoleStatsQuery()
  const { data: permissionsData, isLoading: permissionsLoading } = useGetPermissionsQuery({})

  // Fetch detailed role when editing permissions
  const { data: roleDetailData } = useGetRoleQuery(selectedRole?.id || 0, {
    skip: !selectedRole?.id || !permissionModalOpen,
  })

  // Mutations
  const [createRole, { isLoading: creating }] = useCreateRoleMutation()
  const [updateRole, { isLoading: updating }] = useUpdateRoleMutation()
  const [deleteRole, { isLoading: deleting }] = useDeleteRoleMutation()
  const [updatePermissions, { isLoading: updatingPermissions }] = useUpdateRolePermissionsMutation()
  const [cloneRole, { isLoading: cloning }] = useCloneRoleMutation()

  const roles = rolesData?.data?.data || []
  const totalRoles = rolesData?.data?.total || 0
  const stats = statsData?.data
  const permissions = permissionsData?.data?.permissions || []

  const pageCount = Math.max(1, Math.ceil(totalRoles / pageSize))

  const toggleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  // Handlers
  const handleCreateRole = () => {
    setSelectedRole(null)
    setRoleName('')
    setRoleDescription('')
    setSelectedPermissions([])
    setRoleModalOpen(true)
  }

  const handleEditRole = (role: Role) => {
    setSelectedRole(role)
    setRoleName(role.name)
    setRoleDescription(role.description || '')
    setSelectedPermissions(role.permissions?.map(p => p.id) || [])
    setRoleModalOpen(true)
  }

  const handleManagePermissions = (role: Role) => {
    setSelectedRole(role)
    setSelectedPermissions(role.permissions?.map(p => p.id) || [])
    setExpandedModules(permissions.map(g => g.module))
    setPermissionModalOpen(true)
  }

  const handleCloneRole = (role: Role) => {
    setSelectedRole(role)
    setCloneName(`Copy of ${role.name}`)
    setCloneDescription(role.description || '')
    setCloneModalOpen(true)
  }

  const handleDeleteRole = (role: Role) => {
    setRoleToDelete(role)
    setDeleteDialogOpen(true)
  }

  const confirmDeleteRole = async () => {
    if (!roleToDelete?.id) return
    try {
      await deleteRole(roleToDelete.id).unwrap()
      toast.success('Role deleted successfully')
      setDeleteDialogOpen(false)
      setRoleToDelete(null)
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to delete role')
    }
  }

  const handleSaveRole = async () => {
    if (!roleName.trim()) {
      toast.error('Role name is required')
      return
    }

    try {
      if (selectedRole?.id) {
        await updateRole({
          id: selectedRole.id,
          data: { name: roleName, description: roleDescription },
        }).unwrap()
        toast.success('Role updated successfully')
      } else {
        await createRole({
          name: roleName,
          description: roleDescription,
          permissions: selectedPermissions,
        }).unwrap()
        toast.success('Role created successfully')
      }
      setRoleModalOpen(false)
      setSelectedRole(null)
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to save role')
    }
  }

  const handleSavePermissions = async () => {
    if (!selectedRole?.id) return
    try {
      await updatePermissions({
        id: selectedRole.id,
        data: { permissions: selectedPermissions },
      }).unwrap()
      toast.success('Permissions updated successfully')
      setPermissionModalOpen(false)
      setSelectedRole(null)
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to update permissions')
    }
  }

  const handleConfirmClone = async () => {
    if (!selectedRole?.id || !cloneName.trim()) return
    try {
      await cloneRole({
        id: selectedRole.id,
        data: { name: cloneName, description: cloneDescription },
      }).unwrap()
      toast.success('Role cloned successfully')
      setCloneModalOpen(false)
      setSelectedRole(null)
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to clone role')
    }
  }

  const togglePermission = (permissionId: number) => {
    setSelectedPermissions(prev =>
      prev.includes(permissionId)
        ? prev.filter(id => id !== permissionId)
        : [...prev, permissionId]
    )
  }

  const toggleModule = (module: string) => {
    setExpandedModules(prev =>
      prev.includes(module)
        ? prev.filter(m => m !== module)
        : [...prev, module]
    )
  }

  const toggleAllInModule = (modulePermissions: Permission[]) => {
    const modulePermissionIds = modulePermissions.map(p => p.id)
    const allSelected = modulePermissionIds.every(id => selectedPermissions.includes(id))

    if (allSelected) {
      setSelectedPermissions(prev => prev.filter(id => !modulePermissionIds.includes(id)))
    } else {
      setSelectedPermissions(prev => [...new Set([...prev, ...modulePermissionIds])])
    }
  }

  // Initialize permissions when role detail loads
  useMemo(() => {
    if (roleDetailData?.data?.permissions && permissionModalOpen) {
      setSelectedPermissions(roleDetailData.data.permissions.map(p => p.id))
    }
  }, [roleDetailData, permissionModalOpen])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Roles & Permissions</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage platform roles and their permissions
          </p>
        </div>
        {tab === 'roles' && (
          <Button onClick={handleCreateRole} style={{ backgroundColor: '#4469e5' }} className="text-white">
            <Plus className="h-4 w-4 mr-2" /> Create Role
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Roles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_roles || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">System Roles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.system_roles || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Custom Roles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.custom_roles || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Most Used</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold truncate">{stats?.most_used_role?.name || 'N/A'}</div>
            <div className="text-xs text-gray-500">{stats?.most_used_role?.users_count || 0} users</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b">
        {[
          { key: 'roles', label: 'Manage Roles', icon: Shield },
          { key: 'permissions', label: 'Permission Matrix', icon: Key },
        ].map((t) => {
          const Icon = t.icon
          return (
            <button
              key={t.key}
              onClick={() => {
                setTab(t.key as any)
                setQuery('')
                setPage(1)
              }}
              className={`px-4 py-2 flex items-center gap-2 text-sm border-b-2 transition-colors ${
                tab === t.key
                  ? 'border-blue-600 text-blue-600 font-medium'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className="h-4 w-4" />
              {t.label}
            </button>
          )
        })}
      </div>

      {/* Filters */}
      <div className="border rounded-md bg-white p-3">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setPage(1)
              }}
              placeholder="Search roles by name, slug, or description"
              className="pl-9"
            />
          </div>
        </div>
      </div>

      {/* Roles Table */}
      {tab === 'roles' && (
        <div className="border rounded-md bg-white">
          {rolesLoading || rolesFetching ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <button onClick={() => toggleSort('name')} className="inline-flex items-center gap-1">
                        Role Name <ChevronsUpDown className="h-3 w-3" />
                      </button>
                    </TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Permissions</TableHead>
                    <TableHead>
                      <button onClick={() => toggleSort('users_count')} className="inline-flex items-center gap-1">
                        Users <ChevronsUpDown className="h-3 w-3" />
                      </button>
                    </TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {roles.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                        <Shield className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                        <p>No roles found</p>
                        <p className="text-xs mt-1">
                          {query ? 'Try adjusting your search' : 'Create your first role to get started'}
                        </p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    roles.map((role) => (
                      <TableRow key={role.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4 text-gray-400" />
                            {role.name}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {role.slug}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs truncate" title={role.description}>
                            {role.description || '—'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleManagePermissions(role)}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            {role.permissions_count || 0} permissions
                          </Button>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm font-medium">{role.users_count || 0} users</span>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={role.is_system_role ? 'default' : 'outline'}
                            className={role.is_system_role ? 'bg-blue-100 text-blue-700' : ''}
                          >
                            {role.is_system_role ? 'System' : 'Custom'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCloneRole(role)}
                              title="Clone role"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            {!role.is_system_role && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditRole(role)}
                                  title="Edit role"
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteRole(role)}
                                  title="Delete role"
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              {/* Pagination */}
              {pageCount > 1 && (
                <div className="flex items-center justify-between px-3 py-2 border-t text-sm">
                  <div className="text-xs text-gray-600">
                    Showing {roles.length > 0 ? (page - 1) * pageSize + 1 : 0}–
                    {(page - 1) * pageSize + roles.length} of {totalRoles} roles
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      disabled={page === 1}
                      onClick={() => setPage(1)}
                      className="h-8 w-8 rounded-md border text-xs disabled:opacity-40"
                    >
                      «
                    </button>
                    <button
                      disabled={page === 1}
                      onClick={() => setPage(page - 1)}
                      className="h-8 w-8 rounded-md border text-xs disabled:opacity-40"
                    >
                      ‹
                    </button>
                    {Array.from({ length: Math.min(5, pageCount) }).map((_, i) => {
                      const p = i + 1
                      return (
                        <button
                          key={p}
                          onClick={() => setPage(p)}
                          className={`h-8 w-8 rounded-md border text-xs ${page === p ? 'bg-gray-100 font-medium' : ''}`}
                        >
                          {p}
                        </button>
                      )
                    })}
                    <button
                      disabled={page === pageCount}
                      onClick={() => setPage(page + 1)}
                      className="h-8 w-8 rounded-md border text-xs disabled:opacity-40"
                    >
                      ›
                    </button>
                    <button
                      disabled={page === pageCount}
                      onClick={() => setPage(pageCount)}
                      className="h-8 w-8 rounded-md border text-xs disabled:opacity-40"
                    >
                      »
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Permission Matrix Tab */}
      {tab === 'permissions' && (
        <Card>
          <CardHeader>
            <CardTitle>Permission Matrix</CardTitle>
            <CardDescription>
              View which permissions are assigned to each role
            </CardDescription>
          </CardHeader>
          <CardContent>
            {permissionsLoading || rolesLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2 font-medium sticky left-0 bg-white min-w-[200px]">
                        Permission / Module
                      </th>
                      {roles.map((role) => (
                        <th key={role.id} className="text-center p-2 font-medium min-w-[120px]">
                          <div className="flex flex-col items-center">
                            <span className="truncate max-w-[100px]" title={role.name}>
                              {role.name}
                            </span>
                            <Badge variant="outline" className="text-xs mt-1">
                              {role.permissions_count || 0}
                            </Badge>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {permissions.map((group: PermissionGroup) => (
                      <>
                        <tr key={`module-${group.module}`} className="bg-gray-50">
                          <td className="p-2 font-medium sticky left-0 bg-gray-50" colSpan={roles.length + 1}>
                            {group.module.charAt(0).toUpperCase() + group.module.slice(1).replace(/_/g, ' ')}
                          </td>
                        </tr>
                        {group.permissions.map((permission) => (
                          <tr key={permission.id} className="border-b hover:bg-gray-50">
                            <td className="p-2 pl-6 sticky left-0 bg-white">
                              <div>
                                <span className="text-gray-700">{permission.name}</span>
                                <span className="text-xs text-gray-400 ml-2">({permission.slug})</span>
                              </div>
                            </td>
                            {roles.map((role) => {
                              const hasPermission = role.permissions?.some(p => p.id === permission.id)
                              return (
                                <td key={`${role.id}-${permission.id}`} className="text-center p-2">
                                  {hasPermission ? (
                                    <Check className="h-4 w-4 text-green-600 mx-auto" />
                                  ) : (
                                    <span className="text-gray-300">—</span>
                                  )}
                                </td>
                              )
                            })}
                          </tr>
                        ))}
                      </>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Create/Edit Role Modal */}
      <Dialog open={roleModalOpen} onOpenChange={setRoleModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedRole ? 'Edit Role' : 'Create Role'}</DialogTitle>
            <DialogDescription>
              {selectedRole ? 'Update role details' : 'Create a new custom role'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="roleName">Role Name *</Label>
              <Input
                id="roleName"
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
                placeholder="Enter role name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="roleDescription">Description</Label>
              <Textarea
                id="roleDescription"
                value={roleDescription}
                onChange={(e) => setRoleDescription(e.target.value)}
                placeholder="Enter role description"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRoleModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveRole}
              disabled={creating || updating}
              style={{ backgroundColor: '#4469e5' }}
              className="text-white"
            >
              {(creating || updating) && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {selectedRole ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Manage Permissions Modal */}
      <Dialog open={permissionModalOpen} onOpenChange={setPermissionModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Manage Permissions</DialogTitle>
            <DialogDescription>
              {selectedRole?.name ? `Configure permissions for ${selectedRole.name}` : 'Select permissions'}
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto py-4 pr-2">
            {permissionsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
              </div>
            ) : (
              <div className="space-y-2">
                {permissions.map((group: PermissionGroup) => {
                  const isExpanded = expandedModules.includes(group.module)
                  const modulePermissionIds = group.permissions.map(p => p.id)
                  const allSelected = modulePermissionIds.every(id => selectedPermissions.includes(id))
                  const someSelected = modulePermissionIds.some(id => selectedPermissions.includes(id))

                  return (
                    <div key={group.module} className="border rounded-md">
                      <div
                        className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50"
                        onClick={() => toggleModule(group.module)}
                      >
                        <div className="flex items-center gap-3">
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4 text-gray-500" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-gray-500" />
                          )}
                          <span className="font-medium">
                            {group.module.charAt(0).toUpperCase() + group.module.slice(1).replace(/_/g, ' ')}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {modulePermissionIds.filter(id => selectedPermissions.includes(id)).length} / {group.permissions.length}
                          </Badge>
                        </div>
                        <Checkbox
                          checked={allSelected}
                          // @ts-ignore - indeterminate is valid but not in types
                          indeterminate={someSelected && !allSelected}
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleAllInModule(group.permissions)
                          }}
                        />
                      </div>
                      {isExpanded && (
                        <div className="border-t px-3 py-2 space-y-2 bg-gray-50">
                          {group.permissions.map((permission) => (
                            <div
                              key={permission.id}
                              className="flex items-center justify-between py-1 pl-7"
                            >
                              <div>
                                <span className="text-sm">{permission.name}</span>
                                {permission.description && (
                                  <p className="text-xs text-gray-500">{permission.description}</p>
                                )}
                              </div>
                              <Checkbox
                                checked={selectedPermissions.includes(permission.id)}
                                onCheckedChange={() => togglePermission(permission.id)}
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
          <DialogFooter className="border-t pt-4">
            <div className="flex items-center justify-between w-full">
              <span className="text-sm text-gray-500">
                {selectedPermissions.length} permissions selected
              </span>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setPermissionModalOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleSavePermissions}
                  disabled={updatingPermissions || selectedRole?.is_system_role}
                  style={{ backgroundColor: '#4469e5' }}
                  className="text-white"
                >
                  {updatingPermissions && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Save Permissions
                </Button>
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Clone Role Modal */}
      <Dialog open={cloneModalOpen} onOpenChange={setCloneModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Clone Role</DialogTitle>
            <DialogDescription>
              Create a copy of "{selectedRole?.name}" with the same permissions
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="cloneName">New Role Name *</Label>
              <Input
                id="cloneName"
                value={cloneName}
                onChange={(e) => setCloneName(e.target.value)}
                placeholder="Enter new role name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cloneDescription">Description</Label>
              <Textarea
                id="cloneDescription"
                value={cloneDescription}
                onChange={(e) => setCloneDescription(e.target.value)}
                placeholder="Enter description"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCloneModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirmClone}
              disabled={cloning}
              style={{ backgroundColor: '#4469e5' }}
              className="text-white"
            >
              {cloning && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Clone Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Role</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{roleToDelete?.name}</strong>?
              {roleToDelete?.users_count && roleToDelete.users_count > 0 && (
                <span className="block mt-2 text-red-600">
                  Warning: {roleToDelete.users_count} users are assigned to this role.
                </span>
              )}
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setRoleToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteRole}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default RolesPermissionsPage
