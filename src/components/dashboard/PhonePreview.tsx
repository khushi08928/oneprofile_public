import { themes } from "@/lib/themes";
import { ExternalLink, Github, Instagram, Linkedin, Link as LinkIcon } from "lucide-react";

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

interface PhonePreviewProps {
    username?: string;
    displayName?: string;
    bio?: string;
    theme?: string;
    links?: SocialLink[];
    projects?: Project[];
}

export function PhonePreview({
    username = "",
    displayName = "",
    bio = "",
    theme = "default",
    links = [],
    projects = [],
}: PhonePreviewProps) {
    const themeObj = themes.find((t) => t.id === theme) || themes[0];

    const getInitials = (name: string): string => {
        if (!name) return "U";
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    const getPlatformIcon = (platform?: string) => {
        const cls = "h-3.5 w-3.5 flex-shrink-0";
        switch (platform) {
            case "linkedin":
                return <Linkedin className={cls} />;
            case "github":
                return <Github className={cls} />;
            case "instagram":
                return <Instagram className={cls} />;
            default:
                return <LinkIcon className={cls} />;
        }
    };

    return (
        <div className="w-[300px] h-[600px] border-[10px] border-neutral-900 rounded-[44px] bg-neutral-950 overflow-hidden relative shadow-2xl flex flex-col flex-shrink-0 ring-4 ring-neutral-900/10">
            {/* Notch */}
            <div className="absolute top-3.5 left-1/2 -translate-x-1/2 w-28 h-5 bg-neutral-900 rounded-full z-20 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-neutral-950/80 absolute left-4" />
                <div className="w-10 h-1 bg-neutral-950/80 rounded-full" />
            </div>

            {/* Scrollable Preview Area */}
            <div className={`w-full h-full overflow-y-auto px-4 pt-14 pb-8 flex flex-col items-center select-none custom-phone-scrollbar ${themeObj.backgroundClass}`}>
                {/* Avatar */}
                <div className="relative mb-3.5 mt-2">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center bg-primary text-primary-foreground font-bold text-lg shadow-md border-2 border-white/20">
                        {getInitials(displayName || username || "User")}
                    </div>
                </div>

                {/* Display Name */}
                <h2 className={`text-sm text-center mb-1 max-w-full truncate ${themeObj.titleClass}`}>
                    {displayName || (username ? `@${username}` : "Your Name")}
                </h2>

                {/* Bio */}
                <p className={`text-[10px] text-center max-w-[220px] mb-5 leading-normal ${themeObj.bioClass}`}>
                    {bio || "Your short bio description will appear here."}
                </p>

                {/* Social Links */}
                <div className="w-full space-y-2 mb-6">
                    {links.length === 0 ? (
                        <div className="text-[10px] text-center py-4 border border-dashed border-current/20 rounded-lg opacity-40">
                            No active links
                        </div>
                    ) : (
                        links.map((link) => {
                            const hasTitle = !!link.title;
                            return (
                                <a
                                    key={link.id}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`w-full py-2.5 px-3 flex items-center shadow-sm transition-all duration-200 hover:scale-[1.01] ${themeObj.buttonClass} ${hasTitle ? "justify-between" : "justify-center"}`}
                                >
                                    <div className={`flex items-center gap-2 min-w-0 ${!hasTitle ? "justify-center w-full" : ""}`}>
                                        {link.showIcon && link.faviconUrl ? (
                                            <img
                                                src={link.faviconUrl}
                                                alt=""
                                                className="h-3.5 w-3.5 rounded-sm object-cover flex-shrink-0"
                                                onError={(e) => {
                                                    e.currentTarget.style.display = 'none';
                                                }}
                                            />
                                        ) : (
                                            getPlatformIcon(link.platform)
                                        )}
                                        {hasTitle && (
                                            <span className="truncate text-[11px] font-medium">{link.title}</span>
                                        )}
                                    </div>
                                    {hasTitle && (
                                        <ExternalLink className="h-3 w-3 opacity-60 flex-shrink-0" />
                                    )}
                                </a>
                            );
                        })
                    )}
                </div>

                {/* Projects Section */}
                <div className="w-full space-y-3">
                    {projects.length > 0 && (
                        <div className="flex items-center gap-1.5 px-1">
                            <span className={`text-[9px] font-bold tracking-wider uppercase ${themeObj.bioClass}`}>
                                Featured Projects
                            </span>
                            <div className="flex-1 h-[1px] bg-current opacity-10" />
                        </div>
                    )}

                    {projects.map((project) => (
                        <div
                            key={project.id}
                            className={`p-3 rounded-xl w-full text-left transition-all ${themeObj.cardClass}`}
                        >
                            <div className="flex justify-between items-start gap-1">
                                <h4 className={`text-[11px] font-bold mb-1 truncate ${themeObj.titleClass}`}>
                                    {project.projectTitle}
                                </h4>
                                <a
                                    href={project.projectLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary hover:text-primary/80"
                                >
                                    <ExternalLink className="h-3 w-3 flex-shrink-0" />
                                </a>
                            </div>
                            <p className={`text-[9px] leading-snug mb-2 line-clamp-2 ${themeObj.textClass}`}>
                                {project.projectDescription}
                            </p>
                            {project.techStack && project.techStack.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                    {project.techStack.map((tech, i) => (
                                        <span
                                            key={i}
                                            className="text-[7px] px-1 py-0.5 rounded bg-black/10 dark:bg-white/10 text-inherit font-mono font-medium"
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
        </div>
    );
}
