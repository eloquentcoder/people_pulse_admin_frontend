import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'sonner';
import {
  User,
  Mail,
  Lock,
  Save,
  Loader2,
  Calendar,
  Shield,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/common/components/ui/card';
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import { Label } from '@/common/components/ui/label';
import { Badge } from '@/common/components/ui/badge';
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useUpdatePasswordMutation,
} from '../apis/profile.api';

const profileValidationSchema = Yup.object({
  first_name: Yup.string().required('First name is required').max(255),
  last_name: Yup.string().required('Last name is required').max(255),
  email: Yup.string().email('Invalid email address').required('Email is required'),
});

const passwordValidationSchema = Yup.object({
  current_password: Yup.string().required('Current password is required'),
  password: Yup.string()
    .required('New password is required')
    .min(8, 'Password must be at least 8 characters'),
  password_confirmation: Yup.string()
    .required('Please confirm your password')
    .oneOf([Yup.ref('password')], 'Passwords must match'),
});

const ProfilePage = () => {
  const { data: profileData, isLoading: isLoadingProfile } = useGetProfileQuery();
  const [updateProfile, { isLoading: isUpdatingProfile }] = useUpdateProfileMutation();
  const [updatePassword, { isLoading: isUpdatingPassword }] = useUpdatePasswordMutation();

  const profile = profileData?.data;

  // Profile form
  const profileFormik = useFormik({
    initialValues: {
      first_name: profile?.first_name || '',
      last_name: profile?.last_name || '',
      email: profile?.email || '',
    },
    validationSchema: profileValidationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        await updateProfile(values).unwrap();
        toast.success('Profile updated successfully');
      } catch (error: any) {
        toast.error(error?.data?.message || 'Failed to update profile');
      }
    },
  });

  // Password form
  const passwordFormik = useFormik({
    initialValues: {
      current_password: '',
      password: '',
      password_confirmation: '',
    },
    validationSchema: passwordValidationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        await updatePassword(values).unwrap();
        toast.success('Password updated successfully');
        resetForm();
      } catch (error: any) {
        const errorMessage = error?.data?.errors?.current_password?.[0]
          || error?.data?.message
          || 'Failed to update password';
        toast.error(errorMessage);
      }
    },
  });

  if (isLoadingProfile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-[#4469e5]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            My Profile
          </h1>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-1">
            Manage your account settings and preferences
          </p>
        </div>
      </div>

      {/* Profile Overview Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#4469e5] to-[#ee9807] flex items-center justify-center text-white text-2xl font-bold">
              {profile?.first_name?.charAt(0)}{profile?.last_name?.charAt(0)}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {profile?.first_name} {profile?.last_name}
              </h2>
              <p className="text-gray-500 dark:text-gray-400">{profile?.email}</p>
              <div className="flex items-center gap-3 mt-2">
                <Badge variant="secondary" className="capitalize">
                  {profile?.user_type?.replace('_', ' ')}
                </Badge>
                {profile?.is_active && (
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                    Active
                  </Badge>
                )}
              </div>
            </div>
            <div className="hidden md:flex flex-col items-end text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Joined {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Information Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Profile Information
            </CardTitle>
            <CardDescription>
              Update your personal information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={profileFormik.handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name">First Name *</Label>
                  <Input
                    id="first_name"
                    name="first_name"
                    value={profileFormik.values.first_name}
                    onChange={profileFormik.handleChange}
                    onBlur={profileFormik.handleBlur}
                    placeholder="John"
                    disabled={isUpdatingProfile}
                  />
                  {profileFormik.touched.first_name && profileFormik.errors.first_name && (
                    <p className="text-sm text-destructive">{profileFormik.errors.first_name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="last_name">Last Name *</Label>
                  <Input
                    id="last_name"
                    name="last_name"
                    value={profileFormik.values.last_name}
                    onChange={profileFormik.handleChange}
                    onBlur={profileFormik.handleBlur}
                    placeholder="Doe"
                    disabled={isUpdatingProfile}
                  />
                  {profileFormik.touched.last_name && profileFormik.errors.last_name && (
                    <p className="text-sm text-destructive">{profileFormik.errors.last_name}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={profileFormik.values.email}
                    onChange={profileFormik.handleChange}
                    onBlur={profileFormik.handleBlur}
                    placeholder="john@example.com"
                    className="pl-10"
                    disabled={isUpdatingProfile}
                  />
                </div>
                {profileFormik.touched.email && profileFormik.errors.email && (
                  <p className="text-sm text-destructive">{profileFormik.errors.email}</p>
                )}
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  disabled={isUpdatingProfile || !profileFormik.dirty}
                  className="bg-[#4469e5] hover:bg-[#4469e5]/90"
                >
                  {isUpdatingProfile ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Change Password Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Change Password
            </CardTitle>
            <CardDescription>
              Update your password to keep your account secure
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={passwordFormik.handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current_password">Current Password *</Label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="current_password"
                    name="current_password"
                    type="password"
                    value={passwordFormik.values.current_password}
                    onChange={passwordFormik.handleChange}
                    onBlur={passwordFormik.handleBlur}
                    placeholder="Enter current password"
                    className="pl-10"
                    disabled={isUpdatingPassword}
                  />
                </div>
                {passwordFormik.touched.current_password && passwordFormik.errors.current_password && (
                  <p className="text-sm text-destructive">{passwordFormik.errors.current_password}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">New Password *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={passwordFormik.values.password}
                    onChange={passwordFormik.handleChange}
                    onBlur={passwordFormik.handleBlur}
                    placeholder="Enter new password"
                    className="pl-10"
                    disabled={isUpdatingPassword}
                  />
                </div>
                {passwordFormik.touched.password && passwordFormik.errors.password && (
                  <p className="text-sm text-destructive">{passwordFormik.errors.password}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password_confirmation">Confirm New Password *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="password_confirmation"
                    name="password_confirmation"
                    type="password"
                    value={passwordFormik.values.password_confirmation}
                    onChange={passwordFormik.handleChange}
                    onBlur={passwordFormik.handleBlur}
                    placeholder="Confirm new password"
                    className="pl-10"
                    disabled={isUpdatingPassword}
                  />
                </div>
                {passwordFormik.touched.password_confirmation && passwordFormik.errors.password_confirmation && (
                  <p className="text-sm text-destructive">{passwordFormik.errors.password_confirmation}</p>
                )}
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  disabled={isUpdatingPassword}
                  className="bg-[#4469e5] hover:bg-[#4469e5]/90"
                >
                  {isUpdatingPassword ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      Update Password
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
