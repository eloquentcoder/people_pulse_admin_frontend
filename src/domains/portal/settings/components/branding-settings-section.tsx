import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Save, Loader2, Palette, Image, Type } from 'lucide-react';
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import { Label } from '@/common/components/ui/label';
import { Textarea } from '@/common/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/common/components/ui/card';
import { 
  useGetBrandingSettingsQuery,
  useUpdateBrandingSettingsMutation,
} from '../apis/settings.api';
import { toast } from 'sonner';

const validationSchema = Yup.object({
  primary_color: Yup.string().matches(/^#[0-9A-F]{6}$/i, 'Invalid hex color').required(),
  secondary_color: Yup.string().matches(/^#[0-9A-F]{6}$/i, 'Invalid hex color').required(),
});

export const BrandingSettingsSection = () => {
  const { data: settingsData, isLoading } = useGetBrandingSettingsQuery();
  const [updateSettings, { isLoading: isSaving }] = useUpdateBrandingSettingsMutation();

  const formik = useFormik({
    initialValues: {
      logo_url: '',
      favicon_url: '',
      primary_color: '#4469e5',
      secondary_color: '#ee9807',
      custom_css: '',
      footer_text: '',
      show_powered_by: true,
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        await updateSettings(values).unwrap();
        toast.success('Branding settings saved successfully');
      } catch (error: any) {
        toast.error(error?.data?.message || error?.message || 'Failed to save settings');
      }
    },
  });

  useEffect(() => {
    if (settingsData?.data) {
      formik.setValues({
        logo_url: settingsData.data.logo_url || '',
        favicon_url: settingsData.data.favicon_url || '',
        primary_color: settingsData.data.primary_color || '#4469e5',
        secondary_color: settingsData.data.secondary_color || '#ee9807',
        custom_css: settingsData.data.custom_css || '',
        footer_text: settingsData.data.footer_text || '',
        show_powered_by: settingsData.data.show_powered_by ?? true,
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
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Branding Settings</h3>
        
        <div className="space-y-6">
          {/* Logo & Favicon */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image className="w-5 h-5" />
                Logo & Favicon
              </CardTitle>
              <CardDescription>Upload platform branding assets</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="logo_url">Logo URL</Label>
                  <Input
                    id="logo_url"
                    name="logo_url"
                    value={formik.values.logo_url}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="https://example.com/logo.png"
                    disabled={isSaving}
                  />
                  {formik.values.logo_url && (
                    <div className="mt-2">
                      <img
                        src={formik.values.logo_url}
                        alt="Logo preview"
                        className="h-16 object-contain border border-gray-200 dark:border-gray-700 rounded"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="favicon_url">Favicon URL</Label>
                  <Input
                    id="favicon_url"
                    name="favicon_url"
                    value={formik.values.favicon_url}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="https://example.com/favicon.ico"
                    disabled={isSaving}
                  />
                  {formik.values.favicon_url && (
                    <div className="mt-2">
                      <img
                        src={formik.values.favicon_url}
                        alt="Favicon preview"
                        className="h-8 w-8 object-contain border border-gray-200 dark:border-gray-700 rounded"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Colors */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Color Scheme
              </CardTitle>
              <CardDescription>Customize platform colors</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primary_color">Primary Color *</Label>
                  <div className="flex gap-2">
                    <Input
                      id="primary_color"
                      name="primary_color"
                      type="color"
                      value={formik.values.primary_color}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      disabled={isSaving}
                      className="w-20 h-10 p-1 border border-gray-300 rounded cursor-pointer"
                    />
                    <Input
                      value={formik.values.primary_color}
                      onChange={(e) => formik.setFieldValue('primary_color', e.target.value)}
                      onBlur={formik.handleBlur}
                      placeholder="#4469e5"
                      disabled={isSaving}
                      className="flex-1"
                    />
                  </div>
                  {formik.touched.primary_color && formik.errors.primary_color && (
                    <p className="text-sm text-destructive">{formik.errors.primary_color}</p>
                  )}
                  <div
                    className="h-12 rounded-lg border border-gray-200 dark:border-gray-700"
                    style={{ backgroundColor: formik.values.primary_color }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="secondary_color">Secondary Color *</Label>
                  <div className="flex gap-2">
                    <Input
                      id="secondary_color"
                      name="secondary_color"
                      type="color"
                      value={formik.values.secondary_color}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      disabled={isSaving}
                      className="w-20 h-10 p-1 border border-gray-300 rounded cursor-pointer"
                    />
                    <Input
                      value={formik.values.secondary_color}
                      onChange={(e) => formik.setFieldValue('secondary_color', e.target.value)}
                      onBlur={formik.handleBlur}
                      placeholder="#ee9807"
                      disabled={isSaving}
                      className="flex-1"
                    />
                  </div>
                  {formik.touched.secondary_color && formik.errors.secondary_color && (
                    <p className="text-sm text-destructive">{formik.errors.secondary_color}</p>
                  )}
                  <div
                    className="h-12 rounded-lg border border-gray-200 dark:border-gray-700"
                    style={{ backgroundColor: formik.values.secondary_color }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Custom CSS */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Type className="w-5 h-5" />
                Custom CSS
              </CardTitle>
              <CardDescription>Add custom styles to override default platform styling</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="custom_css">Custom CSS</Label>
                <Textarea
                  id="custom_css"
                  name="custom_css"
                  value={formik.values.custom_css}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="/* Custom CSS rules */"
                  rows={8}
                  disabled={isSaving}
                  className="font-mono text-sm"
                />
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <Card>
            <CardHeader>
              <CardTitle>Footer Settings</CardTitle>
              <CardDescription>Configure footer text and branding</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="footer_text">Footer Text</Label>
                <Input
                  id="footer_text"
                  name="footer_text"
                  value={formik.values.footer_text}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="© 2025 PeoplePulse. All rights reserved."
                  disabled={isSaving}
                />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formik.values.show_powered_by}
                  onChange={(e) => formik.setFieldValue('show_powered_by', e.target.checked)}
                  disabled={isSaving}
                  className="rounded border-gray-300 text-[#4469e5] focus:ring-[#4469e5]"
                />
                <span className="text-sm text-gray-900 dark:text-white">Show "Powered by PeoplePulse"</span>
              </label>
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


