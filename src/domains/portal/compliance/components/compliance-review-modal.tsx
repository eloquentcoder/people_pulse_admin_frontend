import { useState } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';
import { Button } from '@/common/components/ui/button';
import { Label } from '@/common/components/ui/label';
import type { DocumentWithStatus } from '../models/compliance.model';

interface ComplianceReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: DocumentWithStatus;
  action: 'approve' | 'reject';
  onSubmit: (comments: string) => Promise<void>;
  isLoading: boolean;
}

export const ComplianceReviewModal = ({
  isOpen,
  onClose,
  document,
  action,
  onSubmit,
  isLoading,
}: ComplianceReviewModalProps) => {
  const [comments, setComments] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const isReject = action === 'reject';
  const title = isReject ? 'Reject Document' : 'Approve Document';
  const buttonText = isReject ? 'Reject Document' : 'Approve Document';
  const buttonColor = isReject ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700';

  const handleSubmit = async () => {
    if (isReject && comments.trim().length < 10) {
      setError('Please provide a rejection reason (at least 10 characters)');
      return;
    }
    setError('');
    await onSubmit(comments.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg">
        {/* Header */}
        <div className={`flex items-center justify-between px-4 py-3 border-b ${isReject ? 'bg-red-50' : 'bg-green-50'}`}>
          <div className="flex items-center gap-2">
            {isReject ? (
              <XCircle className="h-5 w-5 text-red-600" />
            ) : (
              <CheckCircle className="h-5 w-5 text-green-600" />
            )}
            <h3 className={`font-medium ${isReject ? 'text-red-800' : 'text-green-800'}`}>
              {title}
            </h3>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">Document Type</p>
            <p className="font-medium">{document.label}</p>
            {document.document && (
              <p className="text-sm text-gray-500 mt-1">{document.document.file_name}</p>
            )}
          </div>

          <div>
            <Label htmlFor="comments">
              {isReject ? 'Rejection Reason *' : 'Comments (optional)'}
            </Label>
            <textarea
              id="comments"
              className="w-full mt-1 px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              placeholder={isReject ? 'Please explain why this document is being rejected...' : 'Add any comments for this approval...'}
              value={comments}
              onChange={(e) => setComments(e.target.value)}
            />
            {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
            {isReject && (
              <p className="text-xs text-gray-500 mt-1">
                Minimum 10 characters required. The organization will see this reason.
              </p>
            )}
          </div>

          {isReject && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> Rejecting this document will change the organization's compliance status to "Rejected". They will need to re-upload the document.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-4 py-3 border-t bg-gray-50">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            className={buttonColor}
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : buttonText}
          </Button>
        </div>
      </div>
    </div>
  );
};
