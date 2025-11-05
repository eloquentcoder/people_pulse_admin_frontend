import {  useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Save, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/common/components/ui/dialog';
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import { Label } from '@/common/components/ui/label';
import { Textarea } from '@/common/components/ui/textarea';
import { 
  useCreateHRTemplateCategoryMutation,
  useUpdateHRTemplateCategoryMutation,
} from '../apis/hr-template.api';
import type { HRTemplateCategory, CreateHRTemplateCategoryData, UpdateHRTemplateCategoryData } from '../models/hr-template.model';
import { toast } from 'sonner';

interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  category?: HRTemplateCategory | null;
}

const validationSchema = Yup.object({
  name: Yup.string().required('Name is required').max(255),
  slug: Yup.string().required('Slug is required').max(255),
  description: Yup.string().max(500),
  icon: Yup.string().max(10),
  color: Yup.string().matches(/^#[0-9A-F]{6}$/i, 'Invalid hex color'),
  is_active: Yup.boolean(),
});

const iconOptions = [
  '📄', '📝', '📋', '📑', '📊', '📈', '📉', '📌', '📍', '📎',
  '✉️', '📧', '📨', '📩', '📤', '📥', '📦', '📮', '🏷️', '🏢',
  '👤', '👥', '👔', '💼', '📚', '🎓', '🏆', '⭐', '🌟', '✨'
];

const colorOptions = [
  '#4469e5', '#ee9807', '#10b981', '#ef4444', '#8b5cf6',
  '#06b6d4', '#f59e0b', '#ec4899', '#6366f1', '#14b8a6'
];

export const CategoryFormModal = ({ isOpen, onClose, onSuccess, category }: CategoryFormModalProps) => {
  const [createCategory, { isLoading: isCreating }] = useCreateHRTemplateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateHRTemplateCategoryMutation();
  const isLoading = isCreating || isUpdating;

  const formik = useFormik({
    initialValues: {
      name: '',
      slug: '',
      description: '',
      icon: '',
      color: '#4469e5',
      is_active: true,
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        const categoryData: CreateHRTemplateCategoryData | UpdateHRTemplateCategoryData = {
          name: values.name,
          slug: values.slug,
          description: values.description || undefined,
          icon: values.icon || undefined,
          color: values.color || undefined,
          is_active: values.is_active,
        };

        if (category) {
          await updateCategory({ id: category.id, data: categoryData }).unwrap();
          toast.success('Category updated successfully');
        } else {
          // await createCategory(categoryData).unwrap();
          toast.success('Category created successfully');
        }
        onSuccess();
      } catch (error: any) {
        toast.error(error?.data?.message || error?.message || 'Failed to save category');
      }
    },
  });

  useEffect(() => {
    if (category) {
      formik.setValues({
        name: category.name,
        slug: category.slug,
        description: category.description || '',
        icon: category.icon || '',
        color: category.color || '#4469e5',
        is_active: category.is_active,
      });
    } else {
      formik.resetForm();
    }
  }, [category, isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{category ? 'Edit Category' : 'Create New Category'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Offer Letters"
                disabled={isLoading}
              />
              {formik.touched.name && formik.errors.name && (
                <p className="text-sm text-destructive">{formik.errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                name="slug"
                value={formik.values.slug}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="offer-letters"
                disabled={isLoading}
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
              placeholder="Brief description of this category"
              rows={3}
              disabled={isLoading}
            />
            {formik.touched.description && formik.errors.description && (
              <p className="text-sm text-destructive">{formik.errors.description}</p>
            )}
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Icon (Optional)</Label>
              <div className="flex gap-2">
                <Input
                  id="icon"
                  name="icon"
                  value={formik.values.icon}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="📄"
                  maxLength={10}
                  disabled={isLoading}
                  className="w-20"
                />
                <div className="flex-1 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                    {iconOptions.map((icon) => (
                      <button
                        key={icon}
                        type="button"
                        onClick={() => formik.setFieldValue('icon', icon)}
                        className={`w-8 h-8 flex items-center justify-center rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${
                          formik.values.icon === icon ? 'bg-blue-100 dark:bg-blue-900' : ''
                        }`}
                        disabled={isLoading}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              {formik.values.icon && (
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{formik.values.icon}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Preview</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Color</Label>
              <div className="flex gap-2">
                <Input
                  id="color"
                  name="color"
                  type="color"
                  value={formik.values.color}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={isLoading}
                  className="w-20 h-10 p-1 border border-gray-300 rounded cursor-pointer"
                />
                <Input
                  value={formik.values.color}
                  onChange={(e) => formik.setFieldValue('color', e.target.value)}
                  onBlur={formik.handleBlur}
                  placeholder="#4469e5"
                  disabled={isLoading}
                  className="flex-1"
                />
              </div>
              <div className="flex gap-2 mt-2">
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => formik.setFieldValue('color', color)}
                    className={`w-8 h-8 rounded border-2 ${
                      formik.values.color === color ? 'border-gray-900 dark:border-white' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color }}
                    disabled={isLoading}
                  />
                ))}
              </div>
              {formik.touched.color && formik.errors.color && (
                <p className="text-sm text-destructive">{formik.errors.color}</p>
              )}
              <div
                className="h-12 rounded-lg border border-gray-200 dark:border-gray-700 mt-2"
                style={{ backgroundColor: formik.values.color + '20' }}
              />
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formik.values.is_active}
              onChange={(e) => formik.setFieldValue('is_active', e.target.checked)}
              disabled={isLoading}
              className="rounded border-gray-300 text-[#4469e5] focus:ring-[#4469e5]"
            />
            <span className="text-sm text-gray-900 dark:text-white">Active</span>
          </label>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-[#4469e5] hover:bg-[#4469e5]/90">
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Category
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};


