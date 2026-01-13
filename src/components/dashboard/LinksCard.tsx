import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "@/lib/axios";
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
                return <Github className="h-5 w-5 text-foreground" />;
            case "instagram":
                return <Instagram className="h-5 w-5 text-[#E4405F]" />;
            default:
                return <LinkIcon className="h-5 w-5" />;
        }
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

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <LinkIcon className="h-5 w-5" />
                    <span>Links</span>
                    <span className="ml-auto text-sm font-normal text-muted-foreground">
                        {links.length} {links.length === 1 ? 'link' : 'links'}
                    </span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <p className="text-sm text-muted-foreground">Loading links...</p>
                ) : links.length === 0 ? (
                    <div className="text-center py-8">
                        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-3 rounded-full bg-accent/50">
                            <LinkIcon className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <p className="text-sm font-medium text-foreground mb-1">No links added yet</p>
                        <p className="text-xs text-muted-foreground">Add your first link from the Profile page</p>
                    </div>
                ) : (
                    <div className="space-y-2.5">
                        {links.map((link) => (
                            <a
                                key={link.id}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 p-3.5 rounded-lg  bg-card hover:border-primary/50 hover:bg-accent/30 hover:shadow-sm transition-all duration-200 group"
                            >
                                <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg bg-accent/50 group-hover:bg-accent transition-colors">
                                    {getPlatformIcon(link.platform)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold truncate group-hover:text-primary transition-colors">
                                        {link.title && link.title !== "Website"
                                            ? link.title
                                            : getPlatformName(link.platform)}
                                    </p>
                                    {/* <p className="text-xs text-muted-foreground truncate mt-0.5">
                                        {link.url}
                                    </p> */}
                                </div>
                                <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <LinkIcon className="h-4 w-4 text-muted-foreground" />
                                </div>
                            </a>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
