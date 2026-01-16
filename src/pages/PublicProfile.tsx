import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import axios from "@/lib/axios";
import { useParams } from "@tanstack/react-router";
import { Briefcase, Github, Instagram, Linkedin, Link as LinkIcon, Share } from "lucide-react";
import { useEffect, useState } from "react";

interface SocialLink {
    platform: string;
    url: string;
    title?: string;
    showIcon?: boolean;
    faviconUrl?: string;
}

interface Project {
    id: string;
    projectTitle: string;
    projectDescription?: string;
    techStack?: string[];
    projectLink: string;
}

interface UserProfile {
    username: string;
    displayName?: string;
    bio?: string;
    links?: SocialLink[];
    projects?: Project[];
}

export function PublicProfile() {
    const params = useParams({ strict: false }) as { username: string };
    const username = params.username;
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get(`/api/profile/public/${username}`);
                if (response.status === 200 && response.data) {
                    setProfile(response.data);
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        if (username) {
            fetchProfile();
        }
    }, [username]);

    const getInitials = (name?: string, username?: string) => {
        if (name) {
            return name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2);
        }
        return username?.slice(0, 2).toUpperCase() || "??";
    };

    const getPlatformName = (platform?: string): string => {
        switch (platform) {
            case "linkedin":
                return "LinkedIn";
            case "github":
                return "GitHub";
            case "instagram":
                return "Instagram";
            default:
                return "Website";
        }
    };

    const getPlatformIcon = (platform?: string) => {
        const iconClass = "h-5 w-5";
        switch (platform) {
            case "linkedin":
                return <Linkedin className={`${iconClass} text-[#0A66C2]`} />;
            case "github":
                return <Github className={`${iconClass} text-foreground`} />;
            case "instagram":
                return <Instagram className={`${iconClass} text-[#E4405F]`} />;
            default:
                return <LinkIcon className={`${iconClass} text-muted-foreground`} />;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-muted-foreground">Loading profile...</p>
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-2">404</h1>
                    <p className="text-muted-foreground">Profile not found</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-primary/5">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-12 sm:py-16 md:py-20 lg:py-24">
                {/* Header Section */}
                <div className="mb-8 sm:mb-10 md:mb-12">
                    <div className="flex flex-col sm:flex-row items-start sm:items-start gap-4 sm:gap-6 mb-6">
                        <Avatar className="h-16 w-16 sm:h-20 sm:w-20 ring-2 ring-border">
                            <AvatarFallback className="text-xl sm:text-2xl font-bold bg-gradient-to-br from-primary/10 to-accent">
                                {getInitials(profile.displayName, profile.username)}
                            </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 w-full sm:w-auto">
                            <div className="flex flex-col sm:flex-row items-start sm:items-start justify-between gap-3 sm:gap-4">
                                <div className="flex-1">
                                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-1">
                                        {profile.displayName || profile.username}
                                    </h1>
                                    <p className="text-sm sm:text-base text-muted-foreground">
                                        @{profile.username}
                                    </p>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="gap-2 w-full sm:w-auto"
                                    onClick={() => {
                                        if (navigator.share) {
                                            navigator.share({
                                                title: `${profile.displayName || profile.username}'s Profile`,
                                                text: `Check out ${profile.displayName || profile.username}'s profile!`,
                                                url: window.location.href,
                                            });
                                        }
                                    }}
                                >
                                    <Share className="h-4 w-4" />
                                    <span className="sm:inline">Share</span>
                                </Button>
                            </div>

                            {profile.bio && (
                                <p className="text-sm text-foreground/80 mt-3 leading-relaxed">
                                    {profile.bio}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Social Links - Icon Buttons */}
                    {profile.links && profile.links.length > 0 && (
                        <div className="flex flex-wrap items-center gap-3 sm:gap-4 md:gap-6 mt-8 sm:mt-10 md:mt-12">
                            {profile.links.map((link, index) => (
                                <a
                                    key={index}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center h-10 w-10 sm:h-11 sm:w-11 rounded-md border border-border bg-background hover:bg-accent hover:border-primary/50 transition-all duration-200"
                                    title={link.title && link.title !== "Website" ? link.title : getPlatformName(link.platform)}
                                >
                                    {link.faviconUrl ? (
                                        <img
                                            src={link.faviconUrl}
                                            alt={link.title || getPlatformName(link.platform)}
                                            className="h-5 w-5 rounded object-cover"
                                            onError={(e) => {
                                                // Fallback to platform icon if favicon fails
                                                e.currentTarget.style.display = 'none';
                                                const parent = e.currentTarget.parentElement;
                                                if (parent) {
                                                    const iconDiv = document.createElement('div');
                                                    iconDiv.innerHTML = getPlatformIcon(link.platform) as any;
                                                    parent.appendChild(iconDiv.firstChild as Node);
                                                }
                                            }}
                                        />
                                    ) : (
                                        getPlatformIcon(link.platform)
                                    )}
                                </a>
                            ))}
                        </div>
                    )}
                </div>

                {/* Projects Section */}
                {profile.projects && profile.projects.length > 0 && (
                    <div className="space-y-4">
                        <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2 mb-4 sm:mb-6">
                            <Briefcase className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                            Projects
                        </h2>
                        <div className="space-y-3 sm:space-y-4">
                            {profile.projects.map((project) => (
                                <Card key={project.id} className="border-border/50 hover:border-border hover:shadow-md transition-all duration-200">
                                    <CardContent className="p-4 sm:p-5 md:p-6">
                                        <div className="space-y-3">
                                            <div>
                                                <h3 className="font-semibold text-base sm:text-lg mb-1">
                                                    {project.projectTitle}
                                                </h3>
                                                {project.projectDescription && (
                                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                                        {project.projectDescription}
                                                    </p>
                                                )}
                                            </div>

                                            {project.techStack && project.techStack.length > 0 && (
                                                <div className="flex flex-wrap gap-2">
                                                    {project.techStack.map((tech, index) => (
                                                        <span
                                                            key={index}
                                                            className="text-xs px-2.5 sm:px-3 py-1 rounded-md bg-primary/5 text-primary border border-primary/10 font-medium"
                                                        >
                                                            {tech}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}

                                            <a
                                                href={project.projectLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline font-medium"
                                            >
                                                View Project
                                                <LinkIcon className="h-3.5 w-3.5" />
                                            </a>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {/* Footer */}
                {/* <div className="mt-16 pt-8 border-t border-border/50">
                    <p className="text-center text-xs text-muted-foreground">
                        Powered by OneProfile
                    </p>
                </div> */}
            </div>
        </div>
    );
}
