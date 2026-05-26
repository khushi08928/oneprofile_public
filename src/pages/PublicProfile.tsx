import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import axios from "@/lib/axios";
import { useParams } from "@tanstack/react-router";
import { Briefcase, Github, Instagram, Linkedin, Link as LinkIcon, Share, ExternalLink } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { themes } from "@/lib/themes";

interface SocialLink {
    id?: string;
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
    theme?: string;
}

export function PublicProfile() {
    const params = useParams({ strict: false }) as { username: string };
    const username = params.username;
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const hasTrackedView = useRef(false);

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

    // Check if the visitor is the profile owner (skip self-tracking)
    const [isOwner, setIsOwner] = useState(false);

    useEffect(() => {
        // Try to detect if the logged-in user is the profile owner
        axios.get("/api/profile/me/profile", { withCredentials: true })
            .then(res => {
                if (res.data?.profile?.username === username) {
                    setIsOwner(true);
                }
            })
            .catch(() => {
                // Not logged in — definitely not the owner
                setIsOwner(false);
            });
    }, [username]);

    // Track profile view (fire once per page load, skip if owner)
    useEffect(() => {
        if (username && profile && !hasTrackedView.current && !isOwner) {
            hasTrackedView.current = true;
            // Fire-and-forget: don't block UI or handle errors visibly
            axios.post("/api/analytics/track-view", {
                username,
                referrer: document.referrer || "",
                screenResolution: `${window.screen.width}x${window.screen.height}`,
            }).catch(() => {
                // Silently fail — analytics should never break the user experience
            });
        }
    }, [username, profile, isOwner]);

    // Track link click (skip if owner)
    const handleLinkClick = (url: string, title?: string) => {
        if (isOwner) return; // Don't track owner's own clicks
        // Fire-and-forget tracking
        axios.post("/api/analytics/track-click", {
            username,
            linkUrl: url,
            linkTitle: title || "",
            screenResolution: `${window.screen.width}x${window.screen.height}`,
        }).catch(() => {
            // Silently fail
        });
    };

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
        const iconClass = "h-5 w-5 flex-shrink-0 text-inherit";
        switch (platform) {
            case "linkedin":
                return <Linkedin className={iconClass} />;
            case "github":
                return <Github className={iconClass} />;
            case "instagram":
                return <Instagram className={iconClass} />;
            default:
                return <LinkIcon className={iconClass} />;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-950">
                <p className="text-muted-foreground font-sans text-sm animate-pulse">Loading profile...</p>
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-950 font-sans">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-2 text-white">404</h1>
                    <p className="text-muted-foreground text-sm">Profile not found</p>
                </div>
            </div>
        );
    }

    const themeObj = themes.find((t) => t.id === profile.theme) || themes[0];

    return (
        <div className={`min-h-screen font-sans ${themeObj.backgroundClass}`}>
            <div className="max-w-2xl mx-auto px-4 sm:px-6 md:px-8 py-16 sm:py-20 md:py-24">
                {/* Header Section */}
                <div className="mb-10 sm:mb-12">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6 mb-8">
                        <Avatar className="h-20 w-20 sm:h-24 sm:w-24 ring-4 ring-white/10 shadow-lg">
                            <AvatarFallback className="text-2xl sm:text-3xl font-bold bg-primary text-primary-foreground">
                                {getInitials(profile.displayName, profile.username)}
                            </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 w-full sm:w-auto">
                            <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
                                <div className="flex-1">
                                    <h1 className={`text-3xl sm:text-4xl font-display font-black tracking-tight mb-1.5 ${themeObj.titleClass}`}>
                                        {profile.displayName || profile.username}
                                    </h1>
                                    <p className={`text-sm sm:text-base font-semibold ${themeObj.bioClass}`}>
                                        @{profile.username}
                                    </p>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="gap-2 w-full sm:w-auto bg-transparent border-current/25 hover:bg-current/10 text-inherit font-bold h-9"
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
                                    <span>Share</span>
                                </Button>
                            </div>

                            {profile.bio && (
                                <p className={`text-sm sm:text-base mt-4 leading-relaxed max-w-xl ${themeObj.bioClass}`}>
                                    {profile.bio}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Vertical Stack of Links */}
                {profile.links && profile.links.length > 0 && (
                    <div className="space-y-3 sm:space-y-4 mb-12">
                        {profile.links.map((link, index) => {
                            const hasTitle = !!link.title;
                            return (
                                <a
                                    key={link.id || index}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`w-full py-4 px-5 rounded-2xl flex items-center shadow-sm transition-all duration-200 hover:scale-[1.01] ${themeObj.buttonClass} ${hasTitle ? "justify-between" : "justify-center"}`}
                                    onClick={() => handleLinkClick(link.url, link.title || getPlatformName(link.platform))}
                                >
                                    <div className={`flex items-center gap-3.5 min-w-0 ${!hasTitle ? "justify-center w-full" : ""}`}>
                                        {link.showIcon && link.faviconUrl ? (
                                            <img
                                                src={link.faviconUrl}
                                                alt=""
                                                className="h-5 w-5 rounded-sm object-cover flex-shrink-0"
                                                onError={(e) => {
                                                    e.currentTarget.style.display = 'none';
                                                }}
                                            />
                                        ) : (
                                            getPlatformIcon(link.platform)
                                        )}
                                        {hasTitle && (
                                            <span className="truncate text-sm sm:text-base font-semibold">{link.title}</span>
                                        )}
                                    </div>
                                    {hasTitle && (
                                        <ExternalLink className="h-4 w-4 opacity-60 flex-shrink-0" />
                                    )}
                                </a>
                            );
                        })}
                    </div>
                )}

                {/* Projects Section */}
                {profile.projects && profile.projects.length > 0 && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-6">
                            <Briefcase className="h-5 w-5 text-inherit" />
                            <h2 className={`text-lg sm:text-xl font-display font-bold uppercase tracking-wider ${themeObj.titleClass}`}>
                                Featured Projects
                            </h2>
                        </div>
                        <div className="space-y-4">
                            {profile.projects.map((project) => (
                                <div
                                    key={project.id}
                                    className={`p-6 rounded-2xl w-full text-left transition-all border border-transparent shadow-sm ${themeObj.cardClass}`}
                                >
                                    <div className="flex justify-between items-start gap-2">
                                        <h3 className={`font-display font-bold text-base sm:text-lg mb-1.5 truncate ${themeObj.titleClass}`}>
                                            {project.projectTitle}
                                        </h3>
                                        <a
                                            href={project.projectLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-inherit hover:opacity-85 transition-opacity"
                                            onClick={() => handleLinkClick(project.projectLink, project.projectTitle)}
                                        >
                                            <ExternalLink className="h-4 w-4 flex-shrink-0" />
                                        </a>
                                    </div>
                                    {project.projectDescription && (
                                        <p className={`text-sm leading-relaxed mb-4 ${themeObj.textClass}`}>
                                            {project.projectDescription}
                                        </p>
                                    )}
                                    {project.techStack && project.techStack.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5">
                                            {project.techStack.map((tech, index) => (
                                                <span
                                                    key={index}
                                                    className="text-[10px] px-2 py-0.5 rounded bg-black/10 dark:bg-white/10 text-inherit font-mono font-medium"
                                                >
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

