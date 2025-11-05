import { X, Search } from 'lucide-react'
import { useState } from 'react'
import { Input } from '@/common/components/ui/input'
import { Label } from '@/common/components/ui/label'
import { Button } from '@/common/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/common/components/ui/select'
import type { Role } from '../models/role.model'

interface Employee {
  id: number
  name: string
  email: string
  employee_number?: string
  department?: string
  current_role?: string
}

interface AssignRoleModalProps {
  open: boolean
  onClose: () => void
  onAssign: (employeeId: number, roleId: number) => void
  employees: Employee[]
  roles: Role[]
  selectedEmployee?: Employee | null
}

const AssignRoleModal = ({ open, onClose, onAssign, employees, roles, selectedEmployee }: AssignRoleModalProps) => {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>(
    selectedEmployee?.id.toString() || ''
  )
  const [selectedRoleId, setSelectedRoleId] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState('')

  if (!open) return null

  const filteredEmployees = employees.filter((emp) =>
    (emp.name + emp.email + (emp.employee_number || '')).toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedEmployeeId && selectedRoleId) {
      onAssign(parseInt(selectedEmployeeId), parseInt(selectedRoleId))
      onClose()
      setSelectedEmployeeId('')
      setSelectedRoleId('')
      setSearchQuery('')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-2xl rounded-lg bg-white shadow-xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h3 className="font-medium text-lg">Assign HRIS Role to Employee</h3>
          <button
            onClick={onClose}
            className="h-8 w-8 grid place-items-center rounded-md hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search Employee</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, email, or employee number"
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="employee">
                Select Employee <span className="text-red-500">*</span>
              </Label>
              <Select value={selectedEmployeeId} onValueChange={setSelectedEmployeeId} required>
                <SelectTrigger id="employee">
                  <SelectValue placeholder="Select an employee" />
                </SelectTrigger>
                <SelectContent>
                  {filteredEmployees.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id.toString()}>
                      <div className="flex flex-col">
                        <span className="font-medium">{employee.name}</span>
                        <span className="text-xs text-gray-500">{employee.email}</span>
                        {employee.current_role && (
                          <span className="text-xs text-blue-600">Current: {employee.current_role}</span>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">
                Select HRIS Role <span className="text-red-500">*</span>
              </Label>
              <Select value={selectedRoleId} onValueChange={setSelectedRoleId} required>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.id.toString()}>
                      <div className="flex flex-col">
                        <span className="font-medium">{role.name}</span>
                        {role.description && (
                          <span className="text-xs text-gray-500">{role.description}</span>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 px-4 py-3 border-t bg-gray-50">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!selectedEmployeeId || !selectedRoleId}
              style={{ backgroundColor: '#4469e5' }}
              className="text-white"
            >
              Assign Role
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AssignRoleModal

