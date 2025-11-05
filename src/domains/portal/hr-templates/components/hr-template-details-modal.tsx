import { X, Copy, Edit, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/common/components/ui/dialog';
import { Button } from '@/common/components/ui/button';
import { Badge } from '@/common/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/common/components/ui/tabs';
import type { HRTemplate } from '../models/hr-template.model';
import { CheckCircle, XCircle } from 'lucide-react';

interface HRTemplateDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: HRTemplate | null;
  onEdit?: () => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
}

export const HRTemplateDetailsModal = ({ 
  isOpen, 
  onClose, 
  template,
  onEdit,
  onDelete,
  onDuplicate
}: HRTemplateDetailsModalProps) => {
  if (!template) return null;

  const getStatusBadge = (isActive: boolean) => {
    if (isActive) {
      return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Active</Badge>;
    }
    return <Badge variant="outline" className="text-gray-600"><XCircle className="w-3 h-3 mr-1" />Inactive</Badge>;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>{template.title}</DialogTitle>
            <div className="flex items-center gap-2">
              {onEdit && (
                <Button variant="ghost" size="sm" onClick={onEdit}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              )}
              {onDuplicate && (
                <Button variant="ghost" size="sm" onClick={onDuplicate}>
                  <Copy className="w-4 h-4 mr-2" />
                  Duplicate
                </Button>
              )}
              {onDelete && (
                <Button variant="ghost" size="sm" onClick={onDelete} className="text-red-600 hover:text-red-700">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Category</label>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                  {template.category ? (
                    <Badge variant="outline">{template.category.name}</Badge>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Slug</label>
                <p className="mt-1 text-sm text-gray-900 dark:text-white font-mono">{template.slug}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</label>
                <div className="mt-1">
                  {getStatusBadge(template.is_active)}
                  {template.is_default && (
                    <Badge variant="default" className="ml-2 bg-blue-100 text-blue-800">Default</Badge>
                  )}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Usage Count</label>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">{template.usage_count || 0} times</p>
              </div>
              {template.description && (
                <div className="col-span-2">
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">{template.description}</p>
                </div>
              )}
              {template.variables && template.variables.length > 0 && (
                <div className="col-span-2">
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Variables</label>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {template.variables.map((variable) => (
                      <Badge key={variable} variant="outline" className="font-mono">
                        {'{{'}{variable}{'}}'}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Created</label>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                  {new Date(template.created_at).toLocaleString()}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Updated</label>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                  {new Date(template.updated_at).toLocaleString()}
                </p>
              </div>
              {template.created_by && (
                <div className="col-span-2">
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Created By</label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {template.created_by.name} ({template.created_by.email})
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="content">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Template Content</label>
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <pre className="whitespace-pre-wrap text-sm font-mono text-gray-900 dark:text-white">
                  {template.content}
                </pre>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};


