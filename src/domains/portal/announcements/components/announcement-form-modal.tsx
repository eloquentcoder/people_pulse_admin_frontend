import { useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Save, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/common/components/ui/dialog';
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import { Label } from '@/common/components/ui/label';
import { Textarea } from '@/common/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/common/components/ui/select';
import {
  useCreateAnnouncementMutation,
  useUpdateAnnouncementMutation,
} from '../apis/announcements.api';
import type { PlatformAnnouncement, CreateAnnouncementData, UpdateAnnouncementData } from '../models/announcement.model';
import { ANNOUNCEMENT_TYPES, ANNOUNCEMENT_PRIORITIES } from '../models/announcement.model';
import { toast } from 'sonner';

interface AnnouncementFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  announcement?: PlatformAnnouncement | null;
}

const validationSchema = Yup.object({
  title: Yup.string().required('Title is required').max(255, 'Title must be at most 255 characters'),
  content: Yup.string().required('Content is required'),
  type: Yup.string().required('Type is required'),
  priority: Yup.string().required('Priority is required'),
  scheduled_at: Yup.string().nullable(),
  expires_at: Yup.string().nullable(),
  send_email: Yup.boolean(),
  send_notification: Yup.boolean(),
});

export const AnnouncementFormModal = ({ isOpen, onClose, onSuccess, announcement }: AnnouncementFormModalProps) => {
  const [createAnnouncement, { isLoading: isCreating }] = useCreateAnnouncementMutation();
  const [updateAnnouncement, { isLoading: isUpdating }] = useUpdateAnnouncementMutation();
  const isLoading = isCreating || isUpdating;

  const formik = useFormik({
    initialValues: {
      title: '',
      content: '',
      type: 'general' as const,
      priority: 'medium' as const,
      scheduled_at: '',
      expires_at: '',
      send_email: true,
      send_notification: true,
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        const data: CreateAnnouncementData | UpdateAnnouncementData = {
          title: values.title,
          content: values.content,
          type: values.type,
          priority: values.priority,
          scheduled_at: values.scheduled_at || null,
          expires_at: values.expires_at || null,
          send_email: values.send_email,
          send_notification: values.send_notification,
        };

        if (announcement) {
          await updateAnnouncement({ id: announcement.id, data }).unwrap();
          toast.success('Announcement updated successfully');
        } else {
          await createAnnouncement(data as CreateAnnouncementData).unwrap();
          toast.success('Announcement created successfully');
        }
        onSuccess();
      } catch (error: any) {
        toast.error(error?.data?.message || error?.message || 'Failed to save announcement');
      }
    },
  });

  useEffect(() => {
    if (announcement) {
      formik.setValues({
        title: announcement.title,
        content: announcement.content,
        type: announcement.type,
        priority: announcement.priority,
        scheduled_at: announcement.scheduled_at ? announcement.scheduled_at.substring(0, 16) : '',
        expires_at: announcement.expires_at ? announcement.expires_at.substring(0, 16) : '',
        send_email: announcement.send_email,
        send_notification: announcement.send_notification,
      });
    } else {
      formik.resetForm();
    }
  }, [announcement, isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{announcement ? 'Edit Announcement' : 'Create New Announcement'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              name="title"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Announcement title"
              disabled={isLoading}
            />
            {formik.touched.title && formik.errors.title && (
              <p className="text-sm text-destructive">{formik.errors.title}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type *</Label>
              <Select
                value={formik.values.type}
                onValueChange={(value) => formik.setFieldValue('type', value)}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {ANNOUNCEMENT_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: type.color }} />
                        {type.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formik.touched.type && formik.errors.type && (
                <p className="text-sm text-destructive">{formik.errors.type}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority *</Label>
              <Select
                value={formik.values.priority}
                onValueChange={(value) => formik.setFieldValue('priority', value)}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  {ANNOUNCEMENT_PRIORITIES.map((priority) => (
                    <SelectItem key={priority.value} value={priority.value}>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: priority.color }} />
                        {priority.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formik.touched.priority && formik.errors.priority && (
                <p className="text-sm text-destructive">{formik.errors.priority}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content *</Label>
            <Textarea
              id="content"
              name="content"
              value={formik.values.content}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Write your announcement content here..."
              rows={8}
              disabled={isLoading}
            />
            {formik.touched.content && formik.errors.content && (
              <p className="text-sm text-destructive">{formik.errors.content}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="scheduled_at">Schedule At (Optional)</Label>
              <Input
                id="scheduled_at"
                name="scheduled_at"
                type="datetime-local"
                value={formik.values.scheduled_at}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={isLoading}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Leave empty to publish as draft
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="expires_at">Expires At (Optional)</Label>
              <Input
                id="expires_at"
                name="expires_at"
                type="datetime-local"
                value={formik.values.expires_at}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={isLoading}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Leave empty for no expiry
              </p>
            </div>
          </div>

          <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="font-medium text-gray-900 dark:text-white">Notification Settings</p>
            <div className="flex flex-col gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formik.values.send_notification}
                  onChange={(e) => formik.setFieldValue('send_notification', e.target.checked)}
                  disabled={isLoading}
                  className="rounded border-gray-300 text-[#4469e5] focus:ring-[#4469e5]"
                />
                <span className="text-sm text-gray-900 dark:text-white">Send in-app notification to organization admins</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formik.values.send_email}
                  onChange={(e) => formik.setFieldValue('send_email', e.target.checked)}
                  disabled={isLoading}
                  className="rounded border-gray-300 text-[#4469e5] focus:ring-[#4469e5]"
                />
                <span className="text-sm text-gray-900 dark:text-white">Send email notification to organization admins</span>
              </label>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Emails will be sent when you publish the announcement and click "Send Emails"
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-[#4469e5] hover:bg-[#4469e5]/90">
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {announcement ? 'Update Announcement' : 'Create Announcement'}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
