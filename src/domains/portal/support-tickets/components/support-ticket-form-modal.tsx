import { useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { MessageSquare, Loader2, Save } from 'lucide-react';
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import { Label } from '@/common/components/ui/label';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/common/components/ui/dialog';
import { 
  useCreateSupportTicketMutation,
  useUpdateSupportTicketMutation,
} from '../apis/support-ticket.api';
import type { SupportTicket, CreateSupportTicketData, UpdateSupportTicketData } from '../models/support-ticket.model';
import { toast } from 'sonner';

interface SupportTicketFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  ticket?: SupportTicket | null;
}

const ticketCategories = [
  'Technical Issue',
  'Billing Question',
  'Account Access',
  'Feature Request',
  'Bug Report',
  'General Inquiry',
  'Other'
];

const validationSchema = Yup.object({
  organization_id: Yup.number().required('Organization is required'),
  subject: Yup.string().required('Subject is required').max(255, 'Subject must be less than 255 characters'),
  description: Yup.string().required('Description is required').min(10, 'Description must be at least 10 characters'),
  priority: Yup.string()
    .oneOf(['low', 'medium', 'high', 'urgent'], 'Invalid priority')
    .required('Priority is required'),
  category: Yup.string().required('Category is required'),
});

export const SupportTicketFormModal = ({ isOpen, onClose, onSuccess, ticket }: SupportTicketFormModalProps) => {
  const [createTicket, { isLoading: isCreating }] = useCreateSupportTicketMutation();
  const [updateTicket, { isLoading: isUpdating }] = useUpdateSupportTicketMutation();

  const isLoading = isCreating || isUpdating;

  const formik = useFormik<CreateSupportTicketData>({
    initialValues: {
      organization_id: ticket?.organization_id || 0,
      subject: ticket?.subject || '',
      description: ticket?.description || '',
      priority: ticket?.priority || 'medium',
      category: ticket?.category || '',
      assigned_to: ticket?.assigned_to,
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        if (ticket) {
          // Update existing ticket
          const updateData: UpdateSupportTicketData = {
            subject: values.subject,
            description: values.description,
            priority: values.priority,
            category: values.category,
            assigned_to: values.assigned_to,
          };

          await updateTicket({
            id: ticket.id,
            data: updateData,
          }).unwrap();
          toast.success('Support ticket updated successfully');
        } else {
          // Create new ticket
          const createData: CreateSupportTicketData = {
            organization_id: values.organization_id,
            subject: values.subject,
            description: values.description,
            priority: values.priority,
            category: values.category,
            assigned_to: values.assigned_to,
          };

          await createTicket(createData).unwrap();
          toast.success('Support ticket created successfully');
        }

        onSuccess?.();
        onClose();
        formik.resetForm();
      } catch (error: any) {
        console.error('Failed to save support ticket:', error);
        toast.error(error?.data?.message || error?.message || 'Failed to save support ticket');
      }
    },
  });

  useEffect(() => {
    if (ticket && isOpen) {
      formik.setValues({
        organization_id: ticket.organization_id || 0,
        subject: ticket.subject || '',
        description: ticket.description || '',
        priority: ticket.priority || 'medium',
        category: ticket.category || '',
        assigned_to: ticket.assigned_to,
      });
    } else if (!ticket && isOpen) {
      formik.resetForm();
    }
  }, [ticket, isOpen]);

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white">
            {ticket ? 'Edit Support Ticket' : 'Create New Support Ticket'}
          </DialogTitle>
          <DialogDescription>
            {ticket ? 'Update support ticket information.' : 'Create a new support ticket for customer assistance.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Ticket Information</h3>
            
            <div className="space-y-2">
              <Label htmlFor="subject">Subject *</Label>
              <Input
                id="subject"
                name="subject"
                value={formik.values.subject}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Brief description of the issue"
                disabled={isLoading}
              />
              {formik.touched.subject && formik.errors.subject && (
                <p className="text-sm text-destructive">{formik.errors.subject}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="priority">Priority *</Label>
                <select
                  id="priority"
                  name="priority"
                  value={formik.values.priority}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={isLoading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4469e5] focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
                {formik.touched.priority && formik.errors.priority && (
                  <p className="text-sm text-destructive">{formik.errors.priority}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <select
                  id="category"
                  name="category"
                  value={formik.values.category}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={isLoading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4469e5] focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                >
                  <option value="">Select Category</option>
                  {ticketCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                {formik.touched.category && formik.errors.category && (
                  <p className="text-sm text-destructive">{formik.errors.category}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <textarea
                id="description"
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Provide detailed information about the issue..."
                rows={6}
                disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4469e5] focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />
              {formik.touched.description && formik.errors.description && (
                <p className="text-sm text-destructive">{formik.errors.description}</p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-[#4469e5] hover:bg-[#4469e5]/90"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {ticket ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {ticket ? 'Update Ticket' : 'Create Ticket'}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

