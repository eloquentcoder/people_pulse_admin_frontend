import LoginPage from "@/domains/auth/login/page/login.page";
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
                element: <DashboardPage />,
            },
            {
                path: 'organizations',
                element: <OrganizationPage />,
            },
            {
                path: 'organizations/:id',
                element: <OrganizationDetailPage />,
            },
            {
                path: 'subscriptions',
                element: <SubscriptionManagementPage/>,
            },
            {
                path: 'users',
                element: <UserManagementPage />,
            },
            {
                path: 'plans',
                element: <PlansPage />,
            },
            {
                path: 'features',
                element: <FeaturesPage />,
            },
            {
                path: 'ai-models',
                element: <div className="text-2xl font-bold">AI Models</div>,
            },
            {
                path: 'analytics',
                element: <AnalyticsPage />,
            },
            {
                path: 'billing',
                element: <BillingPage />,
            },
            {
                path: 'support',
                element: <SupportTicketsPage />,
            },
            {
                path: 'notifications',
                element: <NotificationsPage />,
            },
            {
                path: 'settings',
                element: <SettingsPage />,
            },
            {
                path: 'roles-permissions',
                element: <RolesPermissionsPage />,
            },
            {
                path: 'hr-templates',
                element: <HRTemplatesPage />,
            },
            {
                path: 'profile',
                element: <ProfilePage />,
            },
            {
                path: 'announcements',
                element: <AnnouncementsPage />,
            },
        ],
    }
]);