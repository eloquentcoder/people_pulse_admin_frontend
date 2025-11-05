import { X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Input } from '@/common/components/ui/input'
import { Label } from '@/common/components/ui/label'
import { Textarea } from '@/common/components/ui/textarea'
import { Checkbox } from '@/common/components/ui/checkbox'
import { Button } from '@/common/components/ui/button'
import type { Role, Permission, HRModule } from '../models/role.model'

interface RoleModalProps {
  open: boolean
  onClose: () => void
  onSave: (data: { role: Partial<Role>; permissions: number[] }) => void
  initial?: Role | null
  hrModules: HRModule[]
  selectedPermissions?: number[]
}

const RoleModal = ({ open, onClose, onSave, initial, hrModules, selectedPermissions = [] }: RoleModalProps) => {
  const [roleData, setRoleData] = useState({
    name: '',
    slug: '',
    description: '',
    is_system_role: false,
  })

  const [permissions, setPermissions] = useState<number[]>(selectedPermissions)

  useEffect(() => {
    if (initial) {
      setRoleData({
        name: initial.name,
        slug: initial.slug,
        description: initial.description || '',
        is_system_role: initial.is_system_role,
      })
      setPermissions(initial.permissions?.map((p) => p.id) || [])
    } else {
      setRoleData({
        name: '',
        slug: '',
        description: '',
        is_system_role: false,
      })
      setPermissions([])
    }
  }, [initial, open])

  if (!open) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!roleData.name.trim()) return
    onSave({ role: roleData, permissions })
  }

  const handlePermissionToggle = (permissionId: number) => {
    setPermissions((prev) =>
      prev.includes(permissionId) ? prev.filter((id) => id !== permissionId) : [...prev, permissionId]
    )
  }

  const handleModuleToggle = (module: HRModule, crud: 'create' | 'read' | 'update' | 'delete') => {
    const permSlugs: Record<string, string> = {
      create: `create-${module.module}`,
      read: `view-${module.module}`,
      update: `edit-${module.module}`,
      delete: `delete-${module.module}`,
    }

    const permSlug = permSlugs[crud]
    const perm = module.permissions.find((p) => p.slug === permSlug || p.slug.includes(crud))
    if (perm) {
      handlePermissionToggle(perm.id)
    }
  }

  const getModulePermissions = (module: HRModule) => {
    const createPerm = module.permissions.find((p) => p.slug.includes('create') || p.slug.startsWith('create-'))
    const readPerm = module.permissions.find((p) => p.slug.includes('view') || p.slug.startsWith('view-'))
    const updatePerm = module.permissions.find((p) => p.slug.includes('edit') || p.slug.startsWith('edit-'))
    const deletePerm = module.permissions.find((p) => p.slug.includes('delete') || p.slug.startsWith('delete-'))

    return {
      create: createPerm ? permissions.includes(createPerm.id) : false,
      read: readPerm ? permissions.includes(readPerm.id) : false,
      update: updatePerm ? permissions.includes(updatePerm.id) : false,
      delete: deletePerm ? permissions.includes(deletePerm.id) : false,
    }
  }

  const toggleModuleAll = (module: HRModule, checked: boolean) => {
    const modulePerms = module.permissions.map((p) => p.id)
    if (checked) {
      setPermissions((prev) => [...new Set([...prev, ...modulePerms])])
    } else {
      setPermissions((prev) => prev.filter((id) => !modulePerms.includes(id)))
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-5xl rounded-lg bg-white shadow-xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h3 className="font-medium text-lg">
            {initial ? 'Edit HRIS Role' : 'Create HRIS Role'}
          </h3>
          <button
            onClick={onClose}
            className="h-8 w-8 grid place-items-center rounded-md hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-6">
            {/* Role Basic Information */}
            <div className="space-y-4">
              <h4 className="font-medium text-sm text-gray-700">Role Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Role Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={roleData.name}
                    onChange={(e) => {
                      const name = e.target.value
                      setRoleData((prev) => ({
                        ...prev,
                        name,
                        slug: prev.slug || name.toLowerCase().replace(/\s+/g, '-'),
                      }))
                    }}
                    placeholder="e.g. HR Manager, Payroll Admin"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">Role Slug</Label>
                  <Input
                    id="slug"
                    value={roleData.slug}
                    onChange={(e) =>
                      setRoleData((prev) => ({ ...prev, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') }))
                    }
                    placeholder="Auto-generated from name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={roleData.description}
                  onChange={(e) => setRoleData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the role and its responsibilities"
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_system_role"
                  checked={roleData.is_system_role}
                  onCheckedChange={(checked) =>
                    setRoleData((prev) => ({ ...prev, is_system_role: checked === true }))
                  }
                />
                <Label htmlFor="is_system_role" className="text-sm font-normal cursor-pointer">
                  System Role (cannot be deleted)
                </Label>
              </div>
            </div>

            {/* Permissions Matrix */}
            <div className="space-y-4 border-t pt-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-sm text-gray-700">Customize Permissions</h4>
                <p className="text-xs text-gray-500">
                  Note: No selection of any permissions is equivalent to disabled status
                </p>
              </div>

              <div className="border rounded-md overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">HR Function Module</th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 w-20">
                          <span className="block">All</span>
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 w-20">
                          <span className="block">Create</span>
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 w-20">
                          <span className="block">Read</span>
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 w-20">
                          <span className="block">Update</span>
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 w-20">
                          <span className="block">Delete</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {hrModules.map((module) => {
                        const modulePerms = getModulePermissions(module)
                        const allSelected = modulePerms.create && modulePerms.read && modulePerms.update && modulePerms.delete

                        return (
                          <tr key={module.module} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm font-medium">{module.name}</td>
                            <td className="px-4 py-3 text-center">
                              <Checkbox
                                checked={allSelected}
                                onCheckedChange={(checked) => toggleModuleAll(module, checked === true)}
                              />
                            </td>
                            <td className="px-4 py-3 text-center">
                              <Checkbox
                                checked={modulePerms.create}
                                onCheckedChange={() => handleModuleToggle(module, 'create')}
                              />
                            </td>
                            <td className="px-4 py-3 text-center">
                              <Checkbox
                                checked={modulePerms.read}
                                onCheckedChange={() => handleModuleToggle(module, 'read')}
                              />
                            </td>
                            <td className="px-4 py-3 text-center">
                              <Checkbox
                                checked={modulePerms.update}
                                onCheckedChange={() => handleModuleToggle(module, 'update')}
                              />
                            </td>
                            <td className="px-4 py-3 text-center">
                              <Checkbox
                                checked={modulePerms.delete}
                                onCheckedChange={() => handleModuleToggle(module, 'delete')}
                              />
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 px-4 py-3 border-t bg-gray-50">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!roleData.name.trim()}
              style={{ backgroundColor: '#4469e5' }}
              className="text-white"
            >
              {initial ? 'Update Role' : 'Create Role'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RoleModal

