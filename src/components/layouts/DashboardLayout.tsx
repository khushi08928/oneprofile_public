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
                <main className="flex-1 overflow-auto w-full">
                    {/* Mobile Sidebar Trigger */}
                    <div className="sticky top-0 z-10 flex h-12 sm:h-14 items-center gap-3 sm:gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-3 sm:px-4 lg:hidden">
                        <SidebarTrigger />
                        <h1 className="text-base sm:text-lg font-semibold">OneURL</h1>
                    </div>

                    {/* Page Content */}
                    <div className="p-3 sm:p-4 md:p-5 lg:p-6 max-w-full">
                        <div className="max-w-7xl mx-auto">
                            <Outlet />
                        </div>
                    </div>
                </main>
            </div>
        </SidebarProvider>
    );
}