import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/common/components/ui/table';
import { Button } from '@/common/components/ui/button';
import { Badge } from '@/common/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/common/components/ui/dropdown-menu';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/common/components/ui/card';
import { Input } from '@/common/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/common/components/ui/select';
import { Subscription } from '../types';
import {
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Plus,
  Search,
  DollarSign,
  Users,
  Calendar,
  RefreshCw,
  X,
  ChevronLeft,
  ChevronRight,
  Building2
} from 'lucide-react';

interface SubscriptionsTableProps {
  subscriptions: Subscription[];
  loading?: boolean;
  pagination?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  onAdd: () => void;
  onEdit: (subscription: Subscription) => void;
  onView: (subscription: Subscription) => void;
  onCancel: (subscription: Subscription) => void;
  onRenew: (subscription: Subscription) => void;
  onDelete: (subscription: Subscription) => void;
  onFilter: (filters: any) => void;
  onPageChange: (page: number) => void;
}

export function SubscriptionsTable({
  subscriptions,
  loading,
  pagination,
  onAdd,
  onEdit,
  onView,
  onCancel,
  onRenew,
  onDelete,
  onFilter,
  onPageChange
}: SubscriptionsTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [billingCycleFilter, setBillingCycleFilter] = useState<string>('all');
  const [planFilter, setPlanFilter] = useState<string>('all');

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    applyFilters({ search: value, statusFilter, billingCycleFilter, planFilter });
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    applyFilters({ search: searchTerm, statusFilter: value, billingCycleFilter, planFilter });
  };

  const handleBillingCycleChange = (value: string) => {
    setBillingCycleFilter(value);
    applyFilters({ search: searchTerm, statusFilter, billingCycleFilter: value, planFilter });
  };

  const handlePlanChange = (value: string) => {
    setPlanFilter(value);
    applyFilters({ search: searchTerm, statusFilter, billingCycleFilter, planFilter: value });
  };

  const applyFilters = (filters: any) => {
    const activeFilters: any = {};
    if (filters.search) activeFilters.organization_name = filters.search;
    if (filters.statusFilter && filters.statusFilter !== 'all') {
      activeFilters.status = filters.statusFilter;
    }
    if (filters.billingCycleFilter && filters.billingCycleFilter !== 'all') {
      activeFilters.billing_cycle = filters.billingCycleFilter;
    }
    if (filters.planFilter && filters.planFilter !== 'all') {
      activeFilters.plan_id = filters.planFilter;
    }
    onFilter(activeFilters);
  };

  const formatAmount = (amount: number, cycle: string) => {
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);

    const suffix = cycle === 'monthly' ? '/mo' : cycle === 'yearly' ? '/yr' : '';
    return `${formatted}${suffix}`;
  };

  const formatDate = (date: string | null) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'trial':
        return 'secondary';
      case 'past_due':
        return 'destructive';
      case 'cancelled':
        return 'outline';
      case 'expired':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const getNextBillingDate = (subscription: Subscription) => {
    if (subscription.status === 'trial' && subscription.trial_ends_at) {
      return subscription.trial_ends_at;
    }
    return subscription.ends_at;
  };

  const canRenew = (subscription: Subscription) => {
    return subscription.status === 'cancelled' || subscription.status === 'expired';
  };

  const canCancel = (subscription: Subscription) => {
    return subscription.status === 'active' || subscription.status === 'trial';
  };

  const renderPagination = () => {
    if (!pagination || pagination.last_page <= 1) return null;

    const startItem = (pagination.current_page - 1) * pagination.per_page + 1;
    const endItem = Math.min(pagination.current_page * pagination.per_page, pagination.total);

    return (
      <div className="flex items-center justify-between px-2 py-4">
        <div className="text-sm text-muted-foreground">
          Showing {startItem} to {endItem} of {pagination.total} results
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(pagination.current_page - 1)}
            disabled={pagination.current_page <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <div className="text-sm">
            Page {pagination.current_page} of {pagination.last_page}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(pagination.current_page + 1)}
            disabled={pagination.current_page >= pagination.last_page}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Subscriptions</CardTitle>
            <CardDescription>
              Manage customer subscriptions and billing information
            </CardDescription>
          </div>
          <Button onClick={onAdd} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Subscription
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search organizations..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="trial">Trial</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="past_due">Past Due</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>
          <Select value={billingCycleFilter} onValueChange={handleBillingCycleChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Billing Cycle" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cycles</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
              <SelectItem value="one-time">One-time</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Organization</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Billing</TableHead>
                <TableHead>Next Billing</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    Loading subscriptions...
                  </TableCell>
                </TableRow>
              ) : subscriptions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    No subscriptions found. Create your first subscription to get started.
                  </TableCell>
                </TableRow>
              ) : (
                subscriptions.map((subscription) => (
                  <TableRow key={subscription.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">
                            {subscription.organization?.name || 'Unknown Organization'}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {subscription.organization?.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {subscription.plan?.name || 'Unknown Plan'}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {subscription.plan?.slug}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span className="font-semibold">
                          {formatAmount(subscription.amount, subscription.billing_cycle)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(subscription.status)}>
                        {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1).replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {subscription.billing_cycle}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {formatDate(getNextBillingDate(subscription))}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {formatDate(subscription.starts_at)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onView(subscription)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onEdit(subscription)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          {canCancel(subscription) && (
                            <DropdownMenuItem onClick={() => onCancel(subscription)}>
                              <X className="h-4 w-4 mr-2" />
                              Cancel
                            </DropdownMenuItem>
                          )}
                          {canRenew(subscription) && (
                            <DropdownMenuItem onClick={() => onRenew(subscription)}>
                              <RefreshCw className="h-4 w-4 mr-2" />
                              Renew
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() => onDelete(subscription)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {renderPagination()}
      </CardContent>
    </Card>
  );
}