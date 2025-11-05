import { useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { X } from 'lucide-react';
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import { Label } from '@/common/components/ui/label';
import { useUpdateOrganizationMutation } from '../apis/organization.api';
import { toast } from 'sonner';
import type { Organization } from '../models/organization.model';

interface EditOrganizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  organization: Organization | null;
}

const validationSchema = Yup.object({
  name: Yup.string().required('Organization name is required').max(255, 'Name must be less than 255 characters'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  phone: Yup.string().max(20, 'Phone must be less than 20 characters'),
  address: Yup.string().max(500, 'Address must be less than 500 characters'),
  city: Yup.string().max(100, 'City must be less than 100 characters'),
  state: Yup.string().max(100, 'State must be less than 100 characters'),
  country: Yup.string().max(100, 'Country must be less than 100 characters'),
  postal_code: Yup.string().max(20, 'Postal code must be less than 20 characters'),
  website: Yup.string().url('Invalid website URL'),
  industry: Yup.string().required('Industry is required'),
  company_size: Yup.string().required('Company size is required'),
  description: Yup.string().max(1000, 'Description must be less than 1000 characters'),
  status: Yup.string().oneOf(['active', 'inactive', 'suspended'], 'Invalid status').required('Status is required'),
});

const industryOptions = [
  'Technology',
  'Healthcare',
  'Finance',
  'Education',
  'Manufacturing',
  'Retail',
  'Real Estate',
  'Consulting',
  'Media & Entertainment',
  'Transportation',
  'Energy',
  'Government',
  'Non-Profit',
  'Other'
];

const companySizeOptions = [
  '1-10',
  '11-50',
  '51-200',
  '201-500',
  '501-1000',
  '1001-5000',
  '5000+'
];

export const EditOrganizationModal = ({ isOpen, onClose, onSuccess, organization }: EditOrganizationModalProps) => {
  const [updateOrganization, { isLoading }] = useUpdateOrganizationMutation();

  const formik = useFormik({
    initialValues: {
      name: organization?.name || '',
      email: organization?.email || '',
      phone: organization?.phone || '',
      address: organization?.address || '',
      city: organization?.city || '',
      state: organization?.state || '',
      country: organization?.country || '',
      postal_code: organization?.postal_code || '',
      website: organization?.website || '',
      industry: organization?.industry || '',
      company_size: organization?.company_size || '',
      description: organization?.description || '',
      status: organization?.status || 'active',
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      if (!organization) return;

      try {
        await updateOrganization({
          id: organization.id,
          data: values
        }).unwrap();

        onSuccess?.();
        onClose();
        formik.resetForm();
        toast.success('Organization updated successfully');
      } catch (error) {
        console.error('Failed to update organization:', error);
        toast.error('Failed to update organization');
      }
    },
  });

  useEffect(() => {
    if (organization && isOpen) {
      formik.setValues({
        name: organization.name || '',
        email: organization.email || '',
        phone: organization.phone || '',
        address: organization.address || '',
        city: organization.city || '',
        state: organization.state || '',
        country: organization.country || '',
        postal_code: organization.postal_code || '',
        website: organization.website || '',
        industry: organization.industry || '',
        company_size: organization.company_size || '',
        description: organization.description || '',
        status: organization.status || 'active',
      });
    }
  }, [organization, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Edit Organization</h2>
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
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Organization Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={formik.touched.name && formik.errors.name ? 'border-red-500' : ''}
                  placeholder="Acme Corporation"
                />
                {formik.touched.name && formik.errors.name && (
                  <p className="text-sm text-red-500 mt-1">{formik.errors.name}</p>
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
                  placeholder="contact@organization.com"
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
              
              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  name="website"
                  value={formik.values.website}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={formik.touched.website && formik.errors.website ? 'border-red-500' : ''}
                  placeholder="https://www.organization.com"
                />
                {formik.touched.website && formik.errors.website && (
                  <p className="text-sm text-red-500 mt-1">{formik.errors.website}</p>
                )}
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Address Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="address">Street Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={formik.values.address}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={formik.touched.address && formik.errors.address ? 'border-red-500' : ''}
                  placeholder="123 Main Street"
                />
                {formik.touched.address && formik.errors.address && (
                  <p className="text-sm text-red-500 mt-1">{formik.errors.address}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  name="city"
                  value={formik.values.city}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={formik.touched.city && formik.errors.city ? 'border-red-500' : ''}
                  placeholder="New York"
                />
                {formik.touched.city && formik.errors.city && (
                  <p className="text-sm text-red-500 mt-1">{formik.errors.city}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="state">State/Province</Label>
                <Input
                  id="state"
                  name="state"
                  value={formik.values.state}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={formik.touched.state && formik.errors.state ? 'border-red-500' : ''}
                  placeholder="NY"
                />
                {formik.touched.state && formik.errors.state && (
                  <p className="text-sm text-red-500 mt-1">{formik.errors.state}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  name="country"
                  value={formik.values.country}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={formik.touched.country && formik.errors.country ? 'border-red-500' : ''}
                  placeholder="United States"
                />
                {formik.touched.country && formik.errors.country && (
                  <p className="text-sm text-red-500 mt-1">{formik.errors.country}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="postal_code">Postal Code</Label>
                <Input
                  id="postal_code"
                  name="postal_code"
                  value={formik.values.postal_code}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={formik.touched.postal_code && formik.errors.postal_code ? 'border-red-500' : ''}
                  placeholder="10001"
                />
                {formik.touched.postal_code && formik.errors.postal_code && (
                  <p className="text-sm text-red-500 mt-1">{formik.errors.postal_code}</p>
                )}
              </div>
            </div>
          </div>

          {/* Business Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Business Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="industry">Industry *</Label>
                <select
                  id="industry"
                  name="industry"
                  value={formik.values.industry}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4469e5] focus:border-transparent ${
                    formik.touched.industry && formik.errors.industry ? 'border-red-500' : ''
                  }`}
                >
                  <option value="">Select Industry</option>
                  {industryOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                {formik.touched.industry && formik.errors.industry && (
                  <p className="text-sm text-red-500 mt-1">{formik.errors.industry}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="company_size">Company Size *</Label>
                <select
                  id="company_size"
                  name="company_size"
                  value={formik.values.company_size}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4469e5] focus:border-transparent ${
                    formik.touched.company_size && formik.errors.company_size ? 'border-red-500' : ''
                  }`}
                >
                  <option value="">Select Company Size</option>
                  {companySizeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                {formik.touched.company_size && formik.errors.company_size && (
                  <p className="text-sm text-red-500 mt-1">{formik.errors.company_size}</p>
                )}
              </div>
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                rows={3}
                className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4469e5] focus:border-transparent ${
                  formik.touched.description && formik.errors.description ? 'border-red-500' : ''
                }`}
                placeholder="Brief description of the organization..."
              />
              {formik.touched.description && formik.errors.description && (
                <p className="text-sm text-red-500 mt-1">{formik.errors.description}</p>
              )}
            </div>
          </div>

          {/* Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="status">Status *</Label>
                <select
                  id="status"
                  name="status"
                  value={formik.values.status}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4469e5] focus:border-transparent ${
                    formik.touched.status && formik.errors.status ? 'border-red-500' : ''
                  }`}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
                {formik.touched.status && formik.errors.status && (
                  <p className="text-sm text-red-500 mt-1">{formik.errors.status}</p>
                )}
              </div>
            </div>
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
              {isLoading ? 'Updating...' : 'Update Organization'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
