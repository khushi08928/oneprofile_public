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
                <main className="flex-1 overflow-auto">
                    {/* Mobile Sidebar Trigger */}
                    <div className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 lg:hidden">
                        <SidebarTrigger />
                        <h1 className="text-lg font-semibold">OneURL</h1>
                    </div>

                    {/* Page Content */}
                    <div className="p-6">
                        <Outlet />
                    </div>
                </main>
            </div>
        </SidebarProvider>
    );
}