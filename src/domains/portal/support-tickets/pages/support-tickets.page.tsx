import { useState } from 'react';
import { 
  MessageSquare, 
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
  AlertCircle,
  Clock,
  User,
  Building2,
  ArrowUp,
  ArrowDown,
  Mail,
  Calendar
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
  useGetSupportTicketsQuery,
  useGetSupportTicketStatsQuery,
  useUpdateTicketStatusMutation,
  useAssignTicketMutation,
  useDeleteSupportTicketMutation,
  type SupportTicketFilters
} from '../apis/support-ticket.api';
import type { SupportTicket } from '../models/support-ticket.model';
import { SupportTicketDetailsModal } from '../components/support-ticket-details-modal';
import { SupportTicketFormModal } from '../components/support-ticket-form-modal';
import { useAppSelector } from '@/common/hooks/useAppSelector';
import { toast } from 'sonner';

const SupportTicketsPage = () => {
  const { user } = useAppSelector((state) => state.auth);
  const isSuperAdmin = user?.user_type === 'platform_admin';
  
  const [filters, setFilters] = useState<SupportTicketFilters>({
    search: '',
    status: '',
    priority: '',
    category: '',
    organization_id: undefined,
    assigned_to: undefined,
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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);

  // API queries
  const { data: ticketsData, isLoading, refetch } = useGetSupportTicketsQuery(filters);
  const { data: statsData } = useGetSupportTicketStatsQuery();
  const [updateTicketStatus] = useUpdateTicketStatusMutation();
  const [assignTicket] = useAssignTicketMutation();
  const [deleteTicket] = useDeleteSupportTicketMutation();

  const handleFilterChange = (key: keyof SupportTicketFilters, value: string | number | undefined) => {
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
      await updateTicketStatus({ id, status }).unwrap();
      toast.success(`Ticket ${status.replace('_', ' ')} successfully`);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || error?.message || 'Failed to update ticket status');
    }
  };

  const handleDelete = async () => {
    if (!selectedTicket) return;
    try {
      await deleteTicket(selectedTicket.id).unwrap();
      toast.success('Ticket deleted successfully');
      setDeleteDialogOpen(false);
      setSelectedTicket(null);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || error?.message || 'Failed to delete ticket');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge variant="default" className="bg-blue-100 text-blue-800"><AlertCircle className="w-3 h-3 mr-1" />Open</Badge>;
      case 'in_progress':
        return <Badge variant="default" className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />In Progress</Badge>;
      case 'resolved':
        return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Resolved</Badge>;
      case 'closed':
        return <Badge variant="outline" className="text-gray-600"><XCircle className="w-3 h-3 mr-1" />Closed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <Badge variant="destructive"><AlertCircle className="w-3 h-3 mr-1" />Urgent</Badge>;
      case 'high':
        return <Badge variant="default" className="bg-red-100 text-red-800"><ArrowUp className="w-3 h-3 mr-1" />High</Badge>;
      case 'medium':
        return <Badge variant="default" className="bg-orange-100 text-orange-800"><ArrowUp className="w-3 h-3 mr-1" />Medium</Badge>;
      case 'low':
        return <Badge variant="outline" className="text-gray-600"><ArrowDown className="w-3 h-3 mr-1" />Low</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4469e5] mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading support tickets...</p>
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
            Support Tickets
          </h1>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-1">
            Manage and respond to customer support requests
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
          {!isSuperAdmin && (
            <Button 
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-[#4469e5] hover:bg-[#4469e5]/90"
            >
              <Plus className="w-4 h-4" />
              New Ticket
            </Button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      {statsData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Tickets</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{statsData.data.total_tickets}</p>
                </div>
                <MessageSquare className="w-8 h-8 text-[#4469e5]" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Open Tickets</p>
                  <p className="text-2xl font-bold text-blue-600">{statsData.data.open_tickets}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">In Progress</p>
                  <p className="text-2xl font-bold text-yellow-600">{statsData.data.in_progress_tickets}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Urgent</p>
                  <p className="text-2xl font-bold text-red-600">{statsData.data.urgent_tickets}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-red-500" />
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
                    placeholder="Search tickets..."
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
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              <div>
                <Label htmlFor="priority">Priority</Label>
                <select
                  id="priority"
                  value={filters.priority || ''}
                  onChange={(e) => handleFilterChange('priority', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4469e5] focus:border-transparent"
                >
                  <option value="">All Priorities</option>
                  <option value="urgent">Urgent</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
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
                  <option value="priority">Priority</option>
                  <option value="status">Status</option>
                  <option value="subject">Subject</option>
                </select>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Support Tickets Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div>
                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                  Support Tickets
                </CardTitle>
                <CardDescription className="text-sm text-gray-600 dark:text-gray-400">
                  {ticketsData?.data?.data?.length || 0} tickets found
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
                    Ticket
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 dark:text-white">
                    Organization
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 dark:text-white">
                    Priority
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 dark:text-white">
                    Status
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 dark:text-white">
                    Assigned To
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 dark:text-white">
                    Replies
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
                {ticketsData?.data?.data?.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <td className="py-6 px-6">
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white text-base">
                          #{ticket.id} - {ticket.subject}
                        </p>
                        {ticket.category && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {ticket.category}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="py-6 px-6">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {ticket.organization?.name || 'N/A'}
                        </span>
                      </div>
                      {ticket.user && (
                        <div className="flex items-center gap-2 mt-1">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {ticket.user.full_name}
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="py-6 px-6">
                      {getPriorityBadge(ticket.priority)}
                    </td>
                    <td className="py-6 px-6">
                      {getStatusBadge(ticket.status)}
                    </td>
                    <td className="py-6 px-6">
                      {ticket.assigned_user ? (
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {ticket.assigned_user.full_name}
                          </span>
                        </div>
                      ) : (
                        <Badge variant="outline" className="text-xs">Unassigned</Badge>
                      )}
                    </td>
                    <td className="py-6 px-6">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                          {ticket.replies_count || ticket.replies?.length || 0}
                        </span>
                      </div>
                    </td>
                    <td className="py-6 px-6">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Calendar className="w-4 h-4" />
                        {new Date(ticket.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="py-6 px-6">
                      <div className="flex items-center gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            setSelectedTicket(ticket);
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
                            setSelectedTicket(ticket);
                            setShowEditModal(true);
                          }}
                          className="hover:bg-green-50 hover:text-green-600"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        {ticket.status !== 'resolved' && ticket.status !== 'closed' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleStatusChange(ticket.id, 'resolved')}
                            className="hover:bg-green-50 hover:text-green-600"
                            title="Mark as resolved"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                        )}
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            setSelectedTicket(ticket);
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
                {(!ticketsData?.data || ticketsData.data.data.length === 0) && (
                  <tr>
                    <td colSpan={8} className="py-12 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <MessageSquare className="w-12 h-12 text-gray-400" />
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white">No support tickets found</h3>
                          <p className="text-gray-500 dark:text-gray-400 mt-1">
                            {filters.search ? 'Try adjusting your search criteria' : 'Get started by creating your first support ticket'}
                          </p>
                        </div>
                        {!filters.search && !isSuperAdmin && (
                          <Button 
                            onClick={() => setShowAddModal(true)}
                            className="flex items-center gap-2"
                          >
                            <Plus className="w-4 h-4" />
                            New Ticket
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
          {ticketsData && ticketsData.data.last_page > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <span>
                  Showing {((ticketsData.data.current_page - 1) * (filters.per_page || 15)) + 1} to{' '}
                  {Math.min(ticketsData.data.current_page * (filters.per_page || 15), ticketsData.data.total)} of{' '}
                  {ticketsData.data.total} results
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(1)}
                  disabled={ticketsData.data.current_page === 1}
                  className="flex items-center gap-1"
                >
                  <ChevronsLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(ticketsData.data.current_page - 1)}
                  disabled={ticketsData.data.current_page === 1}
                  className="flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, ticketsData.data.last_page) }, (_, i) => {
                    const startPage = Math.max(1, ticketsData.data.current_page - 2);
                    const page = startPage + i;
                    if (page > ticketsData.data.last_page) return null;
                    
                    return (
                      <Button
                        key={page}
                        variant={page === ticketsData.data.current_page ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                        className={`w-8 h-8 p-0 ${
                          page === ticketsData.data.current_page 
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
                  onClick={() => handlePageChange(ticketsData.data.current_page + 1)}
                  disabled={ticketsData.data.current_page === ticketsData.data.last_page}
                  className="flex items-center gap-1"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(ticketsData.data.last_page)}
                  disabled={ticketsData.data.current_page === ticketsData.data.last_page}
                  className="flex items-center gap-1"
                >
                  <ChevronsRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Support Ticket Form Modal */}
      <SupportTicketFormModal
        isOpen={showAddModal || showEditModal}
        onClose={() => {
          setShowAddModal(false);
          setShowEditModal(false);
          setSelectedTicket(null);
        }}
        onSuccess={() => {
          refetch();
          setShowAddModal(false);
          setShowEditModal(false);
          setSelectedTicket(null);
        }}
        ticket={selectedTicket}
      />

      {/* Support Ticket Details Modal */}
      <SupportTicketDetailsModal
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedTicket(null);
        }}
        onEdit={(ticket) => {
          setShowDetailsModal(false);
          setSelectedTicket(ticket);
          setShowEditModal(true);
        }}
        ticket={selectedTicket}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the support ticket "{selectedTicket?.subject}".
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground"
            >
              Delete Ticket
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SupportTicketsPage;

