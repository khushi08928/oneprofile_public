import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "@/lib/axios";
import { AlertCircle, CheckCircle2, Github, Instagram, Linkedin, Link as LinkIcon, Loader2, Plus, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface SocialLink {
    id: string;
    title: string;
    url: string;
    platform?: string;
    showIcon: boolean;
    faviconUrl?: string;
}

interface ValidationState {
    isValidating: boolean;
    isValid: boolean | null;
    message: string;
    faviconUrl?: string;
    fallbackUrls?: string[];
    currentFaviconIndex?: number;
}

interface LinksStepProps {
    links: SocialLink[];
    setLinks: (links: SocialLink[]) => void;
    onContinue: () => void;
    onBack: () => void;
}

export default function LinksStep({
    links,
    setLinks,
    onContinue,
    onBack,
}: LinksStepProps) {
    const [showAddLinkDialog, setShowAddLinkDialog] = useState(false);
    const [newLinkTitle, setNewLinkTitle] = useState("");
    const [newLinkUrl, setNewLinkUrl] = useState("");
    const [showIcon, setShowIcon] = useState(true);
    const [duplicateError, setDuplicateError] = useState(false);

    // Validation state
    const [validationState, setValidationState] = useState<ValidationState>({
        isValidating: false,
        isValid: null,
        message: "",
    });

    // Debounce timer ref
    const debounceTimerRef = useRef<number | null>(null);

    // Cleanup timer on unmount
    useEffect(() => {
        return () => {
            if (debounceTimerRef.current !== null) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, []);

    const detectPlatform = (url: string): string | undefined => {
        if (url.includes("linkedin.com")) return "linkedin";
        if (url.includes("github.com")) return "github";
        if (url.includes("instagram.com")) return "instagram";
        return undefined;
    };

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

    const addLink = () => {
        if (!newLinkUrl) return;

        // Check for duplicate URLs
        const isDuplicate = links.some(link => link.url.toLowerCase() === newLinkUrl.toLowerCase());
        if (isDuplicate) {
            setDuplicateError(true);
            return;
        }

        const platform = detectPlatform(newLinkUrl);
        setLinks([
            ...links,
            {
                id: crypto.randomUUID(),
                title: newLinkTitle || getPlatformName(platform),
                url: newLinkUrl,
                platform,
                showIcon,
                faviconUrl: validationState.faviconUrl,
            },
        ]);
        setNewLinkTitle("");
        setNewLinkUrl("");
        setShowIcon(true);
        setDuplicateError(false);
        setValidationState({
            isValidating: false,
            isValid: null,
            message: "",
        });
        setShowAddLinkDialog(false);
    };

    const removeLink = (id: string) => {
        setLinks(links.filter(link => link.id !== id));
    };

    const handleContinue = () => {
        if (links.length === 0) {
            alert("Please add at least one link to continue");
            return;
        }
        onContinue();
    };

    // Clear duplicate error when URL changes
    const handleUrlChange = (value: string) => {
        setNewLinkUrl(value);
        if (duplicateError) {
            setDuplicateError(false);
        }

        // Clear existing timer
        if (debounceTimerRef.current !== null) {
            clearTimeout(debounceTimerRef.current);
        }

        // Set new timer for validation
        debounceTimerRef.current = window.setTimeout(() => {
            validateUrlWithBackend(value);
        }, 500); // 500ms debounce
    };

    // Dialog component that renders in a portal
    const AddLinkDialog = () => {
        if (!showAddLinkDialog) return null;

        return createPortal(
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[9999] p-4 animate-in fade-in duration-200"
                onClick={(e) => {
                    if (e.target === e.currentTarget) {
                        setShowAddLinkDialog(false);
                        setNewLinkTitle("");
                        setNewLinkUrl("");
                        setShowIcon(true);
                    }
                }}
            >
                <div className="bg-card border border-border rounded-lg p-6 w-full max-w-md space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Add New Link</h3>
                        <button
                            onClick={() => {
                                setShowAddLinkDialog(false);
                                setNewLinkTitle("");
                                setNewLinkUrl("");
                                setShowIcon(true);
                            }}
                            className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <p className="text-sm text-muted-foreground">
                        Add a new link to your profile. Enter a title and URL.
                    </p>

                    {/* Icon Link Toggle */}
                    {/* <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg border border-border/50">
                        <div>
                            <Label htmlFor="icon-link" className="font-medium">
                                Icon Link
                            </Label>
                            <p className="text-xs text-muted-foreground">
                                Display a social media icon instead of a preview card
                            </p>
                        </div>
                        <Switch
                            id="icon-link"
                            checked={showIcon}
                            onCheckedChange={setShowIcon}
                        />
                    </div> */}

                    {/* Title Field */}
                    {/* <div className="space-y-2">
                        <Label htmlFor="linkTitle">Title</Label>
                        <Input
                            id="linkTitle"
                            type="text"
                            placeholder="e.g., My Portfolio"
                            value={newLinkTitle}
                            onChange={(e) => setNewLinkTitle(e.target.value)}
                            className="bg-background/50 border-border/50 focus:border-primary transition-colors"
                        />
                    </div> */}

                    {/* URL Field */}
                    <div className="space-y-2">
                        <Label htmlFor="linkUrl">Profile URL</Label>
                        <div className="relative">
                            <Input
                                id="linkUrl"
                                type="url"
                                placeholder="example.com or https://yo"
                                value={newLinkUrl}
                                onChange={(e) => handleUrlChange(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && newLinkUrl && validationState.isValid === true) {
                                        addLink();
                                    }
                                }}
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
                        {duplicateError && (
                            <p className="text-xs text-destructive flex items-center gap-1 animate-in slide-in-from-top-1 duration-200">
                                <X className="h-3 w-3" />
                                This link has already been added!
                            </p>
                        )}
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

                    {/* Preview Section */}
                    {newLinkUrl && validationState.isValid && validationState.faviconUrl && (
                        <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground">Preview</Label>
                            <div className="p-4 bg-background/50 rounded-lg border border-border/50 animate-in slide-in-from-top-2 duration-200">
                                <div className="flex items-center gap-3">
                                    {showIcon && validationState.faviconUrl && (
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
                                            {newLinkTitle || getPlatformName(detectPlatform(newLinkUrl))}
                                        </p>
                                        <p className="text-xs text-muted-foreground truncate">
                                            {newLinkUrl}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                        <Button
                            onClick={() => {
                                setShowAddLinkDialog(false);
                                setNewLinkTitle("");
                                setNewLinkUrl("");
                                setShowIcon(true);
                            }}
                            variant="outline"
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={addLink}
                            disabled={!newLinkUrl || validationState.isValidating || validationState.isValid !== true}
                            className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                        >
                            Add Link
                        </Button>
                    </div>
                </div>
            </div>,
            document.body
        );
    };

    return (
        <div className="space-y-6">
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold">Add your links</h2>
                <p className="text-muted-foreground">
                    Add at least one link to share on your profile
                </p>
                <p className="text-xs text-primary">
                    * At least 1 link is required
                </p>
            </div>

            <div className="space-y-4 max-w-md mx-auto">
                {links.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed border-border rounded-lg">
                        <LinkIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground mb-4">No links yet</p>
                        <p className="text-sm text-primary mb-4">Add at least one link to continue</p>
                        <Button
                            onClick={() => setShowAddLinkDialog(true)}
                            variant="outline"
                            className="gap-2"
                        >
                            <Plus className="h-4 w-4" />
                            Add Link
                        </Button>
                    </div>
                ) : (
                    <>
                        <div className="space-y-3">
                            {links.map((link) => (
                                <div
                                    key={link.id}
                                    className="flex items-center gap-3 p-4 bg-background/50 border border-border/50 rounded-lg hover:border-border transition-colors group"
                                >
                                    {link.showIcon && (
                                        <div className="flex-shrink-0">
                                            {getPlatformIcon(link.platform)}
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">{link.title}</p>
                                        <p className="text-xs text-muted-foreground truncate">
                                            {link.url}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => removeLink(link.id)}
                                        className="flex-shrink-0 text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <Button
                            onClick={() => setShowAddLinkDialog(true)}
                            variant="outline"
                            className="w-full gap-2"
                        >
                            <Plus className="h-4 w-4" />
                            Add Another Link
                        </Button>
                    </>
                )}
            </div>

            <div className="flex justify-center gap-4 pt-4">
                <Button onClick={onBack} variant="outline" className="px-8">
                    Back
                </Button>
                <Button
                    onClick={handleContinue}
                    disabled={links.length === 0}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Continue
                </Button>
            </div>

            {/* Render dialog in portal */}
            <AddLinkDialog />
        </div>
    );
}
