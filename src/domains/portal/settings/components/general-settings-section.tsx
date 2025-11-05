import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Save, Loader2, Globe, Clock, DollarSign, Mail, Phone } from 'lucide-react';
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import { Label } from '@/common/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/common/components/ui/card';
import { 
  useGetGeneralSettingsQuery,
  useUpdateGeneralSettingsMutation,
} from '../apis/settings.api';
import { toast } from 'sonner';

const validationSchema = Yup.object({
  platform_name: Yup.string().required('Platform name is required').max(255),
  platform_url: Yup.string().url('Invalid URL format').required('Platform URL is required'),
  timezone: Yup.string().required('Timezone is required'),
  default_currency: Yup.string().required('Default currency is required'),
  date_format: Yup.string().required('Date format is required'),
  time_format: Yup.string().oneOf(['12h', '24h']).required('Time format is required'),
  language: Yup.string().required('Language is required'),
  week_starts_on: Yup.string().oneOf(['monday', 'sunday']).required('Week start is required'),
  fiscal_year_start: Yup.string().required('Fiscal year start is required'),
  support_email: Yup.string().email('Invalid email').required('Support email is required'),
  support_phone: Yup.string(),
});

const timezones = [
  { value: 'UTC', label: 'UTC' },
  { value: 'America/New_York', label: 'America/New_York (EST)' },
  { value: 'America/Chicago', label: 'America/Chicago (CST)' },
  { value: 'America/Denver', label: 'America/Denver (MST)' },
  { value: 'America/Los_Angeles', label: 'America/Los_Angeles (PST)' },
  { value: 'Europe/London', label: 'Europe/London (GMT)' },
  { value: 'Europe/Paris', label: 'Europe/Paris (CET)' },
  { value: 'Asia/Dubai', label: 'Asia/Dubai (GST)' },
  { value: 'Asia/Singapore', label: 'Asia/Singapore (SGT)' },
  { value: 'Asia/Tokyo', label: 'Asia/Tokyo (JST)' },
  { value: 'Australia/Sydney', label: 'Australia/Sydney (AEST)' },
];

const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'INR', 'AED', 'NGN', 'KES', 'GHS', 'ZAR'];

