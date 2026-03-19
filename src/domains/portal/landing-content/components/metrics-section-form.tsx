import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Save, Loader2 } from 'lucide-react';
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import { Label } from '@/common/components/ui/label';
import { useUpdateSectionMutation } from '../apis/landing-content.api';
import type { MetricsContent } from '../models/landing-content.model';
import { toast } from 'sonner';

interface MetricsSectionFormProps {
  data?: MetricsContent;
}

const validationSchema = Yup.object({
  satisfaction_percent: Yup.string().required('Satisfaction percentage is required').max(20),
  companies_count: Yup.string().required('Companies count is required').max(20),
  employees_managed: Yup.string().required('Employees managed is required').max(20),
  average_rating: Yup.string().required('Average rating is required').max(20),
});

export const MetricsSectionForm = ({ data }: MetricsSectionFormProps) => {
  const [updateSection, { isLoading }] = useUpdateSectionMutation();

  const formik = useFormik({
    initialValues: {
      satisfaction_percent: data?.satisfaction_percent || '',
      companies_count: data?.companies_count || '',
      employees_managed: data?.employees_managed || '',
      average_rating: data?.average_rating || '',
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        await updateSection({ section: 'metrics', content: values }).unwrap();
        toast.success('Metrics section updated successfully');
      } catch (error: any) {
        toast.error(error?.data?.message || 'Failed to update metrics section');
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      <p className="text-sm text-gray-500">
        These metrics are displayed as key statistics on the landing page. Enter values as you want them displayed (e.g., "98%", "10,000+", "2M+").
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="satisfaction_percent">Customer Satisfaction *</Label>
          <Input
            id="satisfaction_percent"
            name="satisfaction_percent"
            value={formik.values.satisfaction_percent}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="98%"
            disabled={isLoading}
          />
          {formik.touched.satisfaction_percent && formik.errors.satisfaction_percent && (
            <p className="text-sm text-destructive">{formik.errors.satisfaction_percent}</p>
          )}
          <p className="text-xs text-gray-500">E.g., "98%", "95%"</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="companies_count">Companies Count *</Label>
          <Input
            id="companies_count"
            name="companies_count"
            value={formik.values.companies_count}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="10,000+"
            disabled={isLoading}
          />
          {formik.touched.companies_count && formik.errors.companies_count && (
            <p className="text-sm text-destructive">{formik.errors.companies_count}</p>
          )}
          <p className="text-xs text-gray-500">E.g., "10,000+", "500+"</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="employees_managed">Employees Managed *</Label>
          <Input
            id="employees_managed"
            name="employees_managed"
            value={formik.values.employees_managed}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="2M+"
            disabled={isLoading}
          />
          {formik.touched.employees_managed && formik.errors.employees_managed && (
            <p className="text-sm text-destructive">{formik.errors.employees_managed}</p>
          )}
          <p className="text-xs text-gray-500">E.g., "2M+", "500K+"</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="average_rating">Average Rating *</Label>
          <Input
            id="average_rating"
            name="average_rating"
            value={formik.values.average_rating}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="4.8/5"
            disabled={isLoading}
          />
          {formik.touched.average_rating && formik.errors.average_rating && (
            <p className="text-sm text-destructive">{formik.errors.average_rating}</p>
          )}
          <p className="text-xs text-gray-500">E.g., "4.8/5", "4.9 stars"</p>
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
