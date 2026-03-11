import { useState } from 'react';
import { 
  DollarSign, 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Edit, 
  CheckCircle,
  XCircle,
  Users,
  Calendar,
  Star,
  HardDrive,
  RefreshCw,
  ChevronDown,
  Trash2
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
import { PlanForm } from '../components/PlanForm';
import { PlanDetails } from '../components/PlanDetails';
import type { Plan, PlanFormData } from '../types';
import { 
  useGetPlansQuery,
  useGetPlanStatsQuery,
  useCreatePlanMutation,
  useUpdatePlanMutation,
  useDeletePlanMutation,
  type PlanFilters
} from '../apis/plans.api';
import { toast } from 'sonner';

const PlansPage = () => {
  const [filters, setFilters] = useState<PlanFilters>({
    search: '',
    billing_cycle: '',
    is_active: '',
    sort_by: 'created_at',
    sort_order: 'desc',
    per_page: 15,
    page: 1,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  // RTK Query hooks
  const { data: plansData, isLoading, refetch } = useGetPlansQuery(filters);
  const { data: statsData } = useGetPlanStatsQuery();
  const [createPlan] = useCreatePlanMutation();
  const [updatePlan] = useUpdatePlanMutation();
  const [deletePlan] = useDeletePlanMutation();

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePerPageChange = (per_page: number) => {
    setFilters(prev => ({ ...prev, per_page, page: 1 }));
  };

  const handleSearch = (search: string) => {
    setFilters(prev => ({ ...prev, search, page: 1 }));
  };

  const handleAdd = () => {
    setSelectedPlan(null);
    setShowAddModal(true);
  };

  const handleEdit = (plan: Plan) => {
    setSelectedPlan(plan);
    setShowAddModal(true);
  };

  const handleView = (plan: Plan) => {
    setSelectedPlan(plan);
    setShowDetailsModal(true);
  };

  const handleDelete = (plan: Plan) => {
    setSelectedPlan(plan);
    setDeleteDialogOpen(true);
  };

  const handleFormSubmit = async (data: PlanFormData) => {
    try {
      if (selectedPlan) {
        await updatePlan({ id: selectedPlan.id, data }).unwrap();
        toast.success('Plan updated successfully');
      } else {
        await createPlan(data).unwrap();
        toast.success('Plan created successfully');
      }
      setShowAddModal(false);
      setSelectedPlan(null);
    } catch (error: any) {
      toast.error(error?.data?.message || error?.message || 'Failed to save plan');
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedPlan) {
      try {
        await deletePlan(selectedPlan.id).unwrap();
        toast.success('Plan deleted successfully');
        setDeleteDialogOpen(false);
        setSelectedPlan(null);
      } catch (error: any) {
        toast.error(error?.data?.message || error?.message || 'Failed to delete plan');
      }
    }
  };

  const formatPrice = (price: number, cycle: string) => {
    const formatted = new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(price);

    const suffix = cycle === 'monthly' ? '/mo' : cycle === 'yearly' ? '/yr' : '';
    return `${formatted}${suffix}`;
  };

  const getStatusBadge = (isActive: boolean) => {
    if (isActive) {
      return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Active</Badge>;
    }
    return <Badge variant="outline" className="text-gray-600"><XCircle className="w-3 h-3 mr-1" />Inactive</Badge>;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4469e5] mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading plans...</p>
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
            Plans Management
          </h1>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-1">
            Create and manage subscription plans for your platform
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={handleAdd}
            className="flex items-center gap-2 bg-[#4469e5] hover:bg-[#4469e5]/90"
          >
            <Plus className="w-4 h-4" />
            Add Plan
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {statsData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Plans</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{statsData.data.total_plans}</p>
                </div>
                <DollarSign className="w-8 h-8 text-[#4469e5]" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Plans</p>
                  <p className="text-2xl font-bold text-green-600">{statsData.data.active_plans}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Popular Plans</p>
                  <p className="text-2xl font-bold text-blue-600">{statsData.data.popular_plans}</p>
                </div>
                <Star className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Subscriptions</p>
                  <p className="text-2xl font-bold text-purple-600">{statsData.data.total_subscriptions}</p>
                </div>
                <Users className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="search"
                    placeholder="Search plans..."
                    value={filters.search || ''}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="billing_cycle">Billing Cycle</Label>
                <select
                  id="billing_cycle"
                  value={filters.billing_cycle || ''}
                  onChange={(e) => handleFilterChange('billing_cycle', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4469e5] focus:border-transparent"
                >
                  <option value="">All Cycles</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                  <option value="one-time">One-time</option>
                </select>
              </div>
              <div>
                <Label htmlFor="is_active">Status</Label>
                <select
                  id="is_active"
                  value={filters.is_active || ''}
                  onChange={(e) => handleFilterChange('is_active', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4469e5] focus:border-transparent"
                >
                  <option value="">All Statuses</option>
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
              <div>
                <Label htmlFor="sort_by">Sort By</Label>
                <select
                  id="sort_by"
                  value={filters.sort_by || 'created_at'}
                  onChange={(e) => handleFilterChange('sort_by', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4469e5] focus:border-transparent"
                >
                  <option value="created_at">Created Date</option>
                  <option value="name">Name</option>
                  <option value="price">Price</option>
                  <option value="billing_cycle">Billing Cycle</option>
                </select>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Plans Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div>
                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                  Plans
                </CardTitle>
                <CardDescription className="text-sm text-gray-600 dark:text-gray-400">
                  {plansData?.data?.total || plansData?.data?.data?.length || 0} plans found
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="per_page" className="text-sm text-gray-600 dark:text-gray-400">
                  Show:
                </Label>
                <select
                  id="per_page"
                  value={filters.per_page || 15}
                  onChange={(e) => handlePerPageChange(Number(e.target.value))}
                  className="px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-[#4469e5] focus:border-transparent"
                >
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                className="flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 dark:text-white">
                    Plan Details
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 dark:text-white">
                    Pricing
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 dark:text-white">
                    Limits
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 dark:text-white">
                    Subscriptions
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 dark:text-white">
                    Status
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 dark:text-white">
                    Created
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 dark:text-white">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {(!plansData?.data || plansData.data.data.length === 0) ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <DollarSign className="w-12 h-12 text-gray-400" />
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white">No plans found</h3>
                          <p className="text-gray-500 dark:text-gray-400 mt-1">
                            {filters.search ? 'Try adjusting your search criteria' : 'Get started by adding your first plan'}
                          </p>
                        </div>
                        {!filters.search && (
                          <Button 
                            onClick={handleAdd}
                            className="flex items-center gap-2"
                          >
                            <Plus className="w-4 h-4" />
                            Add Plan
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  plansData?.data?.data?.map((plan) => (
                    <tr key={plan.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <td className="py-6 px-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-linear-to-br from-[#4469e5] to-[#ee9807] flex items-center justify-center text-white font-bold text-lg shadow-lg">
                            {plan.name[0]}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-semibold text-gray-900 dark:text-white text-base">{plan.name}</p>
                              {plan.is_popular && (
                                <Badge variant="secondary" className="flex items-center gap-1">
                                  <Star className="h-3 w-3" />
                                  Popular
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{plan.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-6 px-6">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-900 dark:text-white">
                              {formatPrice(plan.price, plan.billing_cycle)}
                            </span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {plan.billing_cycle}
                          </Badge>
                        </div>
                      </td>
                      <td className="py-6 px-6">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">{plan.max_employees} employees</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <HardDrive className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">{plan.max_storage_gb} GB</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-6 px-6">
                        <div className="text-sm">
                          <div className="font-semibold text-gray-900 dark:text-white">{plan.active_subscriptions_count || 0} active</div>
                          <div className="text-gray-500 dark:text-gray-400">
                            {plan.subscriptions_count || 0} total
                          </div>
                        </div>
                      </td>
                      <td className="py-6 px-6">
                        {getStatusBadge(plan.is_active)}
                      </td>
                      <td className="py-6 px-6">
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Calendar className="w-4 h-4" />
                          {new Date(plan.created_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="py-6 px-6">
                        <div className="flex items-center gap-1">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleView(plan)}
                            className="hover:bg-blue-50 hover:text-blue-600"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleEdit(plan)}
                            className="hover:bg-green-50 hover:text-green-600"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(plan)}
                            className="hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Plan Form Modal */}
      <PlanForm
        open={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setSelectedPlan(null);
        }}
        onSubmit={handleFormSubmit}
        plan={selectedPlan}
        loading={isLoading}
      />

      {/* Plan Details Modal */}
      <PlanDetails
        open={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedPlan(null);
        }}
        plan={selectedPlan}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the plan "{selectedPlan?.name}".
              {selectedPlan?.active_subscriptions_count ? (
                <span className="block mt-2 text-destructive">
                  Warning: This plan has {selectedPlan.active_subscriptions_count} active subscriptions.
                </span>
              ) : null}
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground"
            >
              Delete Plan
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PlansPage;