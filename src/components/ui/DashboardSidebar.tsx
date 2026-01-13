import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import axios from "@/lib/axios";
import { useNavigate } from "@tanstack/react-router";
import { Home, LogOut, User } from "lucide-react";
import { useEffect, useState } from "react";

interface UserData {
    id: string;
    name: string;
    email: string;
    hasCompletedOnboarding: boolean;
}

export function DashboardSidebar() {
    const navigate = useNavigate();
    const [user, setUser] = useState<UserData | null>(null);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [currentPath, setCurrentPath] = useState(window.location.pathname);

    // Update current path when location changes
    useEffect(() => {
        const handleLocationChange = () => {
            setCurrentPath(window.location.pathname);
        };

        // Listen for popstate (back/forward)
        window.addEventListener('popstate', handleLocationChange);

        // Also update on mount
        setCurrentPath(window.location.pathname);

        return () => {
            window.removeEventListener('popstate', handleLocationChange);
        };
    }, []);

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

    // Check if route is active
    const isActive = (path: string): boolean => {
        if (path === "/dashboard") {
            return currentPath === "/dashboard";
        }
        return currentPath.startsWith(path);
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
        <Sidebar>
            {/* Header with Logo */}
            <SidebarHeader className="border-b border-border/50 p-4">
                <div className="flex items-center space-x-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <span className="text-lg font-bold">O</span>
                    </div>
                    <span className="text-xl font-semibold tracking-tight">OneProfile</span>
                </div>
            </SidebarHeader>

            {/* Main Navigation */}
            <SidebarContent>
                <SidebarGroup>
                    {/* <SidebarGroupLabel>Navigation</SidebarGroupLabel> */}
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem className="mb-2 mt-6">
                                <SidebarMenuButton
                                    onClick={() => {
                                        // @ts-expect-error - Route types
                                        navigate({ to: "/dashboard" });
                                        setCurrentPath("/dashboard");
                                    }}
                                    isActive={isActive("/dashboard")}
                                    style={{ backgroundColor: isActive("/dashboard") ? 'hsl(240 3.7% 15.9%)' : 'transparent', color: isActive("/dashboard") ? 'hsl(240 4.8% 95.9%)' : 'inherit' }}
                                >
                                    <Home className="h-4 w-4" />
                                    <span>Dashboard</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    onClick={() => {
                                        // @ts-expect-error - Route types
                                        navigate({ to: "/dashboard/profile" });
                                        setCurrentPath("/dashboard/profile");
                                    }}
                                    isActive={isActive("/dashboard/profile")}
                                    style={{ backgroundColor: isActive("/dashboard/profile") ? 'hsl(240 3.7% 15.9%)' : 'transparent', color: isActive("/dashboard/profile") ? 'hsl(240 4.8% 95.9%)' : 'inherit' }}
                                >
                                    <User className="h-4 w-4" />
                                    <span>Profile</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            {/* Footer with User Info and Logout */}
            <SidebarFooter className="border-t border-border/50 p-4">
                <div className="space-y-3">
                    {/* User Info */}
                    {user && (
                        <div className="flex items-center gap-3 px-2 py-1.5 rounded-lg bg-background/50">
                            <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
                                    {getUserInitials(user.name)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{user.name}</p>
                                <p className="text-xs text-muted-foreground truncate">
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
                        className="w-full gap-2 text-destructive hover:text-destructive hover:bg-destructive/10 border-none"
                    >
                        <LogOut className="h-4 w-4" />
                        {isLoggingOut ? "Logging out..." : "Logout"}
                    </Button>
                </div>
            </SidebarFooter>
        </Sidebar>
    );
}
