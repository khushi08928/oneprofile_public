import { Button } from "@/components/ui/button";
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
        baseUrl = baseUrl.replace(/\/$/, '');
        if (!baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
            baseUrl = `https://${baseUrl}`;
        }
        return `${baseUrl}/${username}`;
    };

    const getDisplayUrl = () => {
        let baseUrl = import.meta.env.VITE_APP_URL || "localhost:5173";
        baseUrl = baseUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');
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
        if (navigator.share) {
            try {
                await navigator.share({
                    title: "My OneProfile",
                    text: "Check out my profile!",
                    url: getProfileUrl(),
                });
            } catch (error) {
                console.log("Share cancelled:", error);
            }
        } else {
            handleCopy();
        }
    };

    const handleOpen = () => {
        window.open(getProfileUrl(), "_blank", "noopener,noreferrer");
    };

    if (loading) {
        return (
            <div className="bg-white border-2 border-[#2C3947] rounded-2xl p-5 sm:p-6 shadow-[4px_4px_0px_0px_rgba(44,57,71,1)]">
                <div className="h-5 w-32 bg-[#2C3947]/10 rounded animate-pulse" />
            </div>
        );
    }

    if (!username) {
        return (
            <div className="bg-white border-2 border-[#2C3947] rounded-2xl p-5 sm:p-6 shadow-[4px_4px_0px_0px_rgba(44,57,71,1)]">
                <p className="text-sm text-[#2C3947]/70 font-semibold">
                    Complete your username setup to generate your shareable live link.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white border-2 border-[#2C3947] rounded-2xl p-5 sm:p-6 shadow-[4px_4px_0px_0px_rgba(44,57,71,1)]">
            {/* Header row */}
            <div className="flex items-center gap-2.5 mb-4">
                <div className="h-8 w-8 rounded-lg bg-[#2C3947]/5 border border-[#2C3947]/10 flex items-center justify-center">
                    <LinkIcon className="h-4 w-4 text-[#2C3947]" />
                </div>
                <div>
                    <span className="text-sm font-black text-[#2C3947]">Your Profile URL</span>
                    <p className="text-[10px] text-[#2C3947]/60 font-bold uppercase tracking-wider">Share your profile with the world</p>
                </div>
            </div>

            {/* URL — click to copy */}
            <button
                onClick={handleCopy}
                className="w-full flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl bg-slate-50 border-2 border-[#2C3947] hover:bg-slate-100/50 transition-all group mb-4 text-left p-0"
            >
                <span className="text-xs sm:text-sm font-bold text-[#2C3947] truncate group-hover:text-black transition-colors">
                    {getDisplayUrl()}
                </span>
                <div className="flex-shrink-0">
                    {copied ? (
                        <Check className="h-4 w-4 text-emerald-600 stroke-[3px]" />
                    ) : (
                        <Copy className="h-4 w-4 text-[#2C3947]/60 group-hover:text-[#2C3947]" />
                    )}
                </div>
            </button>

            {/* Action buttons */}
            <div className="flex items-center gap-2.5">
                <Button
                    size="sm"
                    onClick={handleShare}
                    className="gap-1.5 h-9 bg-[#2C3947] text-[#FEF9C3] hover:bg-[#212B36] font-bold border-2 border-[#2C3947] rounded-xl shadow-[2px_2px_0px_0px_rgba(44,57,71,1)] hover:shadow-[1px_1px_0px_0px_rgba(44,57,71,1)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all text-xs"
                >
                    <Share2 className="h-3.5 w-3.5" />
                    Share
                </Button>
                <Button
                    size="sm"
                    variant="outline"
                    onClick={handleOpen}
                    className="gap-1.5 h-9 bg-white text-[#2C3947] hover:bg-slate-50 font-bold border-2 border-[#2C3947] rounded-xl shadow-[2px_2px_0px_0px_rgba(44,57,71,1)] hover:shadow-[1px_1px_0px_0px_rgba(44,57,71,1)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all text-xs"
                >
                    <ExternalLink className="h-3.5 w-3.5" />
                    Live Preview
                </Button>
            </div>
        </div>
    );
}
