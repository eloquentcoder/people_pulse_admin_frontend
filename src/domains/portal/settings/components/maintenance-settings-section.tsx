import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import { Save, Loader2, HardDrive, Database, RefreshCw } from 'lucide-react';
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import { Label } from '@/common/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/common/components/ui/card';
import { 
  useGetMaintenanceSettingsQuery,
  useUpdateMaintenanceSettingsMutation,
} from '../apis/settings.api';
import { toast } from 'sonner';

export const MaintenanceSettingsSection = () => {
  const { data: settingsData, isLoading } = useGetMaintenanceSettingsQuery();
  const [updateSettings, { isLoading: isSaving }] = useUpdateMaintenanceSettingsMutation();

  const formik = useFormik({
    initialValues: {
      auto_backup_enabled: false,
      backup_frequency: 'daily' as 'daily' | 'weekly' | 'monthly',
      backup_retention_days: 30,
      backup_storage: 'local' as 'local' | 's3' | 'gcs',
      cleanup_old_data: false,
      cleanup_after_days: 365,
    },
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        await updateSettings(values).unwrap();
        toast.success('Maintenance settings saved successfully');
      } catch (error: any) {
        toast.error(error?.data?.message || error?.message || 'Failed to save settings');
      }
    },
  });

  useEffect(() => {
    if (settingsData?.data) {
      formik.setValues({
        auto_backup_enabled: settingsData.data.auto_backup_enabled ?? false,
        backup_frequency: settingsData.data.backup_frequency || 'daily',
        backup_retention_days: settingsData.data.backup_retention_days || 30,
        backup_storage: settingsData.data.backup_storage || 'local',
        cleanup_old_data: settingsData.data.cleanup_old_data ?? false,
        cleanup_after_days: settingsData.data.cleanup_after_days || 365,
      });
    }
  }, [settingsData]);

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
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Maintenance Settings</h3>
        
        <div className="space-y-6">
          {/* Backup Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Backup Configuration
              </CardTitle>
              <CardDescription>Configure automatic backup settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formik.values.auto_backup_enabled}
                  onChange={(e) => formik.setFieldValue('auto_backup_enabled', e.target.checked)}
                  disabled={isSaving}
                  className="rounded border-gray-300 text-[#4469e5] focus:ring-[#4469e5]"
                />
                <span className="text-sm font-medium text-gray-900 dark:text-white">Enable Automatic Backups</span>
              </label>
              
              {formik.values.auto_backup_enabled && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="space-y-2">
                    <Label htmlFor="backup_frequency">Backup Frequency</Label>
                    <select
                      id="backup_frequency"
                      name="backup_frequency"
                      value={formik.values.backup_frequency}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      disabled={isSaving}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4469e5] focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="backup_retention_days">Retention (days)</Label>
                    <Input
                      id="backup_retention_days"
                      name="backup_retention_days"
                      type="number"
                      min="1"
                      max="365"
                      value={formik.values.backup_retention_days}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      disabled={isSaving}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="backup_storage">Storage Location</Label>
                    <select
                      id="backup_storage"
                      name="backup_storage"
                      value={formik.values.backup_storage}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      disabled={isSaving}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4469e5] focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                    >
                      <option value="local">Local Storage</option>
                      <option value="s3">Amazon S3</option>
                      <option value="gcs">Google Cloud Storage</option>
                    </select>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Data Cleanup */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="w-5 h-5" />
                Data Cleanup
              </CardTitle>
              <CardDescription>Configure automatic data cleanup</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formik.values.cleanup_old_data}
                  onChange={(e) => formik.setFieldValue('cleanup_old_data', e.target.checked)}
                  disabled={isSaving}
                  className="rounded border-gray-300 text-[#4469e5] focus:ring-[#4469e5]"
                />
                <span className="text-sm font-medium text-gray-900 dark:text-white">Enable Automatic Cleanup</span>
              </label>
              
              {formik.values.cleanup_old_data && (
                <div className="space-y-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Label htmlFor="cleanup_after_days">Cleanup After (days)</Label>
                  <Input
                    id="cleanup_after_days"
                    name="cleanup_after_days"
                    type="number"
                    min="30"
                    max="3650"
                    value={formik.values.cleanup_after_days}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={isSaving}
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Data older than this will be automatically deleted
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* System Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HardDrive className="w-5 h-5" />
                System Information
              </CardTitle>
              <CardDescription>Platform version and maintenance status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Platform Version</span>
                <span className="text-sm text-gray-900 dark:text-white">v1.0.0</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Last Backup</span>
                <span className="text-sm text-gray-900 dark:text-white">Never</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Storage Used</span>
                <span className="text-sm text-gray-900 dark:text-white">--</span>
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


