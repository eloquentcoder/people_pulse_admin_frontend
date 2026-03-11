import { useState } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Edit, 
  CheckCircle,
  XCircle,
  RefreshCw,
  ChevronDown,
  Trash2,
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
import { FeatureForm } from '../components/FeatureForm';
import type { Feature, FeatureFormData } from '../types';
import { 
  useGetFeaturesQuery,
  useCreateFeatureMutation,
  useUpdateFeatureMutation,
  useDeleteFeatureMutation,
  type FeatureFilters
} from '../apis/features.api';
import { toast } from 'sonner';

const FeaturesPage = () => {
  const [filters, setFilters] = useState<FeatureFilters>({
    search: '',
    category: '',
    is_active: undefined,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);

  // RTK Query hooks
  const { data: featuresData, isLoading, refetch } = useGetFeaturesQuery(filters);
  const [createFeature] = useCreateFeatureMutation();
  const [updateFeature] = useUpdateFeatureMutation();
  const [deleteFeature] = useDeleteFeatureMutation();

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSearch = (search: string) => {
    setFilters(prev => ({ ...prev, search }));
  };

  const handleAdd = () => {
    setSelectedFeature(null);
    setShowAddModal(true);
  };

  const handleEdit = (feature: Feature) => {
    setSelectedFeature(feature);
    setShowAddModal(true);
  };

  const handleDelete = (feature: Feature) => {
    setSelectedFeature(feature);
    setDeleteDialogOpen(true);
  };

  const handleFormSubmit = async (data: FeatureFormData) => {
    try {
      if (selectedFeature) {
        await updateFeature({ id: selectedFeature.id, data }).unwrap();
        toast.success('Feature updated successfully');
      } else {
        await createFeature(data).unwrap();
        toast.success('Feature created successfully');
      }
      setShowAddModal(false);
      setSelectedFeature(null);
    } catch (error: any) {
      toast.error(error?.data?.message || error?.message || 'Failed to save feature');
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedFeature) {
      try {
        await deleteFeature(selectedFeature.id).unwrap();
        toast.success('Feature deleted successfully');
        setDeleteDialogOpen(false);
        setSelectedFeature(null);
      } catch (error: any) {
        toast.error(error?.data?.message || error?.message || 'Failed to delete feature');
      }
    }
  };

  const getStatusBadge = (isActive: boolean) => {
    if (isActive) {
      return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Active</Badge>;
    }
    return <Badge variant="outline" className="text-gray-600"><XCircle className="w-3 h-3 mr-1" />Inactive</Badge>;
  };

  const features = featuresData?.data || [];
  const groupedFeatures = features.reduce((acc, feature) => {
    if (!acc[feature.category]) {
      acc[feature.category] = [];
    }
    acc[feature.category].push(feature);
    return acc;
  }, {} as Record<string, Feature[]>);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4469e5] mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading features...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Features Management
          </h1>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-1">
            Manage features that can be assigned to subscription plans
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={handleAdd}
            className="flex items-center gap-2 bg-[#4469e5] hover:bg-[#4469e5]/90"
          >
            <Plus className="w-4 h-4" />
            Add Feature
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              <CardTitle>Filters</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              {showFilters ? 'Hide' : 'Show'} Filters
            </Button>
          </div>
        </CardHeader>
        {showFilters && (
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="search"
                    placeholder="Search features..."
                    value={filters.search || ''}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  value={filters.category || ''}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4469e5] focus:border-transparent"
                >
                  <option value="">All Categories</option>
                  <option value="core_hr">Core HR</option>
                  <option value="payroll">Payroll</option>
                  <option value="performance">Performance</option>
                  <option value="recruitment">Recruitment</option>
                  <option value="learning">Learning</option>
                  <option value="attendance">Attendance</option>
                  <option value="leave">Leave</option>
                  <option value="compliance">Compliance</option>
                  <option value="analytics">Analytics</option>
                  <option value="integrations">Integrations</option>
                  <option value="general">General</option>
                </select>
              </div>
              <div>
                <Label htmlFor="is_active">Status</Label>
                <select
                  id="is_active"
                  value={filters.is_active === undefined ? '' : String(filters.is_active)}
                  onChange={(e) => handleFilterChange('is_active', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4469e5] focus:border-transparent"
                >
                  <option value="">All Statuses</option>
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Features List */}
      <div className="space-y-6">
        {Object.keys(groupedFeatures).length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="flex flex-col items-center gap-4">
                <Tag className="w-12 h-12 text-gray-400" />
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">No features found</h3>
                  <p className="text-gray-500 dark:text-gray-400 mt-1">
                    {filters.search ? 'Try adjusting your search criteria' : 'Get started by adding your first feature'}
                  </p>
                </div>
                {!filters.search && (
                  <Button 
                    onClick={handleAdd}
                    className="flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Feature
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          Object.entries(groupedFeatures).map(([category, categoryFeatures]) => (
            <Card key={category}>
              <CardHeader>
                <CardTitle className="text-lg">
                  {category.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </CardTitle>
                <CardDescription>
                  {categoryFeatures.length} feature{categoryFeatures.length !== 1 ? 's' : ''}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {categoryFeatures.map((feature) => (
                    <div key={feature.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#4469e5] to-[#ee9807] flex items-center justify-center text-white font-bold">
                          {feature.icon || feature.name[0]}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-gray-900 dark:text-white">{feature.name}</p>
                            {getStatusBadge(feature.is_active)}
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{feature.description || 'No description'}</p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Slug: {feature.slug}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEdit(feature)}
                          className="hover:bg-green-50 hover:text-green-600"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(feature)}
                          className="hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Feature Form Modal */}
      <FeatureForm
        open={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setSelectedFeature(null);
        }}
        onSubmit={handleFormSubmit}
        feature={selectedFeature}
        loading={isLoading}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the feature "{selectedFeature?.name}".
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground"
            >
              Delete Feature
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default FeaturesPage;
