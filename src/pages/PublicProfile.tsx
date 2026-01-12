import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { useParams } from "@tanstack/react-router";
import axios from "axios";
import { Briefcase, GraduationCap, Link as LinkIcon } from "lucide-react";
import { useEffect, useState } from "react";

interface SocialLink {
    platform: string;
    url: string;
    title?: string;
    showIcon?: boolean;
}

interface Education {
    id: string;
    institutionName: string;
    degree?: string;
    fieldOfStudy?: string;
    startDate?: string;
    endDate?: string;
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
    education?: Education[];
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

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
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
        <div className="min-h-screen bg-background">
            <div className="max-w-4xl mx-auto p-6 space-y-6">
                {/* Header */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                            <Avatar className="h-20 w-20">
                                <AvatarFallback className="text-2xl">
                                    {getInitials(profile.displayName, profile.username)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <h1 className="text-2xl font-bold">
                                    {profile.displayName || profile.username}
                                </h1>
                                <p className="text-muted-foreground">@{profile.username}</p>
                                {profile.bio && (
                                    <p className="mt-2 text-sm">{profile.bio}</p>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Links */}
                {profile.links && profile.links.length > 0 && (
                    <Card>
                        <CardContent className="pt-6">
                            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <LinkIcon className="h-5 w-5" />
                                Links
                            </h2>
                            <div className="space-y-2">
                                {profile.links.map((link, index) => (
                                    <a
                                        key={index}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block p-3 rounded-lg border border-border hover:bg-accent transition-colors"
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium">{link.title || link.platform}</span>
                                            <span className="text-xs text-muted-foreground">→</span>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Projects */}
                {profile.projects && profile.projects.length > 0 && (
                    <Card>
                        <CardContent className="pt-6">
                            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <Briefcase className="h-5 w-5" />
                                Projects
                            </h2>
                            <div className="space-y-3">
                                {profile.projects.map((project) => (
                                    <div
                                        key={project.id}
                                        className="p-4 rounded-lg border border-border/50 hover:border-border hover:bg-accent/50 transition-all"
                                    >
                                        <h4 className="font-semibold mb-1">{project.projectTitle}</h4>
                                        {project.projectDescription && (
                                            <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                                                {project.projectDescription}
                                            </p>
                                        )}
                                        {project.techStack && project.techStack.length > 0 && (
                                            <div className="flex flex-wrap gap-1 mb-2">
                                                {project.techStack.map((tech, index) => (
                                                    <span
                                                        key={index}
                                                        className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary"
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
                                            className="text-xs text-primary hover:underline"
                                        >
                                            View Project →
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Education */}
                {profile.education && profile.education.length > 0 && (
                    <Card>
                        <CardContent className="pt-6">
                            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <GraduationCap className="h-5 w-5" />
                                Education
                            </h2>
                            <div className="space-y-3">
                                {profile.education.map((edu) => (
                                    <div
                                        key={edu.id}
                                        className="p-4 rounded-lg border border-border/50 hover:border-border hover:bg-accent/50 transition-all"
                                    >
                                        <h4 className="font-semibold">{edu.degree || "Education"}</h4>
                                        <p className="text-sm text-muted-foreground mb-1">
                                            {edu.institutionName}
                                        </p>
                                        {edu.fieldOfStudy && (
                                            <p className="text-sm text-muted-foreground mb-2">
                                                {edu.fieldOfStudy}
                                            </p>
                                        )}
                                        {edu.startDate && (
                                            <p className="text-xs text-muted-foreground">
                                                {formatDate(edu.startDate)} -{" "}
                                                {edu.endDate ? formatDate(edu.endDate) : "Present"}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
