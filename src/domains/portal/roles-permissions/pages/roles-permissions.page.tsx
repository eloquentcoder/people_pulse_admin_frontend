import { Plus, Pencil, Trash2, Search, ChevronsUpDown, Shield, Users, Key, UserX, Eye } from 'lucide-react'
import { useState } from 'react'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/common/components/ui/table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/common/components/ui/card'
import { Badge } from '@/common/components/ui/badge'
import { Button } from '@/common/components/ui/button'
import { Input } from '@/common/components/ui/input'
import RoleModal from '../components/role-modal'
import AssignRoleModal from '../components/assign-role-modal'
import EmployeeAccessModal from '../components/employee-access-modal'
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
import type { Role, Permission, HRModule } from '../models/role.model'

const RolesPermissionsPage = () => {
  const [tab, setTab] = useState<'roles' | 'assign-roles' | 'employee-access'>('roles')

  // Mock HR Modules with permissions
  const hrModules: HRModule[] = [
    {
      name: 'Employee Management',
      module: 'employees',
      permissions: [
        { id: 1, name: 'View Employees', slug: 'view-employees', module: 'employees' },
        { id: 2, name: 'Create Employees', slug: 'create-employees', module: 'employees' },
        { id: 3, name: 'Edit Employees', slug: 'edit-employees', module: 'employees' },
        { id: 4, name: 'Delete Employees', slug: 'delete-employees', module: 'employees' },
      ],
    },
    {
      name: 'Department Management',
      module: 'departments',
      permissions: [
        { id: 5, name: 'View Departments', slug: 'view-departments', module: 'departments' },
        { id: 6, name: 'Create Departments', slug: 'create-departments', module: 'departments' },
        { id: 7, name: 'Edit Departments', slug: 'edit-departments', module: 'departments' },
        { id: 8, name: 'Delete Departments', slug: 'delete-departments', module: 'departments' },
      ],
    },
    {
      name: 'Leave Management',
      module: 'leave',
      permissions: [
        { id: 9, name: 'View Leave Requests', slug: 'view-leave-requests', module: 'leave' },
        { id: 10, name: 'Create Leave Request', slug: 'create-leave-request', module: 'leave' },
        { id: 11, name: 'Approve Leave Requests', slug: 'approve-leave-requests', module: 'leave' },
        { id: 12, name: 'Reject Leave Requests', slug: 'reject-leave-requests', module: 'leave' },
        { id: 13, name: 'Configure Leave Types', slug: 'configure-leave-types', module: 'leave' },
      ],
    },
    {
      name: 'Attendance Management',
      module: 'attendance',
      permissions: [
        { id: 14, name: 'View Attendance', slug: 'view-attendance', module: 'attendance' },
        { id: 15, name: 'Mark Attendance', slug: 'mark-attendance', module: 'attendance' },
        { id: 16, name: 'Edit Attendance', slug: 'edit-attendance', module: 'attendance' },
        { id: 17, name: 'Approve Overtime', slug: 'approve-overtime', module: 'attendance' },
      ],
    },
    {
      name: 'Payroll Management',
      module: 'payroll',
      permissions: [
        { id: 18, name: 'View Payroll', slug: 'view-payroll', module: 'payroll' },
        { id: 19, name: 'Process Payroll', slug: 'process-payroll', module: 'payroll' },
        { id: 20, name: 'Approve Payroll', slug: 'approve-payroll', module: 'payroll' },
        { id: 21, name: 'View Payslips', slug: 'view-payslips', module: 'payroll' },
        { id: 22, name: 'Download Payslips', slug: 'download-payslips', module: 'payroll' },
      ],
    },
    {
      name: 'Performance Management',
      module: 'performance',
      permissions: [
        { id: 23, name: 'View Performance Reviews', slug: 'view-performance-reviews', module: 'performance' },
        { id: 24, name: 'Create Performance Reviews', slug: 'create-performance-reviews', module: 'performance' },
        { id: 25, name: 'Edit Performance Reviews', slug: 'edit-performance-reviews', module: 'performance' },
        { id: 26, name: 'Manage KPIs', slug: 'manage-kpis', module: 'performance' },
        { id: 27, name: 'Manage OKRs', slug: 'manage-okrs', module: 'performance' },
      ],
    },
    {
      name: 'Project Management',
      module: 'projects',
      permissions: [
        { id: 28, name: 'View Projects', slug: 'view-projects', module: 'projects' },
        { id: 29, name: 'Create Projects', slug: 'create-projects', module: 'projects' },
        { id: 30, name: 'Edit Projects', slug: 'edit-projects', module: 'projects' },
        { id: 31, name: 'Delete Projects', slug: 'delete-projects', module: 'projects' },
        { id: 32, name: 'Assign Tasks', slug: 'assign-tasks', module: 'projects' },
      ],
    },
    {
      name: 'Recruitment',
      module: 'recruitment',
      permissions: [
        { id: 33, name: 'View Job Postings', slug: 'view-job-postings', module: 'recruitment' },
        { id: 34, name: 'Create Job Postings', slug: 'create-job-postings', module: 'recruitment' },
        { id: 35, name: 'Edit Job Postings', slug: 'edit-job-postings', module: 'recruitment' },
        { id: 36, name: 'View Candidates', slug: 'view-candidates', module: 'recruitment' },
        { id: 37, name: 'Screen Candidates', slug: 'screen-candidates', module: 'recruitment' },
        { id: 38, name: 'Schedule Interviews', slug: 'schedule-interviews', module: 'recruitment' },
      ],
    },
  ]

  // Roles State
  const [roles, setRoles] = useState<Role[]>([
    {
      id: 1,
      name: 'Organization Administrator',
      slug: 'organization-admin',
      description: 'Full access to organization features',
      is_system_role: true,
      user_count: 12,
      permissions: hrModules.flatMap((m) => m.permissions),
    },
    {
      id: 2,
      name: 'HR Manager',
      slug: 'hr-manager',
      description: 'Manage HR operations and employee lifecycle',
      is_system_role: true,
      user_count: 8,
      permissions: [
        ...hrModules.find((m) => m.module === 'employees')?.permissions || [],
        ...hrModules.find((m) => m.module === 'leave')?.permissions || [],
        ...hrModules.find((m) => m.module === 'attendance')?.permissions || [],
      ],
    },
    {
      id: 3,
      name: 'Payroll Manager',
      slug: 'payroll-manager',
      description: 'Manage payroll processing and compensation',
      is_system_role: true,
      user_count: 5,
      permissions: hrModules.find((m) => m.module === 'payroll')?.permissions || [],
    },
    {
      id: 4,
      name: 'Custom Role',
      slug: 'custom-role',
      description: 'Custom role with specific permissions',
      is_system_role: false,
      user_count: 3,
      permissions: [],
    },
  ])

  // Employees State
  const [employees, setEmployees] = useState([
    {
      id: 1,
      name: 'Jane Doe',
      email: 'jane.doe@company.com',
      employee_number: 'EMP001',
      department: 'Human Resources',
      current_role: 'HR Manager',
      is_active: true,
    },
    {
      id: 2,
      name: 'John Smith',
      email: 'john.smith@company.com',
      employee_number: 'EMP002',
      department: 'Finance',
      current_role: 'Payroll Manager',
      is_active: true,
    },
    {
      id: 3,
      name: 'Amara Bello',
      email: 'amara.bello@company.com',
      employee_number: 'EMP003',
      department: 'IT',
      current_role: 'Organization Administrator',
      is_active: true,
    },
  ])

  // Modal states
  const [roleModalOpen, setRoleModalOpen] = useState(false)
  const [assignRoleModalOpen, setAssignRoleModalOpen] = useState(false)
  const [employeeAccessModalOpen, setEmployeeAccessModalOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null)

  // Filter states
  const [query, setQuery] = useState('')
  const [sortKey, setSortKey] = useState<string>('name')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
  const [page, setPage] = useState(1)
  const pageSize = 10

  // Filter and sort roles
  let filteredRoles = roles.filter((role) =>
    (role.name + role.slug + (role.description || '')).toLowerCase().includes(query.toLowerCase())
  )

  filteredRoles = filteredRoles.sort((a, b) => {
    const aVal = (a as any)[sortKey]
    const bVal = (b as any)[sortKey]
    const aStr = String(aVal || '').toLowerCase()
    const bStr = String(bVal || '').toLowerCase()
    if (aStr < bStr) return sortDir === 'asc' ? -1 : 1
    if (aStr > bStr) return sortDir === 'asc' ? 1 : -1
    return 0
  })

  // Filter and sort employees
  let filteredEmployees = employees.filter((emp) =>
    (emp.name + emp.email + (emp.employee_number || '')).toLowerCase().includes(query.toLowerCase())
  )

  filteredEmployees = filteredEmployees.sort((a, b) => {
    const aVal = (a as any)[sortKey]
    const bVal = (b as any)[sortKey]
    const aStr = String(aVal || '').toLowerCase()
    const bStr = String(bVal || '').toLowerCase()
    if (aStr < bStr) return sortDir === 'asc' ? -1 : 1
    if (aStr > bStr) return sortDir === 'asc' ? 1 : -1
    return 0
  })

  const currentItems = tab === 'roles' ? filteredRoles : filteredEmployees
  const pageCount = Math.max(1, Math.ceil(currentItems.length / pageSize))
  const pageItems = currentItems.slice((page - 1) * pageSize, page * pageSize)

  const toggleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const handleCreateRole = () => {
    setSelectedRole(null)
    setRoleModalOpen(true)
  }

  const handleEditRole = (role: Role) => {
    setSelectedRole(role)
    setRoleModalOpen(true)
  }

  const handleDeleteRole = (role: Role) => {
    setRoleToDelete(role)
    setDeleteDialogOpen(true)
  }

  const confirmDeleteRole = () => {
    if (roleToDelete?.id) {
      setRoles((prev) => prev.filter((r) => r.id !== roleToDelete.id))
      setDeleteDialogOpen(false)
      setRoleToDelete(null)
    }
  }

  const handleRoleSave = (data: { role: Partial<Role>; permissions: number[] }) => {
    if (selectedRole?.id) {
      setRoles((prev) =>
        prev.map((r) =>
          r.id === selectedRole.id
            ? {
                ...r,
                ...data.role,
                permissions: hrModules.flatMap((m) => m.permissions).filter((p) => data.permissions.includes(p.id)),
              }
            : r
        )
      )
    } else {
      const newRole: Role = {
        id: Date.now(),
        name: data.role.name!,
        slug: data.role.slug!,
        description: data.role.description,
        is_system_role: data.role.is_system_role || false,
        user_count: 0,
        permissions: hrModules.flatMap((m) => m.permissions).filter((p) => data.permissions.includes(p.id)),
      }
      setRoles((prev) => [...prev, newRole])
    }
    setRoleModalOpen(false)
    setSelectedRole(null)
  }

  const handleAssignRole = (employeeId: number, roleId: number) => {
    setEmployees((prev) =>
      prev.map((emp) => {
        if (emp.id === employeeId) {
          const role = roles.find((r) => r.id === roleId)
          return { ...emp, current_role: role?.name || 'Unknown' }
        }
        return emp
      })
    )
  }

  const handlePasswordChange = (employeeId: number, oldPassword: string, newPassword: string, confirmPassword: string) => {
    // In real app, this would call an API
    console.log('Password change for employee:', employeeId)
    alert('Password changed successfully')
  }

  const handleDisableEmployee = (employeeId: number, action: 'disable' | 'archive' | 'delete', timeline?: string) => {
    if (action === 'delete') {
      setEmployees((prev) => prev.filter((emp) => emp.id !== employeeId))
    } else {
      setEmployees((prev) =>
        prev.map((emp) => (emp.id === employeeId ? { ...emp, is_active: false } : emp))
      )
    }
    alert(`Employee ${action === 'delete' ? 'deleted' : action === 'archive' ? 'archived' : 'disabled'} successfully`)
  }

  const handleManageAccess = (employee: any) => {
    setSelectedEmployee(employee)
    setEmployeeAccessModalOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">HRIS Roles & Permissions</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage HRIS roles, permissions, and employee access
          </p>
        </div>
        {tab === 'roles' && (
          <Button onClick={handleCreateRole} style={{ backgroundColor: '#4469e5' }} className="text-white">
            <Plus className="h-4 w-4 mr-2" /> Create HRIS Role
          </Button>
        )}
        {tab === 'assign-roles' && (
          <Button
            onClick={() => setAssignRoleModalOpen(true)}
            style={{ backgroundColor: '#4469e5' }}
            className="text-white"
          >
            <Plus className="h-4 w-4 mr-2" /> Assign Role to Employee
          </Button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b">
        {[
          { key: 'roles', label: 'Manage HRIS Roles', icon: Shield },
          { key: 'assign-roles', label: 'Assign Roles to Employees', icon: Users },
          { key: 'employee-access', label: 'Manage Employee Access', icon: Key },
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
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                tab === 'roles'
                  ? 'Search roles by name, slug, or description'
                  : 'Search employees by name, email, or employee number'
              }
              className="pl-9"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-md bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              {tab === 'roles' ? (
                <>
                  <TableHead>
                    <button onClick={() => toggleSort('name')} className="inline-flex items-center gap-1">
                      Role Name <ChevronsUpDown className="h-3 w-3" />
                    </button>
                  </TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Permissions</TableHead>
                  <TableHead>
                    <button onClick={() => toggleSort('user_count')} className="inline-flex items-center gap-1">
                      Users <ChevronsUpDown className="h-3 w-3" />
                    </button>
                  </TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </>
              ) : (
                <>
                  <TableHead>
                    <button onClick={() => toggleSort('name')} className="inline-flex items-center gap-1">
                      Employee Name <ChevronsUpDown className="h-3 w-3" />
                    </button>
                  </TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Employee ID</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Current Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageItems.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={tab === 'roles' ? 7 : 7}
                  className="text-center py-8 text-gray-500"
                >
                  {tab === 'roles' ? (
                    <Shield className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  ) : (
                    <Users className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  )}
                  <p>No {tab === 'roles' ? 'roles' : 'employees'} found</p>
                  <p className="text-xs mt-1">
                    {query ? 'Try adjusting your search' : tab === 'roles' ? 'Create your first role to get started' : 'No employees available'}
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              pageItems.map((item: any) => (
                <TableRow key={item.id}>
                  {tab === 'roles' ? (
                    <>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-gray-400" />
                          {item.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {item.slug}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs truncate" title={item.description}>
                          {item.description || '—'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-600">
                          {item.permissions?.length || 0} permissions
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm font-medium">{item.user_count || 0} users</span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={item.is_system_role ? 'default' : 'outline'}
                          className={item.is_system_role ? 'bg-blue-100 text-blue-700' : ''}
                        >
                          {item.is_system_role ? 'System' : 'Custom'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditRole(item)}
                            title="Edit role"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          {!item.is_system_role && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteRole(item)}
                              title="Delete role"
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {item.employee_number || '—'}
                        </Badge>
                      </TableCell>
                      <TableCell>{item.department || '—'}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{item.current_role || 'No role'}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={item.is_active ? 'default' : 'outline'}
                          className={item.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}
                        >
                          {item.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          {tab === 'assign-roles' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedEmployee(item)
                                setAssignRoleModalOpen(true)
                              }}
                              title="Assign role"
                            >
                              <Users className="h-4 w-4" />
                            </Button>
                          )}
                          {tab === 'employee-access' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleManageAccess(item)}
                              title="Manage access"
                            >
                              <Key className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        {pageCount > 1 && (
          <div className="flex items-center justify-between px-3 py-2 border-t text-sm">
            <div className="text-xs text-gray-600">
              Showing {pageItems.length > 0 ? (page - 1) * pageSize + 1 : 0}–
              {(page - 1) * pageSize + pageItems.length} of {currentItems.length}{' '}
              {tab === 'roles' ? 'roles' : 'employees'}
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
      </div>

      {/* Modals */}
      <RoleModal
        open={roleModalOpen}
        onClose={() => {
          setRoleModalOpen(false)
          setSelectedRole(null)
        }}
        onSave={handleRoleSave}
        initial={selectedRole}
        hrModules={hrModules}
        selectedPermissions={selectedRole?.permissions?.map((p) => p.id) || []}
      />

      <AssignRoleModal
        open={assignRoleModalOpen}
        onClose={() => {
          setAssignRoleModalOpen(false)
          setSelectedEmployee(null)
        }}
        onAssign={handleAssignRole}
        employees={employees}
        roles={roles}
        selectedEmployee={selectedEmployee}
      />

      <EmployeeAccessModal
        open={employeeAccessModalOpen}
        onClose={() => {
          setEmployeeAccessModalOpen(false)
          setSelectedEmployee(null)
        }}
        onPasswordChange={handlePasswordChange}
        onDisable={handleDisableEmployee}
        employee={selectedEmployee}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete HRIS Role</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{roleToDelete?.name}</strong>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setRoleToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteRole} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default RolesPermissionsPage

