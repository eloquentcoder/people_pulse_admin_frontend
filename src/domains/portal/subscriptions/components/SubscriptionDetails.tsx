import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/common/components/ui/dialog';
import { Badge } from '@/common/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/common/components/ui/card';
import { Separator } from '@/common/components/ui/separator';
import { Button } from '@/common/components/ui/button';
import { Subscription } from '../types';
import {
  DollarSign,
  Users,
  HardDrive,
  Calendar,
  Clock,
  CheckCircle2,
  Building2,
  Package,
  TrendingUp,
  CreditCard,
  Timer,
  CalendarDays,
  MapPin,
  Mail,
  Phone,
  Globe,
  Activity
} from 'lucide-react';

interface SubscriptionDetailsProps {
  open: boolean;
  onClose: () => void;
  subscription: Subscription | null;
  onEdit?: (subscription: Subscription) => void;
  onCancel?: (subscription: Subscription) => void;
  onRenew?: (subscription: Subscription) => void;
}

export function SubscriptionDetails({
  open,
  onClose,
  subscription,
  onEdit,
  onCancel,
  onRenew
}: SubscriptionDetailsProps) {
  if (!subscription) return null;

  const formatAmount = (amount: number, cycle: string) => {
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);

    const suffix = cycle === 'monthly' ? '/month' : cycle === 'yearly' ? '/year' : '';
    return `${formatted}${suffix}`;
  };

  const formatDate = (date: string | null) => {
    if (!date) return 'Not set';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDateShort = (date: string | null) => {
    if (!date) return 'Not set';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'trial':
        return 'secondary';
      case 'past_due':
        return 'destructive';
      case 'cancelled':
        return 'outline';
      case 'expired':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'trial':
        return <Timer className="h-4 w-4 text-blue-500" />;
      case 'past_due':
        return <Clock className="h-4 w-4 text-red-500" />;
      case 'cancelled':
        return <Activity className="h-4 w-4 text-gray-500" />;
      case 'expired':
        return <CalendarDays className="h-4 w-4 text-gray-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getDaysRemaining = () => {
    if (subscription.status === 'trial' && subscription.trial_ends_at) {
      const now = new Date();
      const trialEnd = new Date(subscription.trial_ends_at);
      const diffTime = trialEnd.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 0;
    }
    if (subscription.ends_at) {
      const now = new Date();
      const end = new Date(subscription.ends_at);
      const diffTime = end.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 0;
    }
    return null;
  };

  const daysRemaining = getDaysRemaining();

  const canCancel = subscription.status === 'active' || subscription.status === 'trial';
  const canRenew = subscription.status === 'cancelled' || subscription.status === 'expired';

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl flex items-center gap-2">
                Subscription Details
                <Badge variant={getStatusBadgeVariant(subscription.status)} className="flex items-center gap-1">
                  {getStatusIcon(subscription.status)}
                  {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1).replace('_', ' ')}
                </Badge>
              </DialogTitle>
              <DialogDescription className="mt-2">
                Complete subscription information and management options
              </DialogDescription>
            </div>
            <div className="flex gap-2">
              {onEdit && (
                <Button variant="outline" onClick={() => onEdit(subscription)}>
                  Edit
                </Button>
              )}
              {canCancel && onCancel && (
                <Button variant="destructive" onClick={() => onCancel(subscription)}>
                  Cancel
                </Button>
              )}
              {canRenew && onRenew && (
                <Button onClick={() => onRenew(subscription)}>
                  Renew
                </Button>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Status and Billing Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <DollarSign className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Amount</p>
                    <p className="text-xl font-semibold">
                      {formatAmount(subscription.amount, subscription.billing_cycle)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                    <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Billing Cycle</p>
                    <p className="text-xl font-semibold capitalize">{subscription.billing_cycle}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                    <Timer className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {subscription.status === 'trial' ? 'Trial Days Left' : 'Days Until Renewal'}
                    </p>
                    <p className="text-xl font-semibold">
                      {daysRemaining !== null ? `${daysRemaining} days` : 'N/A'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Organization Information */}
          {subscription.organization && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Organization Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Name</p>
                      <p className="font-medium">{subscription.organization.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Domain</p>
                      <p className="font-medium">{subscription.organization.domain}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{subscription.organization.email}</span>
                    </div>
                    {subscription.organization.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{subscription.organization.phone}</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-3">
                    {subscription.organization.website && (
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <a
                          href={subscription.organization.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {subscription.organization.website}
                        </a>
                      </div>
                    )}
                    {subscription.organization.address && (
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div className="text-sm">
                          <p>{subscription.organization.address}</p>
                          {subscription.organization.city && (
                            <p>
                              {subscription.organization.city}
                              {subscription.organization.state && `, ${subscription.organization.state}`}
                              {subscription.organization.zip_code && ` ${subscription.organization.zip_code}`}
                            </p>
                          )}
                          {subscription.organization.country && (
                            <p>{subscription.organization.country}</p>
                          )}
                        </div>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-muted-foreground">Employee Count</p>
                      <p className="font-medium">{subscription.organization.employee_count} employees</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Plan Information */}
          {subscription.plan && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Plan Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Plan Name</p>
                      <p className="font-medium text-lg">{subscription.plan.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Description</p>
                      <p className="text-sm">{subscription.plan.description}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Plan Price</p>
                      <p className="font-medium">
                        {formatAmount(subscription.plan.price, subscription.plan.billing_cycle)}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Max Employees</p>
                        <p className="font-medium">{subscription.plan.max_employees.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <HardDrive className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Storage Limit</p>
                        <p className="font-medium">{subscription.plan.max_storage_gb} GB</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Timer className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Trial Period</p>
                        <p className="font-medium">
                          {subscription.plan.trial_days > 0 ? `${subscription.plan.trial_days} days` : 'No trial'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Features */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                Active Features
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {subscription.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Subscription Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Subscription Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-green-500" />
                    <span className="font-medium">Start Date</span>
                  </div>
                  <span>{formatDateShort(subscription.starts_at)}</span>
                </div>

                {subscription.trial_ends_at && (
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-2">
                      <Timer className="h-4 w-4 text-blue-500" />
                      <span className="font-medium">Trial Ends</span>
                    </div>
                    <span>{formatDateShort(subscription.trial_ends_at)}</span>
                  </div>
                )}

                {subscription.ends_at && (
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-orange-500" />
                      <span className="font-medium">End Date</span>
                    </div>
                    <span>{formatDateShort(subscription.ends_at)}</span>
                  </div>
                )}

                {subscription.cancelled_at && (
                  <div className="flex items-center justify-between p-3 bg-destructive/10 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-destructive" />
                      <span className="font-medium">Cancelled Date</span>
                    </div>
                    <span>{formatDateShort(subscription.cancelled_at)}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Billing History */}
          {subscription.billing_transactions && subscription.billing_transactions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Billing History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {subscription.billing_transactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${
                          transaction.status === 'completed' ? 'bg-green-500' :
                          transaction.status === 'pending' ? 'bg-yellow-500' :
                          transaction.status === 'failed' ? 'bg-red-500' :
                          'bg-gray-500'
                        }`} />
                        <div>
                          <p className="font-medium">
                            {new Intl.NumberFormat('en-US', {
                              style: 'currency',
                              currency: 'USD'
                            }).format(transaction.amount)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {formatDateShort(transaction.transaction_date)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={
                          transaction.status === 'completed' ? 'default' :
                          transaction.status === 'pending' ? 'secondary' :
                          transaction.status === 'failed' ? 'destructive' :
                          'outline'
                        }>
                          {transaction.status}
                        </Badge>
                        <p className="text-sm text-muted-foreground mt-1">
                          {transaction.payment_method}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Separator />

          {/* Metadata */}
          <div className="text-sm text-muted-foreground space-y-1">
            <p>Subscription ID: <span className="font-mono">{subscription.id}</span></p>
            <p>Created: {formatDate(subscription.created_at)}</p>
            <p>Last Updated: {formatDate(subscription.updated_at)}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}