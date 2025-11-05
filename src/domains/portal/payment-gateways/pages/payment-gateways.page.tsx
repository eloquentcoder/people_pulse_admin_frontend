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
  RefreshCw,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Trash2,
  Star,
  Globe,
  DollarSign,
  Shield,
  Settings,
  Zap,
  ArrowUpDown
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
  useGetPaymentGatewaysQuery,
  useGetPaymentGatewayStatsQuery,
  useActivatePaymentGatewayMutation,
  useDeactivatePaymentGatewayMutation,
  useSetDefaultGatewayMutation,
  useDeletePaymentGatewayMutation,
  type PaymentGatewayFilters
} from '../apis/payment-gateway.api';
import type { PaymentGateway } from '../models/payment-gateway.model';
import { PaymentGatewayFormModal } from '../components/payment-gateway-form-modal';
import { PaymentGatewayDetailsModal } from '../components/payment-gateway-details-modal';
import { toast } from 'sonner';

const PaymentGatewaysPage = () => {
  const [filters, setFilters] = useState<PaymentGatewayFilters>({
    search: '',
    is_active: undefined,
    supports_subscriptions: undefined,
    supports_refunds: undefined,
    supports_payouts: undefined,
    sort_by: 'priority',
    sort_order: 'asc',
    per_page: 15,
    page: 1,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedGateway, setSelectedGateway] = useState<PaymentGateway | null>(null);

  // API queries
  const { data: gatewaysData, isLoading, refetch } = useGetPaymentGatewaysQuery(filters);
  const { data: statsData } = useGetPaymentGatewayStatsQuery();
  const [activateGateway] = useActivatePaymentGatewayMutation();
  const [deactivateGateway] = useDeactivatePaymentGatewayMutation();
  const [setDefaultGateway] = useSetDefaultGatewayMutation();
  const [deleteGateway] = useDeletePaymentGatewayMutation();

  const handleFilterChange = (key: keyof PaymentGatewayFilters, value: string | number | boolean | undefined) => {
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

  const handleSort = (sortBy: string) => {
    setFilters(prev => ({
      ...prev,
      sort_by: sortBy,
      sort_order: prev.sort_by === sortBy && prev.sort_order === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleActivate = async (id: number) => {
    try {
      await activateGateway(id).unwrap();
      toast.success('Payment gateway activated successfully');
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || error?.message || 'Failed to activate payment gateway');
    }
  };

  const handleDeactivate = async (id: number) => {
    try {
      await deactivateGateway(id).unwrap();
      toast.success('Payment gateway deactivated successfully');
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || error?.message || 'Failed to deactivate payment gateway');
    }
  };

  const handleSetDefault = async (id: number) => {
    try {
      await setDefaultGateway(id).unwrap();
      toast.success('Default payment gateway updated successfully');
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || error?.message || 'Failed to set default gateway');
    }
  };

  const handleDelete = async () => {
    if (!selectedGateway) return;
    try {
      await deleteGateway(selectedGateway.id).unwrap();
      toast.success('Payment gateway deleted successfully');
      setDeleteDialogOpen(false);
      setSelectedGateway(null);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || error?.message || 'Failed to delete payment gateway');
    }
  };

  const getStatusBadge = (isActive: boolean) => {
    if (isActive) {
      return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Active</Badge>;
    }
    return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Inactive</Badge>;
  };

  const getDefaultBadge = (isDefault: boolean) => {
    if (isDefault) {
      return <Badge variant="default" className="bg-blue-100 text-blue-800"><Star className="w-3 h-3 mr-1" />Default</Badge>;
    }
    return null;
  };

  const formatFee = (percentage: number, fixed: number) => {
    const parts: string[] = [];
    if (percentage > 0) {
      parts.push(`${percentage}%`);
    }
    if (fixed > 0) {
      parts.push(`+$${fixed.toFixed(2)}`);
    }
    return parts.length > 0 ? parts.join(' ') : 'Free';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4469e5] mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading payment gateways...</p>
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
            Payment Gateways
          </h1>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-1">
            Manage payment providers and gateway configurations
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
          <Button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-[#4469e5] hover:bg-[#4469e5]/90"
          >
            <Plus className="w-4 h-4" />
            Add Gateway
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
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Gateways</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{statsData.data.total_gateways}</p>
                </div>
                <CreditCard className="w-8 h-8 text-[#4469e5]" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Gateways</p>
                  <p className="text-2xl font-bold text-green-600">{statsData.data.active_gateways}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Default Gateways</p>
                  <p className="text-2xl font-bold text-blue-600">{statsData.data.default_gateways}</p>
                </div>
                <Star className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Transactions</p>
                  <p className="text-2xl font-bold text-purple-600">{statsData.data.total_transactions}</p>
                </div>
                <DollarSign className="w-8 h-8 text-purple-500" />
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
                    placeholder="Search gateways..."
                    value={filters.search || ''}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="is_active">Status</Label>
                <select
                  id="is_active"
                  value={filters.is_active === undefined ? '' : filters.is_active.toString()}
                  onChange={(e) => handleFilterChange('is_active', e.target.value === '' ? undefined : e.target.value === 'true')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4469e5] focus:border-transparent"
                >
                  <option value="">All Status</option>
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
              <div>
                <Label htmlFor="sort_by">Sort By</Label>
                <select
                  id="sort_by"
                  value={filters.sort_by || 'priority'}
                  onChange={(e) => handleFilterChange('sort_by', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4469e5] focus:border-transparent"
                >
                  <option value="priority">Priority</option>
                  <option value="name">Name</option>
                  <option value="created_at">Created Date</option>
                  <option value="transaction_fee_percentage">Fee %</option>
                </select>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Payment Gateways Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div>
                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                  Payment Gateways
                </CardTitle>
                <CardDescription className="text-sm text-gray-600 dark:text-gray-400">
                  {gatewaysData?.data?.data?.length || 0} gateways found
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
                    Gateway
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 dark:text-white">
                    Provider Class
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 dark:text-white">
                    Currencies
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 dark:text-white">
                    Transaction Fee
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 dark:text-white">
                    Features
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 dark:text-white">
                    Status
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 dark:text-white">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {gatewaysData?.data?.data?.map((gateway) => (
                  <tr key={gateway.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <td className="py-6 px-6">
                      <div className="flex items-center gap-4">
                        {gateway.logo_url ? (
                          <img 
                            src={gateway.logo_url} 
                            alt={gateway.name}
                            className="w-12 h-12 rounded-lg object-contain"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#4469e5] to-[#ee9807] flex items-center justify-center text-white font-bold text-lg shadow-lg">
                            {gateway.name[0]}
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-gray-900 dark:text-white text-base">{gateway.name}</p>
                            {getDefaultBadge(gateway.is_default)}
                          </div>
                          {gateway.description && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{gateway.description}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-6 px-6">
                      <code className="text-xs text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                        {gateway.provider_class}
                      </code>
                    </td>
                    <td className="py-6 px-6">
                      <div className="flex flex-wrap gap-1">
                        {gateway.supported_currencies?.slice(0, 3).map((currency) => (
                          <Badge key={currency} variant="outline" className="text-xs">
                            {currency}
                          </Badge>
                        ))}
                        {gateway.supported_currencies && gateway.supported_currencies.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{gateway.supported_currencies.length - 3}
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="py-6 px-6">
                      <div className="text-sm">
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {formatFee(gateway.transaction_fee_percentage, gateway.transaction_fee_fixed)}
                        </div>
                      </div>
                    </td>
                    <td className="py-6 px-6">
                      <div className="flex flex-wrap gap-1">
                        {gateway.supports_subscriptions && (
                          <Badge variant="secondary" className="text-xs">
                            <Zap className="w-3 h-3 mr-1" />
                            Subscriptions
                          </Badge>
                        )}
                        {gateway.supports_refunds && (
                          <Badge variant="secondary" className="text-xs">
                            <ArrowUpDown className="w-3 h-3 mr-1" />
                            Refunds
                          </Badge>
                        )}
                        {gateway.supports_payouts && (
                          <Badge variant="secondary" className="text-xs">
                            <DollarSign className="w-3 h-3 mr-1" />
                            Payouts
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="py-6 px-6">
                      {getStatusBadge(gateway.is_active)}
                    </td>
                    <td className="py-6 px-6">
                      <div className="flex items-center gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            setSelectedGateway(gateway);
                            setShowDetailsModal(true);
                          }}
                          className="hover:bg-blue-50 hover:text-blue-600"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            setSelectedGateway(gateway);
                            setShowEditModal(true);
                          }}
                          className="hover:bg-green-50 hover:text-green-600"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        {!gateway.is_default && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSetDefault(gateway.id)}
                            className="hover:bg-yellow-50 hover:text-yellow-600"
                            title="Set as default"
                          >
                            <Star className="w-4 h-4" />
                          </Button>
                        )}
                        {gateway.is_active ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeactivate(gateway.id)}
                            className="hover:bg-orange-50 hover:text-orange-600"
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleActivate(gateway.id)}
                            className="hover:bg-green-50 hover:text-green-600"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                        )}
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            setSelectedGateway(gateway);
                            setDeleteDialogOpen(true);
                          }}
                          className="hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {(!gatewaysData?.data || gatewaysData.data.data.length === 0) && (
                  <tr>
                    <td colSpan={7} className="py-12 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <CreditCard className="w-12 h-12 text-gray-400" />
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white">No payment gateways found</h3>
                          <p className="text-gray-500 dark:text-gray-400 mt-1">
                            {filters.search ? 'Try adjusting your search criteria' : 'Get started by adding your first payment gateway'}
                          </p>
                        </div>
                        {!filters.search && (
                          <Button 
                            onClick={() => setShowAddModal(true)}
                            className="flex items-center gap-2"
                          >
                            <Plus className="w-4 h-4" />
                            Add Gateway
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {gatewaysData && gatewaysData.data.last_page > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <span>
                  Showing {((gatewaysData.data.current_page - 1) * (filters.per_page || 15)) + 1} to{' '}
                  {Math.min(gatewaysData.data.current_page * (filters.per_page || 15), gatewaysData.data.total)} of{' '}
                  {gatewaysData.data.total} results
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(1)}
                  disabled={gatewaysData.data.current_page === 1}
                  className="flex items-center gap-1"
                >
                  <ChevronsLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(gatewaysData.data.current_page - 1)}
                  disabled={gatewaysData.data.current_page === 1}
                  className="flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, gatewaysData.data.last_page) }, (_, i) => {
                    const startPage = Math.max(1, gatewaysData.data.current_page - 2);
                    const page = startPage + i;
                    if (page > gatewaysData.data.last_page) return null;
                    
                    return (
                      <Button
                        key={page}
                        variant={page === gatewaysData.data.current_page ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                        className={`w-8 h-8 p-0 ${
                          page === gatewaysData.data.current_page 
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
                  onClick={() => handlePageChange(gatewaysData.data.current_page + 1)}
                  disabled={gatewaysData.data.current_page === gatewaysData.data.last_page}
                  className="flex items-center gap-1"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(gatewaysData.data.last_page)}
                  disabled={gatewaysData.data.current_page === gatewaysData.data.last_page}
                  className="flex items-center gap-1"
                >
                  <ChevronsRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Gateway Form Modal */}
      <PaymentGatewayFormModal
        isOpen={showAddModal || showEditModal}
        onClose={() => {
          setShowAddModal(false);
          setShowEditModal(false);
          setSelectedGateway(null);
        }}
        onSuccess={() => {
          refetch();
          setShowAddModal(false);
          setShowEditModal(false);
          setSelectedGateway(null);
        }}
        gateway={selectedGateway}
      />

      {/* Payment Gateway Details Modal */}
      <PaymentGatewayDetailsModal
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedGateway(null);
        }}
        onEdit={(gateway) => {
          setShowDetailsModal(false);
          setSelectedGateway(gateway);
          setShowEditModal(true);
        }}
        gateway={selectedGateway}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the payment gateway "{selectedGateway?.name}".
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground"
            >
              Delete Gateway
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PaymentGatewaysPage;

