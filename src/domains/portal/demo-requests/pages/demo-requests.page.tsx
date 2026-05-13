import { useState } from 'react';
import {
  Calendar,
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  RefreshCw,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Trash2,
  Clock,
  User,
  Building2,
  Mail,
  Phone,
  CalendarDays
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/common/components/ui/dialog';
import {
  useGetDemoRequestsQuery,
  useGetDemoRequestStatsQuery,
  useUpdateDemoRequestStatusMutation,
  useDeleteDemoRequestMutation,
} from '../apis/demo-request.api';
import type { DemoRequest, DemoRequestFilters } from '../models/demo-request.model';
import { toast } from 'sonner';

const DemoRequestsPage = () => {
  const [filters, setFilters] = useState<DemoRequestFilters>({
    search: '',
    status: '',
    sort_by: 'created_at',
    sort_order: 'desc',
    per_page: 15,
    page: 1,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<DemoRequest | null>(null);

  // API queries
  const { data: requestsData, isLoading, refetch } = useGetDemoRequestsQuery(filters);
  const { data: statsData } = useGetDemoRequestStatsQuery();
  const [updateStatus] = useUpdateDemoRequestStatusMutation();
  const [deleteRequest] = useDeleteDemoRequestMutation();

  const handleFilterChange = (key: keyof DemoRequestFilters, value: string | number | undefined) => {
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

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await updateStatus({ id, status }).unwrap();
      toast.success(`Status updated to "${status}" successfully`);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || error?.message || 'Failed to update status');
    }
  };

  const handleDelete = async () => {
    if (!selectedRequest) return;
    try {
      await deleteRequest(selectedRequest.id).unwrap();
      toast.success('Demo request deleted successfully');
      setDeleteDialogOpen(false);
      setSelectedRequest(null);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || error?.message || 'Failed to delete demo request');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="default" className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'contacted':
        return <Badge variant="default" className="bg-blue-100 text-blue-800"><Phone className="w-3 h-3 mr-1" />Contacted</Badge>;
      case 'completed':
        return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Completed</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="text-gray-600"><XCircle className="w-3 h-3 mr-1" />Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4469e5] mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading demo requests...</p>
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
            Demo Requests
          </h1>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-1">
            Manage and respond to demo scheduling requests
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => refetch()}
          className="flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      {statsData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Requests</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{statsData.data.total}</p>
                </div>
                <Calendar className="w-8 h-8 text-[#4469e5]" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">{statsData.data.pending}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Contacted</p>
                  <p className="text-2xl font-bold text-blue-600">{statsData.data.contacted}</p>
                </div>
                <Phone className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">This Month</p>
                  <p className="text-2xl font-bold text-green-600">{statsData.data.this_month}</p>
                </div>
                <CalendarDays className="w-8 h-8 text-green-500" />
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
                    placeholder="Search by name, email, company..."
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
                  <option value="pending">Pending</option>
                  <option value="contacted">Contacted</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
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
                  <option value="company_name">Company</option>
                  <option value="preferred_date">Preferred Date</option>
                </select>
              </div>
              <div>
                <Label htmlFor="sort_order">Order</Label>
                <select
                  id="sort_order"
                  value={filters.sort_order || 'desc'}
                  onChange={(e) => handleFilterChange('sort_order', e.target.value as 'asc' | 'desc')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4469e5] focus:border-transparent"
                >
                  <option value="desc">Newest First</option>
                  <option value="asc">Oldest First</option>
                </select>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Demo Requests Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div>
                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                  Demo Requests
                </CardTitle>
                <CardDescription className="text-sm text-gray-600 dark:text-gray-400">
                  {requestsData?.data?.total || 0} requests found
                </CardDescription>
              </div>
            </div>
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
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 dark:text-white">
                    Contact
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 dark:text-white">
                    Company
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 dark:text-white">
                    Preferred Schedule
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 dark:text-white">
                    Status
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 dark:text-white">
                    Submitted
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 dark:text-white">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {requestsData?.data?.data?.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <td className="py-6 px-6">
                      <div>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <p className="font-semibold text-gray-900 dark:text-white">{request.name}</p>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <a href={`mailto:${request.email}`} className="text-sm text-blue-600 hover:underline">
                            {request.email}
                          </a>
                        </div>
                        {request.phone && (
                          <div className="flex items-center gap-2 mt-1">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <a href={`tel:${request.phone}`} className="text-sm text-gray-600">
                              {request.phone}
                            </a>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-6 px-6">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-900 dark:text-white font-medium">
                          {request.company_name}
                        </span>
                      </div>
                    </td>
                    <td className="py-6 px-6">
                      {request.preferred_date || request.preferred_time ? (
                        <div>
                          {request.preferred_date && (
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-600">{formatDate(request.preferred_date)}</span>
                            </div>
                          )}
                          {request.preferred_time && (
                            <div className="flex items-center gap-2 mt-1">
                              <Clock className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-600">{request.preferred_time}</span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">Not specified</span>
                      )}
                    </td>
                    <td className="py-6 px-6">
                      {getStatusBadge(request.status)}
                    </td>
                    <td className="py-6 px-6">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <CalendarDays className="w-4 h-4" />
                        {formatDate(request.created_at)}
                      </div>
                    </td>
                    <td className="py-6 px-6">
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedRequest(request);
                            setDetailsDialogOpen(true);
                          }}
                          className="hover:bg-blue-50 hover:text-blue-600"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        {request.status === 'pending' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleStatusChange(request.id, 'contacted')}
                            className="hover:bg-blue-50 hover:text-blue-600"
                            title="Mark as Contacted"
                          >
                            <Phone className="w-4 h-4" />
                          </Button>
                        )}
                        {request.status === 'contacted' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleStatusChange(request.id, 'completed')}
                            className="hover:bg-green-50 hover:text-green-600"
                            title="Mark as Completed"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedRequest(request);
                            setDeleteDialogOpen(true);
                          }}
                          className="hover:bg-red-50 hover:text-red-600"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {(!requestsData?.data || requestsData.data.data.length === 0) && (
                  <tr>
                    <td colSpan={6} className="py-12 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <Calendar className="w-12 h-12 text-gray-400" />
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white">No demo requests found</h3>
                          <p className="text-gray-500 dark:text-gray-400 mt-1">
                            {filters.search || filters.status ? 'Try adjusting your filters' : 'Demo requests will appear here when submitted'}
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {requestsData && requestsData.data.last_page > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <span>
                  Showing {((requestsData.data.current_page - 1) * (filters.per_page || 15)) + 1} to{' '}
                  {Math.min(requestsData.data.current_page * (filters.per_page || 15), requestsData.data.total)} of{' '}
                  {requestsData.data.total} results
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(1)}
                  disabled={requestsData.data.current_page === 1}
                >
                  <ChevronsLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(requestsData.data.current_page - 1)}
                  disabled={requestsData.data.current_page === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, requestsData.data.last_page) }, (_, i) => {
                    const startPage = Math.max(1, requestsData.data.current_page - 2);
                    const page = startPage + i;
                    if (page > requestsData.data.last_page) return null;

                    return (
                      <Button
                        key={page}
                        variant={page === requestsData.data.current_page ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                        className={`w-8 h-8 p-0 ${
                          page === requestsData.data.current_page
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
                  onClick={() => handlePageChange(requestsData.data.current_page + 1)}
                  disabled={requestsData.data.current_page === requestsData.data.last_page}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(requestsData.data.last_page)}
                  disabled={requestsData.data.current_page === requestsData.data.last_page}
                >
                  <ChevronsRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Demo Request Details</DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-500">Name</Label>
                  <p className="font-medium">{selectedRequest.name}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Status</Label>
                  <div className="mt-1">{getStatusBadge(selectedRequest.status)}</div>
                </div>
              </div>
              <div>
                <Label className="text-gray-500">Email</Label>
                <p>
                  <a href={`mailto:${selectedRequest.email}`} className="text-blue-600 hover:underline">
                    {selectedRequest.email}
                  </a>
                </p>
              </div>
              {selectedRequest.phone && (
                <div>
                  <Label className="text-gray-500">Phone</Label>
                  <p>
                    <a href={`tel:${selectedRequest.phone}`} className="text-blue-600 hover:underline">
                      {selectedRequest.phone}
                    </a>
                  </p>
                </div>
              )}
              <div>
                <Label className="text-gray-500">Company</Label>
                <p className="font-medium">{selectedRequest.company_name}</p>
              </div>
              {(selectedRequest.preferred_date || selectedRequest.preferred_time) && (
                <div className="grid grid-cols-2 gap-4">
                  {selectedRequest.preferred_date && (
                    <div>
                      <Label className="text-gray-500">Preferred Date</Label>
                      <p>{formatDate(selectedRequest.preferred_date)}</p>
                    </div>
                  )}
                  {selectedRequest.preferred_time && (
                    <div>
                      <Label className="text-gray-500">Preferred Time</Label>
                      <p>{selectedRequest.preferred_time}</p>
                    </div>
                  )}
                </div>
              )}
              <div>
                <Label className="text-gray-500">Submitted</Label>
                <p>{formatDateTime(selectedRequest.created_at)}</p>
              </div>

              {/* Status Actions */}
              <div className="flex gap-2 pt-4 border-t">
                {selectedRequest.status === 'pending' && (
                  <Button
                    onClick={() => {
                      handleStatusChange(selectedRequest.id, 'contacted');
                      setDetailsDialogOpen(false);
                    }}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Mark as Contacted
                  </Button>
                )}
                {selectedRequest.status === 'contacted' && (
                  <Button
                    onClick={() => {
                      handleStatusChange(selectedRequest.id, 'completed');
                      setDetailsDialogOpen(false);
                    }}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Mark as Completed
                  </Button>
                )}
                {selectedRequest.status !== 'cancelled' && selectedRequest.status !== 'completed' && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      handleStatusChange(selectedRequest.id, 'cancelled');
                      setDetailsDialogOpen(false);
                    }}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the demo request from "{selectedRequest?.company_name}".
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground"
            >
              Delete Request
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DemoRequestsPage;
