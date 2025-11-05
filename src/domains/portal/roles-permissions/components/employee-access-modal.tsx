import { X, Key, UserX, Shield } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Input } from '@/common/components/ui/input'
import { Label } from '@/common/components/ui/label'
import { Button } from '@/common/components/ui/button'
import { Textarea } from '@/common/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/common/components/ui/select'
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

interface Employee {
  id: number
  name: string
  email: string
  employee_number?: string
  is_active: boolean
}

interface EmployeeAccessModalProps {
  open: boolean
  onClose: () => void
  onPasswordChange: (employeeId: number, oldPassword: string, newPassword: string, confirmPassword: string) => void
  onDisable: (employeeId: number, action: 'disable' | 'archive' | 'delete', timeline?: string) => void
  employee: Employee | null
}

const EmployeeAccessModal = ({
  open,
  onClose,
  onPasswordChange,
  onDisable,
  employee,
}: EmployeeAccessModalProps) => {
  const [activeTab, setActiveTab] = useState<'password' | 'disable'>('password')
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [disableAction, setDisableAction] = useState<'disable' | 'archive' | 'delete'>('disable')
  const [disableTimeline, setDisableTimeline] = useState('')
  const [showDisableConfirm, setShowDisableConfirm] = useState(false)

  useEffect(() => {
    if (open && employee) {
      setOldPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setDisableAction('disable')
      setDisableTimeline('')
    }
  }, [open, employee])

  if (!open || !employee) return null

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      alert('New passwords do not match')
      return
    }
    if (newPassword.length < 8) {
      alert('Password must be at least 8 characters')
      return
    }
    onPasswordChange(employee.id, oldPassword, newPassword, confirmPassword)
    setOldPassword('')
    setNewPassword('')
    setConfirmPassword('')
  }

  const handleDisableSubmit = () => {
    setShowDisableConfirm(true)
  }

  const confirmDisable = () => {
    onDisable(employee.id, disableAction, disableTimeline)
    setShowDisableConfirm(false)
    onClose()
  }

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="w-full max-w-2xl rounded-lg bg-white shadow-xl max-h-[90vh] overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <h3 className="font-medium text-lg">Manage Employee Access</h3>
            <button
              onClick={onClose}
              className="h-8 w-8 grid place-items-center rounded-md hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {/* Employee Info */}
            <div className="p-4 border-b bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium">{employee.name}</div>
                  <div className="text-sm text-gray-600">{employee.email}</div>
                  {employee.employee_number && (
                    <div className="text-xs text-gray-500">ID: {employee.employee_number}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-2 border-b px-4">
              <button
                onClick={() => setActiveTab('password')}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'password'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <Key className="h-4 w-4 inline mr-2" />
                Change Password
              </button>
              <button
                onClick={() => setActiveTab('disable')}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'disable'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <UserX className="h-4 w-4 inline mr-2" />
                Disable Employee
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-4">
              {activeTab === 'password' ? (
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">
                      Username / Unique ID
                    </Label>
                    <Input
                      id="username"
                      value={employee.email}
                      disabled
                      className="bg-gray-50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="oldPassword">
                      Old Password <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="oldPassword"
                      type="password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      placeholder="Enter current password"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword">
                      New Password <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password (min 8 characters)"
                      required
                      minLength={8}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">
                      Confirm New Password <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      required
                      minLength={8}
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={onClose}>
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={!oldPassword || !newPassword || !confirmPassword}
                      style={{ backgroundColor: '#4469e5' }}
                      className="text-white"
                    >
                      Save Changes
                    </Button>
                  </div>
                </form>
              ) : (
                <form onSubmit={(e) => { e.preventDefault(); handleDisableSubmit(); }} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="disableAction">Action</Label>
                    <Select value={disableAction} onValueChange={(value: any) => setDisableAction(value)}>
                      <SelectTrigger id="disableAction">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="disable">Disable (Suspend Access)</SelectItem>
                        <SelectItem value="archive">Archive (Keep Data)</SelectItem>
                        <SelectItem value="delete">Permanently Delete</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timeline">Timeline (Optional)</Label>
                    <Input
                      id="timeline"
                      type="date"
                      value={disableTimeline}
                      onChange={(e) => setDisableTimeline(e.target.value)}
                      placeholder="Set date of last access"
                    />
                    <p className="text-xs text-gray-500">
                      Leave empty for immediate action. Set a future date to schedule.
                    </p>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-md p-3">
                    <p className="text-sm text-amber-800">
                      <strong>Warning:</strong> {disableAction === 'delete' 
                        ? 'This action is permanent and cannot be undone. All employee data will be permanently deleted.'
                        : disableAction === 'archive'
                        ? 'This will archive the employee. Data will be preserved but access will be revoked.'
                        : 'This will disable the employee\'s access. They will not be able to log in until reactivated.'}
                    </p>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={onClose}>
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="destructive"
                      className="bg-red-600 hover:bg-red-700"
                    >
                      {disableAction === 'delete' ? 'Delete Employee' : disableAction === 'archive' ? 'Archive Employee' : 'Disable Employee'}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Disable Confirmation Dialog */}
      <AlertDialog open={showDisableConfirm} onOpenChange={setShowDisableConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Confirm {disableAction === 'delete' ? 'Delete' : disableAction === 'archive' ? 'Archive' : 'Disable'} Employee
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to {disableAction} <strong>{employee.name}</strong>?
              {disableAction === 'delete' && ' This action cannot be undone.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDisableConfirm(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDisable} className="bg-red-600 hover:bg-red-700">
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default EmployeeAccessModal

