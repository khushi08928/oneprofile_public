import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "@/lib/axios";
import { Check, Copy, Link as LinkIcon } from "lucide-react";
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
        const baseUrl = import.meta.env.VITE_APP_URL || "http://localhost:5173";
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
                <div className="space-y-3">
                    {/* URL Display */}
                    <div className="flex items-center gap-2 p-3 bg-accent/50 rounded-lg border border-border/50">
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-mono truncate">
                                {getProfileUrl()}
                            </p>
                        </div>
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={handleCopy}
                            className="flex-shrink-0"
                        >
                            {copied ? (
                                <>
                                    <Check className="h-4 w-4 mr-1 text-green-500" />
                                    Copied
                                </>
                            ) : (
                                <>
                                    <Copy className="h-4 w-4 mr-1" />
                                    Copy
                                </>
                            )}
                        </Button>
                    </div>

                    {/* Info Text */}
                    <p className="text-xs text-muted-foreground">
                        Share this link to let others view your profile
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
