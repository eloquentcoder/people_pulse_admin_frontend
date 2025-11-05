import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/sidebar";
import { Navbar } from "../components/navbar";
import { SidebarProvider } from "@/common/hooks/useSidebar";

export const PortalRootPage = () => {
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
        </SidebarProvider>
    );
};