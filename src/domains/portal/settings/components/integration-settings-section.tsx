import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import { Save, Loader2, Link, Plus, X, Trash2 } from 'lucide-react';
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import { Label } from '@/common/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/common/components/ui/card';
import { Badge } from '@/common/components/ui/badge';
import { 
  useGetIntegrationSettingsQuery,
  useUpdateIntegrationSettingsMutation,
} from '../apis/settings.api';
import { toast } from 'sonner';

export const IntegrationSettingsSection = () => {
  const { data: settingsData, isLoading } = useGetIntegrationSettingsQuery();
  const [updateSettings, { isLoading: isSaving }] = useUpdateIntegrationSettingsMutation();
  const [newWebhook, setNewWebhook] = useState({ name: '', url: '', events: [] as string[] });

  const formik = useFormik({
    initialValues: {
      google_analytics_id: '',
      intercom_app_id: '',
      sentry_dsn: '',
      slack_webhook_url: '',
      custom_webhooks: [] as Array<{
        id: string;
        name: string;
        url: string;
        events: string[];
        is_active: boolean;
      }>,
    },
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        await updateSettings(values).unwrap();
        toast.success('Integration settings saved successfully');
      } catch (error: any) {
        toast.error(error?.data?.message || error?.message || 'Failed to save settings');
      }
    },
  });

  useEffect(() => {
    if (settingsData?.data) {
      formik.setValues({
        google_analytics_id: settingsData.data.google_analytics_id || '',
        intercom_app_id: settingsData.data.intercom_app_id || '',
        sentry_dsn: settingsData.data.sentry_dsn || '',
        slack_webhook_url: settingsData.data.slack_webhook_url || '',
        custom_webhooks: settingsData.data.custom_webhooks || [],
      });
    }
  }, [settingsData]);

  const availableEvents = [
    'organization.created',
    'organization.updated',
    'subscription.created',
    'subscription.updated',
    'payment.succeeded',
    'payment.failed',
    'user.created',
    'user.updated',
  ];

  const handleAddWebhook = () => {
    if (newWebhook.name && newWebhook.url) {
      const webhook = {
        id: Date.now().toString(),
        name: newWebhook.name,
        url: newWebhook.url,
        events: newWebhook.events,
        is_active: true,
      };
      formik.setFieldValue('custom_webhooks', [...formik.values.custom_webhooks, webhook]);
      setNewWebhook({ name: '', url: '', events: [] });
    }
  };

  const handleRemoveWebhook = (id: string) => {
    formik.setFieldValue('custom_webhooks', formik.values.custom_webhooks.filter(w => w.id !== id));
  };

  const toggleWebhookEvent = (webhookId: string, event: string) => {
    const webhooks = formik.values.custom_webhooks.map(w => {
      if (w.id === webhookId) {
        const events = w.events.includes(event)
          ? w.events.filter(e => e !== event)
          : [...w.events, event];
        return { ...w, events };
      }
      return w;
    });
    formik.setFieldValue('custom_webhooks', webhooks);
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
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Integration Settings</h3>
        
        <div className="space-y-6">
          {/* Third-Party Integrations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link className="w-5 h-5" />
                Third-Party Integrations
              </CardTitle>
              <CardDescription>Configure external service integrations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="google_analytics_id">Google Analytics ID</Label>
                <Input
                  id="google_analytics_id"
                  name="google_analytics_id"
                  value={formik.values.google_analytics_id}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="G-XXXXXXXXXX"
                  disabled={isSaving}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="intercom_app_id">Intercom App ID</Label>
                <Input
                  id="intercom_app_id"
                  name="intercom_app_id"
                  value={formik.values.intercom_app_id}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="xxxxxxxx"
                  disabled={isSaving}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sentry_dsn">Sentry DSN</Label>
                <Input
                  id="sentry_dsn"
                  name="sentry_dsn"
                  value={formik.values.sentry_dsn}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="https://xxx@xxx.ingest.sentry.io/xxx"
                  disabled={isSaving}
                  type="password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slack_webhook_url">Slack Webhook URL</Label>
                <Input
                  id="slack_webhook_url"
                  name="slack_webhook_url"
                  value={formik.values.slack_webhook_url}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="https://hooks.slack.com/services/xxx/xxx/xxx"
                  disabled={isSaving}
                  type="password"
                />
              </div>
            </CardContent>
          </Card>

          {/* Custom Webhooks */}
          <Card>
            <CardHeader>
              <CardTitle>Custom Webhooks</CardTitle>
              <CardDescription>Configure custom webhook endpoints for events</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add New Webhook */}
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg space-y-4">
                <h4 className="font-semibold text-gray-900 dark:text-white">Add New Webhook</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Webhook Name</Label>
                    <Input
                      value={newWebhook.name}
                      onChange={(e) => setNewWebhook({ ...newWebhook, name: e.target.value })}
                      placeholder="My Webhook"
                      disabled={isSaving}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Webhook URL</Label>
                    <Input
                      value={newWebhook.url}
                      onChange={(e) => setNewWebhook({ ...newWebhook, url: e.target.value })}
                      placeholder="https://example.com/webhook"
                      disabled={isSaving}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Events</Label>
                  <div className="flex flex-wrap gap-2">
                    {availableEvents.map((event) => (
                      <label
                        key={event}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={newWebhook.events.includes(event)}
                          onChange={(e) => {
                            const events = e.target.checked
                              ? [...newWebhook.events, event]
                              : newWebhook.events.filter(e => e !== event);
                            setNewWebhook({ ...newWebhook, events });
                          }}
                          disabled={isSaving}
                          className="rounded border-gray-300 text-[#4469e5] focus:ring-[#4469e5]"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{event}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <Button
                  type="button"
                  onClick={handleAddWebhook}
                  disabled={isSaving || !newWebhook.name || !newWebhook.url}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Webhook
                </Button>
              </div>

              {/* Existing Webhooks */}
              {formik.values.custom_webhooks.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 dark:text-white">Configured Webhooks</h4>
                  {formik.values.custom_webhooks.map((webhook) => (
                    <div
                      key={webhook.id}
                      className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="font-semibold text-gray-900 dark:text-white">{webhook.name}</h5>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{webhook.url}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {webhook.is_active ? (
                            <Badge variant="default" className="bg-green-100 text-green-800">Active</Badge>
                          ) : (
                            <Badge variant="outline">Inactive</Badge>
                          )}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveWebhook(webhook.id)}
                            disabled={isSaving}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm">Events</Label>
                        <div className="flex flex-wrap gap-2">
                          {availableEvents.map((event) => (
                            <label
                              key={event}
                              className="flex items-center gap-2 cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={webhook.events.includes(event)}
                                onChange={() => toggleWebhookEvent(webhook.id, event)}
                                disabled={isSaving}
                                className="rounded border-gray-300 text-[#4469e5] focus:ring-[#4469e5]"
                              />
                              <span className="text-xs text-gray-700 dark:text-gray-300">{event}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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


