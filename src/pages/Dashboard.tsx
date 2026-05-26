import { AddLink } from "@/components/profile/AddLink";
import { AddProject } from "@/components/profile/AddProject";
import { PhonePreview } from "@/components/dashboard/PhonePreview";
import { YourUrlCard } from "@/components/dashboard/YourUrlCard";
import Analytics from "./Analytics";
import axios from "@/lib/axios";
import { themes } from "@/lib/themes";
import { useLocation } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
    Briefcase,
    ExternalLink,
    Eye,
    Layers,
    Link as LinkIcon,
    Loader2,
    Palette,
    Settings2,
    Trash2,
    X,
    Check
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface SocialLink {
    id: string;
    title: string;
    url: string;
    platform?: string;
    showIcon: boolean;
    faviconUrl?: string;
}

interface Project {
    id: string;
    projectTitle: string;
    projectDescription: string;
    techStack: string[];
    projectLink: string;
}

interface ProfileData {
    username: string;
    displayName: string;
    bio: string;
    theme?: string;
}

export default function Dashboard() {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const activeTab = searchParams.get("tab") || "links";

    // Global states
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [links, setLinks] = useState<SocialLink[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [isMobilePreviewOpen, setIsMobilePreviewOpen] = useState(false);

    // Appearance Edit States
    const [displayName, setDisplayName] = useState("");
    const [bio, setBio] = useState("");
    const [savingProfile, setSavingProfile] = useState(false);

    const fetchData = async () => {
        try {
            const profileRes = await axios.get("/api/profile/me/profile", {
                withCredentials: true,
            });
            if (profileRes.status === 200 && profileRes.data?.profile) {
                const p = profileRes.data.profile;
                setProfile({
                    username: p.username || "",
                    displayName: p.displayName || "",
                    bio: p.bio || "",
                    theme: p.theme || "default",
                });
                setDisplayName(p.displayName || "");
                setBio(p.bio || "");
                setLinks(p.links || []);
            }

            const projectsRes = await axios.get("/api/project", {
                withCredentials: true,
            });
            if (projectsRes.status === 200 && projectsRes.data?.projects) {
                setProjects(projectsRes.data.projects);
            }
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
            toast.error("Failed to load dashboard data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Link Action Handlers
    const deleteLink = async (linkId: string) => {
        const promise = axios.delete(`/api/profile/links/${linkId}`, {
            withCredentials: true,
        });

        toast.promise(promise, {
            loading: "Removing link...",
            success: () => {
                setLinks((prev) => prev.filter((l) => l.id !== linkId));
                return "Link removed successfully";
            },
            error: "Failed to remove link",
        });
    };

    // Project Action Handlers
    const deleteProject = async (projectId: string) => {
        const promise = axios.delete(`/api/project/${projectId}`, {
            withCredentials: true,
        });

        toast.promise(promise, {
            loading: "Deleting project...",
            success: () => {
                setProjects((prev) => prev.filter((p) => p.id !== projectId));
                return "Project deleted successfully";
            },
            error: "Failed to delete project",
        });
    };

    // Profile updates (Display Name & Bio)
    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!profile) return;
        setSavingProfile(true);

        try {
            await axios.post(
                "/api/profile/complete-onboarding",
                {
                    username: profile.username,
                    displayName,
                    bio,
                    theme: profile.theme,
                },
                { withCredentials: true }
            );

            setProfile((prev) => prev ? { ...prev, displayName, bio } : null);
            toast.success("Profile details updated successfully!");
        } catch (err) {
            console.error(err);
            toast.error("Failed to save profile details");
        } finally {
            setSavingProfile(false);
        }
    };

    // Direct Theme Click Updates
    const handleThemeSelect = async (themeId: string) => {
        if (!profile) return;
        
        // Optimistic update for instant preview feel
        setProfile((prev) => prev ? { ...prev, theme: themeId } : null);

        try {
            await axios.post(
                "/api/profile/complete-onboarding",
                {
                    username: profile.username,
                    displayName: profile.displayName,
                    bio: profile.bio,
                    theme: themeId,
                },
                { withCredentials: true }
            );
            toast.success(`Theme updated to ${themeId}!`);
        } catch (err) {
            console.error(err);
            toast.error("Failed to change theme on the server");
            // Rollback if failure
            fetchData();
        }
    };

    const getPlatformIcon = (platform?: string) => {
        const cls = "h-4 w-4 text-inherit";
        switch (platform) {
            case "linkedin":
                return <ExternalLink className={cls} />;
            case "github":
                return <ExternalLink className={cls} />;
            case "instagram":
                return <ExternalLink className={cls} />;
            default:
                return <LinkIcon className={cls} />;
        }
    };

    if (loading) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
                <Loader2 className="h-10 w-10 text-primary animate-spin" />
                <p className="text-sm text-muted-foreground animate-pulse font-sans">
                    Setting up your premium workspace...
                </p>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col lg:flex-row gap-8 lg:overflow-hidden font-sans relative">
            {/* Left Content Column (Editor Pane) */}
            <div className="flex-1 w-full max-w-3xl space-y-6 lg:h-full lg:overflow-y-auto lg:pr-3 pb-12 no-scrollbar">
                {/* Links Tab */}
                {activeTab === "links" && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="space-y-6"
                    >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-[#2C3947]/10 pb-4">
                            <div>
                                <h2 className="text-xl sm:text-2xl font-display font-black tracking-tight text-[#2C3947] flex items-center gap-2">
                                    <LinkIcon className="h-5 w-5 text-[#2C3947]" />
                                    Manage Links
                                </h2>
                                <p className="text-xs sm:text-sm text-[#2C3947]/60 font-semibold mt-0.5">
                                    Add, sort, or remove social profiles and custom URLs
                                </p>
                            </div>
                            <AddLink onSuccess={fetchData} />
                        </div>

                        {links.length === 0 ? (
                            <div className="border-2 border-dashed border-[#2C3947]/20 rounded-2xl p-12 text-center bg-slate-50/50">
                                <div className="h-12 w-12 rounded-2xl bg-[#2C3947]/5 flex items-center justify-center mx-auto mb-4 border border-[#2C3947]/10">
                                    <LinkIcon className="h-6 w-6 text-[#2C3947]/60" />
                                </div>
                                <h3 className="font-bold text-sm mb-1 text-[#2C3947]">No links added</h3>
                                <p className="text-xs text-[#2C3947]/60 font-semibold max-w-xs mx-auto mb-5">
                                    Your profile is empty. Click the button above to add your first link.
                                </p>
                            </div>
                        ) : (
                            <div className="grid gap-3 sm:gap-4">
                                {links.map((link) => (
                                    <div
                                        key={link.id}
                                        className="flex items-center justify-between p-4 bg-white border-2 border-[#2C3947] shadow-[3px_3px_0px_0px_rgba(44,57,71,1)] rounded-2xl hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(44,57,71,1)] transition-all duration-200 group"
                                    >
                                        <div className="flex items-center gap-3.5 min-w-0">
                                            <div className="h-9 w-9 rounded-xl bg-slate-50 border-2 border-[#2C3947]/10 flex items-center justify-center flex-shrink-0">
                                                {link.faviconUrl ? (
                                                    <img
                                                        src={link.faviconUrl}
                                                        alt=""
                                                        className="h-5 w-5 rounded object-cover"
                                                        onError={(e) => {
                                                            e.currentTarget.style.display = 'none';
                                                        }}
                                                    />
                                                ) : (
                                                    getPlatformIcon(link.platform)
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="text-sm font-black text-[#2C3947] truncate transition-colors">
                                                    {link.title || link.url}
                                                </h4>
                                                {link.title && (
                                                    <p className="text-xs text-[#2C3947]/60 truncate font-semibold max-w-[200px] sm:max-w-md">
                                                        {link.url}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => deleteLink(link.id)}
                                            className="h-8 w-8 rounded-lg text-[#2C3947]/60 hover:text-red-500 hover:bg-red-50 border border-transparent hover:border-red-500/20 flex items-center justify-center transition-all bg-transparent p-0"
                                            title="Delete Link"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}

                {/* Projects Tab */}
                {activeTab === "projects" && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="space-y-6"
                    >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-[#2C3947]/10 pb-4">
                            <div>
                                <h2 className="text-xl sm:text-2xl font-display font-black tracking-tight text-[#2C3947] flex items-center gap-2">
                                    <Briefcase className="h-5 w-5 text-[#2C3947]" />
                                    Featured Projects
                                </h2>
                                <p className="text-xs sm:text-sm text-[#2C3947]/60 font-semibold mt-0.5">
                                    Display work portfolios, repositories, or blogs
                                </p>
                            </div>
                            <AddProject onSuccess={fetchData} />
                        </div>

                        {projects.length === 0 ? (
                            <div className="border-2 border-dashed border-[#2C3947]/20 rounded-2xl p-12 text-center bg-slate-50/50">
                                <div className="h-12 w-12 rounded-2xl bg-[#2C3947]/5 flex items-center justify-center mx-auto mb-4 border border-[#2C3947]/10">
                                    <Briefcase className="h-6 w-6 text-[#2C3947]/60" />
                                </div>
                                <h3 className="font-bold text-sm mb-1 text-[#2C3947]">No projects yet</h3>
                                <p className="text-xs text-[#2C3947]/60 font-semibold max-w-xs mx-auto">
                                    Feature your GitHub repos, websites, or side hustles.
                                </p>
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {projects.map((project) => (
                                    <div
                                        key={project.id}
                                        className="p-5 bg-white border-2 border-[#2C3947] shadow-[3px_3px_0px_0px_rgba(44,57,71,1)] rounded-2xl hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(44,57,71,1)] transition-all duration-200"
                                    >
                                        <div className="flex justify-between items-start gap-4 mb-2">
                                            <div className="min-w-0">
                                                <h4 className="text-base font-black text-[#2C3947] truncate">
                                                    {project.projectTitle}
                                                </h4>
                                                <a
                                                    href={project.projectLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1 text-xs text-[#2C3947] hover:underline font-bold mt-0.5 animate-pulse"
                                                >
                                                    View project link
                                                    <ExternalLink className="h-3 w-3" />
                                                </a>
                                            </div>
                                            <button
                                                onClick={() => deleteProject(project.id)}
                                                className="h-8 w-8 rounded-lg text-[#2C3947]/60 hover:text-red-500 hover:bg-red-50 border border-transparent hover:border-red-500/20 flex items-center justify-center transition-all flex-shrink-0 bg-transparent p-0"
                                                title="Delete Project"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>

                                        {project.projectDescription && (
                                            <p className="text-sm text-[#2C3947]/75 font-semibold leading-relaxed mb-4">
                                                {project.projectDescription}
                                            </p>
                                        )}

                                        {project.techStack && project.techStack.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5">
                                                {project.techStack.map((tech, index) => (
                                                    <span
                                                        key={index}
                                                        className="text-[10px] px-2 py-0.5 rounded-lg bg-slate-100 text-[#2C3947] border border-[#2C3947]/10 font-bold font-mono"
                                                    >
                                                        {tech}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}

                {/* Appearance Tab */}
                {activeTab === "appearance" && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="space-y-8"
                    >
                        <div className="border-b-2 border-[#2C3947]/10 pb-4">
                            <h2 className="text-xl sm:text-2xl font-display font-black tracking-tight text-[#2C3947] flex items-center gap-2">
                                <Palette className="h-5 w-5 text-[#2C3947]" />
                                Design & Appearance
                            </h2>
                            <p className="text-xs sm:text-sm text-[#2C3947]/60 font-semibold mt-0.5">
                                Personalize your typography, profile metadata, and visual theme
                            </p>
                        </div>

                        {/* Live URL Card */}
                        <YourUrlCard />

                        {/* Profile Info Form Card */}
                        <div className="bg-white border-2 border-[#2C3947] rounded-2xl p-5 sm:p-6 space-y-6 shadow-[4px_4px_0px_0px_rgba(44,57,71,1)]">
                            <h3 className="text-base font-black text-[#2C3947] flex items-center gap-2">
                                <Settings2 className="h-4.5 w-4.5 text-[#2C3947]" />
                                Profile Metadata
                            </h3>
                            <form onSubmit={handleSaveProfile} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="displayName" className="font-bold text-xs text-[#2C3947]/80 uppercase tracking-wider">
                                        Display Name
                                    </Label>
                                    <Input
                                        id="displayName"
                                        value={displayName}
                                        onChange={(e) => setDisplayName(e.target.value)}
                                        placeholder="Jane Doe"
                                        className="h-10 border-2 border-[#2C3947]/20 focus-visible:border-[#2C3947] focus-visible:ring-0 rounded-xl transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="bio" className="font-bold text-xs text-[#2C3947]/80 uppercase tracking-wider">
                                        Bio
                                    </Label>
                                    <Textarea
                                        id="bio"
                                        value={bio}
                                        onChange={(e) => setBio(e.target.value)}
                                        placeholder="Fullstack Developer. Writing code & making apps."
                                        rows={3}
                                        className="border-2 border-[#2C3947]/20 focus-visible:border-[#2C3947] focus-visible:ring-0 rounded-xl transition-all resize-none"
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    disabled={savingProfile}
                                    className="bg-[#2C3947] text-[#FEF9C3] hover:bg-[#212B36] font-bold border-2 border-[#2C3947] h-11 px-8 rounded-xl shadow-[3px_3px_0px_0px_rgba(44,57,71,1)] hover:shadow-[1px_1px_0px_0px_rgba(44,57,71,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                                >
                                    {savingProfile ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin text-[#FEF9C3]/50" />
                                            Saving...
                                        </>
                                    ) : (
                                        "Save Profile Info"
                                    )}
                                </Button>
                            </form>
                        </div>

                        {/* Theme Customizer Container */}
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-base font-black text-[#2C3947] flex items-center gap-2">
                                    <Layers className="h-4.5 w-4.5 text-[#2C3947]" />
                                    Choose Theme
                                </h3>
                                <p className="text-xs text-[#2C3947]/60 font-semibold mt-0.5">
                                    Pick one of our premium themes. Changes apply instantly.
                                </p>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {themes.map((t) => {
                                    const isSelected = profile?.theme === t.id;
                                    return (
                                        <button
                                            key={t.id}
                                            onClick={() => handleThemeSelect(t.id)}
                                            className={`relative aspect-[3/4] rounded-2xl overflow-hidden border-2 p-4 flex flex-col justify-between transition-all duration-300 text-left hover:scale-[1.02] shadow-sm ${t.backgroundClass} ${
                                                isSelected
                                                    ? "border-[#2C3947] shadow-[4px_4px_0px_0px_rgba(44,57,71,1)] -translate-y-1"
                                                    : "border-[#2C3947]/30 hover:border-[#2C3947] hover:shadow-[3px_3px_0px_0px_rgba(44,57,71,1)] hover:-translate-y-0.5"
                                            }`}
                                        >
                                            {/* Selected Badge */}
                                            {isSelected && (
                                                <div className="absolute top-2.5 right-2.5 h-6 w-6 rounded-full bg-[#2C3947] text-[#FEF9C3] border border-[#2C3947] flex items-center justify-center shadow-sm z-10">
                                                    <Check className="h-3.5 w-3.5 stroke-[3px]" />
                                                </div>
                                            )}

                                            {/* Fake Header Mock */}
                                            <div className="space-y-1 mt-1">
                                                <div className="h-4.5 w-4.5 rounded-full bg-white/20" />
                                                <div className={`h-2.5 w-12 rounded bg-current opacity-70`} />
                                                <div className={`h-1.5 w-16 rounded bg-current opacity-45`} />
                                            </div>

                                            {/* Theme Info Block */}
                                            <div className="bg-black/20 dark:bg-white/10 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-white/10 flex items-center justify-between w-full">
                                                <span className="text-[10px] font-bold text-white tracking-wide truncate">
                                                    {t.name}
                                                </span>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Analytics Tab */}
                {activeTab === "analytics" && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                    >
                        <Analytics />
                    </motion.div>
                )}
            </div>

            {/* Right Desktop Live Preview Pane */}
            <div className="hidden lg:block w-[320px] flex-shrink-0">
                <div className="flex flex-col items-center gap-4">
                    <div className="text-center">
                        <span className="text-xs font-black uppercase tracking-widest text-[#2C3947]">
                            Live Preview
                        </span>
                        <p className="text-[10px] text-[#2C3947]/60 font-semibold mt-0.5">
                            See how your page looks to visitors
                        </p>
                    </div>
                    <PhonePreview
                        username={profile?.username}
                        displayName={displayName}
                        bio={bio}
                        theme={profile?.theme}
                        links={links}
                        projects={projects}
                    />
                </div>
            </div>

            {/* Floating Mobile Preview Action Button */}
            <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
                <Button
                    onClick={() => setIsMobilePreviewOpen(true)}
                    className="shadow-xl rounded-full px-5 py-6 gap-2 bg-[#2C3947] text-[#FEF9C3] hover:bg-[#212B36] font-bold text-sm tracking-wide border-2 border-[#2C3947] shadow-[4px_4px_0px_0px_rgba(44,57,71,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_rgba(44,57,71,1)] transition-all"
                >
                    <Eye className="h-4 w-4" />
                    <span>Live Preview</span>
                </Button>
            </div>

            {/* Mobile Preview Modal/Drawer Overlay */}
            <AnimatePresence>
                {isMobilePreviewOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="lg:hidden fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-4"
                    >
                        {/* Header controls */}
                        <div className="w-full max-w-[300px] flex justify-between items-center mb-4 text-white">
                            <span className="text-xs font-black uppercase tracking-widest text-[#FEF9C3]">
                                Live Device View
                            </span>
                            <button
                                onClick={() => setIsMobilePreviewOpen(false)}
                                className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 border border-white/10 transition-colors"
                            >
                                <X className="h-4.5 w-4.5" />
                            </button>
                        </div>

                        {/* Centered Mockup */}
                        <motion.div
                            initial={{ scale: 0.95, y: 15 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 15 }}
                            transition={{ type: "spring", damping: 25, stiffness: 350 }}
                        >
                            <PhonePreview
                                username={profile?.username}
                                displayName={displayName}
                                bio={bio}
                                theme={profile?.theme}
                                links={links}
                                projects={projects}
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
