import { useState } from 'react';
import { 
  Bell, 
  Search, 
  Filter, 
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
  Calendar,
  Mail,
  CheckCheck,
  Eye,
  EyeOff,
  Info,
  AlertTriangle,
  Zap
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
  useGetNotificationsQuery,
  useGetNotificationStatsQuery,
  useMarkAsReadMutation,
  useMarkAsUnreadMutation,
  useMarkAllAsReadMutation,
  useDeleteNotificationMutation,
  useDeleteNotificationsMutation,
  
} from '../apis/notification.api';
import type { Notification, NotificationFilters } from '../models/notification.model';
import { toast } from 'sonner';

const NotificationsPage = () => {
  const [filters, setFilters] = useState<NotificationFilters>({
    search: '',
    type: '',
    is_read: undefined,
    priority: '',
    created_from: '',
    created_to: '',
    sort_by: 'created_at',
    sort_order: 'desc',
    per_page: 15,
    page: 1,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteAllDialogOpen, setDeleteAllDialogOpen] = useState(false);

  // API queries
  const { data: notificationsData, isLoading, refetch } = useGetNotificationsQuery(filters);
  const { data: statsData } = useGetNotificationStatsQuery();
  const [markAsRead] = useMarkAsReadMutation();
  const [markAsUnread] = useMarkAsUnreadMutation();
  const [markAllAsRead] = useMarkAllAsReadMutation();
  const [deleteNotification] = useDeleteNotificationMutation();
  const [deleteNotifications] = useDeleteNotificationsMutation();

  const handleFilterChange = (key: keyof NotificationFilters, value: string | number | boolean | undefined) => {
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

  const handleToggleSelection = (id: string) => {
    setSelectedNotifications(prev => 
      prev.includes(id) 
        ? prev.filter(nId => nId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedNotifications.length === (notificationsData?.data?.data?.length || 0)) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(notificationsData?.data?.data?.map(n => n.id) || []);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsRead({ notification_ids: [id] }).unwrap();
      toast.success('Notification marked as read');
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || error?.message || 'Failed to mark as read');
    }
  };

  const handleMarkAsUnread = async (id: string) => {
    try {
      await markAsUnread({ notification_ids: [id] }).unwrap();
      toast.success('Notification marked as unread');
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || error?.message || 'Failed to mark as unread');
    }
  };

  const handleMarkSelectedAsRead = async () => {
    if (selectedNotifications.length === 0) return;
    try {
      await markAsRead({ notification_ids: selectedNotifications }).unwrap();
      toast.success(`${selectedNotifications.length} notification(s) marked as read`);
      setSelectedNotifications([]);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || error?.message || 'Failed to mark as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead().unwrap();
      toast.success('All notifications marked as read');
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || error?.message || 'Failed to mark all as read');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteNotification(id).unwrap();
      toast.success('Notification deleted successfully');
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || error?.message || 'Failed to delete notification');
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedNotifications.length === 0) return;
    try {
      await deleteNotifications({ ids: selectedNotifications }).unwrap();
      toast.success(`${selectedNotifications.length} notification(s) deleted successfully`);
      setSelectedNotifications([]);
      setDeleteDialogOpen(false);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || error?.message || 'Failed to delete notifications');
    }
  };

  const getNotificationIcon = (type?: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'system':
        return <Zap className="w-5 h-5 text-blue-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getPriorityBadge = (priority?: string) => {
    if (!priority) return null;
    switch (priority) {
      case 'high':
        return <Badge variant="destructive" className="text-xs">High</Badge>;
      case 'medium':
        return <Badge variant="default" className="bg-orange-100 text-orange-800 text-xs">Medium</Badge>;
      case 'low':
        return <Badge variant="outline" className="text-xs">Low</Badge>;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4469e5] mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading notifications...</p>
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
            Notifications
          </h1>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-1">
            Manage and view all platform notifications
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
          {notificationsData?.data?.data && notificationsData.data.data.length > 0 && (
            <Button
              variant="outline"
              onClick={handleMarkAllAsRead}
              className="flex items-center gap-2"
            >
              <CheckCheck className="w-4 h-4" />
              Mark All Read
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
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{statsData.data.total_notifications}</p>
                </div>
                <Bell className="w-8 h-8 text-[#4469e5]" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Unread</p>
                  <p className="text-2xl font-bold text-blue-600">{statsData.data.unread_notifications}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Read</p>
                  <p className="text-2xl font-bold text-green-600">{statsData.data.read_notifications}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Today</p>
                  <p className="text-2xl font-bold text-purple-600">{statsData.data.notifications_today}</p>
                </div>
                <Calendar className="w-8 h-8 text-purple-500" />
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
                    placeholder="Search notifications..."
                    value={filters.search || ''}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="is_read">Status</Label>
                <select
                  id="is_read"
                  value={filters.is_read === undefined ? '' : filters.is_read.toString()}
                  onChange={(e) => handleFilterChange('is_read', e.target.value === '' ? undefined : e.target.value === 'true')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4469e5] focus:border-transparent"
                >
                  <option value="">All</option>
                  <option value="false">Unread</option>
                  <option value="true">Read</option>
                </select>
              </div>
              <div>
                <Label htmlFor="type">Type</Label>
                <select
                  id="type"
                  value={filters.type || ''}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4469e5] focus:border-transparent"
                >
                  <option value="">All Types</option>
                  <option value="info">Info</option>
                  <option value="success">Success</option>
                  <option value="warning">Warning</option>
                  <option value="error">Error</option>
                  <option value="system">System</option>
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
                  <option value="read_at">Read Date</option>
                  <option value="type">Type</option>
                </select>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Bulk Actions */}
      {selectedNotifications.length > 0 && (
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {selectedNotifications.length} notification(s) selected
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleMarkSelectedAsRead}
                  className="flex items-center gap-2"
                >
                  <CheckCheck className="w-4 h-4" />
                  Mark as Read
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDeleteDialogOpen(true)}
                  className="flex items-center gap-2 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedNotifications([])}
                >
                  Clear
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notifications List */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div>
                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                  Notifications
                </CardTitle>
                <CardDescription className="text-sm text-gray-600 dark:text-gray-400">
                  {notificationsData?.data?.data?.length || 0} notifications found
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {notificationsData?.data?.data && notificationsData.data.data.length > 0 && (
                <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600 dark:text-gray-400">
                  <input
                    type="checkbox"
                    checked={selectedNotifications.length === notificationsData.data.data.length}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-[#4469e5] focus:ring-[#4469e5]"
                  />
                  Select All
                </label>
              )}
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
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {notificationsData?.data?.data?.map((notification) => {
              const isSelected = selectedNotifications.includes(notification.id);
              const isRead = !!notification.read_at;
              const notificationData = notification.data;
              
              return (
                <div
                  key={notification.id}
                  className={`p-6 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                    !isRead ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                  } ${isSelected ? 'bg-blue-100 dark:bg-blue-900/30' : ''}`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex items-center gap-3 flex-1">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleSelection(notification.id)}
                        className="mt-1 rounded border-gray-300 text-[#4469e5] focus:ring-[#4469e5]"
                      />
                      <div className="flex-shrink-0">
                        {getNotificationIcon(notificationData.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className={`font-semibold text-gray-900 dark:text-white ${!isRead ? 'font-bold' : ''}`}>
                                {notificationData.title}
                              </h3>
                              {!isRead && (
                                <Badge variant="default" className="bg-blue-100 text-blue-800 text-xs">
                                  New
                                </Badge>
                              )}
                              {getPriorityBadge(notificationData.priority)}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                              {notificationData.message}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(notification.created_at).toLocaleString()}
                              </div>
                              {notification.read_at && (
                                <div className="flex items-center gap-1">
                                  <CheckCircle className="w-3 h-3" />
                                  Read {new Date(notification.read_at).toLocaleString()}
                                </div>
                              )}
                            </div>
                            {notificationData.action_url && (
                              <div className="mt-2">
                                <a
                                  href={notificationData.action_url}
                                  className="text-sm text-[#4469e5] hover:underline inline-flex items-center gap-1"
                                >
                                  {notificationData.action_text || 'View Details'}
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {isRead ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleMarkAsUnread(notification.id)}
                          className="hover:bg-blue-50 hover:text-blue-600"
                          title="Mark as unread"
                        >
                          <EyeOff className="w-4 h-4" />
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="hover:bg-green-50 hover:text-green-600"
                          title="Mark as read"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(notification.id)}
                        className="hover:bg-red-50 hover:text-red-600"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
            {(!notificationsData?.data || notificationsData.data.data.length === 0) && (
              <div className="py-12 text-center">
                <div className="flex flex-col items-center gap-4">
                  <Bell className="w-12 h-12 text-gray-400" />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">No notifications found</h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                      {filters.search ? 'Try adjusting your search criteria' : 'You\'re all caught up!'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Pagination */}
          {notificationsData && notificationsData.data.last_page > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <span>
                  Showing {((notificationsData.data.current_page - 1) * (filters.per_page || 15)) + 1} to{' '}
                  {Math.min(notificationsData.data.current_page * (filters.per_page || 15), notificationsData.data.total)} of{' '}
                  {notificationsData.data.total} results
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(1)}
                  disabled={notificationsData.data.current_page === 1}
                  className="flex items-center gap-1"
                >
                  <ChevronsLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(notificationsData.data.current_page - 1)}
                  disabled={notificationsData.data.current_page === 1}
                  className="flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, notificationsData.data.last_page) }, (_, i) => {
                    const startPage = Math.max(1, notificationsData.data.current_page - 2);
                    const page = startPage + i;
                    if (page > notificationsData.data.last_page) return null;
                    
                    return (
                      <Button
                        key={page}
                        variant={page === notificationsData.data.current_page ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                        className={`w-8 h-8 p-0 ${
                          page === notificationsData.data.current_page 
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
                  onClick={() => handlePageChange(notificationsData.data.current_page + 1)}
                  disabled={notificationsData.data.current_page === notificationsData.data.last_page}
                  className="flex items-center gap-1"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(notificationsData.data.last_page)}
                  disabled={notificationsData.data.current_page === notificationsData.data.last_page}
                  className="flex items-center gap-1"
                >
                  <ChevronsRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Selected Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {selectedNotifications.length} selected notification(s).
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteSelected}
              className="bg-destructive text-destructive-foreground"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default NotificationsPage;

