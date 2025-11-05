import { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from '@/common/components/ui/dialog';
import { Button } from '@/common/components/ui/button';
import { Badge } from '@/common/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/common/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/common/components/ui/tabs';
import { 
  useGetUserQuery,
  useGetUserActivityLogsQuery,
  useActivateUserMutation,
  useDeactivateUserMutation,
  useResetPasswordMutation
} from '../apis/user.api';
import type { User } from '../models/user.model';
import { 
  User as UserIcon,
  Building2,
  Shield,
  User as EmployeeIcon,
  CheckCircle,
  XCircle,
  Clock,
  Key,
  Activity,
  Edit,
  UserCheck,
  UserX,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Briefcase
} from 'lucide-react';
import { toast } from 'sonner';

interface UserDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (user: User) => void;
  user: User | null;
}

export const UserDetailsModal = ({ isOpen, onClose, onEdit, user }: UserDetailsModalProps) => {
  const [activeTab, setActiveTab] = useState('overview');
  
  const { data: userData, isLoading } = useGetUserQuery(user?.id || 0, {
    skip: !user?.id
  });
  
  const { data: activityData } = useGetUserActivityLogsQuery(user?.id || 0, {
    skip: !user?.id
  });
  
  const [activateUser] = useActivateUserMutation();
  const [deactivateUser] = useDeactivateUserMutation();
  const [resetPassword] = useResetPasswordMutation();

  const currentUser = userData?.data || user;

  const handleActivate = async () => {
    if (!currentUser) return;
    try {
      await activateUser(currentUser.id).unwrap();
      toast.success('User activated successfully');
    } catch (error) {
      console.error('Failed to activate user:', error);
      toast.error('Failed to activate user');
    }
  };

  const handleDeactivate = async () => {
    if (!currentUser) return;
    try {
      await deactivateUser(currentUser.id).unwrap();
      toast.success('User deactivated successfully');
    } catch (error) {
      console.error('Failed to deactivate user:', error);
      toast.error('Failed to deactivate user');
    }
  };

  const handleResetPassword = async () => {
    if (!currentUser) return;
    const newPassword = prompt('Enter new password (minimum 8 characters):');
    if (newPassword && newPassword.length >= 8) {
      try {
        await resetPassword({ id: currentUser.id, password: newPassword }).unwrap();
        toast.success('Password reset successfully');
      } catch (error) {
        console.error('Failed to reset password:', error);
        toast.error('Failed to reset password');
      }
    } else if (newPassword) {
      toast.error('Password must be at least 8 characters long');
    }
  };

  const getUserTypeBadge = (userType: string) => {
    switch (userType) {
      case 'platform_admin':
        return <Badge variant="default" className="bg-purple-100 text-purple-800"><Shield className="w-3 h-3 mr-1" />Platform Admin</Badge>;
      case 'organization_admin':
        return <Badge variant="default" className="bg-blue-100 text-blue-800"><Building2 className="w-3 h-3 mr-1" />Org Admin</Badge>;
      case 'employee':
        return <Badge variant="outline" className="text-green-600"><EmployeeIcon className="w-3 h-3 mr-1" />Employee</Badge>;
      default:
        return <Badge variant="outline">{userType}</Badge>;
    }
  };

  const getStatusBadge = (isActive: boolean) => {
    if (isActive) {
      return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Active</Badge>;
    } else {
      return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Inactive</Badge>;
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4469e5] mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading user details...</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!currentUser) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                User Details
              </DialogTitle>
              <DialogDescription>
                View and manage user information, roles, and activity
              </DialogDescription>
            </div>
            <div className="flex items-center gap-2">
              {currentUser.is_active ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDeactivate}
                  className="text-orange-600 hover:text-orange-700"
                >
                  <UserX className="w-4 h-4 mr-1" />
                  Deactivate
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleActivate}
                  className="text-green-600 hover:text-green-700"
                >
                  <UserCheck className="w-4 h-4 mr-1" />
                  Activate
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(currentUser)}
                className="text-blue-600 hover:text-blue-700"
              >
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </Button>
            </div>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* User Profile */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#4469e5] to-[#ee9807] flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                    {getInitials(currentUser.first_name, currentUser.last_name)}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {currentUser.full_name}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">{currentUser.email}</p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Building2 className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Organization</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {currentUser.organization?.name || 'No Organization'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <UserIcon className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">User Type</p>
                      <div className="mt-1">
                        {getUserTypeBadge(currentUser.user_type)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Status</p>
                      <div className="mt-1">
                        {getStatusBadge(currentUser.is_active)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Created</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(currentUser.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {currentUser.employee && (
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Employee Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3">
                        <Briefcase className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Position</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {currentUser.employee.position || 'Not specified'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Building2 className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Department</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {currentUser.employee.department || 'Not specified'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="roles" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Roles & Permissions</CardTitle>
                <CardDescription>
                  User roles and associated permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {currentUser.roles && currentUser.roles.length > 0 ? (
                  <div className="space-y-4">
                    {currentUser.roles.map((role) => (
                      <div key={role.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-900 dark:text-white">{role.name}</h4>
                          <Badge variant="outline">{role.slug}</Badge>
                        </div>
                        {role.description && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                            {role.description}
                          </p>
                        )}
                        {role.permissions && role.permissions.length > 0 && (
                          <div>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Permissions:</p>
                            <div className="flex flex-wrap gap-2">
                              {role.permissions.map((permission) => (
                                <Badge key={permission.id} variant="secondary" className="text-xs">
                                  {permission.name}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">No roles assigned</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Activity Logs</CardTitle>
                <CardDescription>
                  Recent user activity and session information
                </CardDescription>
              </CardHeader>
              <CardContent>
                {activityData?.data?.sessions && activityData.data.sessions.length > 0 ? (
                  <div className="space-y-4">
                    {activityData.data.sessions.map((session: any) => (
                      <div key={session.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Activity className="w-4 h-4 text-gray-400" />
                            <span className="font-medium text-gray-900 dark:text-white">
                              Session {session.id}
                            </span>
                            {session.is_active && (
                              <Badge variant="default" className="bg-green-100 text-green-800">
                                Active
                              </Badge>
                            )}
                          </div>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(session.last_activity).toLocaleString()}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="font-medium text-gray-700 dark:text-gray-300">IP Address</p>
                            <p className="text-gray-500 dark:text-gray-400">{session.ip_address}</p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-700 dark:text-gray-300">User Agent</p>
                            <p className="text-gray-500 dark:text-gray-400 truncate">{session.user_agent}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">No activity logs found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="outline"
            onClick={handleResetPassword}
            className="text-orange-600 hover:text-orange-700"
          >
            <Key className="w-4 h-4 mr-1" />
            Reset Password
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};


