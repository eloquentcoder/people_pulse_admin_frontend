import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/common/components/ui/dialog';
import { Button } from '@/common/components/ui/button';
import { Badge } from '@/common/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/common/components/ui/card';
import type { PlatformAnnouncement } from '../models/announcement.model';
import { ANNOUNCEMENT_TYPES, ANNOUNCEMENT_PRIORITIES, ANNOUNCEMENT_STATUSES } from '../models/announcement.model';
import {
  Edit,
  CheckCircle,
  XCircle,
  Clock,
  Mail,
  Bell,
  Send,
  Calendar,
  User,
  Eye,
  AlertCircle,
} from 'lucide-react';

interface AnnouncementDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  announcement: PlatformAnnouncement | null;
  onEdit: (announcement: PlatformAnnouncement) => void;
  onPublish: (announcement: PlatformAnnouncement) => void;
  onUnpublish: (announcement: PlatformAnnouncement) => void;
  onSendEmails: (announcement: PlatformAnnouncement) => void;
}

export const AnnouncementDetailsModal = ({
  isOpen,
  onClose,
  announcement,
  onEdit,
  onPublish,
  onUnpublish,
  onSendEmails,
}: AnnouncementDetailsModalProps) => {
  if (!announcement) {
    return null;
  }

  const typeConfig = ANNOUNCEMENT_TYPES.find(t => t.value === announcement.type);
  const priorityConfig = ANNOUNCEMENT_PRIORITIES.find(p => p.value === announcement.priority);
  const statusConfig = ANNOUNCEMENT_STATUSES.find(s => s.value === announcement.status);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft':
        return <Edit className="w-4 h-4" />;
      case 'scheduled':
        return <Clock className="w-4 h-4" />;
      case 'published':
        return <CheckCircle className="w-4 h-4" />;
      case 'expired':
      case 'archived':
        return <XCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
                {announcement.title}
              </DialogTitle>
              <DialogDescription className="mt-1">
                Announcement details and actions
              </DialogDescription>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(announcement)}
                className="text-blue-600 hover:text-blue-700"
              >
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <Badge style={{ backgroundColor: typeConfig?.color + '20', color: typeConfig?.color, borderColor: typeConfig?.color }}>
              {typeConfig?.label || announcement.type}
            </Badge>
            <Badge variant="outline" style={{ borderColor: priorityConfig?.color, color: priorityConfig?.color }}>
              {priorityConfig?.label || announcement.priority}
            </Badge>
            <Badge style={{ backgroundColor: statusConfig?.color + '20', color: statusConfig?.color }}>
              {getStatusIcon(announcement.status)}
              <span className="ml-1">{statusConfig?.label || announcement.status}</span>
            </Badge>
          </div>

          {/* Content */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Content</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {announcement.content}
              </p>
            </CardContent>
          </Card>

          {/* Details Grid */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Created By</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {announcement.creator ? `${announcement.creator.first_name} ${announcement.creator.last_name}` : 'Unknown'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Created At</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(announcement.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>

                {announcement.scheduled_at && (
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Scheduled At</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(announcement.scheduled_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}

                {announcement.published_at && (
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Published At</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(announcement.published_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}

                {announcement.expires_at && (
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-orange-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Expires At</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(announcement.expires_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <Eye className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Views</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {announcement.views_count} views
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Notification Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <Bell className={`w-5 h-5 ${announcement.send_notification ? 'text-blue-500' : 'text-gray-400'}`} />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    In-app notification: {announcement.send_notification ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className={`w-5 h-5 ${announcement.send_email ? 'text-blue-500' : 'text-gray-400'}`} />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Email notification: {announcement.send_email ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              </div>
              {announcement.email_sent && (
                <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm font-medium text-green-700 dark:text-green-300">
                      Emails sent to {announcement.email_sent_count} recipients
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex gap-2">
              {(announcement.status === 'draft' || announcement.status === 'scheduled') && (
                <Button
                  variant="outline"
                  onClick={() => onPublish(announcement)}
                  className="text-green-600 hover:text-green-700"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Publish Now
                </Button>
              )}
              {announcement.status === 'published' && (
                <Button
                  variant="outline"
                  onClick={() => onUnpublish(announcement)}
                  className="text-orange-600 hover:text-orange-700"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Unpublish
                </Button>
              )}
              {announcement.status === 'published' && announcement.send_email && !announcement.email_sent && (
                <Button
                  onClick={() => onSendEmails(announcement)}
                  className="bg-[#4469e5] hover:bg-[#4469e5]/90"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send Emails
                </Button>
              )}
            </div>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
