import type { Organization } from "@/domains/portal/organizations/models/organization.model";
import type { User } from "@/common/models/user.model";

export type ComplianceDocumentStatus = 'pending' | 'approved' | 'rejected';
export type OrganizationComplianceStatus = 'pending_documents' | 'pending_review' | 'approved' | 'rejected';

export interface ComplianceDocument {
  id: number;
  organization_id: number;
  document_type: string;
  file_path: string;
  file_name: string;
  file_type: string;
  mime_type: string;
  file_size: number;
  status: ComplianceDocumentStatus;
  reviewer_comments: string | null;
  reviewed_at: string | null;
  reviewed_by: number | null;
  reviewer?: User;
  created_at: string;
  updated_at: string;
}

export interface DocumentWithStatus {
  document_type: string;
  label: string;
  uploaded: boolean;
  document: ComplianceDocument | null;
}

export interface ComplianceDocumentsSummary {
  total_required: number;
  uploaded: number;
  pending: number;
  approved: number;
  rejected: number;
}

export interface OrganizationWithCompliance extends Organization {
  compliance_status: OrganizationComplianceStatus;
  compliance_approved_at: string | null;
  compliance_approved_by: number | null;
  compliance_documents: ComplianceDocument[];
  compliance_documents_count?: number;
  compliance_approver?: User;
  documents_summary?: ComplianceDocumentsSummary;
  documents_with_status?: DocumentWithStatus[];
}

export interface ComplianceReviewFilters {
  search?: string;
  compliance_status?: OrganizationComplianceStatus | '';
  created_from?: string;
  created_to?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  per_page?: number;
  page?: number;
}

export interface ComplianceReviewStats {
  total_organizations: number;
  pending_documents: number;
  pending_review: number;
  approved: number;
  rejected: number;
}

export interface ApproveDocumentData {
  comments?: string;
}

export interface RejectDocumentData {
  comments: string;
}

export interface DocumentViewResponse {
  url: string;
  file_name: string;
  mime_type: string;
  file_size: number;
}

export const DOCUMENT_TYPE_LABELS: Record<string, string> = {
  memorandum_articles: 'Memorandum and Articles of Association',
  certificate_of_incorporation: 'Certificate of Incorporation',
  registration_number: 'Registration Number',
  tax_identification_number: 'Tax Identification Number',
  cac_status_report: 'CAC Status Report',
  proof_of_business_address: 'Proof of Business Address',
  proof_of_identity_directors: 'Proof of Identity for Directors',
};

export const COMPLIANCE_STATUS_LABELS: Record<OrganizationComplianceStatus, string> = {
  pending_documents: 'Pending Documents',
  pending_review: 'Pending Review',
  approved: 'Approved',
  rejected: 'Rejected',
};

export const COMPLIANCE_STATUS_COLORS: Record<OrganizationComplianceStatus, string> = {
  pending_documents: 'bg-gray-100 text-gray-700',
  pending_review: 'bg-yellow-100 text-yellow-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
};

export const DOCUMENT_STATUS_COLORS: Record<ComplianceDocumentStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
};
