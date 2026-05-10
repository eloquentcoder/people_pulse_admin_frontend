import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileCheck,
  Search,
  Filter,
  Eye,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Building2,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/common/components/ui/card';
import { Badge } from '@/common/components/ui/badge';
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import { Label } from '@/common/components/ui/label';
import {
  useGetComplianceOrganizationsQuery,
  useGetComplianceStatsQuery,
} from '../apis/compliance.api';
import type { ComplianceReviewFilters, OrganizationWithCompliance, OrganizationComplianceStatus } from '../models/compliance.model';
import { COMPLIANCE_STATUS_LABELS, COMPLIANCE_STATUS_COLORS } from '../models/compliance.model';

const ComplianceReviewPage = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<ComplianceReviewFilters>({
    search: '',
    compliance_status: '',
    created_from: '',
    created_to: '',
    sort_by: 'created_at',
    sort_order: 'desc',
    per_page: 15,
    page: 1,
  });
  const [showFilters, setShowFilters] = useState(false);

  // API queries
  const { data: organizationsData, isLoading, refetch } = useGetComplianceOrganizationsQuery(filters);
  const { data: statsData } = useGetComplianceStatsQuery();

  const organizations = organizationsData?.data?.data ?? [];
  const pagination = organizationsData?.data;
  const stats = statsData?.data;

  const handleFilterChange = (key: keyof ComplianceReviewFilters, value: string) => {
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

  const handleViewOrganization = (org: OrganizationWithCompliance) => {
    navigate(`/compliance/organizations/${org.id}`);
  };

  const getStatusBadge = (status: OrganizationComplianceStatus) => {
    return (
      <Badge className={`${COMPLIANCE_STATUS_COLORS[status]} border-0`}>
        {COMPLIANCE_STATUS_LABELS[status]}
      </Badge>
    );
  };

  const getProgressBar = (summary: OrganizationWithCompliance['documents_summary']) => {
    if (!summary) return null;
    const { total_required, approved, rejected, pending, uploaded } = summary;
    const approvedPercent = (approved / total_required) * 100;
    const rejectedPercent = (rejected / total_required) * 100;
    const pendingPercent = (pending / total_required) * 100;

    return (
      <div className="w-full">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>{uploaded}/{total_required} uploaded</span>
          <span>{approved} approved</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 flex overflow-hidden">
          <div className="bg-green-500 h-full" style={{ width: `${approvedPercent}%` }} />
          <div className="bg-yellow-500 h-full" style={{ width: `${pendingPercent}%` }} />
          <div className="bg-red-500 h-full" style={{ width: `${rejectedPercent}%` }} />
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Compliance Review</h1>
          <p className="text-gray-500 mt-1">Review and approve organization compliance documents</p>
        </div>
        <Button variant="outline" onClick={() => refetch()}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleFilterChange('compliance_status', '')}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total</p>
                <p className="text-2xl font-bold">{stats?.total_organizations ?? 0}</p>
              </div>
              <Building2 className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleFilterChange('compliance_status', 'pending_documents')}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pending Docs</p>
                <p className="text-2xl font-bold text-gray-600">{stats?.pending_documents ?? 0}</p>
              </div>
              <FileText className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleFilterChange('compliance_status', 'pending_review')}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pending Review</p>
                <p className="text-2xl font-bold text-yellow-600">{stats?.pending_review ?? 0}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleFilterChange('compliance_status', 'approved')}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Approved</p>
                <p className="text-2xl font-bold text-green-600">{stats?.approved ?? 0}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleFilterChange('compliance_status', 'rejected')}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Rejected</p>
                <p className="text-2xl font-bold text-red-600">{stats?.rejected ?? 0}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search organizations..."
                className="pl-10"
                value={filters.search}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <select
                className="border rounded-md px-3 py-2 text-sm"
                value={filters.compliance_status}
                onChange={(e) => handleFilterChange('compliance_status', e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="pending_documents">Pending Documents</option>
                <option value="pending_review">Pending Review</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
              <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Created From</Label>
                <Input
                  type="date"
                  value={filters.created_from}
                  onChange={(e) => handleFilterChange('created_from', e.target.value)}
                />
              </div>
              <div>
                <Label>Created To</Label>
                <Input
                  type="date"
                  value={filters.created_to}
                  onChange={(e) => handleFilterChange('created_to', e.target.value)}
                />
              </div>
              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={() => setFilters({
                    search: '',
                    compliance_status: '',
                    created_from: '',
                    created_to: '',
                    sort_by: 'created_at',
                    sort_order: 'desc',
                    per_page: 15,
                    page: 1,
                  })}
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Organizations Table */}
      <Card>
        <CardHeader>
          <CardTitle>Organizations</CardTitle>
          <CardDescription>
            {pagination?.total ?? 0} organizations found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : organizations.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No organizations found matching your criteria.
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Organization</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Documents Progress</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Created</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {organizations.map((org) => (
                      <tr key={org.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium">{org.name}</p>
                            <p className="text-sm text-gray-500">{org.email}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          {getStatusBadge(org.compliance_status)}
                        </td>
                        <td className="py-3 px-4 w-48">
                          {getProgressBar(org.documents_summary)}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-500">
                          {new Date(org.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewOrganization(org)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Review
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination && (
                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Rows per page:</span>
                    <select
                      className="border rounded-md px-2 py-1 text-sm"
                      value={filters.per_page}
                      onChange={(e) => handlePerPageChange(Number(e.target.value))}
                    >
                      <option value={10}>10</option>
                      <option value={15}>15</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">
                      Page {pagination.current_page} of {pagination.last_page}
                    </span>
                    <div className="flex gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(1)}
                        disabled={pagination.current_page === 1}
                      >
                        <ChevronsLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(pagination.current_page - 1)}
                        disabled={pagination.current_page === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(pagination.current_page + 1)}
                        disabled={pagination.current_page === pagination.last_page}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(pagination.last_page)}
                        disabled={pagination.current_page === pagination.last_page}
                      >
                        <ChevronsRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ComplianceReviewPage;
