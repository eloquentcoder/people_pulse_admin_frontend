import { useFormik } from 'formik';
import * as Yup from 'yup';
import { X } from 'lucide-react';
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import { Label } from '@/common/components/ui/label';
import { useOnboardAdminMutation } from '../apis/organization.api';
import { toast } from 'sonner';

interface OnboardAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  organizationId: number;
}

const validationSchema = Yup.object({
  first_name: Yup.string().required('First name is required').max(255, 'First name must be less than 255 characters'),
  last_name: Yup.string().required('Last name is required').max(255, 'Last name must be less than 255 characters'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
  phone: Yup.string().max(20, 'Phone must be less than 20 characters'),
});

const initialValues = {
  first_name: '',
  last_name: '',
  email: '',
  password: '',
  phone: '',
};

export const OnboardAdminModal = ({ isOpen, onClose, onSuccess, organizationId }: OnboardAdminModalProps) => {
  const [onboardAdmin, { isLoading }] = useOnboardAdminMutation();

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      try {
        await onboardAdmin({
          id: organizationId,
          data: values
        }).unwrap();

        onSuccess?.();
        onClose();
        formik.resetForm();
        toast.success('Admin onboarded successfully');
      } catch (error) {
        console.error('Failed to onboard admin:', error);
        toast.error('Failed to onboard admin');
      }
    },
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Onboard Organization Admin</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <form onSubmit={formik.handleSubmit} className="p-6 space-y-6">
          {/* Admin Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Admin Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="first_name">First Name *</Label>
                <Input
                  id="first_name"
                  name="first_name"
                  value={formik.values.first_name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={formik.touched.first_name && formik.errors.first_name ? 'border-red-500' : ''}
                  placeholder="John"
                />
                {formik.touched.first_name && formik.errors.first_name && (
                  <p className="text-sm text-red-500 mt-1">{formik.errors.first_name}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="last_name">Last Name *</Label>
                <Input
                  id="last_name"
                  name="last_name"
                  value={formik.values.last_name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={formik.touched.last_name && formik.errors.last_name ? 'border-red-500' : ''}
                  placeholder="Doe"
                />
                {formik.touched.last_name && formik.errors.last_name && (
                  <p className="text-sm text-red-500 mt-1">{formik.errors.last_name}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={formik.touched.email && formik.errors.email ? 'border-red-500' : ''}
                  placeholder="admin@organization.com"
                />
                {formik.touched.email && formik.errors.email && (
                  <p className="text-sm text-red-500 mt-1">{formik.errors.email}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={formik.touched.phone && formik.errors.phone ? 'border-red-500' : ''}
                  placeholder="+1 (555) 123-4567"
                />
                {formik.touched.phone && formik.errors.phone && (
                  <p className="text-sm text-red-500 mt-1">{formik.errors.phone}</p>
                )}
              </div>
              
              <div className="md:col-span-2">
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={formik.touched.password && formik.errors.password ? 'border-red-500' : ''}
                  placeholder="Enter secure password"
                />
                {formik.touched.password && formik.errors.password && (
                  <p className="text-sm text-red-500 mt-1">{formik.errors.password}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">Password must be at least 8 characters long</p>
              </div>
            </div>
          </div>

          {/* Admin Role Information */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">Admin Role</h4>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              This user will be assigned the "Organization Admin" role with full administrative privileges 
              for this organization, including user management, settings, and billing access.
            </p>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
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
              className="bg-[#4469e5] hover:bg-[#3a5bc7]"
            >
              {isLoading ? 'Onboarding...' : 'Onboard Admin'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
