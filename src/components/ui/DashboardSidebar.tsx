import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    // SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import axios from "@/lib/axios";
import { useNavigate, useLocation } from "@tanstack/react-router";
import { BarChart3, LogOut, Palette, Link as LinkIcon, Briefcase } from "lucide-react";
import { useEffect, useState } from "react";

interface UserData {
    id: string;
    name: string;
    email: string;
    hasCompletedOnboarding: boolean;
}

export function DashboardSidebar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState<UserData | null>(null);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const searchParams = new URLSearchParams(location.search);
    const activeTab = searchParams.get("tab") || "links";

    // Fetch user data on mount
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get("/api/auth/me", {
                    withCredentials: true,
                });
                if (response.status === 200 && response.data) {
                    setUser(response.data);
                }
            } catch (error) {
                console.error("Error fetching user:", error);
                // If can't get user, redirect to login
                // @ts-expect-error - Route types
                navigate({ to: "/login" });
            }
        };

        fetchUser();
    }, [navigate]);

    // Get user initials for avatar
    const getUserInitials = (name: string): string => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    // Check if tab is active
    const isTabActive = (tabName: string): boolean => {
        return activeTab === tabName;
    };

    // Logout handler
    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            await axios.post("/api/auth/logout", {}, {
                withCredentials: true,
            });

            // Redirect to login after successful logout
            // @ts-expect-error - Route types
            navigate({ to: "/login" });
        } catch (error) {
            console.error("Logout error:", error);
            // Even if logout fails, redirect to login
            // @ts-expect-error - Route types
            navigate({ to: "/login" });
        } finally {
            setIsLoggingOut(false);
        }
    };

    return (
        <Sidebar className="border-r-2 border-[#2C3947]/10 bg-white">
            {/* Header with Logo */}
            <SidebarHeader className="border-b-2 border-[#2C3947]/10 p-4 flex-shrink-0">
                <div className="flex items-center space-x-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#2C3947] text-[#FEF9C3] border-2 border-[#2C3947] shadow-[2px_2px_0px_0px_rgba(44,57,71,1)]">
                        <span className="text-base font-black">O</span>
                    </div>
                    <span className="text-lg font-black tracking-tight text-[#2C3947]">OneProfile</span>
                </div>
            </SidebarHeader>

            {/* Main Navigation */}
            <SidebarContent className="flex-1 overflow-y-auto px-2">
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu className="space-y-1">
                            <SidebarMenuItem className="mb-2 mt-2">
                                <SidebarMenuButton
                                    onClick={() => {
                                        // @ts-expect-error - Route types
                                        navigate({ to: "/dashboard", search: { tab: "links" } as any });
                                    }}
                                    isActive={isTabActive("links")}
                                    className={`h-11 px-3 rounded-xl border-2 font-bold transition-all ${
                                        isTabActive("links")
                                            ? "bg-[#2C3947] text-[#FEF9C3] border-[#2C3947] shadow-[3px_3px_0px_0px_rgba(44,57,71,1)] hover:bg-[#2C3947] hover:text-[#FEF9C3]"
                                            : "bg-transparent text-[#2C3947]/75 border-transparent hover:bg-slate-50 hover:text-[#2C3947]"
                                    }`}
                                >
                                    <LinkIcon className="h-4 w-4" />
                                    <span>Links</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem className="mb-2">
                                <SidebarMenuButton
                                    onClick={() => {
                                        // @ts-expect-error - Route types
                                        navigate({ to: "/dashboard", search: { tab: "projects" } as any });
                                    }}
                                    isActive={isTabActive("projects")}
                                    className={`h-11 px-3 rounded-xl border-2 font-bold transition-all ${
                                        isTabActive("projects")
                                            ? "bg-[#2C3947] text-[#FEF9C3] border-[#2C3947] shadow-[3px_3px_0px_0px_rgba(44,57,71,1)] hover:bg-[#2C3947] hover:text-[#FEF9C3]"
                                            : "bg-transparent text-[#2C3947]/75 border-transparent hover:bg-slate-50 hover:text-[#2C3947]"
                                    }`}
                                >
                                    <Briefcase className="h-4 w-4" />
                                    <span>Projects</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem className="mb-2">
                                <SidebarMenuButton
                                    onClick={() => {
                                        // @ts-expect-error - Route types
                                        navigate({ to: "/dashboard", search: { tab: "appearance" } as any });
                                    }}
                                    isActive={isTabActive("appearance")}
                                    className={`h-11 px-3 rounded-xl border-2 font-bold transition-all ${
                                        isTabActive("appearance")
                                            ? "bg-[#2C3947] text-[#FEF9C3] border-[#2C3947] shadow-[3px_3px_0px_0px_rgba(44,57,71,1)] hover:bg-[#2C3947] hover:text-[#FEF9C3]"
                                            : "bg-transparent text-[#2C3947]/75 border-transparent hover:bg-slate-50 hover:text-[#2C3947]"
                                    }`}
                                >
                                    <Palette className="h-4 w-4" />
                                    <span>Appearance</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            {/* <SidebarMenuItem className="mb-2">
                                <SidebarMenuButton
                                    onClick={() => {
                                        // @ts-expect-error - Route types
                                        navigate({ to: "/dashboard", search: { tab: "analytics" } as any });
                                    }}
                                    isActive={isTabActive("analytics")}
                                    className={`h-11 px-3 rounded-xl border-2 font-bold transition-all ${
                                        isTabActive("analytics")
                                            ? "bg-[#2C3947] text-[#FEF9C3] border-[#2C3947] shadow-[3px_3px_0px_0px_rgba(44,57,71,1)] hover:bg-[#2C3947] hover:text-[#FEF9C3]"
                                            : "bg-transparent text-[#2C3947]/75 border-transparent hover:bg-slate-50 hover:text-[#2C3947]"
                                    }`}
                                >
                                    <BarChart3 className="h-4 w-4" />
                                    <span>Analytics</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem> */}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            {/* Footer with User Info and Logout */}
            <SidebarFooter className="border-t-2 border-[#2C3947]/10 p-4 flex-shrink-0 mt-auto">
                <div className="space-y-3">
                    {/* User Info */}
                    {user && (
                        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 border-2 border-[#2C3947]/10">
                            <Avatar className="h-8 w-8 rounded-lg border-2 border-[#2C3947]">
                                <AvatarFallback className="bg-[#2C3947] text-[#FEF9C3] text-xs font-black">
                                    {getUserInitials(user.name)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-[#2C3947] truncate">{user.name}</p>
                                <p className="text-[10px] text-[#2C3947]/60 font-semibold truncate">
                                    {user.email}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Logout Button */}
                    <Button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        variant="outline"
                        className="w-full gap-2 text-xs sm:text-sm font-bold text-red-500 hover:text-red-600 hover:bg-red-50 border-2 border-red-500/20 rounded-xl h-10 transition-all"
                    >
                        <LogOut className="h-3.5 w-3.5" />
                        {isLoggingOut ? "Logging out..." : "Logout"}
                    </Button>
                </div>
            </SidebarFooter>
        </Sidebar>
    );
}
