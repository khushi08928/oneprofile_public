import { createRootRoute, createRoute } from "@tanstack/react-router";
import Authlayout from "./components/layouts/Authlayout";
import LandingLayout from "./components/layouts/LandingLayout";
import Rootlayout from "./components/layouts/Rootlayout";
import Home from "./pages/Home";
import Login from "./pages/Login";

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

const authlayout = createRoute({
    getParentRoute: () => rootRoute,
    // path: "/auth",
    id:'auth',
    component: Authlayout,
})

const loginRoute = createRoute({
    getParentRoute: () => authlayout,
    path: '/login',
    component: Login,
})

rootRoute.addChildren([
    landingLayoutRoute.addChildren([homeRoute]),
    authlayout.addChildren([loginRoute])
])

export const routeTree = rootRoute;
