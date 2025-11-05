import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { X, Building2, Save, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/common/components/ui/card';
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import { Label } from '@/common/components/ui/label';
import { useCreateOrganizationMutation } from '../apis/organization.api';
import { toast } from 'sonner';

interface AddOrganizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
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
  trial_days: Yup.number().min(1, 'Trial days must be at least 1').max(365, 'Trial days must be less than 365'),
  // Admin fields
  admin_first_name: Yup.string().required('Admin first name is required'),
  admin_last_name: Yup.string().required('Admin last name is required'),
  admin_email: Yup.string().email('Invalid admin email address').required('Admin email is required'),
  admin_password: Yup.string().min(8, 'Password must be at least 8 characters').required('Admin password is required'),
  admin_phone: Yup.string().max(20, 'Admin phone must be less than 20 characters'),
});

const initialValues = {
  name: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  country: '',
  postal_code: '',
  website: '',
  industry: '',
  company_size: '',
  description: '',
  status: 'active' as const,
  trial_days: 14,
  // Admin fields
  admin_first_name: '',
  admin_last_name: '',
  admin_email: '',
  admin_password: '',
  admin_phone: '',
};

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

export const AddOrganizationModal = ({ isOpen, onClose, onSuccess }: AddOrganizationModalProps) => {
  const [createOrganization, { isLoading }] = useCreateOrganizationMutation();

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      try {
        // Send all data including admin fields
        const organizationData = {
          name: values.name,
          email: values.email,
          phone: values.phone,
          address: values.address,
          city: values.city,
          state: values.state,
          country: values.country,
          postal_code: values.postal_code,
          website: values.website,
          industry: values.industry,
          company_size: values.company_size,
          description: values.description,
          status: values.status,
          trial_days: values.trial_days,
          // Admin fields
          admin_first_name: values.admin_first_name,
          admin_last_name: values.admin_last_name,
          admin_email: values.admin_email,
          admin_password: values.admin_password,
          admin_phone: values.admin_phone,
        };

        // Create organization with admin
        await createOrganization(organizationData).unwrap();

        onSuccess?.();
        onClose();
        formik.resetForm();
        toast.success('Organization created successfully');
      } catch (error) {
        console.error('Failed to create organization:', error);
        toast.error('Failed to create organization');
      }
    },
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#4469e5]">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold">Add New Organization</CardTitle>
              <CardDescription>Create a new organization on your platform</CardDescription>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={formik.handleSubmit} className="space-y-6">
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
                    placeholder="Enter organization name"
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
                    placeholder="123 Business Street"
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
                  className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4469e5] focus:border-transparent resize-none ${
                    formik.touched.description && formik.errors.description ? 'border-red-500' : ''
                  }`}
                  rows={3}
                  placeholder="Brief description of the organization..."
                />
                {formik.touched.description && formik.errors.description && (
                  <p className="text-sm text-red-500 mt-1">{formik.errors.description}</p>
                )}
              </div>
            </div>

            {/* Organization Admin */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Organization Admin</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="admin_first_name">First Name *</Label>
                  <Input
                    id="admin_first_name"
                    name="admin_first_name"
                    value={formik.values.admin_first_name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={formik.touched.admin_first_name && formik.errors.admin_first_name ? 'border-red-500' : ''}
                    placeholder="John"
                  />
                  {formik.touched.admin_first_name && formik.errors.admin_first_name && (
                    <p className="text-sm text-red-500 mt-1">{formik.errors.admin_first_name}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="admin_last_name">Last Name *</Label>
                  <Input
                    id="admin_last_name"
                    name="admin_last_name"
                    value={formik.values.admin_last_name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={formik.touched.admin_last_name && formik.errors.admin_last_name ? 'border-red-500' : ''}
                    placeholder="Doe"
                  />
                  {formik.touched.admin_last_name && formik.errors.admin_last_name && (
                    <p className="text-sm text-red-500 mt-1">{formik.errors.admin_last_name}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="admin_email">Email Address *</Label>
                  <Input
                    id="admin_email"
                    name="admin_email"
                    type="email"
                    value={formik.values.admin_email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={formik.touched.admin_email && formik.errors.admin_email ? 'border-red-500' : ''}
                    placeholder="admin@organization.com"
                  />
                  {formik.touched.admin_email && formik.errors.admin_email && (
                    <p className="text-sm text-red-500 mt-1">{formik.errors.admin_email}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="admin_phone">Phone Number</Label>
                  <Input
                    id="admin_phone"
                    name="admin_phone"
                    value={formik.values.admin_phone}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={formik.touched.admin_phone && formik.errors.admin_phone ? 'border-red-500' : ''}
                    placeholder="+1 (555) 123-4567"
                  />
                  {formik.touched.admin_phone && formik.errors.admin_phone && (
                    <p className="text-sm text-red-500 mt-1">{formik.errors.admin_phone}</p>
                  )}
                </div>
                
                <div className="md:col-span-2">
                  <Label htmlFor="admin_password">Password *</Label>
                  <Input
                    id="admin_password"
                    name="admin_password"
                    type="password"
                    value={formik.values.admin_password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={formik.touched.admin_password && formik.errors.admin_password ? 'border-red-500' : ''}
                    placeholder="Enter secure password"
                  />
                  {formik.touched.admin_password && formik.errors.admin_password && (
                    <p className="text-sm text-red-500 mt-1">{formik.errors.admin_password}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">Password must be at least 8 characters long</p>
                </div>
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
                
                <div>
                  <Label htmlFor="trial_days">Trial Days</Label>
                  <Input
                    id="trial_days"
                    name="trial_days"
                    type="number"
                    min="1"
                    max="365"
                    value={formik.values.trial_days}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={formik.touched.trial_days && formik.errors.trial_days ? 'border-red-500' : ''}
                    placeholder="14"
                  />
                  {formik.touched.trial_days && formik.errors.trial_days && (
                    <p className="text-sm text-red-500 mt-1">{formik.errors.trial_days}</p>
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
                disabled={isLoading || !formik.isValid}
                className="bg-[#4469e5] hover:bg-[#4469e5]/90"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Create Organization
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
