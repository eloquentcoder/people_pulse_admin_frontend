import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAppSelector } from '@/common/hooks/useAppSelector';

const AuthRootPage = () => {
    const { isAuthenticated, user } = useAppSelector((state) => state.auth);
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated && user) {
            // Check if user is platform admin
            if (user.user_type === 'platform_admin') {
                navigate('/dashboard');
            } else {
                toast.error('Unauthorized', {
                    description: 'This portal is for platform administrators only.',
                });
            }
        }
    }, [isAuthenticated, user, navigate]);

    return (
        <main>
            <Outlet />
        </main>
    )
}

export default AuthRootPage;