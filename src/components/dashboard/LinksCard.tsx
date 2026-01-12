import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";
import { Github, Instagram, Linkedin, Link as LinkIcon } from "lucide-react";
import { useEffect, useState } from "react";

interface SocialLink {
    id: string;
    title: string;
    url: string;
    platform?: string;
    showIcon: boolean;
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
                    // Backend returns { profile: { links: [...] } }
                    const profileLinks = response.data.profile?.links || [];
                    setLinks(profileLinks);
                }
            } catch (error) {
                console.error("Error fetching links:", error);
                // Set empty array on error
                setLinks([]);
            } finally {
                setLoading(false);
            }
        };

        fetchLinks();
    }, []);

    const getPlatformIcon = (platform?: string) => {
        switch (platform) {
            case "linkedin":
                return <Linkedin className="h-5 w-5 text-[#0A66C2]" />;
            case "github":
                return <Github className="h-5 w-5" />;
            case "instagram":
                return <Instagram className="h-5 w-5 text-[#E4405F]" />;
            default:
                return <LinkIcon className="h-5 w-5" />;
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <span>Links</span>
                    <span className="text-3xl font-bold">{links.length}</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <p className="text-sm text-muted-foreground">Loading links...</p>
                ) : links.length === 0 ? (
                    <div className="text-center py-8">
                        <LinkIcon className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">No links added yet</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {links.map((link) => (
                            <a
                                key={link.id}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 p-3 rounded-lg border border-border/50 hover:border-border hover:bg-accent/50 transition-all group"
                            >
                                <div className="flex-shrink-0">
                                    {getPlatformIcon(link.platform)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                                        {link.title}
                                    </p>
                                    <p className="text-xs text-muted-foreground truncate">
                                        {link.url}
                                    </p>
                                </div>
                                <LinkIcon className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                            </a>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
