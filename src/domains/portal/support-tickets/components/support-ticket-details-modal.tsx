import { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from '@/common/components/ui/dialog';
import { Button } from '@/common/components/ui/button';
import { Badge } from '@/common/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/common/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/common/components/ui/tabs';
import { Textarea } from '@/common/components/ui/textarea';
import { Label } from '@/common/components/ui/label';
import { 
  useGetSupportTicketQuery,
  useUpdateTicketStatusMutation,
  useAssignTicketMutation,
  useAddTicketReplyMutation,
} from '../apis/support-ticket.api';
import type { SupportTicket } from '../models/support-ticket.model';
import { 
  MessageSquare,
  CheckCircle,
  XCircle,
  Edit,
  AlertCircle,
  Clock,
  User,
  Building2,
  ArrowUp,
  ArrowDown,
  Mail,
  Calendar,
  Send,
  Paperclip,
  Shield
} from 'lucide-react';
import { toast } from 'sonner';

interface SupportTicketDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (ticket: SupportTicket) => void;
  ticket: SupportTicket | null;
}

export const SupportTicketDetailsModal = ({ isOpen, onClose, onEdit, ticket }: SupportTicketDetailsModalProps) => {
  const [activeTab, setActiveTab] = useState('details');
  const [replyMessage, setReplyMessage] = useState('');
  const [isInternal, setIsInternal] = useState(false);
  const [replyAttachments, setReplyAttachments] = useState<File[]>([]);
  
  const { data: ticketData, isLoading, refetch } = useGetSupportTicketQuery(ticket?.id || 0, {
    skip: !ticket?.id
  });
  
  const [updateTicketStatus] = useUpdateTicketStatusMutation();
  const [assignTicket] = useAssignTicketMutation();
  const [addReply, { isLoading: isAddingReply }] = useAddTicketReplyMutation();

  const currentTicket = ticketData?.data || ticket;

  const handleStatusChange = async (status: string) => {
    if (!currentTicket) return;
    try {
      await updateTicketStatus({ id: currentTicket.id, status }).unwrap();
      toast.success(`Ticket ${status.replace('_', ' ')} successfully`);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || error?.message || 'Failed to update ticket status');
    }
  };

  const handleAddReply = async () => {
    if (!currentTicket || !replyMessage.trim()) {
      toast.error('Please enter a reply message');
      return;
    }

    try {
      await addReply({
        ticket_id: currentTicket.id,
        message: replyMessage,
        is_internal: isInternal,
        attachments: replyAttachments.length > 0 ? replyAttachments : undefined,
      }).unwrap();
      toast.success('Reply added successfully');
      setReplyMessage('');
      setIsInternal(false);
      setReplyAttachments([]);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || error?.message || 'Failed to add reply');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setReplyAttachments([...replyAttachments, ...files]);
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
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4469e5] mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading ticket details...</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!currentTicket) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                Ticket #{currentTicket.id} - {currentTicket.subject}
              </DialogTitle>
              <DialogDescription>
                Support ticket details and conversation
              </DialogDescription>
            </div>
            <div className="flex items-center gap-2">
              {currentTicket.status === 'open' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleStatusChange('in_progress')}
                  className="text-yellow-600 hover:text-yellow-700"
                >
                  <Clock className="w-4 h-4 mr-1" />
                  In Progress
                </Button>
              )}
              {currentTicket.status !== 'resolved' && currentTicket.status !== 'closed' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleStatusChange('resolved')}
                  className="text-green-600 hover:text-green-700"
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Resolve
                </Button>
              )}
              {currentTicket.status === 'resolved' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleStatusChange('closed')}
                  className="text-gray-600 hover:text-gray-700"
                >
                  <XCircle className="w-4 h-4 mr-1" />
                  Close
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(currentTicket)}
                className="text-blue-600 hover:text-blue-700"
              >
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </Button>
            </div>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="replies">
              Replies ({currentTicket.replies?.length || currentTicket.replies_count || 0})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6">
            {/* Ticket Information */}
            <Card>
              <CardHeader>
                <CardTitle>Ticket Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Building2 className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Organization</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {currentTicket.organization?.name || 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Created By</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {currentTicket.user?.full_name || 'N/A'}
                      </p>
                      {currentTicket.user?.email && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">{currentTicket.user.email}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Priority</p>
                      <div className="mt-1">
                        {getPriorityBadge(currentTicket.priority)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MessageSquare className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Status</p>
                      <div className="mt-1">
                        {getStatusBadge(currentTicket.status)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Created</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(currentTicket.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  {currentTicket.assigned_user && (
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Assigned To</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {currentTicket.assigned_user.full_name}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
                <CardDescription>{currentTicket.category}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {currentTicket.description}
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="replies" className="space-y-6">
            {/* Replies List */}
            <div className="space-y-4">
              {currentTicket.replies && currentTicket.replies.length > 0 ? (
                currentTicket.replies.map((reply) => (
                  <Card key={reply.id} className={reply.is_internal ? 'border-yellow-200 dark:border-yellow-800' : ''}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4469e5] to-[#ee9807] flex items-center justify-center text-white font-semibold">
                            {reply.user?.full_name?.[0] || 'U'}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {reply.user?.full_name || 'Unknown User'}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(reply.created_at).toLocaleString()}
                            </p>
                          </div>
                          {reply.is_internal && (
                            <Badge variant="secondary" className="ml-2">
                              <Shield className="w-3 h-3 mr-1" />
                              Internal
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                        {reply.message}
                      </p>
                      {reply.attachments && reply.attachments.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {reply.attachments.map((attachment) => (
                            <a
                              key={attachment.id}
                              href={attachment.file_path}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                            >
                              <Paperclip className="w-4 h-4" />
                              {attachment.file_name}
                            </a>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">No replies yet</p>
                </div>
              )}
            </div>

            {/* Add Reply Form */}
            <Card>
              <CardHeader>
                <CardTitle>Add Reply</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reply_message">Message</Label>
                  <Textarea
                    id="reply_message"
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    placeholder="Type your reply here..."
                    rows={4}
                    className="w-full"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isInternal}
                      onChange={(e) => setIsInternal(e.target.checked)}
                      className="rounded border-gray-300 text-[#4469e5] focus:ring-[#4469e5]"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Internal note (not visible to customer)</span>
                  </label>
                </div>
                <div className="flex items-center gap-4">
                  <Label htmlFor="attachments" className="cursor-pointer">
                    <Paperclip className="w-4 h-4 inline mr-2" />
                    Attachments
                  </Label>
                  <input
                    id="attachments"
                    type="file"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  {replyAttachments.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {replyAttachments.map((file, index) => (
                        <Badge key={index} variant="secondary">
                          {file.name}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                <Button
                  onClick={handleAddReply}
                  disabled={isAddingReply || !replyMessage.trim()}
                  className="bg-[#4469e5] hover:bg-[#4469e5]/90"
                >
                  {isAddingReply ? (
                    <>
                      <Send className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Reply
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

