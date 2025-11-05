import { Bell, Search, LogOut, User, Settings, Menu } from 'lucide-react';
import { Button } from '@/common/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/common/components/ui/avatar';
import { Badge } from '@/common/components/ui/badge';
import { useAppSelector } from '@/common/hooks/useAppSelector';
import { useLogoutMutation } from '@/domains/auth/login/apis/login.api';
import { useSidebar } from '@/common/hooks/useSidebar';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const Navbar = () => {
    const { user } = useAppSelector((state) => state.auth);
    const [logout, { isLoading }] = useLogoutMutation();
    const { toggle } = useSidebar();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout().unwrap();
            toast.success('Logged out successfully');
            navigate('/login');
        } catch (error) {
            console.error('Logout error:', error);
            // Navigate anyway
            navigate('/login');
        }
    };

    return (
        <header className="fixed top-0 left-0 lg:left-64 right-0 h-16 border-b bg-white dark:bg-gray-950 z-10">
            <div className="h-full px-4 lg:px-6 flex items-center justify-between gap-4">
                {/* Hamburger Menu (Mobile) */}
                <button
                    onClick={toggle}
                    className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    aria-label="Toggle sidebar"
                >
                    <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>

                {/* Search */}
                <div className="flex-1 max-w-xl hidden md:block">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search organizations, users, subscriptions..."
                            className="w-full h-10 pl-10 pr-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#4469e5] focus:border-transparent"
                        />
                    </div>
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-2 lg:gap-4">
                    {/* Notifications */}
                    <button className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                        <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-[#ee9807] rounded-full"></span>
                    </button>

                    {/* User Menu */}
                    <div className="flex items-center gap-2 lg:gap-3 pl-2 lg:pl-4 border-l">
                        <div className="text-right hidden md:block">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {user?.first_name} {user?.last_name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center justify-end gap-1">
                                <Badge variant="default" className="text-[10px] px-1.5 py-0 bg-gradient-to-r from-[#4469e5] to-[#ee9807]">
                                    Platform Admin
                                </Badge>
                            </p>
                        </div>
                        <Avatar>
                            <AvatarImage src={`https://ui-avatars.com/api/?name=${user?.first_name}+${user?.last_name}&background=4469e5&color=fff`} />
                            <AvatarFallback className="bg-gradient-to-br from-[#4469e5] to-[#ee9807] text-white font-semibold">
                                {user?.first_name?.[0]}{user?.last_name?.[0]}
                            </AvatarFallback>
                        </Avatar>

                        {/* Dropdown Menu */}
                        <div className="flex items-center gap-0.5 lg:gap-1">
                            <Button
                                variant="ghost"
                                size="icon-sm"
                                className="hover:bg-gray-100 dark:hover:bg-gray-800 hidden sm:flex"
                                onClick={() => navigate('/profile')}
                            >
                                <User className="w-4 h-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon-sm"
                                className="hover:bg-gray-100 dark:hover:bg-gray-800 hidden sm:flex"
                                onClick={() => navigate('/settings')}
                            >
                                <Settings className="w-4 h-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon-sm"
                                className="hover:bg-gray-100 dark:hover:bg-gray-800 text-destructive"
                                onClick={handleLogout}
                                disabled={isLoading}
                            >
                                <LogOut className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};
