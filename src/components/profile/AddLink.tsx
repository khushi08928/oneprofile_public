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
}

function AddLinkDialog({
    open,
    onClose,
    formData,
    saving,
    handleSubmit,
    validationState,
    onUrlChange,
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
            <div className="bg-card border border-border rounded-lg p-4 sm:p-6 w-full max-w-md space-y-3 sm:space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between">
                    <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2">
                        <LinkIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                        Add New Link
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <X className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* URL Field */}
                    <div className="space-y-2">
                        <Label htmlFor="linkUrl">
                            Enter URL <span className="text-destructive">*</span>
                        </Label>
                        <div className="relative">
                            <Input
                                id="linkUrl"
                                type="url"
                                value={formData.url}
                                onChange={(e) => onUrlChange(e.target.value)}
                                placeholder="https://linkedin.com/in/username"
                                required
                                className={
                                    validationState.isValid === false
                                        ? "border-destructive focus-visible:ring-destructive pr-10"
                                        : validationState.isValid === true
                                            ? "border-green-500 focus-visible:ring-green-500 pr-10"
                                            : "pr-10"
                                }
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                {validationState.isValidating && (
                                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                )}
                                {!validationState.isValidating && validationState.isValid === true && (
                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                )}
                                {!validationState.isValidating && validationState.isValid === false && (
                                    <AlertCircle className="h-4 w-4 text-destructive" />
                                )}
                            </div>
                        </div>
                        {validationState.message && (
                            <p
                                className={`text-xs flex items-center gap-1 ${validationState.isValid === false
                                    ? "text-destructive"
                                    : validationState.isValid === true
                                        ? "text-green-600"
                                        : "text-muted-foreground"
                                    }`}
                            >
                                {validationState.message}
                            </p>
                        )}
                    </div>

                    {/* Title Field (Optional) */}
                    {/* <div className="space-y-2">
                        <Label htmlFor="linkTitle">Title (Optional)</Label>
                        <Input
                            id="linkTitle"
                            type="text"
                            value={formData.title}
                            onChange={(e) =>
                                setFormData({ ...formData, title: e.target.value })
                            }
                            placeholder={getPlatformName(detectedPlatform)}
                        />
                        <p className="text-xs text-muted-foreground">
                            Leave blank to use platform name
                        </p>
                    </div> */}

                    {/* Preview Section */}
                    {formData.url && validationState.isValid && validationState.faviconUrl && (
                        <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground">Preview</Label>
                            <div className="p-4 bg-background/50 rounded-lg border border-border/50">
                                <div className="flex items-center gap-3">
                                    {formData.showIcon && validationState.faviconUrl && (
                                        <div className="flex-shrink-0">
                                            <img
                                                src={validationState.faviconUrl}
                                                alt="Favicon"
                                                className="h-5 w-5 rounded object-cover"
                                                onError={(e) => {
                                                    // Try fallback URLs if available
                                                    const currentIndex = validationState.currentFaviconIndex || 0;
                                                    const fallbacks = validationState.fallbackUrls || [];

                                                    if (currentIndex < fallbacks.length) {
                                                        // Try next fallback
                                                        e.currentTarget.src = fallbacks[currentIndex];
                                                        // Note: We can't update state here, but the src change will trigger another attempt
                                                    } else {
                                                        // All fallbacks failed, hide the image
                                                        e.currentTarget.style.display = 'none';
                                                    }
                                                }}
                                            />
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">
                                            {formData.title || getPlatformName(detectedPlatform)}
                                        </p>
                                        <p className="text-xs text-muted-foreground truncate">
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
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={saving || validationState.isValidating || validationState.isValid !== true}
                            className="flex-1"
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

export function AddLink() {
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
        const platformName = getPlatformName(platform);

        setFormData((prev) => ({
            ...prev,
            url,
            platform,
            // Always update title to platform name (user can edit it manually if needed)
            title: platformName,
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
                title: formData.title || undefined,
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

            // Refresh page to show new link
            setTimeout(() => window.location.reload(), 500);
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
                className="gap-2"
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
            />
        </>
    );
}
