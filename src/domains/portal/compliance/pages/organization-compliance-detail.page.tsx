import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  FileCheck,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  Eye,
  Building2,
  Mail,
  Phone,
  Globe,
  RefreshCw,
  FileText,
  AlertCircle,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/common/components/ui/card';
import { Badge } from '@/common/components/ui/badge';
import { Button } from '@/common/components/ui/button';
import { toast } from 'sonner';
import {
  useGetOrganizationComplianceDocumentsQuery,
  useApproveDocumentMutation,
  useRejectDocumentMutation,
  useBulkApproveDocumentsMutation,
  useApproveOrganizationComplianceMutation,
  useLazyViewDocumentQuery,
} from '../apis/compliance.api';
import type { DocumentWithStatus, ComplianceDocumentStatus, OrganizationComplianceStatus } from '../models/compliance.model';
import {
  COMPLIANCE_STATUS_LABELS,
  COMPLIANCE_STATUS_COLORS,
  DOCUMENT_STATUS_COLORS,
} from '../models/compliance.model';
import { ComplianceDocumentCard } from '../components/compliance-document-card';
import { ComplianceReviewModal } from '../components/compliance-review-modal';

const OrganizationComplianceDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const organizationId = Number(id);

  const [selectedDocument, setSelectedDocument] = useState<DocumentWithStatus | null>(null);
  const [reviewAction, setReviewAction] = useState<'approve' | 'reject' | null>(null);

  // API queries
  const { data: orgData, isLoading, refetch } = useGetOrganizationComplianceDocumentsQuery(organizationId);
  const [approveDocument, { isLoading: isApproving }] = useApproveDocumentMutation();
  const [rejectDocument, { isLoading: isRejecting }] = useRejectDocumentMutation();
  const [bulkApproveDocuments, { isLoading: isBulkApproving }] = useBulkApproveDocumentsMutation();
  const [approveOrganizationCompliance, { isLoading: isFinalApproving }] = useApproveOrganizationComplianceMutation();
  const [triggerViewDocument] = useLazyViewDocumentQuery();

  const organization = orgData?.data;

  const handleApproveDocument = async (documentId: number, comments?: string) => {
    try {
      await approveDocument({ documentId, data: comments ? { comments } : undefined }).unwrap();
      toast.success('Document approved successfully');
      setSelectedDocument(null);
      setReviewAction(null);
      refetch();
    } catch {
      toast.error('Failed to approve document');
    }
  };

  const handleRejectDocument = async (documentId: number, comments: string) => {
    try {
      await rejectDocument({ documentId, data: { comments } }).unwrap();
      toast.success('Document rejected successfully');
      setSelectedDocument(null);
      setReviewAction(null);
      refetch();
    } catch {
      toast.error('Failed to reject document');
    }
  };

  const handleBulkApprove = async () => {
    try {
      const result = await bulkApproveDocuments(organizationId).unwrap();
      toast.success(`${result.data.approved_count} documents approved successfully`);
      refetch();
    } catch {
      toast.error('Failed to bulk approve documents');
    }
  };

  const handleFinalApproval = async () => {
    try {
      await approveOrganizationCompliance(organizationId).unwrap();
      toast.success('Organization compliance approved successfully');
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to approve organization compliance');
    }
  };

  const handleViewDocument = async (documentId: number) => {
    try {
      const result = await triggerViewDocument(documentId).unwrap();
      window.open(result.data.url, '_blank');
    } catch {
      toast.error('Failed to load document');
    }
  };

  const handleDownloadDocument = (documentId: number) => {
    // Open download URL in new tab
    const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
    window.open(`${baseUrl}/compliance-review/documents/${documentId}/download`, '_blank');
  };

  const getStatusBadge = (status: OrganizationComplianceStatus) => {
    return (
      <Badge className={`${COMPLIANCE_STATUS_COLORS[status]} border-0`}>
        {COMPLIANCE_STATUS_LABELS[status]}
      </Badge>
    );
  };

  const getDocumentStatusBadge = (status: ComplianceDocumentStatus) => {
    const labels: Record<ComplianceDocumentStatus, string> = {
      pending: 'Pending Review',
      approved: 'Approved',
      rejected: 'Rejected',
    };
    return (
      <Badge className={`${DOCUMENT_STATUS_COLORS[status]} border-0`}>
        {labels[status]}
      </Badge>
    );
  };

  const hasPendingDocuments = organization?.documents_with_status?.some(
    d => d.uploaded && d.document?.status === 'pending'
  );

  const canFinalApprove = organization?.compliance_status === 'pending_review' ||
    (organization?.documents_summary?.approved === organization?.documents_summary?.total_required);

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center h-96">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="p-6 flex items-center justify-center h-96">
        <div className="text-gray-500">Organization not found</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => navigate('/compliance')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">{organization.name}</h1>
            {getStatusBadge(organization.compliance_status)}
          </div>
          <p className="text-gray-500 mt-1">Compliance Document Review</p>
        </div>
        <Button variant="outline" onClick={() => refetch()}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Organization Info */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-start gap-3">
              <Building2 className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Organization</p>
                <p className="font-medium">{organization.name}</p>
                <p className="text-sm text-gray-500">{organization.industry}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{organization.email}</p>
              </div>
            </div>
            {organization.phone && (
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{organization.phone}</p>
                </div>
              </div>
            )}
            {organization.website && (
              <div className="flex items-start gap-3">
                <Globe className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Website</p>
                  <a href={organization.website} target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 hover:underline">
                    {organization.website}
                  </a>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Documents Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-2xl font-bold">{organization.documents_summary?.uploaded ?? 0}/{organization.documents_summary?.total_required ?? 7}</p>
            <p className="text-sm text-gray-500">Documents Uploaded</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-yellow-600">{organization.documents_summary?.pending ?? 0}</p>
            <p className="text-sm text-gray-500">Pending Review</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-8 w-8 text-green-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-600">{organization.documents_summary?.approved ?? 0}</p>
            <p className="text-sm text-gray-500">Approved</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <XCircle className="h-8 w-8 text-red-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-red-600">{organization.documents_summary?.rejected ?? 0}</p>
            <p className="text-sm text-gray-500">Rejected</p>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      {organization.compliance_status !== 'approved' && (
        <div className="flex gap-3">
          {hasPendingDocuments && (
            <Button
              onClick={handleBulkApprove}
              disabled={isBulkApproving}
              variant="outline"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              {isBulkApproving ? 'Approving...' : 'Approve All Pending'}
            </Button>
          )}
          {canFinalApprove && organization.documents_summary?.approved === organization.documents_summary?.total_required && (
            <Button
              onClick={handleFinalApproval}
              disabled={isFinalApproving}
              className="bg-green-600 hover:bg-green-700"
            >
              <FileCheck className="h-4 w-4 mr-2" />
              {isFinalApproving ? 'Approving...' : 'Final Approval'}
            </Button>
          )}
        </div>
      )}

      {/* Compliance Approved Notice */}
      {organization.compliance_status === 'approved' && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4 flex items-center gap-3">
            <CheckCircle className="h-6 w-6 text-green-600" />
            <div>
              <p className="font-medium text-green-800">Compliance Approved</p>
              {organization.compliance_approved_at && (
                <p className="text-sm text-green-600">
                  Approved on {new Date(organization.compliance_approved_at).toLocaleDateString()}
                  {organization.compliance_approver && ` by ${organization.compliance_approver.first_name} ${organization.compliance_approver.last_name}`}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Documents Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Compliance Documents</CardTitle>
          <CardDescription>Review each document and approve or reject with comments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {organization.documents_with_status?.map((docStatus) => (
              <ComplianceDocumentCard
                key={docStatus.document_type}
                documentWithStatus={docStatus}
                onApprove={() => {
                  setSelectedDocument(docStatus);
                  setReviewAction('approve');
                }}
                onReject={() => {
                  setSelectedDocument(docStatus);
                  setReviewAction('reject');
                }}
                onView={() => docStatus.document && handleViewDocument(docStatus.document.id)}
                onDownload={() => docStatus.document && handleDownloadDocument(docStatus.document.id)}
                getStatusBadge={getDocumentStatusBadge}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Review Modal */}
      {selectedDocument && reviewAction && (
        <ComplianceReviewModal
          isOpen={true}
          onClose={() => {
            setSelectedDocument(null);
            setReviewAction(null);
          }}
          document={selectedDocument}
          action={reviewAction}
          onSubmit={async (comments) => {
            if (!selectedDocument.document) return;
            if (reviewAction === 'approve') {
              await handleApproveDocument(selectedDocument.document.id, comments);
            } else {
              await handleRejectDocument(selectedDocument.document.id, comments);
            }
          }}
          isLoading={isApproving || isRejecting}
        />
      )}
    </div>
  );
};

export default OrganizationComplianceDetailPage;
