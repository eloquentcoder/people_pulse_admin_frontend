import { NavLink, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Building2,
    Users,
    CreditCard,
    Package,
    Settings,
    HelpCircle,
    BarChart3,
    Bell,
    FileText,
    X,
    Shield,
    ClipboardList,
    Tag,
    Megaphone,
    Globe,
    FileCheck,
    CalendarDays,
    ScrollText,
    ShieldCheck
} from 'lucide-react';
import { cn } from '@/common/lib/utils';
import { useSidebar } from '@/common/hooks/useSidebar';
import { useEffect, useMemo } from 'react';
import logo from '@/assets/favicon.png';
import { useGetSupportTicketStatsQuery } from '@/domains/portal/support-tickets/apis/support-ticket.api';
import { useAppSelector } from '@/common/hooks/useAppSelector';
import { canAccess } from '@/common/auth/permissions';

interface NavItem {
    title: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    badgeKey?: 'openTickets';
    permission?: string;
}

export const navItemsConfig: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
        permission: 'view-analytics',
    },
    {
        title: 'Organizations',
        href: '/organizations',
        icon: Building2,
        permission: 'view-organizations',
    },
    {
        title: 'Compliance Review',
        href: '/compliance',
        icon: FileCheck,
        permission: 'view-compliance-review',
    },
    {
        title: 'Subscriptions',
        href: '/subscriptions',
        icon: CreditCard,
        permission: 'view-subscriptions',
    },
    {
        title: 'Organization Users',
        href: '/users',
        icon: Users,
        permission: 'view-all-users',
    },
    {
        title: 'Roles & Permissions',
        href: '/roles-permissions',
        icon: Shield,
        permission: 'roles.view',
    },
    {
        title: 'Platform Admins',
        href: '/platform-admins',
        icon: ShieldCheck,
        permission: 'view-platform-admins',
    },
    {
        title: 'Email Templates',
        href: '/hr-templates',
        icon: ClipboardList,
        permission: 'view-hr-templates',
    },
    {
        title: 'Plans',
        href: '/plans',
        icon: Package,
        permission: 'view-plans',
    },
    {
        title: 'Features',
        href: '/features',
        icon: Tag,
        permission: 'view-features',
    },
    {
        title: 'Analytics',
        href: '/analytics',
        icon: BarChart3,
        permission: 'view-analytics',
    },
    {
        title: 'Billing',
        href: '/billing',
        icon: FileText,
        permission: 'view-billing',
    },
    {
        title: 'Support Tickets',
        href: '/support',
        icon: HelpCircle,
        badgeKey: 'openTickets',
        permission: 'view-all-tickets',
    },
    {
        title: 'Demo Requests',
        href: '/demo-requests',
        icon: CalendarDays,
        permission: 'view-demo-requests',
    },
    {
        title: 'Announcements',
        href: '/announcements',
        icon: Megaphone,
        permission: 'view-announcements',
    },
    {
        title: 'Landing Content',
        href: '/landing-content',
        icon: Globe,
        permission: 'view-landing-content',
    },
    {
        title: 'Audit Log',
        href: '/audit-logs',
        icon: ScrollText,
        permission: 'view-audit-logs',
    },
    {
        title: 'Notifications',
        href: '/notifications',
        icon: Bell,
        permission: 'view-notifications',
    },
    {
        title: 'Settings',
        href: '/settings',
        icon: Settings,
        permission: 'view-system-settings',
    },
];

export function getVisibleNavItems(user: Parameters<typeof canAccess>[0], openTicketsCount = 0) {
    return navItemsConfig
        .filter(item => !item.permission || canAccess(user, item.permission))
        .map(item => ({
            ...item,
            badge: item.badgeKey === 'openTickets' && openTicketsCount > 0
                ? openTicketsCount.toString()
                : undefined,
        }));
}

export const Sidebar = () => {
    const { isOpen, close } = useSidebar();
    const location = useLocation();
    const user = useAppSelector((state) => state.auth.user);

    // Fetch support ticket stats for badge
    const { data: ticketStatsData } = useGetSupportTicketStatsQuery();
    const openTicketsCount = ticketStatsData?.data?.open_tickets || 0;

    // Build nav items with dynamic badges
    const navItems = useMemo(() => {
        return getVisibleNavItems(user, openTicketsCount);
    }, [openTicketsCount, user]);

    // Close sidebar on route change (mobile)
    useEffect(() => {
        close();
    }, [location, close]);

    return (
        <>
            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={close}
                />
            )}

            {/* Sidebar */}
            <aside className={cn(
                "fixed left-0 top-0 h-screen w-64 border-r bg-white dark:bg-gray-950 flex flex-col z-50 transition-transform duration-300",
                "lg:translate-x-0",
                isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
            )}>
                {/* Logo */}
                <div className="h-16 flex items-center justify-between px-6 border-b">
                    {/* Close button (mobile only) */}
                    <button
                        onClick={close}
                        className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors -ml-2"
                    >
                        <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </button>
                <div className="flex items-center gap-1">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                        <img src={logo} alt="Logo" className="h-8" />
                    </div>
                    <div>
                        <h1 className="text-sm font-bold text-gray-900 dark:text-white">
                            PeoplePulse
                        </h1>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Admin Portal
                        </p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-4 px-3">
                <div className="space-y-1">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.href}
                            to={item.href}
                            className={({ isActive }) =>
                                cn(
                                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                                    isActive
                                        ? 'bg-[#ee9807] text-white shadow-md'
                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                                )
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <item.icon className={cn('w-5 h-5', isActive ? 'text-white' : 'text-gray-500 dark:text-gray-400')} />
                                    <span className="flex-1">{item.title}</span>
                                    {item.badge && (
                                        <span className={cn(
                                            'px-2 py-0.5 rounded-full text-xs font-semibold',
                                            isActive
                                                ? 'bg-white/20 text-white'
                                                : 'bg-[#ee9807] text-white'
                                        )}>
                                            {item.badge}
                                        </span>
                                    )}
                                </>
                            )}
                        </NavLink>
                    ))}
                </div>
            </nav>

            {/* Footer */}
            <div className="p-4 border-t">
                <div className="bg-gradient-to-r from-[#4469e5]/10 to-[#ee9807]/10 rounded-lg p-3">
                    <p className="text-xs font-semibold text-gray-900 dark:text-white mb-1">
                        Platform v1.0.0
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                        © 2025 PeoplePulse
                    </p>
                </div>
            </div>
        </aside>
        </>
    );
};
