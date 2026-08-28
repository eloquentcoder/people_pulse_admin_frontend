import {
  FileText,
  CheckCircle,
  XCircle,
  Eye,
  Download,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { Card, CardContent } from '@/common/components/ui/card';
import { Badge } from '@/common/components/ui/badge';
import { Button } from '@/common/components/ui/button';
import type { DocumentWithStatus, ComplianceDocumentStatus } from '../models/compliance.model';
import { PermissionGate } from '@/common/components/permission-gate';

interface ComplianceDocumentCardProps {
  documentWithStatus: DocumentWithStatus;
  onApprove: () => void;
  onReject: () => void;
  onView: () => void;
  onDownload: () => void;
  getStatusBadge: (status: ComplianceDocumentStatus) => React.ReactNode;
}

export const ComplianceDocumentCard = ({
  documentWithStatus,
  onApprove,
  onReject,
  onView,
  onDownload,
  getStatusBadge,
}: ComplianceDocumentCardProps) => {
  const { document_type, label, uploaded, document } = documentWithStatus;

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (!uploaded || !document) {
    // Document not uploaded yet
    return (
      <Card className="border-dashed border-2 border-gray-300 bg-gray-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-gray-200 rounded-lg">
              <AlertCircle className="h-5 w-5 text-gray-400" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-600">{label}</h4>
              <p className="text-sm text-gray-400 mt-1">Not uploaded yet</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const statusColors = {
    pending: 'border-yellow-200 bg-yellow-50',
    approved: 'border-green-200 bg-green-50',
    rejected: 'border-red-200 bg-red-50',
  };

  const iconColors = {
    pending: 'bg-yellow-100 text-yellow-600',
    approved: 'bg-green-100 text-green-600',
    rejected: 'bg-red-100 text-red-600',
  };

  return (
    <Card className={`border ${statusColors[document.status]}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg ${iconColors[document.status]}`}>
            {document.status === 'approved' && <CheckCircle className="h-5 w-5" />}
            {document.status === 'rejected' && <XCircle className="h-5 w-5" />}
            {document.status === 'pending' && <Clock className="h-5 w-5" />}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h4 className="font-medium text-gray-900 truncate">{label}</h4>
              {getStatusBadge(document.status)}
            </div>
            <p className="text-sm text-gray-500 mt-1 truncate" title={document.file_name}>
              {document.file_name}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              {formatFileSize(document.file_size)} &bull; {document.mime_type.split('/')[1]?.toUpperCase()}
            </p>
            {document.reviewer_comments && (
              <div className={`mt-2 p-2 rounded text-sm ${document.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>
                <p className="font-medium text-xs mb-0.5">
                  {document.status === 'rejected' ? 'Rejection Reason:' : 'Reviewer Comments:'}
                </p>
                <p className="text-xs">{document.reviewer_comments}</p>
              </div>
            )}
            {document.reviewed_at && document.reviewer && (
              <p className="text-xs text-gray-400 mt-2">
                Reviewed by {document.reviewer.first_name} {document.reviewer.last_name} on{' '}
                {new Date(document.reviewed_at).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-4 pt-3 border-t">
          <Button variant="outline" size="sm" className="flex-1" onClick={onView}>
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
          <Button variant="outline" size="sm" className="flex-1" onClick={onDownload}>
            <Download className="h-4 w-4 mr-1" />
            Download
          </Button>
        </div>

        {/* Review Actions */}
        {document.status === 'pending' && (
          <div className="flex gap-2 mt-2">
            <PermissionGate permission="edit-compliance-review">
            <Button
              size="sm"
              className="flex-1 bg-green-600 hover:bg-green-700"
              onClick={onApprove}
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Approve
            </Button>
            </PermissionGate>
            <PermissionGate permission="edit-compliance-review">
            <Button
              size="sm"
              variant="destructive"
              className="flex-1"
              onClick={onReject}
            >
              <XCircle className="h-4 w-4 mr-1" />
              Reject
            </Button>
            </PermissionGate>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
