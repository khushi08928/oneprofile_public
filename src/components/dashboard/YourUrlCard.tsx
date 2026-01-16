import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "@/lib/axios";
import { Check, Copy, ExternalLink, Link as LinkIcon, Share2 } from "lucide-react";
import { useEffect, useState } from "react";

export function YourUrlCard() {
    const [username, setUsername] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get("/api/profile/me/profile", {
                    withCredentials: true,
                });

                if (response.status === 200 && response.data) {
                    setUsername(response.data.profile?.username || "");
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const getProfileUrl = () => {
        let baseUrl = import.meta.env.VITE_APP_URL || "http://localhost:5173";
        // Remove trailing slash if present
        baseUrl = baseUrl.replace(/\/$/, '');
        // If baseUrl already contains the protocol, use it as is, otherwise add it
        if (!baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
            baseUrl = `https://${baseUrl}`;
        }
        return `${baseUrl}/${username}`;
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(getProfileUrl());
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error("Failed to copy:", error);
        }
    };

    const handleShare = async () => {
        const url = getProfileUrl();

        // Check if Web Share API is available
        if (navigator.share) {
            try {
                await navigator.share({
                    title: "My OneURL Profile",
                    text: "Check out my profile!",
                    url: url,
                });
            } catch (error) {
                // User cancelled or share failed
                console.log("Share cancelled or failed:", error);
            }
        } else {
            // Fallback to copy
            handleCopy();
        }
    };

    const handleOpen = () => {
        window.open(getProfileUrl(), "_blank", "noopener,noreferrer");
    };

    if (loading) {
        return (
            <Card>
                <CardContent className="p-6">
                    <p className="text-sm text-muted-foreground">Loading...</p>
                </CardContent>
            </Card>
        );
    }

    if (!username) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <LinkIcon className="h-5 w-5" />
                        Your URL
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        No username set. Please complete your profile.
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <LinkIcon className="h-5 w-5" />
                    Your URL
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3 sm:space-y-4">
                    {/* URL Display with Copy Button */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 p-2.5 sm:p-3 bg-accent/30 rounded-lg border border-border/50">
                            <div className="flex-1 min-w-0 overflow-hidden">
                                <p className="text-xs sm:text-sm font-mono font-medium break-all">
                                    {getProfileUrl()}
                                </p>
                            </div>
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={handleCopy}
                                className="flex-shrink-0 h-7 sm:h-8 hover:bg-accent"
                                style={{ backgroundColor: 'transparent' }}
                            >
                                {copied ? (
                                    <>
                                        <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-500" />
                                    </>
                                ) : (
                                    <>
                                        <Copy className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                    </>
                                )}
                            </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Share this link to let others view your profile
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                        <Button
                            variant="default"
                            onClick={handleShare}
                            className="w-full gap-1.5 sm:gap-2 text-sm"
                        >
                            <Share2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            Share
                        </Button>
                        <Button
                            variant="outline"
                            onClick={handleOpen}
                            className="w-full gap-1.5 sm:gap-2 text-sm"
                        >
                            <ExternalLink className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            Open
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
