import axios from "axios";

interface User {
    id: string;
    name: string;
    email: string;
    hasCompletedOnboarding: boolean;
    createdAt: string;
}

/**
 * Check if user is authenticated by calling /api/auth/me
 * Returns user data if authenticated, null otherwise
 */
export async function checkAuth(): Promise<User | null> {
    try {
        const response = await axios.get("/api/auth/me", {
            withCredentials: true,
        });

        if (response.status === 200 && response.data) {
            return response.data;
        }

        return null;
    } catch (error) {
        // User is not authenticated
        return null;
    }
}

/**
 * Check if user has completed onboarding
 */
export async function hasCompletedOnboarding(): Promise<boolean> {
    const user = await checkAuth();
    return user?.hasCompletedOnboarding ?? false;
}

/**
 * Get current authenticated user
 */
export async function getCurrentUser(): Promise<User | null> {
    return await checkAuth();
}

/**
 * Logout user
 */
export async function logout(): Promise<void> {
    try {
        await axios.post("/api/auth/logout", {}, {
            withCredentials: true,
        });
    } catch (error) {
        console.error("Logout error:", error);
    }
}
