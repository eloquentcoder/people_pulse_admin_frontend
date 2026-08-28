import LoginPage from "@/domains/auth/login/page/login.page";
import AdminSetupPage from "@/domains/auth/login/page/admin-setup.page";
import AuthRootPage from "@/domains/auth/root/pages/root.page";
import { DashboardPage } from "@/domains/portal/dashboard/pages/dashboard.page";
import { PortalRootPage } from "@/domains/portal/root/pages/root.page";
import { ProtectedRoute } from "@/common/components/protected-route";
import { createBrowserRouter, Navigate } from "react-router-dom";
import OrganizationPage from "@/domains/portal/organizations/pages/organization.page";
import OrganizationDetailPage from "@/domains/portal/organizations/pages/organization-detail.page";
import PlansPage from "@/domains/portal/plans/pages/plans.page";
import SubscriptionManagementPage from "@/domains/portal/subscriptions/pages/subscription-management.page";
import UserManagementPage from "@/domains/portal/users/pages/user-management.page";
import SupportTicketsPage from "@/domains/portal/support-tickets/pages/support-tickets.page";
import { AnalyticsPage } from "@/domains/portal/analytics/pages/analytics.page";
import NotificationsPage from "@/domains/portal/notifications/pages/notifications.page";
import RolesPermissionsPage from "@/domains/portal/roles-permissions/pages/roles-permissions.page";
import SettingsPage from "@/domains/portal/settings/pages/settings.page";
import BillingPage from "@/domains/portal/billing/pages/billing.page";
import HRTemplatesPage from "@/domains/portal/hr-templates/pages/hr-templates.page";
import FeaturesPage from "@/domains/portal/features/pages/features.page";
import ProfilePage from "@/domains/portal/profile/pages/profile.page";
import AnnouncementsPage from "@/domains/portal/announcements/pages/announcements.page";
import LandingContentPage from "@/domains/portal/landing-content/pages/landing-content.page";
import ComplianceReviewPage from "@/domains/portal/compliance/pages/compliance-review.page";
import OrganizationComplianceDetailPage from "@/domains/portal/compliance/pages/organization-compliance-detail.page";
import DemoRequestsPage from "@/domains/portal/demo-requests/pages/demo-requests.page";
import AuditLogsPage from "@/domains/portal/audit-logs/pages/audit-logs.page";
import type { ReactNode } from "react";
import PlatformAdminsPage from "@/domains/portal/platform-admins/pages/platform-admins.page";
import { PermissionRoute } from "@/common/components/permission-route";

const gated = (permission: string, element: ReactNode) => (
    <PermissionRoute permission={permission}>{element}</PermissionRoute>
);

export const routes = createBrowserRouter([
    {
        path: '/',
        element: <Navigate to="/login" replace />,
    },
    {
        path: '/',
        element: <AuthRootPage />,
        children: [
            {
                path: 'login',
                element: <LoginPage />,
            },
            {
                path: 'admin/setup',
                element: <AdminSetupPage />,
            },
        ],
    },
    {
        path: "",
        element: (
            <ProtectedRoute>
                <PortalRootPage />
            </ProtectedRoute>
        ),
        children: [
            {
                path: 'dashboard',
                element: gated('view-analytics', <DashboardPage />),
            },
            {
                path: 'organizations',
                element: gated('view-organizations', <OrganizationPage />),
            },
            {
                path: 'organizations/:id',
                element: gated('view-organizations', <OrganizationDetailPage />),
            },
            {
                path: 'subscriptions',
                element: gated('view-subscriptions', <SubscriptionManagementPage/>),
            },
            {
                path: 'users',
                element: gated('view-all-users', <UserManagementPage />),
            },
            {
                path: 'platform-admins',
                element: gated('view-platform-admins', <PlatformAdminsPage />),
            },
            {
                path: 'plans',
                element: gated('view-plans', <PlansPage />),
            },
            {
                path: 'features',
                element: gated('view-features', <FeaturesPage />),
            },
            {
                path: 'ai-models',
                element: gated('view-ai-models', <div className="text-2xl font-bold">AI Models</div>),
            },
            {
                path: 'analytics',
                element: gated('view-analytics', <AnalyticsPage />),
            },
            {
                path: 'billing',
                element: gated('view-billing', <BillingPage />),
            },
            {
                path: 'support',
                element: gated('view-all-tickets', <SupportTicketsPage />),
            },
            {
                path: 'notifications',
                element: gated('view-notifications', <NotificationsPage />),
            },
            {
                path: 'settings',
                element: gated('view-system-settings', <SettingsPage />),
            },
            {
                path: 'roles-permissions',
                element: gated('roles.view', <RolesPermissionsPage />),
            },
            {
                path: 'hr-templates',
                element: gated('view-hr-templates', <HRTemplatesPage />),
            },
            {
                path: 'profile',
                element: <ProfilePage />,
            },
            {
                path: 'announcements',
                element: gated('view-announcements', <AnnouncementsPage />),
            },
            {
                path: 'landing-content',
                element: gated('view-landing-content', <LandingContentPage />),
            },
            {
                path: 'compliance',
                element: gated('view-compliance-review', <ComplianceReviewPage />),
            },
            {
                path: 'compliance/organizations/:id',
                element: gated('view-compliance-review', <OrganizationComplianceDetailPage />),
            },
            {
                path: 'demo-requests',
                element: gated('view-demo-requests', <DemoRequestsPage />),
            },
            {
                path: 'audit-logs',
                element: gated('view-audit-logs', <AuditLogsPage />),
            },
        ],
    }
]);
