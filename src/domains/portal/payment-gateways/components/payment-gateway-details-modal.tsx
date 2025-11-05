import { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from '@/common/components/ui/dialog';
import { Button } from '@/common/components/ui/button';
import { Badge } from '@/common/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/common/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/common/components/ui/tabs';
import { 
  useGetPaymentGatewayQuery,
  useActivatePaymentGatewayMutation,
  useDeactivatePaymentGatewayMutation,
  useSetDefaultGatewayMutation
} from '../apis/payment-gateway.api';
import type { PaymentGateway } from '../models/payment-gateway.model';
import { 
  CreditCard,
  CheckCircle,
  XCircle,
  Edit,
  Star,
  Globe,
  DollarSign,
  Settings,
  Zap,
  ArrowUpDown,
  Shield,
  Clock,
  Code,
  Link
} from 'lucide-react';
import { toast } from 'sonner';

interface PaymentGatewayDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (gateway: PaymentGateway) => void;
  gateway: PaymentGateway | null;
}

export const PaymentGatewayDetailsModal = ({ isOpen, onClose, onEdit, gateway }: PaymentGatewayDetailsModalProps) => {
  const [activeTab, setActiveTab] = useState('overview');
  
  const { data: gatewayData, isLoading } = useGetPaymentGatewayQuery(gateway?.id || 0, {
    skip: !gateway?.id
  });
  
  const [activateGateway] = useActivatePaymentGatewayMutation();
  const [deactivateGateway] = useDeactivatePaymentGatewayMutation();
  const [setDefaultGateway] = useSetDefaultGatewayMutation();

  const currentGateway = gatewayData?.data || gateway;

  const handleActivate = async () => {
    if (!currentGateway) return;
    try {
      await activateGateway(currentGateway.id).unwrap();
      toast.success('Payment gateway activated successfully');
    } catch (error: any) {
      toast.error(error?.data?.message || error?.message || 'Failed to activate payment gateway');
    }
  };

  const handleDeactivate = async () => {
    if (!currentGateway) return;
    try {
      await deactivateGateway(currentGateway.id).unwrap();
      toast.success('Payment gateway deactivated successfully');
    } catch (error: any) {
      toast.error(error?.data?.message || error?.message || 'Failed to deactivate payment gateway');
    }
  };

  const handleSetDefault = async () => {
    if (!currentGateway) return;
    try {
      await setDefaultGateway(currentGateway.id).unwrap();
      toast.success('Default payment gateway updated successfully');
    } catch (error: any) {
      toast.error(error?.data?.message || error?.message || 'Failed to set default gateway');
    }
  };

  const getStatusBadge = (isActive: boolean) => {
    if (isActive) {
      return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Active</Badge>;
    }
    return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Inactive</Badge>;
  };

  const formatFee = (percentage: number, fixed: number) => {
    const parts: string[] = [];
    if (percentage > 0) {
      parts.push(`${percentage}%`);
    }
    if (fixed > 0) {
      parts.push(`+$${fixed.toFixed(2)}`);
    }
    return parts.length > 0 ? parts.join(' ') : 'Free';
  };

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4469e5] mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading gateway details...</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!currentGateway) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                Payment Gateway Details
              </DialogTitle>
              <DialogDescription>
                View and manage payment gateway configuration
              </DialogDescription>
            </div>
            <div className="flex items-center gap-2">
              {currentGateway.is_active ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDeactivate}
                  className="text-orange-600 hover:text-orange-700"
                >
                  <XCircle className="w-4 h-4 mr-1" />
                  Deactivate
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleActivate}
                  className="text-green-600 hover:text-green-700"
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Activate
                </Button>
              )}
              {!currentGateway.is_default && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSetDefault}
                  className="text-yellow-600 hover:text-yellow-700"
                >
                  <Star className="w-4 h-4 mr-1" />
                  Set Default
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(currentGateway)}
                className="text-blue-600 hover:text-blue-700"
              >
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </Button>
            </div>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="configuration">Configuration</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Gateway Profile */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  {currentGateway.logo_url ? (
                    <img 
                      src={currentGateway.logo_url} 
                      alt={currentGateway.name}
                      className="w-16 h-16 rounded-lg object-contain"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#4469e5] to-[#ee9807] flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                      {currentGateway.name[0]}
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {currentGateway.name}
                      </h3>
                      {currentGateway.is_default && (
                        <Badge variant="default" className="bg-blue-100 text-blue-800">
                          <Star className="w-3 h-3 mr-1" />
                          Default
                        </Badge>
                      )}
                      {getStatusBadge(currentGateway.is_active)}
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">{currentGateway.slug}</p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Code className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Provider Class</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {currentGateway.provider_class}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Transaction Fee</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {formatFee(currentGateway.transaction_fee_percentage, currentGateway.transaction_fee_fixed)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Created</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(currentGateway.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Settings className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Priority</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {currentGateway.priority}
                      </p>
                    </div>
                  </div>
                </div>

                {currentGateway.description && (
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {currentGateway.description}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Supported Currencies */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Supported Currencies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {currentGateway.supported_currencies?.map((currency) => (
                    <Badge key={currency} variant="outline" className="text-sm">
                      {currency}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Supported Payment Methods */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Supported Payment Methods
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {currentGateway.supported_payment_methods?.map((method) => (
                    <Badge key={method} variant="secondary" className="text-sm capitalize">
                      {method.replace('_', ' ')}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="configuration" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuration Details</CardTitle>
                <CardDescription>
                  Gateway configuration and settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Provider Class</p>
                    <code className="text-xs text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded block">
                      {currentGateway.provider_class}
                    </code>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Slug</p>
                    <code className="text-xs text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded block">
                      {currentGateway.slug}
                    </code>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Transaction Fee</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {formatFee(currentGateway.transaction_fee_percentage, currentGateway.transaction_fee_fixed)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Priority</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {currentGateway.priority}
                    </p>
                  </div>
                </div>
                {currentGateway.webhook_secret && (
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Webhook Secret</p>
                    <code className="text-xs text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded block">
                      {currentGateway.webhook_secret.substring(0, 20)}...
                    </code>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="features" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Gateway Features</CardTitle>
                <CardDescription>
                  Supported capabilities and features
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                      <Zap className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Subscriptions</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Recurring billing support</p>
                      </div>
                    </div>
                    {currentGateway.supports_subscriptions ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                      <ArrowUpDown className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Refunds</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Refund processing support</p>
                      </div>
                    </div>
                    {currentGateway.supports_refunds ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                      <DollarSign className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Payouts</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Payout processing support</p>
                      </div>
                    </div>
                    {currentGateway.supports_payouts ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {currentGateway.countries && currentGateway.countries.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    Supported Countries
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {currentGateway.countries.map((country) => (
                      <Badge key={country} variant="outline" className="text-sm">
                        {country}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

