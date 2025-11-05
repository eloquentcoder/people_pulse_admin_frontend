import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { X, User, Loader2, Building2, Shield, Save } from 'lucide-react';
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import { Label } from '@/common/components/ui/label';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/common/components/ui/dialog';
import { 
  useCreateUserMutation,
  useUpdateUserMutation,
  useGetOrganizationsQuery,
  useGetRolesQuery
} from '../apis/user.api';
import type { User, CreateUserData, UpdateUserData } from '../models/user.model';
import { toast } from 'sonner';

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  user?: User | null;
}

const validationSchema = Yup.object({
  organization_id: Yup.number().required('Organization is required'),
  first_name: Yup.string().required('First name is required').max(255, 'First name must be less than 255 characters'),
  last_name: Yup.string().required('Last name is required').max(255, 'Last name must be less than 255 characters'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string()
    .when('user', {
      is: (user: User | null | undefined) => !user,
      then: (schema) => schema.min(8, 'Password must be at least 8 characters').required('Password is required'),
      otherwise: (schema) => schema.min(8, 'Password must be at least 8 characters'),
    }),
  user_type: Yup.string()
    .oneOf(['platform_admin', 'organization_admin', 'employee'], 'Invalid user type')
    .required('User type is required'),
  is_active: Yup.boolean(),
  role_ids: Yup.array().of(Yup.number()),
});

export const UserFormModal = ({ isOpen, onClose, onSuccess, user }: UserFormModalProps) => {
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const { data: organizationsData } = useGetOrganizationsQuery();
  const { data: rolesData } = useGetRolesQuery();

  const isLoading = isCreating || isUpdating;

  const formik = useFormik<CreateUserData & { role_ids?: number[] }>({
    initialValues: {
      organization_id: user?.organization_id || 0,
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      email: user?.email || '',
      password: '',
      user_type: user?.user_type || 'employee',
      is_active: user?.is_active ?? true,
      role_ids: user?.roles?.map(r => r.id) || [],
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        if (user) {
          // Update existing user
          const updateData: UpdateUserData = {
            organization_id: values.organization_id,
            first_name: values.first_name,
            last_name: values.last_name,
            email: values.email,
            user_type: values.user_type,
            is_active: values.is_active,
            role_ids: values.role_ids,
          };
          
          // Only include password if it's been changed
          if (values.password && values.password.length > 0) {
            updateData.password = values.password;
          }

          await updateUser({
            id: user.id,
            data: updateData,
          }).unwrap();
          toast.success('User updated successfully');
        } else {
          // Create new user
          const createData: CreateUserData = {
            organization_id: values.organization_id,
            first_name: values.first_name,
            last_name: values.last_name,
            email: values.email,
            password: values.password!,
            user_type: values.user_type,
            is_active: values.is_active,
            role_ids: values.role_ids,
          };

          await createUser(createData).unwrap();
          toast.success('User created successfully');
        }

        onSuccess?.();
        onClose();
        formik.resetForm();
      } catch (error: any) {
        console.error('Failed to save user:', error);
        toast.error(error?.data?.message || error?.message || 'Failed to save user');
      }
    },
  });

  useEffect(() => {
    if (user && isOpen) {
      formik.setValues({
        organization_id: user.organization_id || 0,
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        password: '',
        user_type: user.user_type || 'employee',
        is_active: user.is_active ?? true,
        role_ids: user.roles?.map(r => r.id) || [],
      });
    } else if (!user && isOpen) {
      formik.resetForm();
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  const organizations = organizationsData?.data || [];
  const roles = rolesData?.data || [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white">
            {user ? 'Edit User' : 'Create New User'}
          </DialogTitle>
          <DialogDescription>
            {user ? 'Update user information and permissions.' : 'Add a new user to the platform.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">First Name *</Label>
                <Input
                  id="first_name"
                  name="first_name"
                  value={formik.values.first_name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="John"
                  disabled={isLoading}
                />
                {formik.touched.first_name && formik.errors.first_name && (
                  <p className="text-sm text-destructive">{formik.errors.first_name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name *</Label>
                <Input
                  id="last_name"
                  name="last_name"
                  value={formik.values.last_name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Doe"
                  disabled={isLoading}
                />
                {formik.touched.last_name && formik.errors.last_name && (
                  <p className="text-sm text-destructive">{formik.errors.last_name}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="john.doe@example.com"
                disabled={isLoading}
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-sm text-destructive">{formik.errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">
                Password {user ? '(leave blank to keep current)' : '*'}
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder={user ? "Enter new password" : "Minimum 8 characters"}
                disabled={isLoading}
              />
              {formik.touched.password && formik.errors.password && (
                <p className="text-sm text-destructive">{formik.errors.password}</p>
              )}
            </div>
          </div>

          {/* Organization & User Type */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Organization & Type</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="organization_id">Organization *</Label>
                <select
                  id="organization_id"
                  name="organization_id"
                  value={formik.values.organization_id}
                  onChange={(e) => formik.setFieldValue('organization_id', Number(e.target.value))}
                  onBlur={formik.handleBlur}
                  disabled={isLoading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4469e5] focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                >
                  <option value={0}>Select Organization</option>
                  {organizations.map((org) => (
                    <option key={org.id} value={org.id}>
                      {org.name}
                    </option>
                  ))}
                </select>
                {formik.touched.organization_id && formik.errors.organization_id && (
                  <p className="text-sm text-destructive">{formik.errors.organization_id}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="user_type">User Type *</Label>
                <select
                  id="user_type"
                  name="user_type"
                  value={formik.values.user_type}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={isLoading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4469e5] focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                >
                  <option value="employee">Employee</option>
                  <option value="organization_admin">Organization Admin</option>
                  <option value="platform_admin">Platform Admin</option>
                </select>
                {formik.touched.user_type && formik.errors.user_type && (
                  <p className="text-sm text-destructive">{formik.errors.user_type}</p>
                )}
              </div>
            </div>
          </div>

          {/* Roles */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Roles & Permissions</h3>
            <div className="space-y-2">
              <Label>Assign Roles</Label>
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 max-h-48 overflow-y-auto">
                {roles.length > 0 ? (
                  <div className="space-y-2">
                    {roles.map((role) => (
                      <label
                        key={role.id}
                        className="flex items-center gap-2 p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={formik.values.role_ids?.includes(role.id) || false}
                          onChange={(e) => {
                            const currentRoleIds = formik.values.role_ids || [];
                            if (e.target.checked) {
                              formik.setFieldValue('role_ids', [...currentRoleIds, role.id]);
                            } else {
                              formik.setFieldValue(
                                'role_ids',
                                currentRoleIds.filter((id) => id !== role.id)
                              );
                            }
                          }}
                          disabled={isLoading}
                          className="rounded border-gray-300 text-[#4469e5] focus:ring-[#4469e5]"
                        />
                        <span className="text-sm text-gray-900 dark:text-white">{role.name}</span>
                        {role.description && (
                          <span className="text-xs text-gray-500 dark:text-gray-400 ml-auto">
                            {role.description}
                          </span>
                        )}
                      </label>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                    No roles available
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Status</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formik.values.is_active}
                  onChange={(e) => formik.setFieldValue('is_active', e.target.checked)}
                  disabled={isLoading}
                  className="rounded border-gray-300 text-[#4469e5] focus:ring-[#4469e5]"
                />
                <span className="text-sm text-gray-900 dark:text-white">Active User</span>
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Inactive users cannot log in to the platform
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-[#4469e5] hover:bg-[#4469e5]/90"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {user ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {user ? 'Update User' : 'Create User'}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

