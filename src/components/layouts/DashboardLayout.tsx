import { DashboardSidebar } from "@/components/ui/DashboardSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Outlet } from "@tanstack/react-router";

export default function DashboardLayout() {
    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full">
                {/* Sidebar */}
                <DashboardSidebar />

                {/* Main Content */}
                <main className="flex-1 flex flex-col lg:h-screen lg:overflow-hidden w-full min-h-screen lg:min-h-0">
                    {/* Mobile Sidebar Trigger */}
                    <div className="sticky top-0 z-10 flex h-12 sm:h-14 items-center gap-3 sm:gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-3 sm:px-4 lg:hidden">
                        <SidebarTrigger />
                        <h1 className="text-base sm:text-lg font-semibold">OneURL</h1>
                    </div>

                    {/* Page Content */}
                    <div className="flex-1 p-3 sm:p-4 md:p-5 lg:p-6 max-w-full overflow-y-auto lg:overflow-hidden">
                        <div className="max-w-7xl mx-auto h-full">
                            <Outlet />
                        </div>
                    </div>
                </main>
            </div>
        </SidebarProvider>
    );
}