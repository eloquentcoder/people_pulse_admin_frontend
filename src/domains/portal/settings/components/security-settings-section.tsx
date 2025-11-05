import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Save, Loader2, Shield, Lock, Key, Users, Plus, X } from 'lucide-react';
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import { Label } from '@/common/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/common/components/ui/card';
import { 
  useGetSecuritySettingsQuery,
  useUpdateSecuritySettingsMutation,
} from '../apis/settings.api';
import { toast } from 'sonner';

const validationSchema = Yup.object({
  password_policy: Yup.object({
    min_length: Yup.number().min(6).max(128).required(),
    require_uppercase: Yup.boolean(),
    require_lowercase: Yup.boolean(),
    require_numbers: Yup.boolean(),
    require_special_chars: Yup.boolean(),
    expiry_days: Yup.number().min(0).max(365),
    prevent_reuse: Yup.number().min(0).max(10),
  }),
  session_timeout: Yup.number().min(5).max(1440).required(),
  max_login_attempts: Yup.number().min(3).max(10).required(),
  lockout_duration: Yup.number().min(1).max(1440).required(),
  require_mfa_for_admins: Yup.boolean(),
  require_mfa_for_all: Yup.boolean(),
  audit_log_retention: Yup.number().min(30).max(3650).required(),
  ip_whitelist: Yup.array().of(Yup.string()),
  enforce_https: Yup.boolean(),
  api_rate_limit: Yup.number().min(10).max(10000).required(),
});

