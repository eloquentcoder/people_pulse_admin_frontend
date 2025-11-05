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
import { Plan } from '../types';
import {
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Plus,
  Search,
  DollarSign,
  Users,
  HardDrive,
  Star
} from 'lucide-react';

interface PlansTableProps {
  plans: Plan[];
  loading?: boolean;
  onAdd: () => void;
  onEdit: (plan: Plan) => void;
  onView: (plan: Plan) => void;
  onDelete: (plan: Plan) => void;
  onFilter: (filters: any) => void;
}

export function PlansTable({
  plans,
  loading,
  onAdd,
  onEdit,
  onView,
  onDelete,
  onFilter
}: PlansTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [billingCycle, setBillingCycle] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    applyFilters({ search: value, billingCycle, statusFilter });
  };

  const handleBillingCycleChange = (value: string) => {
    setBillingCycle(value);
    applyFilters({ search: searchTerm, billingCycle: value, statusFilter });
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    applyFilters({ search: searchTerm, billingCycle, statusFilter: value });
  };

  const applyFilters = (filters: any) => {
    const activeFilters: any = {};
    if (filters.search) activeFilters.search = filters.search;
    if (filters.billingCycle && filters.billingCycle !== 'all') {
      activeFilters.billing_cycle = filters.billingCycle;
    }
    if (filters.statusFilter && filters.statusFilter !== 'all') {
      activeFilters.is_active = filters.statusFilter === 'active';
    }
    onFilter(activeFilters);
  };

  const formatPrice = (price: number, cycle: string) => {
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);

    const suffix = cycle === 'monthly' ? '/mo' : cycle === 'yearly' ? '/yr' : '';
    return `${formatted}${suffix}`;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Subscription Plans</CardTitle>
            <CardDescription>
              Manage subscription plans and pricing for your platform
            </CardDescription>
          </div>
          <Button onClick={onAdd} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Plan
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search plans..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={billingCycle} onValueChange={handleBillingCycleChange}>
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
          <Select value={statusFilter} onValueChange={handleStatusChange}>
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

        {/* Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Plan Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Billing</TableHead>
                <TableHead>Limits</TableHead>
                <TableHead>Trial</TableHead>
                <TableHead>Subscriptions</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    Loading plans...
                  </TableCell>
                </TableRow>
              ) : plans.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    No plans found. Create your first plan to get started.
                  </TableCell>
                </TableRow>
              ) : (
                plans.map((plan) => (
                  <TableRow key={plan.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div>
                          <div className="font-medium">{plan.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {plan.slug}
                          </div>
                        </div>
                        {plan.is_popular && (
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <Star className="h-3 w-3" />
                            Popular
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span className="font-semibold">
                          {formatPrice(plan.price, plan.billing_cycle)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {plan.billing_cycle}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Users className="h-3 w-3 text-muted-foreground" />
                          <span>{plan.max_employees} employees</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <HardDrive className="h-3 w-3 text-muted-foreground" />
                          <span>{plan.max_storage_gb} GB</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {plan.trial_days > 0 ? (
                        <Badge variant="secondary">
                          {plan.trial_days} days
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{plan.active_subscriptions_count || 0} active</div>
                        <div className="text-muted-foreground">
                          {plan.subscriptions_count || 0} total
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={plan.is_active ? 'default' : 'secondary'}>
                        {plan.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onView(plan)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onEdit(plan)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onDelete(plan)}
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
      </CardContent>
    </Card>
  );
}