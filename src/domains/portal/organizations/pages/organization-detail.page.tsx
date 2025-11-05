import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Building2, 
  ArrowLeft, 
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
  MapPin,
  UserPlus,
  FileText,
  Settings,
  Activity,
  TrendingUp,
  Shield,
  Clock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/common/components/ui/card';
import { Badge } from '@/common/components/ui/badge';
import { Button } from '@/common/components/ui/button';
// import { 
//   useGetOrganizationQuery,
//   useActivateOrganizationMutation,
//   useDeactivateOrganizationMutation,
// } from '../apis/organization.api';
import type { Organization } from '../models/organization.model';
import { toast } from 'sonner';
import { EditOrganizationModal } from '../components/edit-organization-modal';
import { OnboardAdminModal } from '../components/onboard-admin-modal';

const OrganizationDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showOnboardModal, setShowOnboardModal] = useState(false);

  // API queries - COMMENTED OUT
  // const { data: organizationData, isLoading, error } = useGetOrganizationQuery(Number(id));
  // const [activateOrganization] = useActivateOrganizationMutation();
  // const [deactivateOrganization] = useDeactivateOrganizationMutation();

  // Mock organization data
  const mockOrganization: Organization = {
    id: Number(id) || 1,
    name: 'Acme Corporation',
    email: 'contact@acme.com',
    phone: '+1-555-0101',
    address: '123 Business Street',
    city: 'San Francisco',
    state: 'CA',
    country: 'USA',
    postal_code: '94105',
    website: 'https://acme.com',
    industry: 'Technology',
    company_size: '250-500',
    description: 'A leading technology company specializing in innovative solutions.',
    status: 'active',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-06-20T14:30:00Z',
    users_count: 250,
    users: [
      {
        id: 1,
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@acme.com',
        user_type: 'organization_admin',
        is_active: true,
        organization_id: Number(id) || 1,
      },
      {
        id: 2,
        first_name: 'Jane',
        last_name: 'Smith',
        email: 'jane.smith@acme.com',
        user_type: 'employee',
        is_active: true,
        organization_id: Number(id) || 1,
      },
    ],
    active_subscription: {
      id: 1,
      plan: { id: 1, name: 'Enterprise', price: 2500 },
      status: 'active',
      amount: 2500,
    },
    trial_ends_at: undefined,
  };

  const isLoading = false;
  const error = null;
  const organization = mockOrganization;

  // Check if organization has an admin user
  const hasAdmin = organization?.users?.some(user => user.user_type === 'organization_admin');

  const handleStatusToggle = async () => {
    if (!organization) return;

    // Mock status toggle
    if (organization.status === 'active') {
      toast.success('Organization deactivated successfully');
      console.log('Deactivate organization:', organization.id);
    } else {
      toast.success('Organization activated successfully');
      console.log('Activate organization:', organization.id);
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

  const getSubscriptionBadge = (subscription?: Organization['active_subscription']) => {
    if (!subscription) {
      return <Badge variant="outline" className="text-gray-500">No Subscription</Badge>;
    }
    
    switch (subscription.status) {
      case 'active':
        return <Badge variant="default" className="bg-blue-100 text-blue-800">Active</Badge>;
      case 'trial':
        return <Badge variant="outline" className="text-orange-600">Trial</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{subscription.status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4469e5] mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading organization...</p>
        </div>
      </div>
    );
  }

  if (error || !organization) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Organization Not Found</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">The organization you're looking for doesn't exist.</p>
        <Button onClick={() => navigate('/organizations')} className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Organizations
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate('/organizations')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              {organization.name}
            </h1>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-1">
              Organization Details
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {!hasAdmin && (
            <Button
              variant="outline"
              onClick={() => setShowOnboardModal(true)}
              className="flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              Onboard Admin
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => setShowEditModal(true)}
            className="flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            Edit
          </Button>
          <Button
            onClick={handleStatusToggle}
            className={`flex items-center gap-2 ${
              organization.status === 'active' 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {organization.status === 'active' ? (
              <>
                <XCircle className="w-4 h-4" />
                Deactivate
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                Activate
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Organization Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Organization Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Name</label>
                  <p className="text-gray-900 dark:text-white">{organization.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Status</label>
                  <div className="mt-1">
                    {getStatusBadge(organization.status)}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Email</label>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900 dark:text-white">{organization.email}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Phone</label>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900 dark:text-white">{organization.phone || 'Not provided'}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Website</label>
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-gray-400" />
                    {organization.website ? (
                      <a 
                        href={organization.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {organization.website}
                      </a>
                    ) : (
                      <span className="text-gray-500">Not provided</span>
                    )}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Industry</label>
                  <p className="text-gray-900 dark:text-white">{organization.industry || 'Not specified'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Company Size</label>
                  <p className="text-gray-900 dark:text-white">{organization.company_size || 'Not specified'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Created</label>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900 dark:text-white">
                      {new Date(organization.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              
              {organization.address && (
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Address</label>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                    <div className="text-gray-900 dark:text-white">
                      <p>{organization.address}</p>
                      {organization.city && organization.state && (
                        <p>{organization.city}, {organization.state} {organization.postal_code}</p>
                      )}
                      {organization.country && <p>{organization.country}</p>}
                    </div>
                  </div>
                </div>
              )}

              {organization.description && (
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Description</label>
                  <p className="text-gray-900 dark:text-white mt-1">{organization.description}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Users */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Users ({organization.users?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {organization.users && organization.users.length > 0 ? (
                <div className="space-y-3">
                  {organization.users.slice(0, 5).map((user) => (
                    <div key={user.id} className="flex items-center gap-3 p-3 rounded-lg border">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#4469e5] to-[#ee9807] flex items-center justify-center text-white text-sm font-semibold">
                        {user.first_name[0]}{user.last_name[0]}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {user.first_name} {user.last_name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={user.user_type === 'organization_admin' ? 'default' : 'outline'} 
                          className={`capitalize ${
                            user.user_type === 'organization_admin' 
                              ? 'bg-blue-100 text-blue-800' 
                              : ''
                          }`}
                        >
                          {user.user_type === 'organization_admin' ? 'Admin' : user.user_type?.replace('_', ' ')}
                        </Badge>
                        {user.user_type === 'organization_admin' && (
                          <Shield className="w-4 h-4 text-blue-600" />
                        )}
                      </div>
                    </div>
                  ))}
                  {organization.users.length > 5 && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                      +{organization.users.length - 5} more users
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">No users found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Subscription Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Subscription
              </CardTitle>
            </CardHeader>
            <CardContent>
              {organization.active_subscription ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Plan</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {organization.active_subscription.plan?.name || 'Unknown Plan'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Status</span>
                    {getSubscriptionBadge(organization.active_subscription)}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Amount</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      ${organization.active_subscription.amount || 0}/month
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <DollarSign className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 dark:text-gray-400">No subscription</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="w-4 h-4 mr-2" />
                View Documents
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Activity className="w-4 h-4 mr-2" />
                View Activity
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <TrendingUp className="w-4 h-4 mr-2" />
                Analytics
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Shield className="w-4 h-4 mr-2" />
                Security
              </Button>
            </CardContent>
          </Card>

          {/* Trial Info */}
          {organization.trial_ends_at && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Trial Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Trial Ends</span>
                    <span className="text-sm text-gray-900 dark:text-white">
                      {new Date(organization.trial_ends_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Days Remaining</span>
                    <span className="text-sm font-semibold text-orange-600">
                      {Math.ceil((new Date(organization.trial_ends_at).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Modals */}
      <EditOrganizationModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSuccess={() => {
          // Refetch organization data
          window.location.reload();
        }}
        organization={organization}
      />

      <OnboardAdminModal
        isOpen={showOnboardModal}
        onClose={() => setShowOnboardModal(false)}
        onSuccess={() => {
          // Refetch organization data
          window.location.reload();
        }}
        organizationId={organization?.id || 0}
      />
    </div>
  );
};

export default OrganizationDetailPage;
