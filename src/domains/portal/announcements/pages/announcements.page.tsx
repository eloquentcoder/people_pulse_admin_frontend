import { useState } from 'react';
import {
  Megaphone,
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  RefreshCw,
  Send,
  CheckCircle,
  XCircle,
  Clock,
  Mail,
  Bell,
  ChevronDown,
  ChevronUp,
  Filter,
  MoreVertical,
} from 'lucide-react';
import { Card, CardContent } from '@/common/components/ui/card';
import { Badge } from '@/common/components/ui/badge';
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/common/components/ui/dropdown-menu';
import { AnnouncementFormModal } from '../components/announcement-form-modal';
import { AnnouncementDetailsModal } from '../components/announcement-details-modal';
import type { PlatformAnnouncement, AnnouncementFilters } from '../models/announcement.model';
import { ANNOUNCEMENT_TYPES, ANNOUNCEMENT_PRIORITIES, ANNOUNCEMENT_STATUSES } from '../models/announcement.model';
import {
  useGetAnnouncementsQuery,
  useGetAnnouncementStatsQuery,
  useDeleteAnnouncementMutation,
  usePublishAnnouncementMutation,
  useUnpublishAnnouncementMutation,
  useSendAnnouncementEmailsMutation,
} from '../apis/announcements.api';
import { toast } from 'sonner';

