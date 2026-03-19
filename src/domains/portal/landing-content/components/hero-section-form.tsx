import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Save, Loader2 } from 'lucide-react';
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import { Label } from '@/common/components/ui/label';
import { Textarea } from '@/common/components/ui/textarea';
import { useUpdateSectionMutation } from '../apis/landing-content.api';
import type { HeroContent } from '../models/landing-content.model';
import { toast } from 'sonner';

interface HeroSectionFormProps {
  data?: HeroContent;
}

const validationSchema = Yup.object({
  headline: Yup.string().required('Headline is required').max(200),
  subheadline: Yup.string().required('Subheadline is required').max(500),
  demo_video_url: Yup.string().url('Must be a valid URL'),
  cta_text: Yup.string().required('CTA text is required').max(50),
  cta_secondary_text: Yup.string().max(50),
});

export const HeroSectionForm = ({ data }: HeroSectionFormProps) => {
  const [updateSection, { isLoading }] = useUpdateSectionMutation();

  const formik = useFormik({
    initialValues: {
      headline: data?.headline || '',
      subheadline: data?.subheadline || '',
      demo_video_url: data?.demo_video_url || '',
      cta_text: data?.cta_text || '',
      cta_secondary_text: data?.cta_secondary_text || '',
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        await updateSection({ section: 'hero', content: values }).unwrap();
        toast.success('Hero section updated successfully');
      } catch (error: any) {
        toast.error(error?.data?.message || 'Failed to update hero section');
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="headline">Headline *</Label>
          <Input
            id="headline"
            name="headline"
            value={formik.values.headline}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="The future of people management is here"
            disabled={isLoading}
          />
          {formik.touched.headline && formik.errors.headline && (
            <p className="text-sm text-destructive">{formik.errors.headline}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="subheadline">Subheadline *</Label>
          <Textarea
            id="subheadline"
            name="subheadline"
            value={formik.values.subheadline}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Transform your HR operations with AI-driven insights..."
            rows={3}
            disabled={isLoading}
          />
          {formik.touched.subheadline && formik.errors.subheadline && (
            <p className="text-sm text-destructive">{formik.errors.subheadline}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="demo_video_url">Demo Video URL</Label>
          <Input
            id="demo_video_url"
            name="demo_video_url"
            type="url"
            value={formik.values.demo_video_url}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="https://youtube.com/watch?v=..."
            disabled={isLoading}
          />
          {formik.touched.demo_video_url && formik.errors.demo_video_url && (
            <p className="text-sm text-destructive">{formik.errors.demo_video_url}</p>
          )}
          <p className="text-xs text-gray-500">
            YouTube or Vimeo URL for the demo video
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="cta_text">Primary CTA Text *</Label>
            <Input
              id="cta_text"
              name="cta_text"
              value={formik.values.cta_text}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Get Started"
              disabled={isLoading}
            />
            {formik.touched.cta_text && formik.errors.cta_text && (
              <p className="text-sm text-destructive">{formik.errors.cta_text}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="cta_secondary_text">Secondary CTA Text</Label>
            <Input
              id="cta_secondary_text"
              name="cta_secondary_text"
              value={formik.values.cta_secondary_text}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Watch Demo"
              disabled={isLoading}
            />
            {formik.touched.cta_secondary_text && formik.errors.cta_secondary_text && (
              <p className="text-sm text-destructive">{formik.errors.cta_secondary_text}</p>
            )}
          </div>
        </div>
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
  );
};
