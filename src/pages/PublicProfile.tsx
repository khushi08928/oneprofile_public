import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import axios from "@/lib/axios";
import { useParams } from "@tanstack/react-router";
import { Briefcase, Github, Instagram, Linkedin, Link as LinkIcon, Share, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
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
            <div className="min-h-screen bg-gradient-to-br from-[#FEF9C3]/40 via-white to-[#FEF9C3]/20 font-sans">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 md:px-8 py-16 sm:py-20 md:py-24 animate-in fade-in duration-300">
                    {/* Header Skeleton */}
                    <div className="mb-10 sm:mb-12">
                        <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6 mb-8">
                            {/* Avatar placeholder */}
                            <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-[#2C3947]/10 border-2 border-[#2C3947]/20 flex-shrink-0 animate-pulse" />

                            <div className="flex-1 w-full sm:w-auto space-y-3">
                                <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
                                    <div className="flex-1 space-y-2.5">
                                        {/* Display name line */}
                                        <div className="h-8 w-48 bg-[#2C3947]/15 rounded-xl mx-auto sm:mx-0 animate-pulse" />
                                        {/* Username line */}
                                        <div className="h-4 w-24 bg-[#2C3947]/10 rounded-lg mx-auto sm:mx-0 animate-pulse" />
                                    </div>
                                    {/* Share Button placeholder */}
                                    <div className="h-9 w-24 bg-[#2C3947]/10 rounded-xl animate-pulse" />
                                </div>
                                {/* Bio lines */}
                                <div className="space-y-2 mt-4 max-w-xl mx-auto sm:mx-0">
                                    <div className="h-4 w-full bg-[#2C3947]/10 rounded-lg animate-pulse" />
                                    <div className="h-4 w-[85%] bg-[#2C3947]/10 rounded-lg mx-auto sm:mx-0 animate-pulse" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Links Stack Skeleton */}
                    <div className="space-y-3 sm:space-y-4 mb-12">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="w-full h-14 rounded-2xl bg-white/70 border-2 border-[#2C3947]/15 flex items-center justify-between px-5 shadow-[2px_2px_0px_0px_rgba(44,57,71,0.05)] animate-pulse"
                                style={{ animationDelay: `${i * 150}ms` }}
                            >
                                <div className="flex items-center gap-3.5 w-full">
                                    {/* Link Icon Placeholder */}
                                    <div className="h-5 w-5 rounded bg-[#2C3947]/15 flex-shrink-0" />
                                    {/* Link Title Placeholder */}
                                    <div className="h-4 w-[35%] bg-[#2C3947]/10 rounded-lg" />
                                </div>
                                <div className="h-4 w-4 bg-[#2C3947]/10 rounded flex-shrink-0" />
                            </div>
                        ))}
                    </div>

                    {/* Projects Section Skeleton */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-6 animate-pulse">
                            <div className="h-5 w-5 bg-[#2C3947]/15 rounded" />
                            <div className="h-4 w-36 bg-[#2C3947]/15 rounded" />
                        </div>
                        <div className="space-y-4">
                            {[1, 2].map((i) => (
                                <div
                                    key={i}
                                    className="p-6 rounded-2xl w-full bg-white/70 border-2 border-[#2C3947]/15 shadow-[3px_3px_0px_0px_rgba(44,57,71,0.05)] space-y-3.5 animate-pulse"
                                    style={{ animationDelay: `${i * 200}ms` }}
                                >
                                    <div className="flex justify-between items-start gap-2">
                                        <div className="h-5 w-[40%] bg-[#2C3947]/15 rounded-lg" />
                                        <div className="h-4 w-4 bg-[#2C3947]/10 rounded" />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="h-4 w-full bg-[#2C3947]/10 rounded-lg" />
                                        <div className="h-4 w-[90%] bg-[#2C3947]/10 rounded-lg" />
                                    </div>
                                    <div className="flex gap-1.5 pt-1">
                                        <div className="h-5 w-12 bg-[#2C3947]/10 rounded-md" />
                                        <div className="h-5 w-14 bg-[#2C3947]/10 rounded-md" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#FEF9C3]/40 via-white to-[#FEF9C3]/20 font-sans p-4">
                <div className="bg-white border-4 border-[#2C3947] rounded-3xl p-8 max-w-sm w-full text-center shadow-[8px_8px_0px_0px_rgba(44,57,71,1)] flex flex-col items-center space-y-6 animate-in fade-in zoom-in duration-200">
                    <div className="w-16 h-16 rounded-2xl bg-red-100 border-2 border-[#2C3947] flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(44,57,71,1)]">
                        <span className="text-3xl font-black text-red-600">?</span>
                    </div>
                    <div>
                        <h3 className="text-2xl font-display font-black text-[#2C3947] tracking-tight">404</h3>
                        <p className="text-sm font-bold text-[#2C3947]/70 mt-1">Profile Not Found</p>
                        <p className="text-xs text-[#2C3947]/50 mt-2 font-medium">The page you are looking for might have been removed or doesn't exist.</p>
                    </div>
                    <Button 
                        onClick={() => window.location.href = "/"}
                        className="w-full bg-[#2C3947] text-[#FEF9C3] hover:bg-[#212B36] font-bold border-2 border-[#2C3947] rounded-xl shadow-[3px_3px_0px_0px_rgba(44,57,71,1)] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(44,57,71,1)]"
                    >
                        Back to Home
                    </Button>
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

