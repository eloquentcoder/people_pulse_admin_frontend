import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { X, Save, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/common/components/ui/dialog';
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import { Label } from '@/common/components/ui/label';
import { Textarea } from '@/common/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/common/components/ui/select';
import { 
  useCreateHRTemplateMutation,
  useUpdateHRTemplateMutation,
  useGetHRTemplateCategoriesQuery,
} from '../apis/hr-template.api';
import type { HRTemplate, CreateHRTemplateData, UpdateHRTemplateData } from '../models/hr-template.model';
import { toast } from 'sonner';

interface HRTemplateFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  template?: HRTemplate | null;
}

const validationSchema = Yup.object({
  category_id: Yup.number().required('Category is required'),
  title: Yup.string().required('Title is required').max(255),
  slug: Yup.string().required('Slug is required').max(255),
  description: Yup.string().max(500),
  content: Yup.string().required('Content is required'),
  is_active: Yup.boolean(),
  is_default: Yup.boolean(),
});

export const HRTemplateFormModal = ({ isOpen, onClose, onSuccess, template }: HRTemplateFormModalProps) => {
  const { data: categoriesData } = useGetHRTemplateCategoriesQuery({});
  const [createTemplate, { isLoading: isCreating }] = useCreateHRTemplateMutation();
  const [updateTemplate, { isLoading: isUpdating }] = useUpdateHRTemplateMutation();
  const isLoading = isCreating || isUpdating;

  const formik = useFormik({
    initialValues: {
      category_id: 0,
      title: '',
      slug: '',
      description: '',
      content: '',
      variables: [] as string[],
      is_active: true,
      is_default: false,
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        const templateData: CreateHRTemplateData | UpdateHRTemplateData = {
          category_id: values.category_id,
          title: values.title,
          slug: values.slug,
          description: values.description || undefined,
          content: values.content,
          variables: values.variables.length > 0 ? values.variables : undefined,
          is_active: values.is_active,
          is_default: values.is_default,
        };

        if (template) {
          await updateTemplate({ id: template.id, data: templateData }).unwrap();
          toast.success('Template updated successfully');
        } else {
          // await createTemplate(templateData).unwrap();
          toast.success('Template created successfully');
        }
        onSuccess();
      } catch (error: any) {
        toast.error(error?.data?.message || error?.message || 'Failed to save template');
      }
    },
  });

  useEffect(() => {
    if (template) {
      formik.setValues({
        category_id: template.category_id,
        title: template.title,
        slug: template.slug,
        description: template.description || '',
        content: template.content,
        variables: template.variables || [],
        is_active: template.is_active,
        is_default: template.is_default,
      });
    } else {
      formik.resetForm();
    }
  }, [template, isOpen]);

  // Extract variables from content
  const extractVariables = (content: string): string[] => {
    const regex = /\{\{(\w+)\}\}/g;
    const matches = content.matchAll(regex);
    const variables = Array.from(matches, (match) => match[1]);
    return Array.from(new Set(variables));
  };

  useEffect(() => {
    if (formik.values.content) {
      const vars = extractVariables(formik.values.content);
      formik.setFieldValue('variables', vars);
    }
  }, [formik.values.content]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{template ? 'Edit Template' : 'Create New Template'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category_id">Category *</Label>
              <Select
                value={formik.values.category_id.toString()}
                onValueChange={(value) => formik.setFieldValue('category_id', parseInt(value))}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categoriesData?.data?.data?.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formik.touched.category_id && formik.errors.category_id && (
                <p className="text-sm text-destructive">{formik.errors.category_id}</p>
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
                placeholder="offer-letter-template"
                disabled={isLoading}
              />
              {formik.touched.slug && formik.errors.slug && (
                <p className="text-sm text-destructive">{formik.errors.slug}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              name="title"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Offer Letter Template"
              disabled={isLoading}
            />
            {formik.touched.title && formik.errors.title && (
              <p className="text-sm text-destructive">{formik.errors.title}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Brief description of this template"
              rows={3}
              disabled={isLoading}
            />
            {formik.touched.description && formik.errors.description && (
              <p className="text-sm text-destructive">{formik.errors.description}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content *</Label>
            <Textarea
              id="content"
              name="content"
              value={formik.values.content}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Template content. Use {{variable_name}} for dynamic values."
              rows={15}
              disabled={isLoading}
              className="font-mono text-sm"
            />
            {formik.touched.content && formik.errors.content && (
              <p className="text-sm text-destructive">{formik.errors.content}</p>
            )}
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Use double curly braces for variables, e.g., {'{{employee_name}}'}, {'{{date}}'}, {'{{position}}'}
            </p>
          </div>

          {formik.values.variables.length > 0 && (
            <div className="space-y-2">
              <Label>Detected Variables</Label>
              <div className="flex flex-wrap gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                {formik.values.variables.map((variable) => (
                  <span
                    key={variable}
                    className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-sm"
                  >
                    {'{{'}{variable}{'}}'}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-4">
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
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formik.values.is_default}
                onChange={(e) => formik.setFieldValue('is_default', e.target.checked)}
                disabled={isLoading}
                className="rounded border-gray-300 text-[#4469e5] focus:ring-[#4469e5]"
              />
              <span className="text-sm text-gray-900 dark:text-white">Set as default</span>
            </label>
          </div>

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
                  Save Template
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

