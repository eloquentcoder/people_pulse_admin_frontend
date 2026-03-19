import { useFormik, FieldArray, FormikProvider } from 'formik';
import * as Yup from 'yup';
import { Save, Loader2, Plus, Trash2, Star } from 'lucide-react';
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import { Label } from '@/common/components/ui/label';
import { Textarea } from '@/common/components/ui/textarea';
import { Card, CardContent } from '@/common/components/ui/card';
import { useUpdateSectionMutation } from '../apis/landing-content.api';
import type { TestimonialsContent } from '../models/landing-content.model';
import { toast } from 'sonner';

interface TestimonialsSectionFormProps {
  data?: TestimonialsContent;
}

const testimonialSchema = Yup.object({
  quote: Yup.string().required('Quote is required').max(500),
  author: Yup.string().required('Author name is required').max(100),
  role: Yup.string().required('Role is required').max(100),
  company: Yup.string().required('Company is required').max(100),
  rating: Yup.number().required('Rating is required').min(1).max(5),
});

const validationSchema = Yup.object({
  title: Yup.string().required('Section title is required').max(200),
  subtitle: Yup.string().max(300),
  testimonials: Yup.array().of(testimonialSchema).min(1, 'At least one testimonial is required'),
});

export const TestimonialsSectionForm = ({ data }: TestimonialsSectionFormProps) => {
  const [updateSection, { isLoading }] = useUpdateSectionMutation();

  const formik = useFormik({
    initialValues: {
      title: data?.title || '',
      subtitle: data?.subtitle || '',
      testimonials: data?.testimonials || [
        { quote: '', author: '', role: '', company: '', rating: 5 },
      ],
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        await updateSection({ section: 'testimonials', content: values }).unwrap();
        toast.success('Testimonials section updated successfully');
      } catch (error: any) {
        toast.error(error?.data?.message || 'Failed to update testimonials section');
      }
    },
  });

  const renderStarRating = (index: number, currentRating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => formik.setFieldValue(`testimonials.${index}.rating`, star)}
            disabled={isLoading}
            className="focus:outline-none"
          >
            <Star
              className={`w-5 h-5 transition-colors ${
                star <= currentRating
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300 hover:text-yellow-300'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

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
              placeholder="Loved by HR teams everywhere"
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
              placeholder="See why thousands of companies trust PeoplePulse"
              disabled={isLoading}
            />
            {formik.touched.subtitle && formik.errors.subtitle && (
              <p className="text-sm text-destructive">{formik.errors.subtitle}</p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Testimonials</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                formik.setFieldValue('testimonials', [
                  ...formik.values.testimonials,
                  { quote: '', author: '', role: '', company: '', rating: 5 },
                ]);
              }}
              disabled={isLoading}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Testimonial
            </Button>
          </div>

          <FieldArray name="testimonials">
            {({ remove }) => (
              <div className="space-y-4">
                {formik.values.testimonials.map((testimonial, index) => (
                  <Card key={index}>
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <span className="text-sm font-medium text-gray-500">
                            Testimonial {index + 1}
                          </span>
                          {formik.values.testimonials.length > 1 && (
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

                        <div className="space-y-2">
                          <Label>Quote *</Label>
                          <Textarea
                            name={`testimonials.${index}.quote`}
                            value={testimonial.quote}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder="PeoplePulse transformed how we manage our employees..."
                            rows={3}
                            disabled={isLoading}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Author Name *</Label>
                            <Input
                              name={`testimonials.${index}.author`}
                              value={testimonial.author}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              placeholder="Sarah Mitchell"
                              disabled={isLoading}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Role *</Label>
                            <Input
                              name={`testimonials.${index}.role`}
                              value={testimonial.role}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              placeholder="VP of People Operations"
                              disabled={isLoading}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Company *</Label>
                            <Input
                              name={`testimonials.${index}.company`}
                              value={testimonial.company}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              placeholder="TechScale Inc."
                              disabled={isLoading}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Rating *</Label>
                            {renderStarRating(index, testimonial.rating)}
                          </div>
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
