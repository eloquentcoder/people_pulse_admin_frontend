import { useFormik, FieldArray, FormikProvider } from 'formik';
import * as Yup from 'yup';
import { Save, Loader2, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import { Label } from '@/common/components/ui/label';
import { Textarea } from '@/common/components/ui/textarea';
import { Card, CardContent } from '@/common/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/common/components/ui/select';
import { useUpdateSectionMutation } from '../apis/landing-content.api';
import type { FeaturesContent } from '../models/landing-content.model';
import { AVAILABLE_ICONS } from '../models/landing-content.model';
import { toast } from 'sonner';

interface FeaturesSectionFormProps {
  data?: FeaturesContent;
}

const featureSchema = Yup.object({
  icon: Yup.string().required('Icon is required'),
  title: Yup.string().required('Title is required').max(100),
  description: Yup.string().required('Description is required').max(300),
});

const validationSchema = Yup.object({
  title: Yup.string().required('Section title is required').max(200),
  subtitle: Yup.string().max(300),
  features: Yup.array().of(featureSchema).min(1, 'At least one feature is required'),
});

export const FeaturesSectionForm = ({ data }: FeaturesSectionFormProps) => {
  const [updateSection, { isLoading }] = useUpdateSectionMutation();

  const formik = useFormik({
    initialValues: {
      title: data?.title || '',
      subtitle: data?.subtitle || '',
      features: data?.features || [{ icon: 'Users', title: '', description: '' }],
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        await updateSection({ section: 'features', content: values }).unwrap();
        toast.success('Features section updated successfully');
      } catch (error: any) {
        toast.error(error?.data?.message || 'Failed to update features section');
      }
    },
  });

  return (
    <FormikProvider value={formik}>
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Section Title *</Label>
            <Input
              id="title"
              name="title"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Everything you need, one platform"
              disabled={isLoading}
            />
            {formik.touched.title && formik.errors.title && (
              <p className="text-sm text-destructive">{formik.errors.title}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="subtitle">Subtitle</Label>
            <Input
              id="subtitle"
              name="subtitle"
              value={formik.values.subtitle}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Comprehensive HR management tools"
              disabled={isLoading}
            />
            {formik.touched.subtitle && formik.errors.subtitle && (
              <p className="text-sm text-destructive">{formik.errors.subtitle}</p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Features</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                formik.setFieldValue('features', [
                  ...formik.values.features,
                  { icon: 'Users', title: '', description: '' },
                ]);
              }}
              disabled={isLoading}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Feature
            </Button>
          </div>

          <FieldArray name="features">
            {({ remove }) => (
              <div className="space-y-4">
                {formik.values.features.map((feature, index) => (
                  <Card key={index}>
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <span className="text-sm font-medium text-gray-500">
                            Feature {index + 1}
                          </span>
                          {formik.values.features.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => remove(index)}
                              disabled={isLoading}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Icon *</Label>
                            <Select
                              value={feature.icon}
                              onValueChange={(value) =>
                                formik.setFieldValue(`features.${index}.icon`, value)
                              }
                              disabled={isLoading}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select icon" />
                              </SelectTrigger>
                              <SelectContent>
                                {AVAILABLE_ICONS.map((icon) => (
                                  <SelectItem key={icon.value} value={icon.value}>
                                    {icon.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label>Title *</Label>
                            <Input
                              name={`features.${index}.title`}
                              value={feature.title}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              placeholder="Employee Management"
                              disabled={isLoading}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Description *</Label>
                          <Textarea
                            name={`features.${index}.description`}
                            value={feature.description}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder="Complete employee lifecycle management..."
                            rows={2}
                            disabled={isLoading}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </FieldArray>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button type="submit" disabled={isLoading} className="bg-orange-500 hover:bg-orange-600">
            {isLoading ? (
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
    </FormikProvider>
  );
};
