import { useState } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Edit, 
  Trash2,
  RefreshCw,
  Copy,
  FolderTree,
  CheckCircle,
  XCircle,
  MoreVertical,
  Tag
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/common/components/ui/card';
import { Badge } from '@/common/components/ui/badge';
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import { Label } from '@/common/components/ui/label';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/common/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/common/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/common/components/ui/tabs';
import { HRTemplateFormModal } from '../components/hr-template-form-modal';
import { HRTemplateDetailsModal } from '../components/hr-template-details-modal';
import { CategoryFormModal } from '../components/category-form-modal';
import { CategoryIcon } from '../components/category-icon';
import type { HRTemplate, HRTemplateCategory, HRTemplateFilters } from '../models/hr-template.model';
import { 
  useGetHRTemplatesQuery,
  useGetHRTemplateCategoriesQuery,
  useGetHRTemplateStatsQuery,
  useDeleteHRTemplateMutation,
  useDeleteHRTemplateCategoryMutation,
  useDuplicateHRTemplateMutation,
} from '../apis/hr-template.api';
import { toast } from 'sonner';

const HRTemplatesPage = () => {
  const [activeTab, setActiveTab] = useState<'templates' | 'categories'>('templates');
  const [filters, setFilters] = useState<HRTemplateFilters>({
    search: '',
    category_id: undefined,
    is_active: undefined,
    sort_by: 'created_at',
    sort_order: 'desc',
    per_page: 15,
    page: 1,
  });
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showTemplateDetails, setShowTemplateDetails] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<HRTemplate | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<HRTemplateCategory | null>(null);
  const [deleteTemplateDialogOpen, setDeleteTemplateDialogOpen] = useState(false);
  const [deleteCategoryDialogOpen, setDeleteCategoryDialogOpen] = useState(false);

  // API queries
  const { data: templatesData, isLoading: isLoadingTemplates, refetch: refetchTemplates } = useGetHRTemplatesQuery(filters);
  const { data: categoriesData, isLoading: isLoadingCategories, refetch: refetchCategories } = useGetHRTemplateCategoriesQuery({});
  const { data: statsData } = useGetHRTemplateStatsQuery();
  const [deleteTemplate] = useDeleteHRTemplateMutation();
  const [deleteCategory] = useDeleteHRTemplateCategoryMutation();
  const [duplicateTemplate] = useDuplicateHRTemplateMutation();

  const handleFilterChange = (key: keyof HRTemplateFilters, value: string | number | boolean | undefined) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const handleSearch = (search: string) => {
    setFilters(prev => ({ ...prev, search, page: 1 }));
  };

  const handleAddTemplate = () => {
    setSelectedTemplate(null);
    setShowTemplateModal(true);
  };

  const handleEditTemplate = (template: HRTemplate) => {
    setSelectedTemplate(template);
    setShowTemplateModal(true);
  };

  const handleViewTemplate = (template: HRTemplate) => {
    setSelectedTemplate(template);
    setShowTemplateDetails(true);
  };

  const handleDeleteTemplate = (template: HRTemplate) => {
    setSelectedTemplate(template);
    setDeleteTemplateDialogOpen(true);
  };

  const handleConfirmDeleteTemplate = async () => {
    if (selectedTemplate) {
      try {
        await deleteTemplate(selectedTemplate.id).unwrap();
        toast.success('Template deleted successfully');
        setDeleteTemplateDialogOpen(false);
        setSelectedTemplate(null);
      } catch (error: any) {
        toast.error(error?.data?.message || error?.message || 'Failed to delete template');
      }
    }
  };

  const handleDuplicateTemplate = async (template: HRTemplate) => {
    try {
      await duplicateTemplate(template.id).unwrap();
      toast.success('Template duplicated successfully');
    } catch (error: any) {
      toast.error(error?.data?.message || error?.message || 'Failed to duplicate template');
    }
  };

  const handleAddCategory = () => {
    setSelectedCategory(null);
    setShowCategoryModal(true);
  };

  const handleEditCategory = (category: HRTemplateCategory) => {
    setSelectedCategory(category);
    setShowCategoryModal(true);
  };

  const handleDeleteCategory = (category: HRTemplateCategory) => {
    setSelectedCategory(category);
    setDeleteCategoryDialogOpen(true);
  };

  const handleConfirmDeleteCategory = async () => {
    if (selectedCategory) {
      try {
        await deleteCategory(selectedCategory.id).unwrap();
        toast.success('Category deleted successfully');
        setDeleteCategoryDialogOpen(false);
        setSelectedCategory(null);
      } catch (error: any) {
        toast.error(error?.data?.message || error?.message || 'Failed to delete category');
      }
    }
  };

  const getStatusBadge = (isActive: boolean) => {
    if (isActive) {
      return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Active</Badge>;
    }
    return <Badge variant="outline" className="text-gray-600"><XCircle className="w-3 h-3 mr-1" />Inactive</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            HR Templates
          </h1>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-1">
            Manage HR document templates and categories
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => {
              if (activeTab === 'templates') refetchTemplates();
              else refetchCategories();
            }}
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
          {activeTab === 'templates' ? (
            <Button
              onClick={handleAddTemplate}
              className="flex items-center gap-2 bg-[#4469e5] hover:bg-[#4469e5]/90"
            >
              <Plus className="w-4 h-4" />
              New Template
            </Button>
          ) : (
            <Button
              onClick={handleAddCategory}
              className="flex items-center gap-2 bg-[#4469e5] hover:bg-[#4469e5]/90"
            >
              <Plus className="w-4 h-4" />
              New Category
            </Button>
          )}
        </div>
      </div>

      {/* Stats */}
      {statsData?.data && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Templates</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{statsData.data.total_templates}</p>
                </div>
                <FileText className="w-8 h-8 text-[#4469e5]" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Active Templates</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{statsData.data.active_templates}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Categories</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{statsData.data.total_categories}</p>
                </div>
                <FolderTree className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Active Categories</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{statsData.data.active_categories}</p>
                </div>
                <Tag className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tabs */}
      <Card>
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'templates' | 'categories')} className="w-full">
            <div className="border-b border-gray-200 dark:border-gray-700 px-6">
              <TabsList className="w-full justify-start bg-transparent p-0 h-auto">
                <TabsTrigger value="templates" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Templates
                </TabsTrigger>
                <TabsTrigger value="categories" className="flex items-center gap-2">
                  <FolderTree className="w-4 h-4" />
                  Categories
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="p-6">
              {/* Templates Tab */}
              <TabsContent value="templates" className="mt-0 space-y-4">
                {/* Filters */}
                <div className="flex flex-wrap gap-4">
                  <div className="flex-1 min-w-[200px] relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search templates..."
                      value={filters.search || ''}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select
                    value={filters.category_id?.toString() || 'all'}
                    onValueChange={(value) => handleFilterChange('category_id', value === 'all' ? undefined : parseInt(value))}
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categoriesData?.data?.data?.map((category) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={filters.is_active === undefined ? 'all' : filters.is_active ? 'active' : 'inactive'}
                    onValueChange={(value) => handleFilterChange('is_active', value === 'all' ? undefined : value === 'active')}
                  >
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Templates Table */}
                {isLoadingTemplates ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4469e5] mx-auto"></div>
                      <p className="mt-4 text-gray-600 dark:text-gray-400">Loading templates...</p>
                    </div>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                          <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Title</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Category</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Status</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Usage</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Created</th>
                          <th className="text-right py-3 px-4 font-semibold text-gray-900 dark:text-white">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {templatesData?.data?.data?.map((template) => (
                          <tr key={template.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                            <td className="py-3 px-4">
                              <div>
                                <div className="font-medium text-gray-900 dark:text-white">{template.title}</div>
                                {template.description && (
                                  <div className="text-sm text-gray-500 dark:text-gray-400">{template.description}</div>
                                )}
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              {template.category ? (
                                <Badge variant="outline">{template.category.name}</Badge>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                {getStatusBadge(template.is_active)}
                                {template.is_default && (
                                  <Badge variant="default" className="bg-blue-100 text-blue-800">Default</Badge>
                                )}
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                {template.usage_count || 0} times
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                {new Date(template.created_at).toLocaleDateString()}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleViewTemplate(template)}
                                  className="h-8 w-8 p-0"
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditTemplate(template)}
                                  className="h-8 w-8 p-0"
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDuplicateTemplate(template)}
                                  className="h-8 w-8 p-0"
                                >
                                  <Copy className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteTemplate(template)}
                                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {(!templatesData?.data?.data || templatesData.data.data.length === 0) && (
                      <div className="text-center py-12">
                        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No templates found</h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-4">
                          {filters.search ? 'Try adjusting your search criteria' : 'Get started by creating your first template'}
                        </p>
                        {!filters.search && (
                          <Button onClick={handleAddTemplate} className="flex items-center gap-2 mx-auto">
                            <Plus className="w-4 h-4" />
                            New Template
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Pagination */}
                {/* {templatesData?.data?.pagination && templatesData.data.pagination.total_pages > 1 && (
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Showing {templatesData.data.pagination.from} to {templatesData.data.pagination.to} of {templatesData.data.pagination.total} templates
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(filters.page! - 1)}
                        disabled={filters.page === 1}
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(filters.page! + 1)}
                        disabled={filters.page === templatesData.data.pagination.total_pages}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )} */}
              </TabsContent>

              {/* Categories Tab */}
              <TabsContent value="categories" className="mt-0 space-y-4">
                {isLoadingCategories ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4469e5] mx-auto"></div>
                      <p className="mt-4 text-gray-600 dark:text-gray-400">Loading categories...</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categoriesData?.data?.data?.map((category) => (
                      <Card key={category.id} className="hover:shadow-md transition-shadow">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              {category.icon && (
                                <div
                                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                                  style={{ backgroundColor: (category.color || '#4469e5') + '20' }}
                                >
                                  <CategoryIcon icon={category.icon} color={category.color} size={20} />
                                </div>
                              )}
                              <div>
                                <CardTitle className="text-lg">{category.name}</CardTitle>
                                {category.description && (
                                  <CardDescription className="mt-1">{category.description}</CardDescription>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {getStatusBadge(category.is_active)}
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                {category.templates_count || 0} templates
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditCategory(category)}
                                className="h-8 w-8 p-0"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteCategory(category)}
                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    {(!categoriesData?.data?.data || categoriesData.data.data.length === 0) && (
                      <div className="col-span-full text-center py-12">
                        <FolderTree className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No categories found</h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-4">Get started by creating your first category</p>
                        <Button onClick={handleAddCategory} className="flex items-center gap-2 mx-auto">
                          <Plus className="w-4 h-4" />
                          New Category
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>

      {/* Modals */}
      <HRTemplateFormModal
        isOpen={showTemplateModal}
        onClose={() => {
          setShowTemplateModal(false);
          setSelectedTemplate(null);
        }}
        onSuccess={() => {
          refetchTemplates();
          setShowTemplateModal(false);
          setSelectedTemplate(null);
        }}
        template={selectedTemplate}
      />

      <HRTemplateDetailsModal
        isOpen={showTemplateDetails}
        onClose={() => {
          setShowTemplateDetails(false);
          setSelectedTemplate(null);
        }}
        template={selectedTemplate}
      />

      <CategoryFormModal
        isOpen={showCategoryModal}
        onClose={() => {
          setShowCategoryModal(false);
          setSelectedCategory(null);
        }}
        onSuccess={() => {
          refetchCategories();
          setShowCategoryModal(false);
          setSelectedCategory(null);
        }}
        category={selectedCategory}
      />

      {/* Delete Dialogs */}
      <AlertDialog open={deleteTemplateDialogOpen} onOpenChange={setDeleteTemplateDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Template</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedTemplate?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDeleteTemplate} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={deleteCategoryDialogOpen} onOpenChange={setDeleteCategoryDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedCategory?.name}"? This will also delete all templates in this category. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDeleteCategory} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default HRTemplatesPage;


