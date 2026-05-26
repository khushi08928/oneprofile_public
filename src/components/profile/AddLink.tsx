import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "@/lib/axios";
import { AlertCircle, CheckCircle2, Link as LinkIcon, Loader2, Plus, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";

interface LinkFormData {
    title: string;
    url: string;
    platform?: string;
    showIcon: boolean;
}

interface ValidationState {
    isValidating: boolean;
    isValid: boolean | null;
    message: string;
    faviconUrl?: string;
    fallbackUrls?: string[];
    currentFaviconIndex?: number;
}

interface AddLinkDialogProps {
    open: boolean;
    onClose: () => void;
    formData: LinkFormData;
    saving: boolean;
    handleSubmit: (e: React.FormEvent) => void;
    validationState: ValidationState;
    onUrlChange: (url: string) => void;
    onTitleChange: (title: string) => void;
}

function AddLinkDialog({
    open,
    onClose,
    formData,
    saving,
    handleSubmit,
    validationState,
    onUrlChange,
    onTitleChange,
}: AddLinkDialogProps) {
    if (!open) return null;

    const detectPlatform = (url: string): string | undefined => {
        if (url.includes("linkedin.com")) return "linkedin";
        if (url.includes("github.com")) return "github";
        if (url.includes("instagram.com")) return "instagram";
        if (url.includes("twitter.com") || url.includes("x.com")) return "twitter";
        if (url.includes("facebook.com")) return "facebook";
        if (url.includes("youtube.com") || url.includes("youtu.be")) return "youtube";
        if (url.includes("tiktok.com")) return "tiktok";
        if (url.includes("discord.com") || url.includes("discord.gg")) return "discord";
        if (url.includes("behance.net")) return "behance";
        if (url.includes("dribbble.com")) return "dribbble";
        if (url.includes("medium.com")) return "medium";
        if (url.includes("dev.to")) return "devto";
        if (url.includes("stackoverflow.com")) return "stackoverflow";
        if (url.includes("reddit.com")) return "reddit";
        if (url.includes("twitch.tv")) return "twitch";
        return undefined;
    };

    const getPlatformName = (platform?: string): string => {
        switch (platform) {
            case "linkedin":
                return "LinkedIn";
            case "github":
                return "GitHub";
            case "instagram":
                return "Instagram";
            case "twitter":
                return "X (Twitter)";
            case "facebook":
                return "Facebook";
            case "youtube":
                return "YouTube";
            case "tiktok":
                return "TikTok";
            case "discord":
                return "Discord";
            case "behance":
                return "Behance";
            case "dribbble":
                return "Dribbble";
            case "medium":
                return "Medium";
            case "devto":
                return "Dev.to";
            case "stackoverflow":
                return "Stack Overflow";
            case "reddit":
                return "Reddit";
            case "twitch":
                return "Twitch";
            default:
                return "Website";
        }
    };

    const detectedPlatform = detectPlatform(formData.url);

    return createPortal(
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[9999] p-4 animate-in fade-in duration-200"
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    onClose();
                }
            }}
        >
            <div className="bg-white border-2 border-[#2C3947] rounded-2xl p-6 w-full max-w-md space-y-4 shadow-[4px_4px_0px_0px_rgba(44,57,71,1)] animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-black text-[#2C3947] flex items-center gap-2">
                        <LinkIcon className="h-5 w-5 text-[#2C3947]" />
                        Add New Link
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-[#2C3947]/60 hover:text-[#2C3947] transition-colors bg-transparent p-0"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* URL Field */}
                    <div className="space-y-2">
                        <Label htmlFor="linkUrl" className="font-bold text-xs text-[#2C3947]/80 uppercase tracking-wider">
                            Enter URL <span className="text-red-500">*</span>
                        </Label>
                        <div className="relative">
                            <Input
                                id="linkUrl"
                                type="url"
                                value={formData.url}
                                onChange={(e) => onUrlChange(e.target.value)}
                                placeholder="https://linkedin.com/in/username"
                                required
                                className={`border-2 rounded-xl h-10 pr-10 transition-all ${
                                    validationState.isValid === false
                                        ? "border-red-500 focus-visible:border-red-500 focus-visible:ring-0"
                                        : validationState.isValid === true
                                            ? "border-green-500 focus-visible:border-green-500 focus-visible:ring-0"
                                            : "border-[#2C3947]/20 focus-visible:border-[#2C3947] focus-visible:ring-0"
                                }`}
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                {validationState.isValidating && (
                                    <Loader2 className="h-4 w-4 animate-spin text-[#2C3947]/50" />
                                )}
                                {!validationState.isValidating && validationState.isValid === true && (
                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                )}
                                {!validationState.isValidating && validationState.isValid === false && (
                                    <AlertCircle className="h-4 w-4 text-red-500" />
                                )}
                            </div>
                        </div>
                        {validationState.message && (
                            <p
                                className={`text-xs font-semibold flex items-center gap-1 ${validationState.isValid === false
                                    ? "text-red-500"
                                    : validationState.isValid === true
                                        ? "text-green-600"
                                        : "text-[#2C3947]/60"
                                    }`}
                            >
                                {validationState.message}
                            </p>
                        )}
                    </div>

                    {/* Title Field (Optional) */}
                    <div className="space-y-2 animate-in slide-in-from-top-1 duration-200">
                        <Label htmlFor="linkTitle" className="font-bold text-xs text-[#2C3947]/80 uppercase tracking-wider">
                            Name / Title <span className="text-[#2C3947]/40 font-normal">(Optional)</span>
                        </Label>
                        <Input
                            id="linkTitle"
                            type="text"
                            value={formData.title}
                            onChange={(e) => onTitleChange(e.target.value)}
                            placeholder="e.g. Portfolio, Blog"
                            className="border-2 rounded-xl h-10 transition-all border-[#2C3947]/20 focus-visible:border-[#2C3947] focus-visible:ring-0"
                        />
                        <p className="text-[10px] text-[#2C3947]/50 font-semibold">
                            Leave empty to display only the icon in the preview.
                        </p>
                    </div>

                    {/* Preview Section */}
                    {formData.url && validationState.isValid && validationState.faviconUrl && (
                        <div className="space-y-2">
                            <Label className="font-bold text-xs text-[#2C3947]/60 uppercase tracking-wider">Preview</Label>
                            <div className="p-4 bg-slate-50 rounded-xl border-2 border-[#2C3947]/10">
                                <div className="flex items-center gap-3">
                                    {formData.showIcon && validationState.faviconUrl && (
                                        <div className="flex-shrink-0">
                                            <img
                                                src={validationState.faviconUrl}
                                                alt="Favicon"
                                                className="h-5 w-5 rounded object-cover"
                                                onError={(e) => {
                                                    const currentIndex = validationState.currentFaviconIndex || 0;
                                                    const fallbacks = validationState.fallbackUrls || [];
                                                    if (currentIndex < fallbacks.length) {
                                                        e.currentTarget.src = fallbacks[currentIndex];
                                                    } else {
                                                        e.currentTarget.style.display = 'none';
                                                    }
                                                }}
                                            />
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-[#2C3947] truncate">
                                            {formData.title || formData.url}
                                        </p>
                                        <p className="text-xs text-[#2C3947]/60 truncate font-semibold">
                                            {formData.url}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="flex-1 font-bold text-[#2C3947] border-2 border-[#2C3947]/20 hover:border-[#2C3947] hover:bg-slate-50 rounded-xl h-10 transition-all"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={saving || validationState.isValidating || validationState.isValid !== true}
                            className="flex-1 bg-[#2C3947] text-[#FEF9C3] hover:bg-[#212B36] font-bold border-2 border-[#2C3947] h-10 rounded-xl shadow-[2px_2px_0px_0px_rgba(44,57,71,1)] hover:shadow-[1px_1px_0px_0px_rgba(44,57,71,1)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                        >
                            {saving ? "Adding..." : "Add Link"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
}

export function AddLink({ onSuccess }: { onSuccess?: () => void }) {
    const [showDialog, setShowDialog] = useState(false);
    const [formData, setFormData] = useState<LinkFormData>({
        title: "",
        url: "",
        showIcon: true,
    });
    const [saving, setSaving] = useState(false);
    const [validationState, setValidationState] = useState<ValidationState>({
        isValidating: false,
        isValid: null,
        message: "",
    });

    // Debounce timer ref
    const debounceTimerRef = useRef<number | null>(null);

    // Platform detection helper
    const detectPlatform = (url: string): string | undefined => {
        if (url.includes("linkedin.com")) return "linkedin";
        if (url.includes("github.com")) return "github";
        if (url.includes("instagram.com")) return "instagram";
        if (url.includes("twitter.com") || url.includes("x.com")) return "twitter";
        if (url.includes("facebook.com")) return "facebook";
        if (url.includes("youtube.com") || url.includes("youtu.be")) return "youtube";
        if (url.includes("tiktok.com")) return "tiktok";
        if (url.includes("discord.com") || url.includes("discord.gg")) return "discord";
        if (url.includes("behance.net")) return "behance";
        if (url.includes("dribbble.com")) return "dribbble";
        if (url.includes("medium.com")) return "medium";
        if (url.includes("dev.to")) return "devto";
        if (url.includes("stackoverflow.com")) return "stackoverflow";
        if (url.includes("reddit.com")) return "reddit";
        if (url.includes("twitch.tv")) return "twitch";
        return undefined;
    };

    const getPlatformName = (platform?: string): string => {
        switch (platform) {
            case "linkedin":
                return "LinkedIn";
            case "github":
                return "GitHub";
            case "instagram":
                return "Instagram";
            case "twitter":
                return "X (Twitter)";
            case "facebook":
                return "Facebook";
            case "youtube":
                return "YouTube";
            case "tiktok":
                return "TikTok";
            case "discord":
                return "Discord";
            case "behance":
                return "Behance";
            case "dribbble":
                return "Dribbble";
            case "medium":
                return "Medium";
            case "devto":
                return "Dev.to";
            case "stackoverflow":
                return "Stack Overflow";
            case "reddit":
                return "Reddit";
            case "twitch":
                return "Twitch";
            default:
                return "Website";
        }
    };

    // Validate URL with backend and fetch favicon
    const validateUrlWithBackend = async (url: string) => {
        if (!url || url.length < 10) {
            setValidationState({
                isValidating: false,
                isValid: null,
                message: "",
            });
            return;
        }

        setValidationState({
            isValidating: true,
            isValid: null,
            message: "Validating URL...",
        });

        try {
            // First validate the URL
            const validationResponse = await axios.post(
                "/api/validate-url",
                { url },
                { withCredentials: true }
            );

            const result = validationResponse.data;

            if (result.valid && result.reachable) {
                // URL is valid, now fetch favicon
                try {
                    const faviconResponse = await axios.post(
                        "/api/validate-url/favicon",
                        { url },
                        { withCredentials: true }
                    );

                    setValidationState({
                        isValidating: false,
                        isValid: true,
                        message: "✓ URL is valid and reachable",
                        faviconUrl: faviconResponse.data.faviconUrl,
                        fallbackUrls: faviconResponse.data.fallbackUrls || [],
                        currentFaviconIndex: 0,
                    });
                } catch (faviconError) {
                    // If favicon fetch fails, still mark URL as valid
                    console.error("Error fetching favicon:", faviconError);
                    setValidationState({
                        isValidating: false,
                        isValid: true,
                        message: "✓ URL is valid and reachable",
                    });
                }
            } else if (result.valid && !result.reachable) {
                setValidationState({
                    isValidating: false,
                    isValid: false,
                    message: result.message || "URL is not reachable",
                });
            } else {
                setValidationState({
                    isValidating: false,
                    isValid: false,
                    message: result.message || "Invalid URL format",
                });
            }
        } catch (error) {
            console.error("Error validating URL:", error);
            setValidationState({
                isValidating: false,
                isValid: false,
                message: "Failed to validate URL. Please try again.",
            });
        }
    };

    // Handle URL change with debouncing
    const handleUrlChange = useCallback((url: string) => {
        // Update form data immediately
        const platform = detectPlatform(url);

        setFormData((prev) => ({
            ...prev,
            url,
            platform,
        }));

        // Clear existing timer
        if (debounceTimerRef.current !== null) {
            clearTimeout(debounceTimerRef.current);
        }

        // Set new timer for validation
        debounceTimerRef.current = window.setTimeout(() => {
            validateUrlWithBackend(url);
        }, 500); // 500ms debounce
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (debounceTimerRef.current !== null) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            // Prepare data for backend
            const linkData = {
                title: formData.title ? formData.title.trim() : "",
                url: formData.url,
                platform: formData.platform,
                showIcon: formData.showIcon,
                faviconUrl: validationState.faviconUrl || undefined,
            };

            await axios.post("/api/profile/links", linkData, {
                withCredentials: true,
            });

            // Reset form
            setFormData({
                title: "",
                url: "",
                showIcon: true,
            });
            setValidationState({
                isValidating: false,
                isValid: null,
                message: "",
            });
            setShowDialog(false);
            toast.success("Link added successfully!");

            // Refresh state via callback if provided, else reload
            if (onSuccess) {
                onSuccess();
            } else {
                setTimeout(() => window.location.reload(), 500);
            }
        } catch (error) {
            console.error("Error saving link:", error);
            toast.error("Failed to save link. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <>
            <Button
                onClick={() => setShowDialog(true)}
                className="gap-2 font-bold bg-white text-[#2C3947] border-2 border-[#2C3947] hover:bg-slate-50 h-10 px-4 rounded-xl shadow-[3px_3px_0px_0px_rgba(44,57,71,1)] hover:shadow-[1px_1px_0px_0px_rgba(44,57,71,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
            >
                <Plus className="h-4 w-4" />
                Add Link
            </Button>
            <AddLinkDialog
                open={showDialog}
                onClose={() => setShowDialog(false)}
                formData={formData}
                saving={saving}
                handleSubmit={handleSubmit}
                validationState={validationState}
                onUrlChange={handleUrlChange}
                onTitleChange={(title) => setFormData((prev) => ({ ...prev, title }))}
            />
        </>
    );
}
