import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/common/components/ui/dialog';
import { Badge } from '@/common/components/ui/badge';
import { Card, CardContent } from '@/common/components/ui/card';
import { Separator } from '@/common/components/ui/separator';
import { Plan } from '../types';
import {
  DollarSign,
  Users,
  HardDrive,
  Calendar,
  Clock,
  CheckCircle2,
  Star,
  TrendingUp,
  Package
} from 'lucide-react';

interface PlanDetailsProps {
  open: boolean;
  onClose: () => void;
  plan: Plan | null;
}

export function PlanDetails({ open, onClose, plan }: PlanDetailsProps) {
  if (!plan) return null;

  const formatPrice = (price: number, cycle: string) => {
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);

    const suffix = cycle === 'monthly' ? '/month' : cycle === 'yearly' ? '/year' : '';
    return `${formatted}${suffix}`;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl flex items-center gap-2">
                {plan.name}
                {plan.is_popular && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    Popular
                  </Badge>
                )}
              </DialogTitle>
              <DialogDescription className="mt-2">
                {plan.description}
              </DialogDescription>
            </div>
            <Badge variant={plan.is_active ? 'default' : 'secondary'} className="ml-4">
              {plan.is_active ? 'Active' : 'Inactive'}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Pricing Information */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <DollarSign className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Price</p>
                    <p className="text-lg font-semibold">
                      {formatPrice(plan.price, plan.billing_cycle)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Billing Cycle</p>
                    <p className="text-lg font-semibold capitalize">{plan.billing_cycle}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Trial Period</p>
                    <p className="text-lg font-semibold">
                      {plan.trial_days > 0 ? `${plan.trial_days} days` : 'No trial'}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Limits */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-4">Plan Limits</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                    <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Maximum Employees</p>
                    <p className="text-lg font-semibold">{plan.max_employees.toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                    <HardDrive className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Storage Limit</p>
                    <p className="text-lg font-semibold">{plan.max_storage_gb} GB</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Package className="h-5 w-5" />
                Included Features
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Subscription Statistics */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Subscription Statistics
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Active Subscriptions</p>
                  <p className="text-2xl font-bold text-green-600">
                    {plan.active_subscriptions_count || 0}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Subscriptions</p>
                  <p className="text-2xl font-bold">
                    {plan.subscriptions_count || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Metadata */}
          <div className="text-sm text-muted-foreground space-y-1">
            <p>Plan ID: <span className="font-mono">{plan.id}</span></p>
            <p>Slug: <span className="font-mono">{plan.slug}</span></p>
            <p>Created: {formatDate(plan.created_at)}</p>
            <p>Last Updated: {formatDate(plan.updated_at)}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}