export const SecuritySettingsSection = () => {
  const { data: settingsData, isLoading } = useGetSecuritySettingsQuery();
  const [updateSettings, { isLoading: isSaving }] = useUpdateSecuritySettingsMutation();
  const [newIp, setNewIp] = useState('');

  const formik = useFormik({
    initialValues: {
      password_policy: {
        min_length: 8,
        require_uppercase: true,
        require_lowercase: true,
        require_numbers: true,
        require_special_chars: false,
        expiry_days: 90,
        prevent_reuse: 3,
      },
      session_timeout: 30,
      max_login_attempts: 5,
      lockout_duration: 15,
      require_mfa_for_admins: false,
      require_mfa_for_all: false,
      audit_log_retention: 365,
      ip_whitelist: [] as string[],
      enforce_https: true,
      api_rate_limit: 1000,
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        await updateSettings(values).unwrap();
        toast.success('Security settings saved successfully');
      } catch (error: any) {
        toast.error(error?.data?.message || error?.message || 'Failed to save settings');
      }
    },
  });

  useEffect(() => {
    if (settingsData?.data) {
      formik.setValues(settingsData.data);
    }
  }, [settingsData]);

  const handleAddIp = () => {
    if (newIp.trim() && !formik.values.ip_whitelist.includes(newIp.trim())) {
      formik.setFieldValue('ip_whitelist', [...formik.values.ip_whitelist, newIp.trim()]);
      setNewIp('');
    }
  };

  const handleRemoveIp = (ip: string) => {
    formik.setFieldValue('ip_whitelist', formik.values.ip_whitelist.filter(i => i !== ip));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4469e5] mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Security Settings</h3>
        
        <div className="space-y-6">
          {/* Password Policy */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="w-5 h-5" />
                Password Policy
              </CardTitle>
              <CardDescription>Configure password requirements and expiration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="min_length">Minimum Length</Label>
                  <Input
                    id="min_length"
                    name="password_policy.min_length"
                    type="number"
                    min="6"
                    max="128"
                    value={formik.values.password_policy.min_length}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={isSaving}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expiry_days">Password Expiry (days)</Label>
                  <Input
                    id="expiry_days"
                    name="password_policy.expiry_days"
                    type="number"
                    min="0"
                    max="365"
                    value={formik.values.password_policy.expiry_days}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={isSaving}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prevent_reuse">Prevent Reuse (last N passwords)</Label>
                  <Input
                    id="prevent_reuse"
                    name="password_policy.prevent_reuse"
                    type="number"
                    min="0"
                    max="10"
                    value={formik.values.password_policy.prevent_reuse}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={isSaving}
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formik.values.password_policy.require_uppercase}
                    onChange={(e) => formik.setFieldValue('password_policy.require_uppercase', e.target.checked)}
                    disabled={isSaving}
                    className="rounded border-gray-300 text-[#4469e5] focus:ring-[#4469e5]"
                  />
                  <span className="text-sm text-gray-900 dark:text-white">Require uppercase letters</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formik.values.password_policy.require_lowercase}
                    onChange={(e) => formik.setFieldValue('password_policy.require_lowercase', e.target.checked)}
                    disabled={isSaving}
                    className="rounded border-gray-300 text-[#4469e5] focus:ring-[#4469e5]"
                  />
                  <span className="text-sm text-gray-900 dark:text-white">Require lowercase letters</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formik.values.password_policy.require_numbers}
                    onChange={(e) => formik.setFieldValue('password_policy.require_numbers', e.target.checked)}
                    disabled={isSaving}
                    className="rounded border-gray-300 text-[#4469e5] focus:ring-[#4469e5]"
                  />
                  <span className="text-sm text-gray-900 dark:text-white">Require numbers</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formik.values.password_policy.require_special_chars}
                    onChange={(e) => formik.setFieldValue('password_policy.require_special_chars', e.target.checked)}
                    disabled={isSaving}
                    className="rounded border-gray-300 text-[#4469e5] focus:ring-[#4469e5]"
                  />
                  <span className="text-sm text-gray-900 dark:text-white">Require special characters</span>
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Session & Authentication */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Session & Authentication
              </CardTitle>
              <CardDescription>Configure session management and authentication</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="session_timeout">Session Timeout (minutes)</Label>
                  <Input
                    id="session_timeout"
                    name="session_timeout"
                    type="number"
                    min="5"
                    max="1440"
                    value={formik.values.session_timeout}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={isSaving}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max_login_attempts">Max Login Attempts</Label>
                  <Input
                    id="max_login_attempts"
                    name="max_login_attempts"
                    type="number"
                    min="3"
                    max="10"
                    value={formik.values.max_login_attempts}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={isSaving}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lockout_duration">Lockout Duration (minutes)</Label>
                  <Input
                    id="lockout_duration"
                    name="lockout_duration"
                    type="number"
                    min="1"
                    max="1440"
                    value={formik.values.lockout_duration}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={isSaving}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="api_rate_limit">API Rate Limit (requests/minute)</Label>
                  <Input
                    id="api_rate_limit"
                    name="api_rate_limit"
                    type="number"
                    min="10"
                    max="10000"
                    value={formik.values.api_rate_limit}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={isSaving}
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formik.values.require_mfa_for_admins}
                    onChange={(e) => formik.setFieldValue('require_mfa_for_admins', e.target.checked)}
                    disabled={isSaving}
                    className="rounded border-gray-300 text-[#4469e5] focus:ring-[#4469e5]"
                  />
                  <span className="text-sm text-gray-900 dark:text-white">Require MFA for platform admins</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formik.values.require_mfa_for_all}
                    onChange={(e) => formik.setFieldValue('require_mfa_for_all', e.target.checked)}
                    disabled={isSaving}
                    className="rounded border-gray-300 text-[#4469e5] focus:ring-[#4469e5]"
                  />
                  <span className="text-sm text-gray-900 dark:text-white">Require MFA for all users</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formik.values.enforce_https}
                    onChange={(e) => formik.setFieldValue('enforce_https', e.target.checked)}
                    disabled={isSaving}
                    className="rounded border-gray-300 text-[#4469e5] focus:ring-[#4469e5]"
                  />
                  <span className="text-sm text-gray-900 dark:text-white">Enforce HTTPS</span>
                </label>
              </div>
            </CardContent>
          </Card>

          {/* IP Whitelist */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                IP Whitelist
              </CardTitle>
              <CardDescription>Restrict access to specific IP addresses (optional)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newIp}
                  onChange={(e) => setNewIp(e.target.value)}
                  placeholder="192.168.1.1"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddIp())}
                  disabled={isSaving}
                />
                <Button
                  type="button"
                  onClick={handleAddIp}
                  disabled={isSaving || !newIp.trim()}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add IP
                </Button>
              </div>
              {formik.values.ip_whitelist.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formik.values.ip_whitelist.map((ip) => (
                    <div
                      key={ip}
                      className="flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg"
                    >
                      <span className="text-sm text-gray-900 dark:text-white">{ip}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveIp(ip)}
                        disabled={isSaving}
                        className="text-gray-500 hover:text-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Audit & Logging */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Audit & Logging
              </CardTitle>
              <CardDescription>Configure audit log retention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="audit_log_retention">Audit Log Retention (days)</Label>
                <Input
                  id="audit_log_retention"
                  name="audit_log_retention"
                  type="number"
                  min="30"
                  max="3650"
                  value={formik.values.audit_log_retention}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={isSaving}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Audit logs older than this will be automatically deleted
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button
          type="submit"
          disabled={isSaving}
          className="bg-[#4469e5] hover:bg-[#4469e5]/90"
        >
          {isSaving ? (
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
  );
};


