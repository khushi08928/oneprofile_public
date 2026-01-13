import { createRootRoute, createRoute, redirect } from "@tanstack/react-router";
import Authlayout from "./components/layouts/Authlayout";
import DashboardLayout from "./components/layouts/DashboardLayout";
import LandingLayout from "./components/layouts/LandingLayout";
import Rootlayout from "./components/layouts/Rootlayout";
import { checkAuth } from "./lib/auth";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Onboarding from "./pages/Onboarding";
import Profile from "./pages/Profile";
import { PublicProfile } from "./pages/PublicProfile";
import Signup from "./pages/Signup";
import ProfilesPage from "./pages/Profiles";


const rootRoute = createRootRoute({
    component: Rootlayout,
})

const landingLayoutRoute = createRoute({
    getParentRoute: () => rootRoute,
    id: 'landing',
    component: LandingLayout,
})

const homeRoute = createRoute({
    getParentRoute: () => landingLayoutRoute,
    path: '/',
    component: Home,
})

const profilesRoute = createRoute({
    getParentRoute: () => landingLayoutRoute,
    path: '/profiles',
    component: ProfilesPage,
})

const authlayout = createRoute({
    getParentRoute: () => rootRoute,
    // path: "/auth",
    id: 'auth',
    component: Authlayout,
})

const loginRoute = createRoute({
    getParentRoute: () => authlayout,
    path: '/login',
    component: Login,
    beforeLoad: async () => {
        const user = await checkAuth();

        if (user) {
            // User is authenticated
            if (user.hasCompletedOnboarding) {
                // Already completed onboarding - go to dashboard
                throw redirect({ to: "/dashboard" as any });
            } else {
                // Not completed onboarding - go to onboarding
                throw redirect({ to: "/onboarding" as any });
            }
        }
        // Not authenticated - allow access to login
    },
})

const signupRoute = createRoute({
    getParentRoute: () => authlayout,
    path: '/signup',
    component: Signup,
    beforeLoad: async () => {
        const user = await checkAuth();

        if (user) {
            // User is authenticated
            if (user.hasCompletedOnboarding) {
                // Already completed onboarding - go to dashboard
                throw redirect({ to: "/dashboard" as any });
            } else {
                // Not completed onboarding - go to onboarding
                throw redirect({ to: "/onboarding" as any });
            }
        }
        // Not authenticated - allow access to signup
    },
})

const onboardingRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/onboarding',
    component: Onboarding,
    beforeLoad: async () => {
        const user = await checkAuth();

        if (!user) {
            // Not authenticated - redirect to login
            throw redirect({ to: "/login" as any });
        }

        if (user.hasCompletedOnboarding) {
            // Already completed onboarding - go to dashboard
            throw redirect({ to: "/dashboard" as any });
        }

        // Authenticated and not completed - allow access to onboarding
    },
})

const dashboardLayoutRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/dashboard',
    component: DashboardLayout,
    beforeLoad: async () => {
        const user = await checkAuth();

        if (!user) {
            // Not authenticated - redirect to login
            throw redirect(
                { to: "/login" as any }
            );
        }

        if (!user.hasCompletedOnboarding) {
            // Not completed onboarding - redirect to onboarding
            throw redirect({ to: "/onboarding" as any });
        }

        // Authenticated and completed onboarding - allow access to dashboard
    },
})

// Dashboard Index Route
const dashboardIndexRoute = createRoute({
    getParentRoute: () => dashboardLayoutRoute,
    path: '/',
    component: Dashboard,
})

// Profile Route
const profileRoute = createRoute({
    getParentRoute: () => dashboardLayoutRoute,
    path: '/profile',
    component: Profile,
})

// Public Profile Route (must be last to avoid conflicts)
const publicProfileRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/$username',
    component: PublicProfile,
})

rootRoute.addChildren([
    landingLayoutRoute.addChildren([homeRoute, profilesRoute]),
    authlayout.addChildren([loginRoute, signupRoute]),
    onboardingRoute,
    dashboardLayoutRoute.addChildren([dashboardIndexRoute, profileRoute]),
    publicProfileRoute  // Add at the end to avoid route conflicts
])

export const routeTree = rootRoute;
