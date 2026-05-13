import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/sidebar";
import { Navbar } from "../components/navbar";
import { SidebarProvider } from "@/common/hooks/useSidebar";
import { useInactivityTimeout } from "@/common/hooks/useInactivityTimeout";
import { InactivityWarningModal } from "@/common/components/inactivity-warning-modal";

// Inactivity timeout: 25 minutes, with 60 second warning countdown
const INACTIVITY_TIMEOUT_MINUTES = 25;
const WARNING_DURATION_SECONDS = 60;

export const PortalRootPage = () => {
    const {
        showWarning,
        secondsRemaining,
        continueSession,
        logoutNow,
    } = useInactivityTimeout({
        timeoutMinutes: INACTIVITY_TIMEOUT_MINUTES,
        warningDurationSeconds: WARNING_DURATION_SECONDS,
        enabled: true,
    });

    return (
        <SidebarProvider>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                {/* Sidebar */}
                <Sidebar />

                {/* Main Content Area */}
                <div className="lg:pl-64">
                    {/* Navbar */}
                    <Navbar />

                    {/* Page Content */}
                    <main className="mt-14 p-4 md:p-6 min-h-screen">
                        <Outlet />
                    </main>
                </div>
            </div>

            {/* Inactivity Warning Modal */}
            <InactivityWarningModal
                open={showWarning}
                secondsRemaining={secondsRemaining}
                onContinue={continueSession}
                onLogout={logoutNow}
            />
        </SidebarProvider>
    );
};