import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Building2,
  ArrowLeft,
  Edit,
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
  TrendingUp,
  Clock,
  Briefcase
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/common/components/ui/card';
import { Badge } from '@/common/components/ui/badge';
import { Button } from '@/common/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/common/components/ui/tabs';
import {
  useGetOrganizationQuery,
  useActivateOrganizationMutation,
  useDeactivateOrganizationMutation,
} from '../apis/organization.api';
import type { Organization } from '../models/organization.model';
import { toast } from 'sonner';
import { EditOrganizationModal } from '../components/edit-organization-modal';
import { OnboardAdminModal } from '../components/onboard-admin-modal';
import { OrganizationUsersTab } from '../components/organization-users-tab';
import { OrganizationDepartmentsTab } from '../components/organization-departments-tab';
import { OrganizationBranchesTab } from '../components/organization-branches-tab';
import { OrganizationDesignationsTab } from '../components/organization-designations-tab';

const OrganizationDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showOnboardModal, setShowOnboardModal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // API queries
  const { data: organizationData, isLoading, error, refetch } = useGetOrganizationQuery(Number(id));
  const [activateOrganization] = useActivateOrganizationMutation();
  const [deactivateOrganization] = useDeactivateOrganizationMutation();

  const organization = organizationData?.data as Organization | undefined;

  // Check if organization has an admin user
  const hasAdmin = organization?.users?.some(user => user.user_type === 'organization_admin');

  const handleStatusToggle = async () => {
    if (!organization) return;

    try {
      if (organization.status === 'active') {
        await deactivateOrganization(organization.id).unwrap();
        toast.success('Organization deactivated successfully');
      } else {
        await activateOrganization(organization.id).unwrap();
        toast.success('Organization activated successfully');
      }
      refetch();
    } catch {
      toast.error('Failed to update organization status');
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

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="flex flex-wrap gap-1 h-auto p-1">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Users ({organization.users_count || organization.users?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="departments" className="flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            Departments ({organization.departments_count || organization.departments?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="branches" className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Branches ({organization.branches_count || organization.branches?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="designations" className="flex items-center gap-2">
            <Briefcase className="w-4 h-4" />
            Designations ({organization.positions_count || organization.positions?.length || 0})
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-6">
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

              {/* Statistics Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Organization Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {organization.users_count || organization.users?.length || 0}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Users</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <Building2 className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {organization.departments_count || organization.departments?.length || 0}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Departments</p>
                    </div>
                    <div className="text-center p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                      <MapPin className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {organization.branches_count || organization.branches?.length || 0}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Branches</p>
                    </div>
                    <div className="text-center p-4 bg-rose-50 dark:bg-rose-900/20 rounded-lg">
                      <Briefcase className="w-8 h-8 text-rose-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {organization.positions_count || organization.positions?.length || 0}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Designations</p>
                    </div>
                  </div>
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

              {/* Trial Info - Only show if on trial (no active subscription and trial_ends_at exists) */}
              {organization.trial_ends_at && !organization.active_subscription && (
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
                        <span className={`text-sm font-semibold ${
                          Math.ceil((new Date(organization.trial_ends_at).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) <= 7
                            ? 'text-red-600'
                            : 'text-orange-600'
                        }`}>
                          {Math.max(0, Math.ceil((new Date(organization.trial_ends_at).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))} days
                        </span>
                      </div>
                      {Math.ceil((new Date(organization.trial_ends_at).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) <= 0 && (
                        <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                          <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                            Trial has expired
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Organization Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <OrganizationUsersTab users={organization.users || []} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Departments Tab */}
        <TabsContent value="departments" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Departments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <OrganizationDepartmentsTab departments={organization.departments || []} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Branches Tab */}
        <TabsContent value="branches" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Branches
              </CardTitle>
            </CardHeader>
            <CardContent>
              <OrganizationBranchesTab branches={organization.branches || []} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Designations Tab */}
        <TabsContent value="designations" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                Designations (Positions)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <OrganizationDesignationsTab positions={organization.positions || []} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <EditOrganizationModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSuccess={() => {
          refetch();
        }}
        organization={organization}
      />

      <OnboardAdminModal
        isOpen={showOnboardModal}
        onClose={() => setShowOnboardModal(false)}
        onSuccess={() => {
          refetch();
        }}
        organizationId={organization?.id || 0}
      />
    </div>
  );
};

export default OrganizationDetailPage;
