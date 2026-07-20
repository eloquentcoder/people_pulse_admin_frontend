import { useEffect, useState } from 'react';
import { CreditCard, Loader2, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent } from '@/common/components/ui/card';
import { Switch } from '@/common/components/ui/switch';
import type { Organization } from '../models/organization.model';
import { useUpdateBillingInterfaceMutation } from '../apis/organization.api';

interface BillingInterfaceToggleProps {
  organization: Organization;
  onSuccess?: () => void;
}

export const BillingInterfaceToggle = ({ organization, onSuccess }: BillingInterfaceToggleProps) => {
  const [enabled, setEnabled] = useState(organization.settings?.billing_interface_enabled !== false);
  const [updateBillingInterface, { isLoading }] = useUpdateBillingInterfaceMutation();

  useEffect(() => {
    setEnabled(organization.settings?.billing_interface_enabled !== false);
  }, [organization.settings?.billing_interface_enabled]);

  const handleChange = async (nextEnabled: boolean) => {
    const previousEnabled = enabled;
    setEnabled(nextEnabled);

    try {
      await updateBillingInterface({ id: organization.id, enabled: nextEnabled }).unwrap();
      toast.success(`Billing interface ${nextEnabled ? 'enabled' : 'disabled'}`);
      onSuccess?.();
    } catch {
      setEnabled(previousEnabled);
      toast.error('Failed to update billing interface');
    }
  };

  return (
    <Card className="border-l-4 border-l-[#ee9807] shadow-sm">
      <CardContent className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-orange-50 p-2 text-[#ee9807]">
            <CreditCard className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">Billing interface</p>
            <p className="mt-1 max-w-xl text-sm text-gray-600 dark:text-gray-400">
              Control whether this organization can see and manage billing in its PeoplePulse portal.
            </p>
            <p className="mt-2 flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
              Enabled by default for existing organizations
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-3 self-end sm:self-center">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {enabled ? 'Visible' : 'Hidden'}
          </span>
          {isLoading && <Loader2 className="h-4 w-4 animate-spin text-gray-400" aria-label="Saving billing interface setting" />}
          <Switch
            checked={enabled}
            onCheckedChange={handleChange}
            disabled={isLoading}
            aria-label="Billing interface"
          />
        </div>
      </CardContent>
    </Card>
  );
};
