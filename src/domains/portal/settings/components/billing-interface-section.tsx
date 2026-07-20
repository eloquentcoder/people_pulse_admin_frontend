import { useEffect, useState } from 'react';
import { CreditCard, Globe2, Loader2, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/common/components/ui/card';
import { Switch } from '@/common/components/ui/switch';
import {
  useGetBillingInterfaceSettingQuery,
  useUpdateBillingInterfaceSettingMutation,
} from '../apis/settings.api';

export const BillingInterfaceSection = () => {
  const { data, isLoading } = useGetBillingInterfaceSettingQuery();
  const [updateSetting, { isLoading: isSaving }] = useUpdateBillingInterfaceSettingMutation();
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    if (data?.data) {
      setEnabled(data.data.enabled);
    }
  }, [data]);

  const handleChange = async (nextEnabled: boolean) => {
    const previousEnabled = enabled;
    setEnabled(nextEnabled);

    try {
      await updateSetting({ enabled: nextEnabled }).unwrap();
      toast.success(`Billing interface ${nextEnabled ? 'enabled for all organizations' : 'disabled for all organizations'}`);
    } catch {
      setEnabled(previousEnabled);
      toast.error('Failed to update global billing interface setting');
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex h-32 items-center justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-[#4469e5]" aria-label="Loading billing setting" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-l-4 border-l-[#4469e5] shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Globe2 className="h-5 w-5 text-[#4469e5]" />
          Billing for all organizations
        </CardTitle>
        <CardDescription>
          Use this master switch to show or hide the billing interface across the entire platform.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-blue-50 p-2 text-[#4469e5]">
            <CreditCard className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">
              {enabled ? 'Billing is visible platform-wide' : 'Billing is hidden platform-wide'}
            </p>
            <p className="mt-1 flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
              Organization-specific overrides still apply when this is enabled.
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-3 self-end sm:self-center">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {enabled ? 'Enabled' : 'Disabled'}
          </span>
          <Switch
            checked={enabled}
            onCheckedChange={handleChange}
            disabled={isSaving}
            aria-label="Billing for all organizations"
          />
        </div>
      </CardContent>
    </Card>
  );
};
