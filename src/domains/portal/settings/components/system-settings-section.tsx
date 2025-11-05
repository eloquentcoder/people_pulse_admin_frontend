import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Save, Loader2, Server, Database, AlertTriangle } from 'lucide-react';
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import { Label } from '@/common/components/ui/label';
import { Textarea } from '@/common/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/common/components/ui/card';
import { 
  useGetSystemSettingsQuery,
  useUpdateSystemSettingsMutation,
  useClearCacheMutation,
} from '../apis/settings.api';
import { toast } from 'sonner';

const validationSchema = Yup.object({
  log_level: Yup.string().oneOf(['debug', 'info', 'warning', 'error']).required(),
  log_retention_days: Yup.number().min(1).max(365).required(),
  max_upload_size: Yup.number().min(1).max(1024).required(),
  cache_driver: Yup.string().oneOf(['file', 'redis', 'memcached']).required(),
  queue_driver: Yup.string().oneOf(['sync', 'database', 'redis', 'sqs']).required(),
  session_driver: Yup.string().oneOf(['file', 'database', 'redis', 'memcached']).required(),
});

export const SystemSettingsSection = () => {
  const { data: settingsData, isLoading } = useGetSystemSettingsQuery();
  const [updateSettings, { isLoading: isSaving }] = useUpdateSystemSettingsMutation();
  const [clearCache, { isLoading: isClearing }] = useClearCacheMutation();

  const formik = useFormik({
    initialValues: {
      maintenance_mode: false,
      maintenance_message: '',
      log_level: 'info' as 'debug' | 'info' | 'warning' | 'error',
      log_retention_days: 30,
      enable_api_logging: true,
      enable_query_logging: false,
      max_upload_size: 10,
      allowed_file_types: ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx', 'xls', 'xlsx'],
      cache_driver: 'file' as 'file' | 'redis' | 'memcached',
      queue_driver: 'database' as 'sync' | 'database' | 'redis' | 'sqs',
      session_driver: 'database' as 'file' | 'database' | 'redis' | 'memcached',
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        await updateSettings(values).unwrap();
        toast.success('System settings saved successfully');
      } catch (error: any) {
        toast.error(error?.data?.message || error?.message || 'Failed to save settings');
      }
    },
  });

  useEffect(() => {
    if (settingsData?.data) {
      formik.setValues({
        maintenance_mode: settingsData.data.maintenance_mode || false,
        maintenance_message: settingsData.data.maintenance_message || '',
        log_level: settingsData.data.log_level || 'info',
        log_retention_days: settingsData.data.log_retention_days || 30,
        enable_api_logging: settingsData.data.enable_api_logging ?? true,
        enable_query_logging: settingsData.data.enable_query_logging ?? false,
        max_upload_size: settingsData.data.max_upload_size || 10,
        allowed_file_types: settingsData.data.allowed_file_types || [],
        cache_driver: settingsData.data.cache_driver || 'file',
        queue_driver: settingsData.data.queue_driver || 'database',
        session_driver: settingsData.data.session_driver || 'database',
      });
    }
  }, [settingsData]);

  const handleClearCache = async () => {
    try {
      await clearCache().unwrap();
      toast.success('Cache cleared successfully');
    } catch (error: any) {
      toast.error(error?.data?.message || error?.message || 'Failed to clear cache');
    }
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
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">System Settings</h3>
        
        <div className="space-y-6">
          {/* Maintenance Mode */}
          <Card className={formik.values.maintenance_mode ? 'border-yellow-200 dark:border-yellow-800 bg-yellow-50/50 dark:bg-yellow-900/10' : ''}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Maintenance Mode
              </CardTitle>
              <CardDescription>Put the platform in maintenance mode</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formik.values.maintenance_mode}
                  onChange={(e) => formik.setFieldValue('maintenance_mode', e.target.checked)}
                  disabled={isSaving}
                  className="rounded border-gray-300 text-[#4469e5] focus:ring-[#4469e5]"
                />
                <span className="text-sm font-medium text-gray-900 dark:text-white">Enable Maintenance Mode</span>
              </label>
              {formik.values.maintenance_mode && (
                <div className="space-y-2">
                  <Label htmlFor="maintenance_message">Maintenance Message</Label>
                  <Textarea
                    id="maintenance_message"
                    name="maintenance_message"
                    value={formik.values.maintenance_message}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="We're currently performing scheduled maintenance. We'll be back shortly."
                    rows={3}
                    disabled={isSaving}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Logging */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Logging Configuration
              </CardTitle>
              <CardDescription>Configure system logging and retention</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="log_level">Log Level</Label>
                  <select
                    id="log_level"
                    name="log_level"
                    value={formik.values.log_level}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={isSaving}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4469e5] focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  >
                    <option value="debug">Debug</option>
                    <option value="info">Info</option>
                    <option value="warning">Warning</option>
                    <option value="error">Error</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="log_retention_days">Log Retention (days)</Label>
                  <Input
                    id="log_retention_days"
                    name="log_retention_days"
                    type="number"
                    min="1"
                    max="365"
                    value={formik.values.log_retention_days}
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
                    checked={formik.values.enable_api_logging}
                    onChange={(e) => formik.setFieldValue('enable_api_logging', e.target.checked)}
                    disabled={isSaving}
                    className="rounded border-gray-300 text-[#4469e5] focus:ring-[#4469e5]"
                  />
                  <span className="text-sm text-gray-900 dark:text-white">Enable API Logging</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formik.values.enable_query_logging}
                    onChange={(e) => formik.setFieldValue('enable_query_logging', e.target.checked)}
                    disabled={isSaving}
                    className="rounded border-gray-300 text-[#4469e5] focus:ring-[#4469e5]"
                  />
                  <span className="text-sm text-gray-900 dark:text-white">Enable Query Logging</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">(Use with caution - may impact performance)</span>
                </label>
              </div>
            </CardContent>
          </Card>

          {/* File Upload */}
          <Card>
            <CardHeader>
              <CardTitle>File Upload Settings</CardTitle>
              <CardDescription>Configure file upload limits and allowed types</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="max_upload_size">Max Upload Size (MB)</Label>
                <Input
                  id="max_upload_size"
                  name="max_upload_size"
                  type="number"
                  min="1"
                  max="1024"
                  value={formik.values.max_upload_size}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={isSaving}
                />
              </div>
              <div className="space-y-2">
                <Label>Allowed File Types</Label>
                <div className="flex flex-wrap gap-2">
                  {formik.values.allowed_file_types.map((type) => (
                    <span
                      key={type}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm text-gray-900 dark:text-white"
                    >
                      {type}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  File types are configured in the backend
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Cache & Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="w-5 h-5" />
                Cache & Performance
              </CardTitle>
              <CardDescription>Configure caching and performance settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cache_driver">Cache Driver</Label>
                  <select
                    id="cache_driver"
                    name="cache_driver"
                    value={formik.values.cache_driver}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={isSaving}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4469e5] focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  >
                    <option value="file">File</option>
                    <option value="redis">Redis</option>
                    <option value="memcached">Memcached</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="queue_driver">Queue Driver</Label>
                  <select
                    id="queue_driver"
                    name="queue_driver"
                    value={formik.values.queue_driver}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={isSaving}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4469e5] focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  >
                    <option value="sync">Sync</option>
                    <option value="database">Database</option>
                    <option value="redis">Redis</option>
                    <option value="sqs">Amazon SQS</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="session_driver">Session Driver</Label>
                  <select
                    id="session_driver"
                    name="session_driver"
                    value={formik.values.session_driver}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={isSaving}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4469e5] focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  >
                    <option value="file">File</option>
                    <option value="database">Database</option>
                    <option value="redis">Redis</option>
                    <option value="memcached">Memcached</option>
                  </select>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button
                  type="button"
                  onClick={handleClearCache}
                  disabled={isClearing}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  {isClearing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Clearing...
                    </>
                  ) : (
                    <>
                      <Server className="w-4 h-4" />
                      Clear Cache
                    </>
                  )}
                </Button>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Clear all cached data to refresh system performance
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


