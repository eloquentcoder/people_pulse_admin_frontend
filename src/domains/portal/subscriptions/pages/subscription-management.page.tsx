import { useState } from 'react';
import {
  CreditCard,
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Banknote,
  Calendar,
  RefreshCw,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  CalendarClock
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/common/components/ui/card';
import { Badge } from '@/common/components/ui/badge';
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import { Label } from '@/common/components/ui/label';
import {
  useGetSubscriptionsQuery,
  useGetSubscriptionStatsQuery,
  useCancelSubscriptionMutation,
  useRenewSubscriptionMutation,
  useDeleteSubscriptionMutation,
  useUpdateSubscriptionMutation,
  useCreateSubscriptionMutation,
} from '../apis/subscription.api';
import type {  SubscriptionFilters } from '../models/subscription.model';
import { toast } from 'sonner';
import type { Subscription, SubscriptionFormData } from '../types';
import { SubscriptionDetails } from '../components/SubscriptionDetails';
import { SubscriptionForm } from '../components/SubscriptionForm';
import { ExtendTrialDialog } from '../components/ExtendTrialDialog';
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
import { toCreatePayload, toUpdatePayload } from '../utils/mapFormData';
import { useGetOrganizationsQuery } from '@/domains/portal/organizations/apis/organization.api';
import { PermissionGate } from '@/common/components/permission-gate';

// Format amount in Naira
const formatNaira = (amount: number) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

const SubscriptionManagementPage = () => {
  const [filters, setFilters] = useState<SubscriptionFilters>({
    search: '',
    status: '',
    plan_id: undefined,
    organization_id: undefined,
    created_from: '',
    created_to: '',
    sort_by: 'created_at',
    sort_order: 'desc',
    per_page: 15,
    page: 1,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showExtendTrialModal, setShowExtendTrialModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{ type: 'disable' | 'delete'; id: number } | null>(null);
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);

  // API queries
  const { data: subscriptionsData, isLoading, refetch } = useGetSubscriptionsQuery(filters);
  const { data: statsData } = useGetSubscriptionStatsQuery();
  const [cancelSubscription] = useCancelSubscriptionMutation();
  const [renewSubscription] = useRenewSubscriptionMutation();
  const [deleteSubscription] = useDeleteSubscriptionMutation();
  const [updateSubscription, { isLoading: isUpdating }] = useUpdateSubscriptionMutation();
  const [createSubscription, { isLoading: isCreating }] = useCreateSubscriptionMutation();
  const { data: organizationsData } = useGetOrganizationsQuery({});
  const organizations = organizationsData?.data?.data ?? [];

  const handleFilterChange = (key: keyof SubscriptionFilters, value: string | number | undefined) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const handlePerPageChange = (per_page: number) => {
    setFilters(prev => ({ ...prev, per_page, page: 1 }));
  };

  const handleSearch = (search: string) => {
    setFilters(prev => ({ ...prev, search, page: 1 }));
  };

  const handleCancel = async (id: number) => {
    try {
      await cancelSubscription(id).unwrap();
      toast.success('Subscription cancelled successfully');
    } catch (error) {
      console.error('Failed to cancel subscription:', error);
      toast.error('Failed to cancel subscription');
    }
  };

  const handleRenew = async (id: number) => {
    try {
      await renewSubscription(id).unwrap();
      toast.success('Subscription renewed successfully');
    } catch (error) {
      console.error('Failed to renew subscription:', error);
      toast.error('Failed to renew subscription');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteSubscription(id).unwrap();
      toast.success('Subscription deleted successfully');
    } catch (error) {
      console.error('Failed to delete subscription:', error);
      toast.error('Failed to delete subscription');
    }
  };

  const closeModals = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setShowDetailsModal(false);
    setShowExtendTrialModal(false);
    setSelectedSubscription(null);
  };

  const runConfirm = async () => {
    if (!confirmAction) return;
    if (confirmAction.type === 'disable') {
      await handleCancel(confirmAction.id);
    } else {
      await handleDelete(confirmAction.id);
    }
    setConfirmAction(null);
  };

  const handleExtendTrial = async (newTrialEndsAt: string) => {
    if (!selectedSubscription) return;
    try {
      await updateSubscription({
        id: selectedSubscription.id,
        data: { trial_ends_at: newTrialEndsAt },
      }).unwrap();
      toast.success('Trial extended successfully');
      closeModals();
    } catch (error) {
      console.error('Failed to extend trial:', error);
      toast.error('Failed to extend trial');
    }
  };

  const handleSave = async (formData: SubscriptionFormData) => {
    try {
      if (selectedSubscription) {
        await updateSubscription({
          id: selectedSubscription.id,
          data: toUpdatePayload(formData),
        }).unwrap();
        toast.success('Subscription updated successfully');
      } else {
        await createSubscription(toCreatePayload(formData)).unwrap();
        toast.success('Subscription created successfully');
      }
      closeModals();
    } catch (error) {
      console.error('Failed to save subscription:', error);
      toast.error('Failed to save subscription');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Active</Badge>;
      case 'trial':
        return <Badge variant="outline" className="text-orange-600"><Clock className="w-3 h-3 mr-1" />Trial</Badge>;
      case 'cancelled':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Cancelled</Badge>;
      case 'past_due':
        return <Badge variant="destructive"><AlertTriangle className="w-3 h-3 mr-1" />Past Due</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getBillingCycleBadge = (cycle: string) => {
    switch (cycle) {
      case 'monthly':
        return <Badge variant="outline" className="text-blue-600">Monthly</Badge>;
      case 'yearly':
        return <Badge variant="outline" className="text-purple-600">Yearly</Badge>;
      default:
        return <Badge variant="outline">{cycle}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4469e5] mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading subscriptions...</p>
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
            Subscription Management
          </h1>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-1">
            Manage customer subscriptions, billing, and subscription lifecycle
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => refetch()}
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
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
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{statsData.data.total_subscriptions}</p>
                </div>
                <CreditCard className="w-8 h-8 text-[#4469e5]" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active</p>
                  <p className="text-2xl font-bold text-green-600">{statsData.data.active_subscriptions}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Trial</p>
                  <p className="text-2xl font-bold text-orange-600">{statsData.data.trial_subscriptions}</p>
                </div>
                <Clock className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Revenue</p>
                  <p className="text-2xl font-bold text-blue-600">{formatNaira(statsData.data.total_revenue)}</p>
                </div>
                <Banknote className="w-8 h-8 text-blue-500" />
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
                    placeholder="Search subscriptions..."
                    value={filters.search || ''}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  value={filters.status || ''}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4469e5] focus:border-transparent"
                >
                  <option value="">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="trial">Trial</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="past_due">Past Due</option>
                </select>
              </div>
              <div>
                <Label htmlFor="billing_cycle">Billing Cycle</Label>
                <select
                  id="billing_cycle"
                  value={filters.sort_by || 'created_at'}
                  onChange={(e) => handleFilterChange('sort_by', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4469e5] focus:border-transparent"
                >
                  <option value="created_at">Created Date</option>
                  <option value="amount">Amount</option>
                  <option value="status">Status</option>
                  <option value="organization">Organization</option>
                </select>
              </div>
              <div>
                <Label htmlFor="sort_order">Sort Order</Label>
                <select
                  id="sort_order"
                  value={filters.sort_order || 'desc'}
                  onChange={(e) => handleFilterChange('sort_order', e.target.value as 'asc' | 'desc')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4469e5] focus:border-transparent"
                >
                  <option value="desc">Descending</option>
                  <option value="asc">Ascending</option>
                </select>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Subscriptions Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div>
                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                  Subscriptions
                </CardTitle>
                <CardDescription className="text-sm text-gray-600 dark:text-gray-400">
                  {subscriptionsData?.data.total || 0} subscriptions found
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
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 dark:text-white">
                    Organization
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 dark:text-white">
                    Plan
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 dark:text-white">
                    Status
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 dark:text-white">
                    Amount
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 dark:text-white">
                    Billing
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
                {subscriptionsData?.data.data.map((subscription) => (
                  <tr key={subscription.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <td className="py-6 px-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#4469e5] to-[#ee9807] flex items-center justify-center text-white font-bold text-lg shadow-lg">
                          {subscription.organization?.name[0] || 'O'}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white text-base">
                            {subscription.organization?.name || 'Unknown Organization'}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {subscription.organization?.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-6 px-6">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {subscription.plan?.name || 'Unknown Plan'}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {subscription.plan?.description}
                        </p>
                      </div>
                    </td>
                    <td className="py-6 px-6">
                      {getStatusBadge(subscription.status)}
                    </td>
                    <td className="py-6 px-6">
                      <div className="flex items-center gap-2">
                        <Banknote className="w-4 h-4 text-gray-400" />
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {formatNaira(subscription.amount)}
                        </span>
                      </div>
                    </td>
                    <td className="py-6 px-6">
                      {getBillingCycleBadge(subscription.billing_cycle)}
                    </td>
                    <td className="py-6 px-6">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Calendar className="w-4 h-4" />
                        {new Date(subscription.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="py-6 px-6">
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          aria-label="View subscription"
                          onClick={() => {
                            setSelectedSubscription(subscription);
                            setShowDetailsModal(true);
                          }}
                          className="hover:bg-blue-50 hover:text-blue-600"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <PermissionGate permission="edit-subscriptions">
                        <Button
                          variant="ghost"
                          size="sm"
                          aria-label="Edit subscription"
                          onClick={() => {
                            setSelectedSubscription(subscription);
                            setShowEditModal(true);
                          }}
                          className="hover:bg-green-50 hover:text-green-600"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        </PermissionGate>
                        {subscription.status === 'trial' && (
                          <PermissionGate permission="edit-subscriptions">
                          <Button
                            variant="ghost"
                            size="sm"
                            aria-label="Extend trial"
                            onClick={() => {
                              setSelectedSubscription(subscription);
                              setShowExtendTrialModal(true);
                            }}
                            className="hover:bg-orange-50 hover:text-orange-600"
                          >
                            <CalendarClock className="w-4 h-4" />
                          </Button>
                          </PermissionGate>
                        )}
                        {subscription.status === 'active' ? (
                          <PermissionGate permission="cancel-subscriptions">
                          <Button
                            variant="ghost"
                            size="sm"
                            aria-label="Disable subscription"
                            onClick={() => setConfirmAction({ type: 'disable', id: subscription.id })}
                            className="hover:bg-red-50 hover:text-red-600"
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>
                          </PermissionGate>
                        ) : subscription.status === 'cancelled' ? (
                          <PermissionGate permission="edit-subscriptions">
                          <Button
                            variant="ghost"
                            size="sm"
                            aria-label="Enable subscription"
                            onClick={() => handleRenew(subscription.id)}
                            className="hover:bg-green-50 hover:text-green-600"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                          </PermissionGate>
                        ) : null}
                        <PermissionGate permission="delete-subscriptions">
                        <Button
                          variant="ghost"
                          size="sm"
                          aria-label="Delete subscription"
                          onClick={() => setConfirmAction({ type: 'delete', id: subscription.id })}
                          className="hover:bg-red-50 hover:text-red-600"
                        >
                          <XCircle className="w-4 h-4" />
                        </Button>
                        </PermissionGate>
                      </div>
                    </td>
                  </tr>
                ))}
                {(!subscriptionsData?.data || subscriptionsData.data.data.length === 0) && (
                  <tr>
                    <td colSpan={7} className="py-12 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <CreditCard className="w-12 h-12 text-gray-400" />
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white">No subscriptions found</h3>
                          <p className="text-gray-500 dark:text-gray-400 mt-1">
                            {filters.search ? 'Try adjusting your search criteria' : 'Get started by adding your first subscription'}
                          </p>
                        </div>
                        {!filters.search && (
                          <PermissionGate permission="create-subscriptions">
                          <Button 
                            onClick={() => setShowAddModal(true)}
                            className="flex items-center gap-2"
                          >
                            <Plus className="w-4 h-4" />
                            Add Subscription
                          </Button>
                          </PermissionGate>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {subscriptionsData && subscriptionsData.data.last_page > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <span>
                  Showing {((subscriptionsData.data.current_page - 1) * (filters.per_page || 15)) + 1} to{' '}
                  {Math.min(subscriptionsData.data.current_page * (filters.per_page || 15), subscriptionsData.data.total)} of{' '}
                  {subscriptionsData.data.total} results
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(1)}
                  disabled={subscriptionsData.data.current_page === 1}
                  className="flex items-center gap-1"
                >
                  <ChevronsLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(subscriptionsData.data.current_page - 1)}
                  disabled={subscriptionsData.data.current_page === 1}
                  className="flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, subscriptionsData.data.last_page) }, (_, i) => {
                    const startPage = Math.max(1, subscriptionsData.data.current_page - 2);
                    const page = startPage + i;
                    if (page > subscriptionsData.data.last_page) return null;
                    
                    return (
                      <Button
                        key={page}
                        variant={page === subscriptionsData.data.current_page ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                        className={`w-8 h-8 p-0 ${
                          page === subscriptionsData.data.current_page 
                            ? 'bg-[#4469e5] text-white' 
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </Button>
                    );
                  })}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(subscriptionsData.data.current_page + 1)}
                  disabled={subscriptionsData.data.current_page === subscriptionsData.data.last_page}
                  className="flex items-center gap-1"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(subscriptionsData.data.last_page)}
                  disabled={subscriptionsData.data.current_page === subscriptionsData.data.last_page}
                  className="flex items-center gap-1"
                >
                  <ChevronsRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View details modal */}
      <SubscriptionDetails
        open={showDetailsModal}
        onClose={closeModals}
        subscription={selectedSubscription}
        onEdit={(subscription) => {
          setSelectedSubscription(subscription);
          setShowDetailsModal(false);
          setShowEditModal(true);
        }}
        onCancel={(subscription) => handleCancel(subscription.id)}
        onRenew={(subscription) => handleRenew(subscription.id)}
      />

      {/* Create / edit modal */}
      <PermissionGate permission={showEditModal ? 'edit-subscriptions' : 'create-subscriptions'}>
      <SubscriptionForm
        open={showAddModal || showEditModal}
        onClose={closeModals}
        onSubmit={handleSave}
        subscription={showEditModal ? selectedSubscription : null}
        loading={isUpdating || isCreating}
        organizations={organizations}
      />
      </PermissionGate>

      {/* Extend trial modal */}
      <PermissionGate permission="edit-subscriptions">
      <ExtendTrialDialog
        open={showExtendTrialModal}
        onClose={closeModals}
        subscription={selectedSubscription}
        onConfirm={handleExtendTrial}
        loading={isUpdating}
      />
      </PermissionGate>

      {/* Disable / delete confirmation */}
      <AlertDialog
        open={!!confirmAction}
        onOpenChange={(open) => !open && setConfirmAction(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmAction?.type === 'delete'
                ? 'Delete subscription?'
                : 'Disable subscription?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmAction?.type === 'delete'
                ? 'This permanently removes the subscription. This action cannot be undone.'
                : 'This cancels the subscription and revokes access. You can re-enable it later.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <PermissionGate permission={confirmAction?.type === 'delete' ? 'delete-subscriptions' : 'cancel-subscriptions'}>
            <AlertDialogAction onClick={runConfirm}>
              {confirmAction?.type === 'delete' ? 'Delete' : 'Disable'}
            </AlertDialogAction>
            </PermissionGate>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SubscriptionManagementPage;
