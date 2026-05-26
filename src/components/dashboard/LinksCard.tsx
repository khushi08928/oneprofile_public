import axios from "@/lib/axios";
import { ExternalLink, Github, Instagram, Linkedin, Link as LinkIcon } from "lucide-react";
import { useEffect, useState } from "react";

interface SocialLink {
    id: string;
    title: string;
    url: string;
    platform?: string;
    showIcon: boolean;
    faviconUrl?: string;
}

export function LinksCard() {
    const [links, setLinks] = useState<SocialLink[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLinks = async () => {
            try {
                const response = await axios.get("/api/profile/me/profile", {
                    withCredentials: true,
                });

                if (response.status === 200 && response.data) {
                    const profileLinks = response.data.profile?.links || [];
                    setLinks(profileLinks);
                }
            } catch (error) {
                console.error("Error fetching links:", error);
                setLinks([]);
            } finally {
                setLoading(false);
            }
        };

        fetchLinks();
    }, []);

    const getPlatformIcon = (platform?: string) => {
        const cls = "h-4 w-4";
        switch (platform) {
            case "linkedin":
                return <Linkedin className={`${cls} text-[#0A66C2]`} />;
            case "github":
                return <Github className={`${cls} text-foreground`} />;
            case "instagram":
                return <Instagram className={`${cls} text-[#E4405F]`} />;
            default:
                return <LinkIcon className={`${cls} text-muted-foreground`} />;
        }
    };

    const getPlatformName = (platform?: string): string => {
        switch (platform) {
            case "linkedin": return "LinkedIn";
            case "github": return "GitHub";
            case "instagram": return "Instagram";
            default: return "Website";
        }
    };

    return (
        <div className="rounded-xl border border-border/40 bg-card p-5 sm:p-6 h-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                        <LinkIcon className="h-4 w-4 text-cyan-400" />
                    </div>
                    <h3 className="font-semibold text-sm">Your Links</h3>
                </div>
                <span className="text-xs text-muted-foreground px-2 py-0.5 rounded-full bg-accent/30">
                    {links.length}
                </span>
            </div>

            {/* Content */}
            {loading ? (
                <div className="space-y-2.5">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-12 bg-accent/20 rounded-lg animate-pulse" />
                    ))}
                </div>
            ) : links.length === 0 ? (
                <div className="text-center py-8">
                    <div className="h-12 w-12 rounded-xl bg-accent/30 flex items-center justify-center mx-auto mb-3">
                        <LinkIcon className="h-6 w-6 text-muted-foreground/50" />
                    </div>
                    <p className="text-sm font-medium text-foreground/60 mb-1">No links yet</p>
                    <p className="text-xs text-muted-foreground">Add links from the Profile page</p>
                </div>
            ) : (
                <div className="space-y-1.5">
                    {links.map((link) => (
                        <a
                            key={link.id}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-2.5 sm:p-3 rounded-lg hover:bg-accent/25 transition-all duration-200 group"
                        >
                            <div className="flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-lg bg-accent/30 group-hover:bg-accent/50 transition-colors">
                                {link.faviconUrl ? (
                                    <img
                                        src={link.faviconUrl}
                                        alt=""
                                        className="h-4 w-4 rounded object-cover"
                                        onError={(e) => {
                                            e.currentTarget.style.display = 'none';
                                        }}
                                    />
                                ) : (
                                    getPlatformIcon(link.platform)
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                                    {link.title && link.title !== "Website"
                                        ? link.title
                                        : getPlatformName(link.platform)}
                                </p>
                            </div>
                            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground/0 group-hover:text-muted-foreground/60 transition-all" />
                        </a>
                    ))}
                </div>
            )}
        </div>
    );
}
