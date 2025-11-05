import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Save, Loader2, Mail, Send, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import { Label } from '@/common/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/common/components/ui/card';
import { 
  useGetEmailSettingsQuery,
  useUpdateEmailSettingsMutation,
  useTestEmailMutation,
} from '../apis/settings.api';
import { toast } from 'sonner';

const validationSchema = Yup.object({
  mail_driver: Yup.string().oneOf(['smtp', 'sendmail', 'mailgun', 'ses', 'postmark']).required(),
  mail_host: Yup.string().when('mail_driver', {
    is: 'smtp',
    then: (schema) => schema.required('Mail host is required for SMTP'),
    otherwise: (schema) => schema,
  }),
  mail_port: Yup.number().when('mail_driver', {
    is: 'smtp',
    then: (schema) => schema.required('Mail port is required for SMTP'),
    otherwise: (schema) => schema,
  }),
  mail_from_address: Yup.string().email('Invalid email').required('From address is required'),
  mail_from_name: Yup.string().required('From name is required'),
  mail_reply_to: Yup.string().email('Invalid email'),
});

export const EmailSettingsSection = () => {
  const { data: settingsData, isLoading } = useGetEmailSettingsQuery();
  const [updateSettings, { isLoading: isSaving }] = useUpdateEmailSettingsMutation();
  const [testEmail, { isLoading: isTesting }] = useTestEmailMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [testEmailAddress, setTestEmailAddress] = useState('');

  const formik = useFormik({
    initialValues: {
      mail_driver: 'smtp' as 'smtp' | 'sendmail' | 'mailgun' | 'ses' | 'postmark',
      mail_host: '',
      mail_port: 587,
      mail_username: '',
      mail_password: '',
      mail_encryption: 'tls' as 'tls' | 'ssl' | null,
      mail_from_address: '',
      mail_from_name: '',
      mail_reply_to: '',
      test_email_address: '',
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        const { test_email_address: _, ...settingsToSave } = values;
        await updateSettings(settingsToSave).unwrap();
        toast.success('Email settings saved successfully');
      } catch (error: any) {
        toast.error(error?.data?.message || error?.message || 'Failed to save settings');
      }
    },
  });

  useEffect(() => {
    if (settingsData?.data) {
      formik.setValues({
        mail_driver: settingsData.data.mail_driver || 'smtp',
        mail_host: settingsData.data.mail_host || '',
        mail_port: settingsData.data.mail_port || 587,
        mail_username: settingsData.data.mail_username || '',
        mail_password: settingsData.data.mail_password || '',
        mail_encryption: settingsData.data.mail_encryption || 'tls',
        mail_from_address: settingsData.data.mail_from_address || '',
        mail_from_name: settingsData.data.mail_from_name || '',
        mail_reply_to: settingsData.data.mail_reply_to || '',
        test_email_address: settingsData.data.test_email_address || '',
      });
    }
  }, [settingsData]);

  const handleTestEmail = async () => {
    if (!testEmailAddress.trim()) {
      toast.error('Please enter a test email address');
      return;
    }
    try {
      await testEmail({ to: testEmailAddress }).unwrap();
      toast.success('Test email sent successfully');
    } catch (error: any) {
      toast.error(error?.data?.message || error?.message || 'Failed to send test email');
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
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Email Settings</h3>
        
        <div className="space-y-6">
          {/* Mail Driver */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Mail Driver Configuration
              </CardTitle>
              <CardDescription>Configure your email service provider</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="mail_driver">Mail Driver *</Label>
                <select
                  id="mail_driver"
                  name="mail_driver"
                  value={formik.values.mail_driver}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={isSaving}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4469e5] focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                >
                  <option value="smtp">SMTP</option>
                  <option value="sendmail">Sendmail</option>
                  <option value="mailgun">Mailgun</option>
                  <option value="ses">Amazon SES</option>
                  <option value="postmark">Postmark</option>
                </select>
              </div>

              {formik.values.mail_driver === 'smtp' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="mail_host">SMTP Host *</Label>
                    <Input
                      id="mail_host"
                      name="mail_host"
                      value={formik.values.mail_host}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="smtp.gmail.com"
                      disabled={isSaving}
                    />
                    {formik.touched.mail_host && formik.errors.mail_host && (
                      <p className="text-sm text-destructive">{formik.errors.mail_host}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mail_port">SMTP Port *</Label>
                    <Input
                      id="mail_port"
                      name="mail_port"
                      type="number"
                      value={formik.values.mail_port}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="587"
                      disabled={isSaving}
                    />
                    {formik.touched.mail_port && formik.errors.mail_port && (
                      <p className="text-sm text-destructive">{formik.errors.mail_port}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mail_username">SMTP Username</Label>
                    <Input
                      id="mail_username"
                      name="mail_username"
                      value={formik.values.mail_username}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="your-email@gmail.com"
                      disabled={isSaving}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mail_password">SMTP Password</Label>
                    <div className="relative">
                      <Input
                        id="mail_password"
                        name="mail_password"
                        type={showPassword ? 'text' : 'password'}
                        value={formik.values.mail_password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Enter SMTP password"
                        disabled={isSaving}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mail_encryption">Encryption</Label>
                    <select
                      id="mail_encryption"
                      name="mail_encryption"
                      value={formik.values.mail_encryption || ''}
                      onChange={(e) => formik.setFieldValue('mail_encryption', e.target.value || null)}
                      onBlur={formik.handleBlur}
                      disabled={isSaving}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4469e5] focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                    >
                      <option value="">None</option>
                      <option value="tls">TLS</option>
                      <option value="ssl">SSL</option>
                    </select>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Email From Settings */}
          <Card>
            <CardHeader>
              <CardTitle>From Address</CardTitle>
              <CardDescription>Default sender information for all emails</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="mail_from_address">From Email Address *</Label>
                  <Input
                    id="mail_from_address"
                    name="mail_from_address"
                    type="email"
                    value={formik.values.mail_from_address}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="noreply@peoplepulse.com"
                    disabled={isSaving}
                  />
                  {formik.touched.mail_from_address && formik.errors.mail_from_address && (
                    <p className="text-sm text-destructive">{formik.errors.mail_from_address}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mail_from_name">From Name *</Label>
                  <Input
                    id="mail_from_name"
                    name="mail_from_name"
                    value={formik.values.mail_from_name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="PeoplePulse"
                    disabled={isSaving}
                  />
                  {formik.touched.mail_from_name && formik.errors.mail_from_name && (
                    <p className="text-sm text-destructive">{formik.errors.mail_from_name}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mail_reply_to">Reply-To Address</Label>
                  <Input
                    id="mail_reply_to"
                    name="mail_reply_to"
                    type="email"
                    value={formik.values.mail_reply_to}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="support@peoplepulse.com"
                    disabled={isSaving}
                  />
                  {formik.touched.mail_reply_to && formik.errors.mail_reply_to && (
                    <p className="text-sm text-destructive">{formik.errors.mail_reply_to}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Test Email */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="w-5 h-5" />
                Test Email Configuration
              </CardTitle>
              <CardDescription>Send a test email to verify your configuration</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  value={testEmailAddress}
                  onChange={(e) => setTestEmailAddress(e.target.value)}
                  placeholder="test@example.com"
                  type="email"
                  disabled={isSaving || isTesting}
                  className="flex-1"
                />
                <Button
                  type="button"
                  onClick={handleTestEmail}
                  disabled={isSaving || isTesting || !testEmailAddress.trim()}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  {isTesting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Test Email
                    </>
                  )}
                </Button>
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