const dateFormats = [
  { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
  { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
  { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
  { value: 'DD MMM YYYY', label: 'DD MMM YYYY' },
];

const languages = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'pt', label: 'Portuguese' },
  { value: 'zh', label: 'Chinese' },
  { value: 'ja', label: 'Japanese' },
  { value: 'ar', label: 'Arabic' },
];

export const GeneralSettingsSection = () => {
  const { data: settingsData, isLoading } = useGetGeneralSettingsQuery();
  const [updateSettings, { isLoading: isSaving }] = useUpdateGeneralSettingsMutation();

  const formik = useFormik({
    initialValues: {
      platform_name: '',
      platform_url: '',
      timezone: 'UTC',
      default_currency: 'USD',
      date_format: 'MM/DD/YYYY',
      time_format: '12h' as '12h' | '24h',
      language: 'en',
      week_starts_on: 'monday' as 'monday' | 'sunday',
      fiscal_year_start: '01-01',
      support_email: '',
      support_phone: '',
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        await updateSettings(values).unwrap();
        toast.success('General settings saved successfully');
      } catch (error: any) {
        toast.error(error?.data?.message || error?.message || 'Failed to save settings');
      }
    },
  });

  useEffect(() => {
    if (settingsData?.data) {
      formik.setValues({
        platform_name: settingsData.data.platform_name || '',
        platform_url: settingsData.data.platform_url || '',
        timezone: settingsData.data.timezone || 'UTC',
        default_currency: settingsData.data.default_currency || 'USD',
        date_format: settingsData.data.date_format || 'MM/DD/YYYY',
        time_format: settingsData.data.time_format || '12h',
        language: settingsData.data.language || 'en',
        week_starts_on: settingsData.data.week_starts_on || 'monday',
        fiscal_year_start: settingsData.data.fiscal_year_start || '01-01',
        support_email: settingsData.data.support_email || '',
        support_phone: settingsData.data.support_phone || '',
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
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">General Settings</h3>
        
        <div className="space-y-6">
          {/* Platform Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Platform Information
              </CardTitle>
              <CardDescription>Basic platform configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="platform_name">Platform Name *</Label>
                  <Input
                    id="platform_name"
                    name="platform_name"
                    value={formik.values.platform_name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="PeoplePulse"
                    disabled={isSaving}
                  />
                  {formik.touched.platform_name && formik.errors.platform_name && (
                    <p className="text-sm text-destructive">{formik.errors.platform_name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="platform_url">Platform URL *</Label>
                  <Input
                    id="platform_url"
                    name="platform_url"
                    value={formik.values.platform_url}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="https://app.peoplepulse.com"
                    disabled={isSaving}
                  />
                  {formik.touched.platform_url && formik.errors.platform_url && (
                    <p className="text-sm text-destructive">{formik.errors.platform_url}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Localization */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Localization
              </CardTitle>
              <CardDescription>Date, time, and language preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone *</Label>
                  <select
                    id="timezone"
                    name="timezone"
                    value={formik.values.timezone}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={isSaving}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4469e5] focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  >
                    {timezones.map((tz) => (
                      <option key={tz.value} value={tz.value}>
                        {tz.label}
                      </option>
                    ))}
                  </select>
                  {formik.touched.timezone && formik.errors.timezone && (
                    <p className="text-sm text-destructive">{formik.errors.timezone}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="default_currency">Default Currency *</Label>
                  <select
                    id="default_currency"
                    name="default_currency"
                    value={formik.values.default_currency}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={isSaving}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4469e5] focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  >
                    {currencies.map((currency) => (
                      <option key={currency} value={currency}>
                        {currency}
                      </option>
                    ))}
                  </select>
                  {formik.touched.default_currency && formik.errors.default_currency && (
                    <p className="text-sm text-destructive">{formik.errors.default_currency}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date_format">Date Format *</Label>
                  <select
                    id="date_format"
                    name="date_format"
                    value={formik.values.date_format}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={isSaving}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4469e5] focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  >
                    {dateFormats.map((format) => (
                      <option key={format.value} value={format.value}>
                        {format.label}
                      </option>
                    ))}
                  </select>
                  {formik.touched.date_format && formik.errors.date_format && (
                    <p className="text-sm text-destructive">{formik.errors.date_format}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time_format">Time Format *</Label>
                  <select
                    id="time_format"
                    name="time_format"
                    value={formik.values.time_format}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={isSaving}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4469e5] focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  >
                    <option value="12h">12-hour (AM/PM)</option>
                    <option value="24h">24-hour</option>
                  </select>
                  {formik.touched.time_format && formik.errors.time_format && (
                    <p className="text-sm text-destructive">{formik.errors.time_format}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language">Language *</Label>
                  <select
                    id="language"
                    name="language"
                    value={formik.values.language}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={isSaving}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4469e5] focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  >
                    {languages.map((lang) => (
                      <option key={lang.value} value={lang.value}>
                        {lang.label}
                      </option>
                    ))}
                  </select>
                  {formik.touched.language && formik.errors.language && (
                    <p className="text-sm text-destructive">{formik.errors.language}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="week_starts_on">Week Starts On *</Label>
                  <select
                    id="week_starts_on"
                    name="week_starts_on"
                    value={formik.values.week_starts_on}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={isSaving}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4469e5] focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  >
                    <option value="monday">Monday</option>
                    <option value="sunday">Sunday</option>
                  </select>
                  {formik.touched.week_starts_on && formik.errors.week_starts_on && (
                    <p className="text-sm text-destructive">{formik.errors.week_starts_on}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fiscal_year_start">Fiscal Year Start *</Label>
                  <Input
                    id="fiscal_year_start"
                    name="fiscal_year_start"
                    type="text"
                    value={formik.values.fiscal_year_start}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="01-01"
                    disabled={isSaving}
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400">Format: MM-DD (e.g., 01-01 for January 1st)</p>
                  {formik.touched.fiscal_year_start && formik.errors.fiscal_year_start && (
                    <p className="text-sm text-destructive">{formik.errors.fiscal_year_start}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Support Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Support Information
              </CardTitle>
              <CardDescription>Contact information for support</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="support_email">Support Email *</Label>
                  <Input
                    id="support_email"
                    name="support_email"
                    type="email"
                    value={formik.values.support_email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="support@peoplepulse.com"
                    disabled={isSaving}
                  />
                  {formik.touched.support_email && formik.errors.support_email && (
                    <p className="text-sm text-destructive">{formik.errors.support_email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="support_phone">Support Phone</Label>
                  <Input
                    id="support_phone"
                    name="support_phone"
                    value={formik.values.support_phone}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="+1 (555) 123-4567"
                    disabled={isSaving}
                  />
                  {formik.touched.support_phone && formik.errors.support_phone && (
                    <p className="text-sm text-destructive">{formik.errors.support_phone}</p>
                  )}
                </div>
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