const AnnouncementsPage = () => {
  const [filters, setFilters] = useState<AnnouncementFilters>({
    search: '',
    type: '',
    priority: '',
    status: '',
    sort_by: 'created_at',
    sort_order: 'desc',
    per_page: 15,
    page: 1,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<PlatformAnnouncement | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // API queries
  const { data: announcementsData, isLoading, refetch } = useGetAnnouncementsQuery(filters);
  const { data: statsData } = useGetAnnouncementStatsQuery();
  const [deleteAnnouncement] = useDeleteAnnouncementMutation();
  const [publishAnnouncement] = usePublishAnnouncementMutation();
  const [unpublishAnnouncement] = useUnpublishAnnouncementMutation();
  const [sendEmails] = useSendAnnouncementEmailsMutation();

  const announcements = announcementsData?.data?.data || [];
  const pagination = announcementsData?.data;
  const stats = statsData?.data;

  const handleFilterChange = (key: keyof AnnouncementFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleSearch = (search: string) => {
    setFilters(prev => ({ ...prev, search, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const handleCreate = () => {
    setSelectedAnnouncement(null);
    setShowFormModal(true);
  };

  const handleEdit = (announcement: PlatformAnnouncement) => {
    setSelectedAnnouncement(announcement);
    setShowFormModal(true);
  };

  const handleView = (announcement: PlatformAnnouncement) => {
    setSelectedAnnouncement(announcement);
    setShowDetailsModal(true);
  };

  const handleDelete = (announcement: PlatformAnnouncement) => {
    setSelectedAnnouncement(announcement);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedAnnouncement) {
      try {
        await deleteAnnouncement(selectedAnnouncement.id).unwrap();
        toast.success('Announcement deleted successfully');
        setDeleteDialogOpen(false);
        setSelectedAnnouncement(null);
      } catch (error: any) {
        toast.error(error?.data?.message || 'Failed to delete announcement');
      }
    }
  };

  const handlePublish = async (announcement: PlatformAnnouncement) => {
    try {
      await publishAnnouncement(announcement.id).unwrap();
      toast.success('Announcement published successfully');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to publish announcement');
    }
  };

  const handleUnpublish = async (announcement: PlatformAnnouncement) => {
    try {
      await unpublishAnnouncement(announcement.id).unwrap();
      toast.success('Announcement unpublished successfully');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to unpublish announcement');
    }
  };

  const handleSendEmails = async (announcement: PlatformAnnouncement) => {
    try {
      await sendEmails(announcement.id).unwrap();
      toast.success('Emails queued for sending');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to send emails');
    }
  };

  const getTypeBadge = (type: string) => {
    const typeConfig = ANNOUNCEMENT_TYPES.find(t => t.value === type);
    return (
      <Badge style={{ backgroundColor: typeConfig?.color + '20', color: typeConfig?.color, borderColor: typeConfig?.color }}>
        {typeConfig?.label || type}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = ANNOUNCEMENT_PRIORITIES.find(p => p.value === priority);
    return (
      <Badge variant="outline" style={{ borderColor: priorityConfig?.color, color: priorityConfig?.color }}>
        {priorityConfig?.label || priority}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = ANNOUNCEMENT_STATUSES.find(s => s.value === status);
    const icons: Record<string, JSX.Element> = {
      draft: <Edit className="w-3 h-3 mr-1" />,
      scheduled: <Clock className="w-3 h-3 mr-1" />,
      published: <CheckCircle className="w-3 h-3 mr-1" />,
      expired: <XCircle className="w-3 h-3 mr-1" />,
      archived: <XCircle className="w-3 h-3 mr-1" />,
    };
    return (
      <Badge style={{ backgroundColor: statusConfig?.color + '20', color: statusConfig?.color }}>
        {icons[status]}
        {statusConfig?.label || status}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Platform Announcements
          </h1>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-1">
            Send announcements to organization administrators
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => refetch()} className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
          <Button onClick={handleCreate} className="flex items-center gap-2 bg-[#4469e5] hover:bg-[#4469e5]/90">
            <Plus className="w-4 h-4" />
            New Announcement
          </Button>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                </div>
                <Megaphone className="w-8 h-8 text-[#4469e5]" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Published</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.published}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Draft</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.draft}</p>
                </div>
                <Edit className="w-8 h-8 text-gray-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Scheduled</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.scheduled}</p>
                </div>
                <Clock className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="font-medium text-gray-900 dark:text-white">Filters</span>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setShowFilters(!showFilters)}>
              {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </Button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search announcements..."
                  value={filters.search || ''}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filters.type || 'all'} onValueChange={(value) => handleFilterChange('type', value === 'all' ? '' : value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {ANNOUNCEMENT_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filters.priority || 'all'} onValueChange={(value) => handleFilterChange('priority', value === 'all' ? '' : value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All Priorities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  {ANNOUNCEMENT_PRIORITIES.map((priority) => (
                    <SelectItem key={priority.value} value={priority.value}>{priority.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filters.status || 'all'} onValueChange={(value) => handleFilterChange('status', value === 'all' ? '' : value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {ANNOUNCEMENT_STATUSES.map((status) => (
                    <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Announcements Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4469e5] mx-auto"></div>
                <p className="mt-4 text-gray-600 dark:text-gray-400">Loading announcements...</p>
              </div>
            </div>
          ) : announcements.length === 0 ? (
            <div className="text-center py-12">
              <Megaphone className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No announcements found</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">Get started by creating your first announcement</p>
              <Button onClick={handleCreate} className="flex items-center gap-2 mx-auto bg-[#4469e5] hover:bg-[#4469e5]/90">
                <Plus className="w-4 h-4" />
                New Announcement
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Title</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Type</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Priority</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Notifications</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Created</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-900 dark:text-white">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {announcements.map((announcement) => (
                    <tr key={announcement.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">{announcement.title}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                            {announcement.content.substring(0, 60)}...
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">{getTypeBadge(announcement.type)}</td>
                      <td className="py-3 px-4">{getPriorityBadge(announcement.priority)}</td>
                      <td className="py-3 px-4">{getStatusBadge(announcement.status)}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {announcement.send_notification && (
                            <Bell className="w-4 h-4 text-blue-500" title="In-app notification enabled" />
                          )}
                          {announcement.send_email && (
                            <Mail className={`w-4 h-4 ${announcement.email_sent ? 'text-green-500' : 'text-gray-400'}`} title={announcement.email_sent ? `Email sent to ${announcement.email_sent_count} recipients` : 'Email pending'} />
                          )}
                          {announcement.email_sent && (
                            <span className="text-xs text-gray-500">{announcement.email_sent_count}</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {new Date(announcement.created_at).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleView(announcement)}>
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEdit(announcement)}>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {announcement.status === 'draft' || announcement.status === 'scheduled' ? (
                              <DropdownMenuItem onClick={() => handlePublish(announcement)}>
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Publish Now
                              </DropdownMenuItem>
                            ) : announcement.status === 'published' ? (
                              <DropdownMenuItem onClick={() => handleUnpublish(announcement)}>
                                <XCircle className="w-4 h-4 mr-2" />
                                Unpublish
                              </DropdownMenuItem>
                            ) : null}
                            {announcement.status === 'published' && announcement.send_email && !announcement.email_sent && (
                              <DropdownMenuItem onClick={() => handleSendEmails(announcement)}>
                                <Send className="w-4 h-4 mr-2" />
                                Send Emails
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleDelete(announcement)} className="text-red-600">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {pagination && pagination.last_page > 1 && (
            <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Showing {((pagination.current_page - 1) * pagination.per_page) + 1} to {Math.min(pagination.current_page * pagination.per_page, pagination.total)} of {pagination.total} announcements
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.current_page - 1)}
                  disabled={pagination.current_page === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.current_page + 1)}
                  disabled={pagination.current_page === pagination.last_page}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <AnnouncementFormModal
        isOpen={showFormModal}
        onClose={() => {
          setShowFormModal(false);
          setSelectedAnnouncement(null);
        }}
        onSuccess={() => {
          refetch();
          setShowFormModal(false);
          setSelectedAnnouncement(null);
        }}
        announcement={selectedAnnouncement}
      />

      <AnnouncementDetailsModal
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedAnnouncement(null);
        }}
        announcement={selectedAnnouncement}
        onEdit={(a) => {
          setShowDetailsModal(false);
          handleEdit(a);
        }}
        onPublish={handlePublish}
        onUnpublish={handleUnpublish}
        onSendEmails={handleSendEmails}
      />

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Announcement</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedAnnouncement?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AnnouncementsPage;
