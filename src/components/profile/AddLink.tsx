import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "@/lib/axios";
import { Github, Instagram, Link as LinkIcon, Linkedin, Plus, X } from "lucide-react";
import { useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";

interface LinkFormData {
    title: string;
    url: string;
    platform?: string;
    showIcon: boolean;
}

interface AddLinkDialogProps {
    open: boolean;
    onClose: () => void;
    formData: LinkFormData;
    setFormData: (data: LinkFormData) => void;
    saving: boolean;
    handleSubmit: (e: React.FormEvent) => void;
}

function AddLinkDialog({
    open,
    onClose,
    formData,
    setFormData,
    saving,
    handleSubmit,
}: AddLinkDialogProps) {
    if (!open) return null;

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
            <div className="bg-card border border-border rounded-lg p-6 w-full max-w-md space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        <LinkIcon className="h-5 w-5" />
                        Add New Link
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* URL Field */}
                    <div className="space-y-2">
                        <Label htmlFor="linkUrl">
                            Enter URL <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="linkUrl"
                            type="url"
                            value={formData.url}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    url: e.target.value,
                                    platform: detectPlatform(e.target.value),
                                    title: formData.title || getPlatformName(detectPlatform(e.target.value))
                                })
                            }
                            placeholder="https://linkedin.com/in/username"
                            required
                        />
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
                    {formData.url && (
                        <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground">Preview</Label>
                            <div className="p-4 bg-background/50 rounded-lg border border-border/50">
                                <div className="flex items-center gap-3">
                                    {formData.showIcon && (
                                        <div className="flex-shrink-0">
                                            {getPlatformIcon(detectedPlatform)}
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
                                {detectedPlatform && (
                                    <p className="text-xs text-primary mt-2 flex items-center gap-1">
                                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary"></span>
                                        Platform detected: {getPlatformName(detectedPlatform)}
                                    </p>
                                )}
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
                            disabled={saving}
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
                setFormData={setFormData}
                saving={saving}
                handleSubmit={handleSubmit}
            />
        </>
    );
}
