import { useState, useRef } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Save, Loader2, Upload, X, GripVertical, Trash2, Plus } from 'lucide-react';
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import { Label } from '@/common/components/ui/label';
import { Card, CardContent } from '@/common/components/ui/card';
import {
  useUpdateSectionMutation,
  useAddCompanyMutation,
  useUpdateCompanyMutation,
  useDeleteCompanyMutation,
  useReorderCompaniesMutation,
} from '../apis/landing-content.api';
import type { TrustContent, TrustedCompany } from '../models/landing-content.model';
import { toast } from 'sonner';

interface TrustSectionFormProps {
  data?: TrustContent;
  companies?: TrustedCompany[];
}

const validationSchema = Yup.object({
  title: Yup.string().required('Title is required').max(200),
  subtitle: Yup.string().max(300),
  company_count: Yup.string().required('Company count is required').max(50),
});

export const TrustSectionForm = ({ data, companies = [] }: TrustSectionFormProps) => {
  const [updateSection, { isLoading: isSavingSection }] = useUpdateSectionMutation();
  const [addCompany, { isLoading: isAddingCompany }] = useAddCompanyMutation();
  const [updateCompany] = useUpdateCompanyMutation();
  const [deleteCompany] = useDeleteCompanyMutation();
  const [reorderCompanies] = useReorderCompaniesMutation();

  const [newCompanyName, setNewCompanyName] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [draggedId, setDraggedId] = useState<number | null>(null);

  const formik = useFormik({
    initialValues: {
      title: data?.title || '',
      subtitle: data?.subtitle || '',
      company_count: data?.company_count || '',
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        await updateSection({ section: 'trust', content: values }).unwrap();
        toast.success('Trust section updated successfully');
      } catch (error: any) {
        toast.error(error?.data?.message || 'Failed to update trust section');
      }
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image must be less than 2MB');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleAddCompany = async () => {
    if (!newCompanyName.trim()) {
      toast.error('Please enter a company name');
      return;
    }
    if (!selectedFile) {
      toast.error('Please select a logo image');
      return;
    }

    const formData = new FormData();
    formData.append('name', newCompanyName.trim());
    formData.append('logo', selectedFile);

    try {
      await addCompany(formData).unwrap();
      toast.success('Company added successfully');
      setNewCompanyName('');
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to add company');
    }
  };

  const handleDeleteCompany = async (id: number) => {
    if (!confirm('Are you sure you want to delete this company?')) return;

    try {
      await deleteCompany(id).unwrap();
      toast.success('Company deleted successfully');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to delete company');
    }
  };

  const handleDragStart = (id: number) => {
    setDraggedId(id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (targetId: number) => {
    if (draggedId === null || draggedId === targetId) {
      setDraggedId(null);
      return;
    }

    const sortedCompanies = [...companies].sort((a, b) => a.display_order - b.display_order);
    const draggedIndex = sortedCompanies.findIndex(c => c.id === draggedId);
    const targetIndex = sortedCompanies.findIndex(c => c.id === targetId);

    const newOrder = [...sortedCompanies];
    const [removed] = newOrder.splice(draggedIndex, 1);
    newOrder.splice(targetIndex, 0, removed);

    const orderData = newOrder.map((company, index) => ({
      id: company.id,
      display_order: index,
    }));

    try {
      await reorderCompanies(orderData).unwrap();
      toast.success('Order updated');
    } catch (error: any) {
      toast.error('Failed to update order');
    }

    setDraggedId(null);
  };

  const sortedCompanies = [...companies].sort((a, b) => a.display_order - b.display_order);

  return (
    <div className="space-y-8">
      {/* Section Content Form */}
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
              placeholder="Trusted by Industry Leaders"
              disabled={isSavingSection}
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
              placeholder="Powering HR for companies worldwide"
              disabled={isSavingSection}
            />
            {formik.touched.subtitle && formik.errors.subtitle && (
              <p className="text-sm text-destructive">{formik.errors.subtitle}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="company_count">Company Count Display *</Label>
            <Input
              id="company_count"
              name="company_count"
              value={formik.values.company_count}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="10,000+"
              disabled={isSavingSection}
            />
            {formik.touched.company_count && formik.errors.company_count && (
              <p className="text-sm text-destructive">{formik.errors.company_count}</p>
            )}
            <p className="text-xs text-gray-500">
              This is the text displayed, e.g., "10,000+" or "500+"
            </p>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button type="submit" disabled={isSavingSection} className="bg-orange-500 hover:bg-orange-600">
            {isSavingSection ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Section
              </>
            )}
          </Button>
        </div>
      </form>

      {/* Company Logos Management */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Company Logos</h3>
        <p className="text-sm text-gray-500">Drag and drop to reorder. Logos appear on the landing page in this order.</p>

        {/* Add New Company */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-4 items-end">
              <div className="flex-1 space-y-2">
                <Label htmlFor="newCompanyName">Company Name</Label>
                <Input
                  id="newCompanyName"
                  value={newCompanyName}
                  onChange={(e) => setNewCompanyName(e.target.value)}
                  placeholder="Company name"
                  disabled={isAddingCompany}
                />
              </div>
              <div className="flex-1 space-y-2">
                <Label htmlFor="logoUpload">Logo Image</Label>
                <div className="flex gap-2">
                  <Input
                    ref={fileInputRef}
                    id="logoUpload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    disabled={isAddingCompany}
                    className="flex-1"
                  />
                </div>
              </div>
              <Button
                type="button"
                onClick={handleAddCompany}
                disabled={isAddingCompany || !newCompanyName.trim() || !selectedFile}
                className="bg-orange-500 hover:bg-orange-600"
              >
                {isAddingCompany ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Add
                  </>
                )}
              </Button>
            </div>
            {selectedFile && (
              <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
                <span>Selected: {selectedFile.name}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedFile(null);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Company List */}
        <div className="space-y-2">
          {sortedCompanies.length === 0 ? (
            <p className="text-center py-8 text-gray-500">No companies added yet</p>
          ) : (
            sortedCompanies.map((company) => (
              <Card
                key={company.id}
                draggable
                onDragStart={() => handleDragStart(company.id)}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(company.id)}
                className={`transition-opacity ${draggedId === company.id ? 'opacity-50' : ''}`}
              >
                <CardContent className="py-3 px-4">
                  <div className="flex items-center gap-4">
                    <GripVertical className="w-5 h-5 text-gray-400 cursor-grab" />
                    <div className="w-16 h-10 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
                      <img
                        src={company.logo_url}
                        alt={company.name}
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                    <span className="flex-1 font-medium">{company.name}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteCompany(company.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
