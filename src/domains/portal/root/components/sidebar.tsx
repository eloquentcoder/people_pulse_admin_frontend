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
    Megaphone
} from 'lucide-react';
import { cn } from '@/common/lib/utils';
import { useSidebar } from '@/common/hooks/useSidebar';
import { useEffect, useMemo } from 'react';
import logo from '@/assets/favicon.png';
import { useGetSupportTicketStatsQuery } from '@/domains/portal/support-tickets/apis/support-ticket.api';

interface NavItem {
    title: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    badgeKey?: 'openTickets';
}

const navItemsConfig: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
    },
    {
        title: 'Organizations',
        href: '/organizations',
        icon: Building2,
    },
    {
        title: 'Subscriptions',
        href: '/subscriptions',
        icon: CreditCard,
    },
    {
        title: 'Users',
        href: '/users',
        icon: Users,
    },
    {
        title: 'Roles & Permissions',
        href: '/roles-permissions',
        icon: Shield,
    },
    {
        title: 'HR Templates',
        href: '/hr-templates',
        icon: ClipboardList,
    },
    {
        title: 'Plans',
        href: '/plans',
        icon: Package,
    },
    {
        title: 'Features',
        href: '/features',
        icon: Tag,
    },
    {
        title: 'Analytics',
        href: '/analytics',
        icon: BarChart3,
    },
    {
        title: 'Billing',
        href: '/billing',
        icon: FileText,
    },
    {
        title: 'Support Tickets',
        href: '/support',
        icon: HelpCircle,
        badgeKey: 'openTickets',
    },
    {
        title: 'Announcements',
        href: '/announcements',
        icon: Megaphone,
    },
    {
        title: 'Notifications',
        href: '/notifications',
        icon: Bell,
    },
    {
        title: 'Settings',
        href: '/settings',
        icon: Settings,
    },
];

export const Sidebar = () => {
    const { isOpen, close } = useSidebar();
    const location = useLocation();

    // Fetch support ticket stats for badge
    const { data: ticketStatsData } = useGetSupportTicketStatsQuery();
    const openTicketsCount = ticketStatsData?.data?.open_tickets || 0;

    // Build nav items with dynamic badges
    const navItems = useMemo(() => {
        return navItemsConfig.map(item => ({
            ...item,
            badge: item.badgeKey === 'openTickets' && openTicketsCount > 0
                ? openTicketsCount.toString()
                : undefined
        }));
    }, [openTicketsCount]);

    // Close sidebar on route change (mobile)
    useEffect(() => {
        close();
    }, [location]);

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
