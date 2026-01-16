import { Card, CardContent } from "@/components/ui/card";
import axios, { isAxiosError } from "@/lib/axios";
import { useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { User } from "lucide-react";
import { useEffect, useState } from "react";

interface PublicProfile {
    username: string;
    displayName?: string;
    bio?: string;
}

export default function ProfilesPage() {
    const [profiles, setProfiles] = useState<PublicProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfiles = async () => {
            try {
                console.log("Fetching profiles from /api/profile/all");
                const response = await axios.get("/api/profile/all");
                console.log("Response status:", response.status);
                console.log("Response data:", response.data);
                if (response.status === 200 && response.data) {
                    setProfiles(response.data.profiles || []);
                    console.log("Profiles set:", response.data.profiles);
                }
            } catch (error) {
                console.error("Error fetching profiles:", error);
                if (isAxiosError(error)) {
                    console.error("Response data:", error.response?.data);
                    console.error("Response status:", error.response?.status);
                }
                setProfiles([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProfiles();
    }, []);

    const handleProfileClick = (username: string) => {
        navigate({ to: `/${username}` });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-primary/5">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 md:py-24 max-w-6xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-8 sm:mb-10 md:mb-12"
                >
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-2 sm:mb-3 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                        Discover Profiles
                    </h1>
                    <p className="text-muted-foreground text-base sm:text-lg">
                        Explore profiles created by our community
                    </p>
                </motion.div>

                {/* Profiles Grid */}
                {loading ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20"
                    >
                        <p className="text-muted-foreground">Loading profiles...</p>
                    </motion.div>
                ) : profiles.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="text-center py-20"
                    >
                        <div className="flex items-center justify-center w-20 h-20 mx-auto mb-4 rounded-full bg-accent/50">
                            <User className="h-10 w-10 text-muted-foreground" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">No profiles yet</h3>
                        <p className="text-muted-foreground">Be the first to create a profile!</p>
                    </motion.div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {profiles.map((profile, index) => (
                            <motion.div
                                key={profile.username}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                            >
                                <Card
                                    className="group cursor-pointer border-border/50 hover:border-primary/50 hover:shadow-lg transition-all duration-300"
                                    onClick={() => handleProfileClick(profile.username)}
                                >
                                    <CardContent className="p-6">
                                        <div className="flex items-start gap-4">
                                            <motion.div
                                                whileHover={{ scale: 1.1, rotate: 5 }}
                                                transition={{ duration: 0.3 }}
                                                className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-accent text-2xl font-bold"
                                            >
                                                {(profile.displayName || profile.username).charAt(0).toUpperCase()}
                                            </motion.div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold text-lg truncate group-hover:text-primary transition-colors">
                                                    {profile.displayName || profile.username}
                                                </h3>
                                                <p className="text-sm text-muted-foreground truncate">
                                                    @{profile.username}
                                                </p>
                                                {profile.bio && (
                                                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                                                        {profile.bio}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
