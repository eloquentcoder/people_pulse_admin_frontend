import { useFormik } from 'formik';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/common/components/ui/dialog';
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import { Label } from '@/common/components/ui/label';
import { Textarea } from '@/common/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/common/components/ui/select';
import { Switch } from '@/common/components/ui/switch';
import { Feature, FeatureFormData } from '../types';
import * as Yup from 'yup';

interface FeatureFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: FeatureFormData) => void;
  feature?: Feature | null;
  loading?: boolean;
}

const featureValidationSchema = Yup.object({
  name: Yup.string().required('Name is required').max(255, 'Name must be less than 255 characters'),
  slug: Yup.string().required('Slug is required').matches(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  description: Yup.string().max(1000, 'Description must be less than 1000 characters'),
  category: Yup.string().required('Category is required'),
  is_active: Yup.boolean(),
  display_order: Yup.number().min(0, 'Display order must be 0 or greater'),
  icon: Yup.string().max(100, 'Icon must be less than 100 characters'),
});

const FEATURE_CATEGORIES = [
  'core_hr',
  'payroll',
  'performance',
  'recruitment',
  'learning',
  'attendance',
  'leave',
  'compliance',
  'analytics',
  'integrations',
  'general',
];

export function FeatureForm({ open, onClose, onSubmit, feature, loading }: FeatureFormProps) {
  const formik = useFormik<FeatureFormData>({
    initialValues: {
      name: feature?.name || '',
      slug: feature?.slug || '',
      description: feature?.description || '',
      category: feature?.category || 'general',
      is_active: feature?.is_active ?? true,
      display_order: feature?.display_order || 0,
      icon: feature?.icon || null,
    },
    validationSchema: featureValidationSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
    enableReinitialize: true,
  });

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    formik.setFieldValue('name', name);
    if (!feature) {
      formik.setFieldValue('slug', generateSlug(name));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{feature ? 'Edit Feature' : 'Create New Feature'}</DialogTitle>
          <DialogDescription>
            {feature ? 'Update the feature details.' : 'Add a new feature to the registry.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Feature Name</Label>
              <Input
                id="name"
                name="name"
                value={formik.values.name}
                onChange={handleNameChange}
                onBlur={formik.handleBlur}
                placeholder="e.g., Employee Management"
              />
              {formik.touched.name && formik.errors.name && (
                <p className="text-sm text-destructive">{formik.errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                name="slug"
                value={formik.values.slug}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="e.g., employee-management"
              />
              {formik.touched.slug && formik.errors.slug && (
                <p className="text-sm text-destructive">{formik.errors.slug}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Describe this feature..."
              rows={3}
            />
            {formik.touched.description && formik.errors.description && (
              <p className="text-sm text-destructive">{formik.errors.description}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formik.values.category}
                onValueChange={(value) => formik.setFieldValue('category', value)}
              >
                <SelectTrigger id="category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FEATURE_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formik.touched.category && formik.errors.category && (
                <p className="text-sm text-destructive">{formik.errors.category}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="display_order">Display Order</Label>
              <Input
                id="display_order"
                name="display_order"
                type="number"
                value={formik.values.display_order}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                min={0}
              />
              {formik.touched.display_order && formik.errors.display_order && (
                <p className="text-sm text-destructive">{formik.errors.display_order}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="icon">Icon (Optional)</Label>
            <Input
              id="icon"
              name="icon"
              value={formik.values.icon || ''}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="e.g., Users, Calendar"
            />
            {formik.touched.icon && formik.errors.icon && (
              <p className="text-sm text-destructive">{formik.errors.icon}</p>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="is_active">Active Status</Label>
                <p className="text-sm text-muted-foreground">
                  Enable this feature for assignment to plans
                </p>
              </div>
              <Switch
                id="is_active"
                checked={formik.values.is_active}
                onCheckedChange={(checked) => formik.setFieldValue('is_active', checked)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : feature ? 'Update Feature' : 'Create Feature'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
