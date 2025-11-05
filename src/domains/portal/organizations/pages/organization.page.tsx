import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Search, 
  Filter, 
  Download, 
  Upload, 
  Plus, 
  Eye, 
  Edit, 
  MoreVertical,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Users,
  Calendar,
  DollarSign,
  Globe,
  Phone,
  Mail,
  ChevronDown,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/common/components/ui/card';
import { Badge } from '@/common/components/ui/badge';
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import { Label } from '@/common/components/ui/label';
// import { 
//   useGetOrganizationsQuery,
//   useGetOrganizationStatsQuery,
//   useActivateOrganizationMutation,
//   useDeactivateOrganizationMutation,
//   useUploadOrganizationsMutation,
// } from '../apis/organization.api';
import type { Organization, OrganizationFilters, OrganizationStats } from '../models/organization.model';
import { AddOrganizationModal } from '../components/add-organization-modal';
import { 
  validateExcelFile as validateFile,
  getRequiredFields,
  getOptionalFields
} from '@/common/helpers/documentValidation';
import type { Organization } from '../models/organization.model';
import type { OrganizationFilters } from '../models/organization.model';
import { toast } from 'sonner';

const OrganizationPage = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<OrganizationFilters>({
    search: '',
    status: '',
    subscription_status: '',
    created_from: '',
    created_to: '',
    sort_by: 'created_at',
    sort_order: 'desc',
    per_page: 15,
    page: 1,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // API queries - COMMENTED OUT
  // const { data: organizationsData, isLoading, refetch } = useGetOrganizationsQuery(filters);
  // const { data: statsData } = useGetOrganizationStatsQuery();
  // const [activateOrganization] = useActivateOrganizationMutation();
  // const [deactivateOrganization] = useDeactivateOrganizationMutation(); 
  // const [uploadOrganizations] = useUploadOrganizationsMutation();

  // Mock data
  const mockOrganizations: Organization[] = [
    {
      id: 1,
      name: 'Acme Corporation',
      email: 'contact@acme.com',
      phone: '+1-555-0101',
      website: 'https://acme.com',
      industry: 'Technology',
      company_size: '250-500',
      status: 'active',
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-06-20T14:30:00Z',
      users_count: 250,
      active_subscription: {
        id: 1,
        plan: { id: 1, name: 'Enterprise', price: 2500 },
        status: 'active',
        amount: 2500,
      },
    },
    {
      id: 2,
      name: 'Tech Solutions Inc',
      email: 'info@techsolutions.com',
      phone: '+1-555-0202',
      website: 'https://techsolutions.com',
      industry: 'Software',
      company_size: '100-250',
      status: 'active',
      created_at: '2024-02-20T09:15:00Z',
      updated_at: '2024-06-18T11:20:00Z',
      users_count: 180,
      active_subscription: {
        id: 2,
        plan: { id: 2, name: 'Professional', price: 1800 },
        status: 'active',
        amount: 1800,
      },
    },
    {
      id: 3,
      name: 'Global Industries',
      email: 'hello@globalind.com',
      phone: '+1-555-0303',
      website: 'https://globalind.com',
      industry: 'Manufacturing',
      company_size: '500+',
      status: 'active',
      created_at: '2024-03-10T08:30:00Z',
      updated_at: '2024-06-19T16:45:00Z',
      users_count: 320,
      active_subscription: {
        id: 3,
        plan: { id: 1, name: 'Enterprise', price: 3200 },
        status: 'active',
        amount: 3200,
      },
    },
    {
      id: 4,
      name: 'Startup Inc',
      email: 'team@startup.com',
      phone: '+1-555-0404',
      industry: 'Finance',
      company_size: '10-50',
      status: 'active',
      created_at: '2024-05-05T12:00:00Z',
      updated_at: '2024-06-17T10:15:00Z',
      users_count: 45,
      active_subscription: {
        id: 4,
        plan: { id: 3, name: 'Basic', price: 450 },
        status: 'trial',
        amount: 450,
      },
    },
    {
      id: 5,
      name: 'Mega Corp',
      email: 'contact@megacorp.com',
      phone: '+1-555-0505',
      website: 'https://megacorp.com',
      industry: 'Retail',
      company_size: '500+',
      status: 'active',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-06-21T09:00:00Z',
      users_count: 500,
      active_subscription: {
        id: 5,
        plan: { id: 1, name: 'Enterprise', price: 5000 },
        status: 'active',
        amount: 5000,
      },
    },
  ];

  const mockStats: OrganizationStats = {
    total_organizations: 245,
    active_organizations: 198,
    inactive_organizations: 35,
    suspended_organizations: 12,
    organizations_with_subscription: 180,
    organizations_without_subscription: 65,
    new_this_month: 12,
    new_this_week: 3,
  };

  // Filter mock data based on filters
  let filteredOrganizations = [...mockOrganizations];
  
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filteredOrganizations = filteredOrganizations.filter(org =>
      org.name.toLowerCase().includes(searchLower) ||
      org.email.toLowerCase().includes(searchLower)
    );
  }
  
  if (filters.status) {
    filteredOrganizations = filteredOrganizations.filter(org => org.status === filters.status);
  }
  
  if (filters.subscription_status) {
    filteredOrganizations = filteredOrganizations.filter(org => 
      org.active_subscription?.status === filters.subscription_status
    );
  }

  // Pagination
  const perPage = filters.per_page || 15;
  const currentPage = filters.page || 1;
  const startIndex = (currentPage - 1) * perPage;
  const endIndex = startIndex + perPage;
  const paginatedOrganizations = filteredOrganizations.slice(startIndex, endIndex);

  const mockOrganizationsData = {
    data: paginatedOrganizations,
    current_page: currentPage,
    last_page: Math.ceil(filteredOrganizations.length / perPage),
    per_page: perPage,
    total: filteredOrganizations.length,
  };

  const isLoading = false;
  const organizationsData = { data: mockOrganizationsData };
  const statsData = { data: mockStats };

  const refetch = () => {
    // Mock refetch - no-op
    console.log('Refetch called (mocked)');
  };

  const handleActivate = async (id: number) => {
    // Mock activation
    toast.success('Organization activated successfully');
    console.log('Activate organization:', id);
  };

  const handleDeactivate = async (id: number) => {
    // Mock deactivation
    toast.success('Organization deactivated successfully');
    console.log('Deactivate organization:', id);
  };

  const handleUpload = async () => {
    if (!uploadFile) return;
    // Mock upload
    toast.success('Upload completed! Imported: 5 organizations');
    setShowUploadModal(false);
    setUploadFile(null);
  };


  const handleFilterChange = (key: keyof OrganizationFilters, value: string) => {
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

  const handleSort = (sortBy: string) => {
    setFilters(prev => ({
      ...prev,
      sort_by: sortBy,
      sort_order: prev.sort_by === sortBy && prev.sort_order === 'asc' ? 'desc' : 'asc'
    }));
  };


  const handleDownloadTemplate = () => {
    try {
      // Create a link to the template file in the assets folder
      const link = document.createElement('a');
      link.href = '/assets/organization_template.csv';
      link.download = 'organization_template.csv';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Failed to download template:', error);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const validation = validateFile(file);
      if (validation.isValid) {
        setUploadFile(file);
        setShowUploadModal(true);
      } else {
        alert(`File validation failed: ${validation.errors.join(', ')}`);
      }
    }
  };


  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Active</Badge>;
      case 'inactive':
        return <Badge variant="outline" className="text-gray-600"><XCircle className="w-3 h-3 mr-1" />Inactive</Badge>;
      case 'suspended':
        return <Badge variant="destructive"><AlertTriangle className="w-3 h-3 mr-1" />Suspended</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

    const getSubscriptionBadge = (activeSubscription?: Organization['active_subscription']) => {
    if (!activeSubscription) {
      return <Badge variant="outline" className="text-gray-500">No Subscription</Badge>;
    }
    
    switch (activeSubscription.status) {
      case 'active':
        return <Badge variant="default" className="bg-blue-100 text-blue-800">Active</Badge>;
      case 'trial':
        return <Badge variant="outline" className="text-orange-600">Trial</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{activeSubscription.status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4469e5] mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading organizations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Organizations
          </h1>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-1">
            Manage and monitor all organizations on your platform
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleDownloadTemplate}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Template
          </Button>
          <label className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
            <Upload className="w-4 h-4" />
            Upload
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
          <Button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-[#4469e5] hover:bg-[#4469e5]/90"
          >
            <Plus className="w-4 h-4" />
            Add Organization
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {statsData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{statsData.data.total_organizations}</p>
                </div>
                <Building2 className="w-8 h-8 text-[#4469e5]" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active</p>
                  <p className="text-2xl font-bold text-green-600">{statsData.data.active_organizations}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">With Subscription</p>
                  <p className="text-2xl font-bold text-blue-600">{statsData.data.organizations_with_subscription}</p>
                </div>
                <DollarSign className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">New This Month</p>
                  <p className="text-2xl font-bold text-purple-600">{statsData.data.new_this_month}</p>
                </div>
                <Calendar className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              <CardTitle>Filters</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              {showFilters ? 'Hide' : 'Show'} Filters
            </Button>
          </div>
        </CardHeader>
        {showFilters && (
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="search"
                    placeholder="Search organizations..."
                    value={filters.search || ''}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  value={filters.status || ''}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4469e5] focus:border-transparent"
                >
                  <option value="">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
              <div>
                <Label htmlFor="subscription_status">Subscription</Label>
                <select
                  id="subscription_status"
                  value={filters.subscription_status || ''}
                  onChange={(e) => handleFilterChange('subscription_status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4469e5] focus:border-transparent"
                >
                  <option value="">All Subscriptions</option>
                  <option value="active">Active</option>
                  <option value="trial">Trial</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <Label htmlFor="sort_by">Sort By</Label>
                <select
                  id="sort_by"
                  value={filters.sort_by || 'created_at'}
                  onChange={(e) => handleFilterChange('sort_by', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4469e5] focus:border-transparent"
                >
                  <option value="created_at">Created Date</option>
                  <option value="name">Name</option>
                  <option value="email">Email</option>
                  <option value="status">Status</option>
                </select>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Organizations Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div>
                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                  Organizations
                </CardTitle>
                <CardDescription className="text-sm text-gray-600 dark:text-gray-400">
                  {organizationsData?.data?.data?.length || 0} organizations found
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="per_page" className="text-sm text-gray-600 dark:text-gray-400">
                  Show:
                </Label>
                <select
                  id="per_page"
                  value={filters.per_page || 15}
                  onChange={(e) => handlePerPageChange(Number(e.target.value))}
                  className="px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-[#4469e5] focus:border-transparent"
                >
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                className="flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 dark:text-white">
                    Organization
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 dark:text-white">
                    Contact
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 dark:text-white">
                    Users
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 dark:text-white">
                    Status
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 dark:text-white">
                    Subscription
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 dark:text-white">
                    Created
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 dark:text-white">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {organizationsData?.data?.data?.map((org) => (
                  <tr key={org.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <td className="py-6 px-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#4469e5] to-[#ee9807] flex items-center justify-center text-white font-bold text-lg shadow-lg">
                          {org.name[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white text-base">{org.name}</p>
                          {org.industry && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{org.industry}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-6 px-6">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">{org.email}</span>
                        </div>
                        {org.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">{org.phone}</span>
                          </div>
                        )}
                        {org.website && (
                          <div className="flex items-center gap-2">
                            <Globe className="w-4 h-4 text-gray-400" />
                            <a href={org.website} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                              Website
                            </a>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-6 px-6">
                      <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-gray-400" />
                        <span className="font-semibold text-gray-900 dark:text-white">{org.users_count || 0}</span>
                      </div>
                    </td>
                    <td className="py-6 px-6">
                      {getStatusBadge(org.status)}
                    </td>
                    <td className="py-6 px-6">
                      {getSubscriptionBadge(org.active_subscription)}
                    </td>
                    <td className="py-6 px-6">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Calendar className="w-4 h-4" />
                        {new Date(org.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="py-6 px-6">
                      <div className="flex items-center gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => navigate(`/organizations/${org.id}`)}
                          className="hover:bg-blue-50 hover:text-blue-600"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => navigate(`/organizations/${org.id}`)}
                          className="hover:bg-green-50 hover:text-green-600"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        {org.status === 'active' ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeactivate(org.id)}
                            className="hover:bg-red-50 hover:text-red-600"
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleActivate(org.id)}
                            className="hover:bg-green-50 hover:text-green-600"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                        )}
                        <Button variant="ghost" size="sm" className="hover:bg-gray-50">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {(!organizationsData?.data || organizationsData.data.data.length === 0) && (
                  <tr>
                    <td colSpan={7} className="py-12 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <Building2 className="w-12 h-12 text-gray-400" />
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white">No organizations found</h3>
                          <p className="text-gray-500 dark:text-gray-400 mt-1">
                            {filters.search ? 'Try adjusting your search criteria' : 'Get started by adding your first organization'}
                          </p>
                        </div>
                        {!filters.search && (
                          <Button 
                            onClick={() => setShowAddModal(true)}
                            className="flex items-center gap-2"
                          >
                            <Plus className="w-4 h-4" />
                            Add Organization
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {organizationsData && organizationsData.data.last_page > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <span>
                  Showing {((organizationsData.data.current_page - 1) * (filters.per_page || 15)) + 1} to{' '}
                  {Math.min(organizationsData.data.current_page * (filters.per_page || 15), organizationsData.data.total)} of{' '}
                  {organizationsData.data.total} results
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(1)}
                  disabled={organizationsData.data.current_page === 1}
                  className="flex items-center gap-1"
                >
                  <ChevronsLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                    onClick={() => handlePageChange(organizationsData.data.current_page - 1)}
                  disabled={organizationsData.data.current_page === 1}
                  className="flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, organizationsData.data.last_page) }, (_, i) => {
                    const startPage = Math.max(1, organizationsData.data.current_page - 2);
                    const page = startPage + i;
                    if (page > organizationsData.data.last_page) return null;
                    
                    return (
                      <Button
                        key={page}
                        variant={page === organizationsData.data.current_page ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                        className={`w-8 h-8 p-0 ${
                          page === organizationsData.data.current_page 
                            ? 'bg-[#4469e5] text-white' 
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </Button>
                    );
                  })}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(organizationsData.data.current_page + 1)}
                  disabled={organizationsData.data.current_page === organizationsData.data.last_page}
                  className="flex items-center gap-1"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(organizationsData.data.last_page)}
                  disabled={organizationsData.data.current_page === organizationsData.data.last_page}
                  className="flex items-center gap-1"
                >
                  <ChevronsRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>Upload Organizations</CardTitle>
              <CardDescription>
                Upload Excel file with organization data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Required Fields:</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {getRequiredFields().map(field => (
                    <div key={field} className="flex items-center gap-2">
                      <CheckCircle className="w-3 h-3 text-green-500" />
                      <span>{field}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Optional Fields:</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {getOptionalFields().map(field => (
                    <div key={field} className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full border border-gray-300"></span>
                      <span>{field}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleUpload} className="flex-1">
                  Upload
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Add Organization Modal */}
      <AddOrganizationModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={() => {
          refetch();
          setShowAddModal(false);
        }}
      />
    </div>
  );
};

export default OrganizationPage;