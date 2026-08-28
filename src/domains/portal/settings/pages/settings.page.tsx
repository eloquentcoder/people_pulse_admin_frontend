import { useState } from 'react';
import { 
  Globe,
  Shield,
  Mail,
  Server,
  Palette,
  Zap,
  Link,
  HardDrive,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import { Card, CardContent } from '@/common/components/ui/card';
import { Button } from '@/common/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/common/components/ui/tabs';
import { GeneralSettingsSection } from '../components/general-settings-section';
import { SecuritySettingsSection } from '../components/security-settings-section';
import { EmailSettingsSection } from '../components/email-settings-section';
import { SystemSettingsSection } from '../components/system-settings-section';
import { BrandingSettingsSection } from '../components/branding-settings-section';
import { FeatureFlagsSection } from '../components/feature-flags-section';
import { IntegrationSettingsSection } from '../components/integration-settings-section';
import { MaintenanceSettingsSection } from '../components/maintenance-settings-section';
import { BillingInterfaceSection } from '../components/billing-interface-section';
import { AdminNotificationEmailsSection } from '../components/admin-notification-emails-section';
import { PermissionGate } from '@/common/components/permission-gate';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('general');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Platform Settings
          </h1>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-1">
            Configure platform-wide settings and preferences
          </p>
        </div>
        <div className="flex gap-2">
          <PermissionGate permission="edit-system-settings">
          <Button
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Reset
          </Button>
          </PermissionGate>
        </div>
      </div>

      {/* Warning Banner */}
      <Card className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-yellow-900 dark:text-yellow-100">
                Important Settings
              </h3>
              <p className="text-sm text-yellow-800 dark:text-yellow-200 mt-1">
                Changes to these settings will affect all organizations on the platform. Please review carefully before saving.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <PermissionGate permission="edit-system-settings">
        <BillingInterfaceSection />
        <AdminNotificationEmailsSection />
      </PermissionGate>

      {/* Settings Tabs */}
      <Card>
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="border-b border-gray-200 dark:border-gray-700 px-6">
              <TabsList className="w-full justify-start bg-transparent p-0 h-auto">
                <TabsTrigger value="general" className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  General
                </TabsTrigger>
                <TabsTrigger value="security" className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Security
                </TabsTrigger>
                <TabsTrigger value="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </TabsTrigger>
                <TabsTrigger value="system" className="flex items-center gap-2">
                  <Server className="w-4 h-4" />
                  System
                </TabsTrigger>
                <TabsTrigger value="branding" className="flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  Branding
                </TabsTrigger>
                <TabsTrigger value="features" className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Features
                </TabsTrigger>
                <TabsTrigger value="integrations" className="flex items-center gap-2">
                  <Link className="w-4 h-4" />
                  Integrations
                </TabsTrigger>
                <TabsTrigger value="maintenance" className="flex items-center gap-2">
                  <HardDrive className="w-4 h-4" />
                  Maintenance
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="p-6">
              <TabsContent value="general" className="mt-0">
                <PermissionGate permission="edit-system-settings"><GeneralSettingsSection /></PermissionGate>
              </TabsContent>

              <TabsContent value="security" className="mt-0">
                <PermissionGate permission="edit-system-settings"><SecuritySettingsSection /></PermissionGate>
              </TabsContent>

              <TabsContent value="email" className="mt-0">
                <PermissionGate permission="edit-system-settings"><EmailSettingsSection /></PermissionGate>
              </TabsContent>

              <TabsContent value="system" className="mt-0">
                <PermissionGate permission="edit-system-settings"><SystemSettingsSection /></PermissionGate>
              </TabsContent>

              <TabsContent value="branding" className="mt-0">
                <PermissionGate permission="edit-system-settings"><BrandingSettingsSection /></PermissionGate>
              </TabsContent>

              <TabsContent value="features" className="mt-0">
                <PermissionGate permission="edit-system-settings"><FeatureFlagsSection /></PermissionGate>
              </TabsContent>

              <TabsContent value="integrations" className="mt-0">
                <PermissionGate permission="edit-system-settings"><IntegrationSettingsSection /></PermissionGate>
              </TabsContent>

              <TabsContent value="maintenance" className="mt-0">
                <PermissionGate permission="edit-system-settings"><MaintenanceSettingsSection /></PermissionGate>
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
