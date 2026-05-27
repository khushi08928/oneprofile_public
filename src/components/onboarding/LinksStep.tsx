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
                title: newLinkTitle ? newLinkTitle.trim() : "",
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

    return (
        <div className="space-y-6">
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-black text-[#2C3947] tracking-tight">Add your links</h2>
                <p className="text-[#2C3947]/70 font-medium">
                    Add at least one link to share on your profile
                </p>
                <p className="text-xs text-rose-500 font-bold">
                    * At least 1 link is required
                </p>
            </div>

            <div className="space-y-4 max-w-md mx-auto">
                {links.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed border-[#2C3947]/20 bg-slate-50/50 rounded-2xl">
                        <LinkIcon className="h-12 w-12 mx-auto text-[#2C3947]/40 mb-4" />
                        <p className="text-[#2C3947]/60 font-semibold mb-2">No links yet</p>
                        <p className="text-sm text-rose-500/85 font-bold mb-4">Add at least one link to continue</p>
                        <Button
                            onClick={() => setShowAddLinkDialog(true)}
                            variant="outline"
                            className="gap-2 border-2 border-[#2C3947] font-bold text-[#2C3947] rounded-xl hover:bg-slate-100 transition-all h-11"
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
                                    className="flex items-center gap-3 p-4 bg-white border-2 border-[#2C3947] shadow-[2px_2px_0px_0px_rgba(44,57,71,1)] rounded-xl hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(44,57,71,1)] transition-all duration-200 group"
                                >
                                    <div className="flex-shrink-0">
                                        {link.faviconUrl ? (
                                            <img
                                                src={link.faviconUrl}
                                                alt=""
                                                className="h-5 w-5 rounded object-cover"
                                                onError={(e) => {
                                                    e.currentTarget.style.display = 'none';
                                                    const parent = e.currentTarget.parentElement;
                                                    if (parent) {
                                                        parent.classList.add('favicon-fallback');
                                                    }
                                                }}
                                            />
                                        ) : (
                                            getPlatformIcon(link.platform)
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-[#2C3947] truncate">
                                            {link.title || link.url}
                                        </p>
                                        {link.title && (
                                            <p className="text-xs text-[#2C3947]/65 truncate">
                                                {link.url}
                                            </p>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => removeLink(link.id)}
                                        className="flex-shrink-0 text-[#2C3947]/50 hover:text-rose-500 transition-colors opacity-100 sm:opacity-0 group-hover:opacity-100 bg-transparent p-0"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <Button
                            onClick={() => setShowAddLinkDialog(true)}
                            variant="outline"
                            className="w-full gap-2 border-2 border-[#2C3947] font-bold text-[#2C3947] rounded-xl hover:bg-slate-50 transition-all h-11"
                        >
                            <Plus className="h-4 w-4" />
                            Add Another Link
                        </Button>
                    </>
                )}
            </div>

            <div className="flex justify-center gap-4 pt-4">
                <Button 
                    onClick={onBack} 
                    variant="outline" 
                    className="px-8 border-2 border-[#2C3947] font-bold text-[#2C3947] rounded-xl hover:bg-slate-50 transition-all h-11"
                >
                    Back
                </Button>
                <Button
                    onClick={handleContinue}
                    disabled={links.length === 0}
                    className="bg-[#2C3947] text-[#FEF9C3] hover:bg-[#212B36] font-bold border-2 border-[#2C3947] h-11 px-8 rounded-xl shadow-[3px_3px_0px_0px_rgba(44,57,71,1)] hover:shadow-[1px_1px_0px_0px_rgba(44,57,71,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                >
                    Continue
                </Button>
            </div>

            {/* Add Link Dialog - rendered inline in portal to avoid remount focus issues */}
            {showAddLinkDialog && createPortal(
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
                    <div className="bg-white border-2 border-[#2C3947] rounded-2xl p-6 w-full max-w-md space-y-4 shadow-[8px_8px_0px_0px_rgba(44,57,71,1)] animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-black text-[#2C3947] tracking-tight">Add New Link</h3>
                            <button
                                onClick={() => { setShowAddLinkDialog(false); setNewLinkTitle(""); setNewLinkUrl(""); setShowIcon(true); }}
                                className="text-[#2C3947]/50 hover:text-[#2C3947] transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <p className="text-sm text-[#2C3947]/70 font-medium">Add a new link to your profile. Enter a URL below.</p>

                        {/* URL Field */}
                        <div className="space-y-2">
                            <Label htmlFor="linkUrl" className="font-bold text-xs text-[#2C3947]/80 uppercase tracking-wider">Profile URL</Label>
                            <div className="relative">
                                <Input
                                    id="linkUrl"
                                    type="url"
                                    placeholder="example.com or https://yourprofile"
                                    value={newLinkUrl}
                                    onChange={(e) => handleUrlChange(e.target.value)}
                                    onKeyDown={(e) => { if (e.key === "Enter" && newLinkUrl && validationState.isValid === true) addLink(); }}
                                    autoFocus
                                    className={validationState.isValid === false ? "border-destructive focus-visible:border-destructive focus-visible:shadow-[2px_2px_0px_0px_rgba(239,68,68,1)] pr-10" : validationState.isValid === true ? "border-green-500 focus-visible:border-green-500 focus-visible:shadow-[2px_2px_0px_0px_rgba(34,197,94,1)] pr-10" : "pr-10"}
                                />
                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                    {validationState.isValidating && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                                    {!validationState.isValidating && validationState.isValid === true && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                                    {!validationState.isValidating && validationState.isValid === false && <AlertCircle className="h-4 w-4 text-destructive" />}
                                </div>
                            </div>
                            {duplicateError && <p className="text-xs text-destructive flex items-center gap-1 font-semibold animate-in slide-in-from-top-1 duration-200"><X className="h-3 w-3" />This link has already been added!</p>}
                            {validationState.message && <p className={`text-xs flex items-center gap-1 font-semibold ${validationState.isValid === false ? "text-destructive" : validationState.isValid === true ? "text-green-600" : "text-muted-foreground"}`}>{validationState.message}</p>}
                        </div>

                        {/* Title Field (Optional) */}
                        <div className="space-y-2">
                            <Label htmlFor="linkTitle" className="font-bold text-xs text-[#2C3947]/80 uppercase tracking-wider">
                                Name / Title <span className="text-[#2C3947]/40 font-normal">(Optional)</span>
                            </Label>
                            <Input
                                id="linkTitle"
                                type="text"
                                placeholder="e.g. Portfolio, Blog"
                                value={newLinkTitle}
                                onChange={(e) => setNewLinkTitle(e.target.value)}
                                className="border-2 rounded-xl h-10 transition-all border-[#2C3947]/20 focus-visible:border-[#2C3947] focus-visible:ring-0"
                            />
                            <p className="text-[10px] text-[#2C3947]/50 font-semibold">Leave empty to display only the icon in the preview.</p>
                        </div>

                        {/* Preview */}
                        {newLinkUrl && validationState.isValid && validationState.faviconUrl && (
                            <div className="space-y-2">
                                <Label className="text-xs text-[#2C3947]/70 font-bold uppercase tracking-wider">Preview</Label>
                                <div className="p-4 bg-slate-50 border-2 border-[#2C3947]/20 rounded-xl animate-in slide-in-from-top-2 duration-200">
                                    <div className="flex items-center gap-3">
                                        {showIcon && validationState.faviconUrl && (
                                            <div className="flex-shrink-0">
                                                <img src={validationState.faviconUrl} alt="Favicon" className="h-5 w-5 rounded object-cover" onError={(e) => { const fallbacks = validationState.fallbackUrls || []; const idx = validationState.currentFaviconIndex || 0; if (idx < fallbacks.length) { e.currentTarget.src = fallbacks[idx]; } else { e.currentTarget.style.display = 'none'; } }} />
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-[#2C3947] truncate">{newLinkTitle || newLinkUrl}</p>
                                            <p className="text-xs text-[#2C3947]/60 font-semibold truncate">{newLinkUrl}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-2 pt-2">
                            <Button onClick={() => { setShowAddLinkDialog(false); setNewLinkTitle(""); setNewLinkUrl(""); setShowIcon(true); }} variant="outline" className="flex-1 border-2 border-[#2C3947] font-bold text-[#2C3947] rounded-xl hover:bg-slate-50 transition-all h-11">Cancel</Button>
                            <Button onClick={addLink} disabled={!newLinkUrl || validationState.isValidating || validationState.isValid !== true} className="flex-1 bg-[#2C3947] text-[#FEF9C3] hover:bg-[#212B36] font-bold border-2 border-[#2C3947] rounded-xl shadow-[3px_3px_0px_0px_rgba(44,57,71,1)] hover:shadow-[1px_1px_0px_0px_rgba(44,57,71,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none h-11">Add Link</Button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}
