import { useState } from 'react';
import {
  CreditCard,
  Calendar,
  DollarSign,
  CheckCircle,
  AlertTriangle,
  Clock,
  XCircle,
  Package,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/common/components/ui/card';
import { Badge } from '@/common/components/ui/badge';
import { Button } from '@/common/components/ui/button';
import { AssignPlanModal } from './assign-plan-modal';
import type { Organization } from '../models/organization.model';
import type { Subscription } from '@/common/models/subscription.model';

interface OrganizationSubscriptionTabProps {
  organization: Organization;
  onSubscriptionChange: () => void;
}

const formatDate = (dateString?: string) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
  }).format(amount);
};

const getStatusBadge = (status?: string) => {
  switch (status) {
    case 'active':
      return (
        <Badge className="bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Active
        </Badge>
      );
    case 'trial':
      return (
        <Badge className="bg-blue-100 text-blue-800">
          <Clock className="w-3 h-3 mr-1" />
          Trial
        </Badge>
      );
    case 'past_due':
      return (
        <Badge className="bg-amber-100 text-amber-800">
          <AlertTriangle className="w-3 h-3 mr-1" />
          Past Due
        </Badge>
      );
    case 'cancelled':
      return (
        <Badge className="bg-gray-100 text-gray-800">
          <XCircle className="w-3 h-3 mr-1" />
          Cancelled
        </Badge>
      );
    case 'suspended':
      return (
        <Badge className="bg-red-100 text-red-800">
          <XCircle className="w-3 h-3 mr-1" />
          Suspended
        </Badge>
      );
    default:
      return (
        <Badge variant="outline">
          {status || 'Unknown'}
        </Badge>
      );
  }
};

export const OrganizationSubscriptionTab = ({
  organization,
  onSubscriptionChange,
}: OrganizationSubscriptionTabProps) => {
  const [showAssignModal, setShowAssignModal] = useState(false);

  const subscription = organization.active_subscription as Subscription | undefined;
  const hasActiveSubscription = subscription && subscription.status !== 'cancelled';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-gray-500" />
            Subscription
          </h3>
          <p className="text-sm text-gray-600">
            Manage the subscription plan for this organization.
          </p>
        </div>
        <Button onClick={() => setShowAssignModal(true)}>
          {hasActiveSubscription ? 'Change Plan' : 'Assign Plan'}
        </Button>
      </div>

      {/* Subscription Info */}
      {subscription ? (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-600" />
                {subscription.plan?.name || 'Unknown Plan'}
              </CardTitle>
              {getStatusBadge(subscription.status)}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Amount */}
              <div className="flex items-start gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <DollarSign className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Amount</p>
                  <p className="font-semibold text-lg">{formatCurrency(subscription.amount)}</p>
                  <p className="text-xs text-gray-400 capitalize">{subscription.billing_cycle}</p>
                </div>
              </div>

              {/* Start Date */}
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Start Date</p>
                  <p className="font-medium">{formatDate(subscription.starts_at)}</p>
                </div>
              </div>

              {/* End Date */}
              <div className="flex items-start gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Calendar className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">
                    {subscription.status === 'trial' ? 'Trial Ends' : 'End Date'}
                  </p>
                  <p className="font-medium">
                    {subscription.status === 'trial'
                      ? formatDate(subscription.trial_ends_at)
                      : formatDate(subscription.ends_at)}
                  </p>
                </div>
              </div>
            </div>

            {/* Plan Features */}
            {subscription.plan?.features && subscription.plan.features.length > 0 && (
              <div className="mt-6 pt-6 border-t">
                <p className="text-sm font-medium text-gray-700 mb-3">Plan Features</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {subscription.plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Plan Limits */}
            {(subscription.plan?.max_employees || subscription.plan?.max_storage_gb) && (
              <div className="mt-6 pt-6 border-t">
                <p className="text-sm font-medium text-gray-700 mb-3">Plan Limits</p>
                <div className="flex gap-6">
                  {subscription.plan?.max_employees && (
                    <div className="text-sm">
                      <span className="text-gray-500">Max Employees:</span>{' '}
                      <span className="font-medium">{subscription.plan.max_employees}</span>
                    </div>
                  )}
                  {subscription.plan?.max_storage_gb && (
                    <div className="text-sm">
                      <span className="text-gray-500">Storage:</span>{' '}
                      <span className="font-medium">{subscription.plan.max_storage_gb} GB</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <CreditCard className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Subscription</h3>
              <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                This organization doesn't have an active subscription. Assign a plan to enable
                access to platform features.
              </p>
              <Button onClick={() => setShowAssignModal(true)}>Assign Plan</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Assign Plan Modal */}
      <AssignPlanModal
        isOpen={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        organizationId={organization.id}
        currentSubscription={subscription}
        onSuccess={() => {
          setShowAssignModal(false);
          onSubscriptionChange();
        }}
      />
    </div>
  );
};
