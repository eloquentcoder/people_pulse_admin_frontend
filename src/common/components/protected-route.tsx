import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../hooks/useAppSelector';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { isAuthenticated, user } = useAppSelector((state) => state.auth);

    // Not authenticated - redirect to login
    if (!isAuthenticated || !user) {
        return <Navigate to="/login" replace />;
    }

    // Not a platform admin - show unauthorized
    if (user.user_type !== 'platform_admin') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                        403 - Unauthorized
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        This portal is for platform administrators only.
                    </p>
                    <a
                        href="/login"
                        className="text-[#4469e5] hover:underline"
                    >
                        Return to login
                    </a>
                </div>
            </div>
        );
    }

    return <>{children}</>;
};

