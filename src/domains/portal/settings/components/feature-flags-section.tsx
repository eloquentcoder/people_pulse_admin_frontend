import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import { Save, Loader2, Zap, ToggleLeft, ToggleRight } from 'lucide-react';
import { Button } from '@/common/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/common/components/ui/card';
import { 
  useGetFeatureFlagsQuery,
  useUpdateFeatureFlagsMutation,
} from '../apis/settings.api';
import { toast } from 'sonner';

export const FeatureFlagsSection = () => {
  const { data: settingsData, isLoading } = useGetFeatureFlagsQuery();
  const [updateSettings, { isLoading: isSaving }] = useUpdateFeatureFlagsMutation();

  const formik = useFormik({
    initialValues: {
      enable_registration: true,
      enable_trials: true,
      enable_ai_features: false,
      enable_analytics: true,
      enable_audit_logs: true,
      enable_two_factor: false,
      enable_sso: false,
      enable_webhooks: true,
      enable_api_access: true,
    },
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        await updateSettings(values).unwrap();
        toast.success('Feature flags updated successfully');
      } catch (error: any) {
        toast.error(error?.data?.message || error?.message || 'Failed to update feature flags');
      }
    },
  });

  useEffect(() => {
    if (settingsData?.data) {
      formik.setValues({
        enable_registration: settingsData.data.enable_registration ?? true,
        enable_trials: settingsData.data.enable_trials ?? true,
        enable_ai_features: settingsData.data.enable_ai_features ?? false,
        enable_analytics: settingsData.data.enable_analytics ?? true,
        enable_audit_logs: settingsData.data.enable_audit_logs ?? true,
        enable_two_factor: settingsData.data.enable_two_factor ?? false,
        enable_sso: settingsData.data.enable_sso ?? false,
        enable_webhooks: settingsData.data.enable_webhooks ?? true,
        enable_api_access: settingsData.data.enable_api_access ?? true,
      });
    }
  }, [settingsData]);

  const featureFlags = [
    {
      key: 'enable_registration',
      label: 'Enable Registration',
      description: 'Allow new organizations to register on the platform',
      category: 'Core',
    },
    {
      key: 'enable_trials',
      label: 'Enable Trials',
      description: 'Allow organizations to start with trial subscriptions',
      category: 'Core',
    },
    {
      key: 'enable_ai_features',
      label: 'AI Features',
      description: 'Enable AI-powered features and integrations',
      category: 'AI',
    },
    {
      key: 'enable_analytics',
      label: 'Analytics',
      description: 'Enable platform analytics and reporting',
      category: 'Analytics',
    },
    {
      key: 'enable_audit_logs',
      label: 'Audit Logs',
      description: 'Enable comprehensive audit logging',
      category: 'Security',
    },
    {
      key: 'enable_two_factor',
      label: 'Two-Factor Authentication',
      description: 'Enable 2FA for all users',
      category: 'Security',
    },
    {
      key: 'enable_sso',
      label: 'Single Sign-On (SSO)',
      description: 'Enable SSO integration for organizations',
      category: 'Security',
    },
    {
      key: 'enable_webhooks',
      label: 'Webhooks',
      description: 'Enable webhook notifications for events',
      category: 'Integrations',
    },
    {
      key: 'enable_api_access',
      label: 'API Access',
      description: 'Enable API access for third-party integrations',
      category: 'Integrations',
    },
  ];

  const categories = Array.from(new Set(featureFlags.map(f => f.category)));

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
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Feature Flags</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Enable or disable platform features globally
        </p>
        
        <div className="space-y-6">
          {categories.map((category) => (
            <Card key={category}>
              <CardHeader>
                <CardTitle>{category}</CardTitle>
                <CardDescription>Configure {category.toLowerCase()} features</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {featureFlags
                  .filter(f => f.category === category)
                  .map((flag) => {
                    const value = formik.values[flag.key as keyof typeof formik.values] as boolean;
                    return (
                      <div
                        key={flag.key}
                        className="flex items-start justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                              {flag.label}
                            </h4>
                            {value ? (
                              <span className="text-xs px-2 py-0.5 bg-green-100 text-green-800 rounded">
                                Enabled
                              </span>
                            ) : (
                              <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-800 rounded">
                                Disabled
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {flag.description}
                          </p>
                        </div>
                        <label className="flex items-center cursor-pointer ml-4">
                          <input
                            type="checkbox"
                            checked={value}
                            onChange={(e) => formik.setFieldValue(flag.key, e.target.checked)}
                            disabled={isSaving}
                            className="sr-only"
                          />
                          <div
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              value ? 'bg-[#4469e5]' : 'bg-gray-300 dark:bg-gray-600'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                value ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </div>
                        </label>
                      </div>
                    );
                  })}
              </CardContent>
            </Card>
          ))}
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


