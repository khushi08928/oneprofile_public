import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Github, Instagram, Linkedin, Link as LinkIcon, Plus, X } from "lucide-react";
import React from "react";
import { createPortal } from "react-dom";

interface SocialLink {
    id: string;
    title: string;
    url: string;
    platform?: string;
    showIcon: boolean;
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
    const [showAddLinkDialog, setShowAddLinkDialog] = React.useState(false);
    const [newLinkTitle, setNewLinkTitle] = React.useState("");
    const [newLinkUrl, setNewLinkUrl] = React.useState("");
    const [showIcon, setShowIcon] = React.useState(true);
    const [duplicateError, setDuplicateError] = React.useState(false);

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
            },
        ]);
        setNewLinkTitle("");
        setNewLinkUrl("");
        setShowIcon(true);
        setDuplicateError(false);
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
                        <Input
                            id="linkUrl"
                            type="url"
                            placeholder="example.com or https://yo"
                            value={newLinkUrl}
                            onChange={(e) => handleUrlChange(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && newLinkUrl) {
                                    addLink();
                                }
                            }}
                            className={`bg-background/50 border-border/50 focus:border-primary transition-colors ${duplicateError ? "border-destructive focus:border-destructive" : ""
                                }`}
                        />
                        {duplicateError && (
                            <p className="text-xs text-destructive flex items-center gap-1 animate-in slide-in-from-top-1 duration-200">
                                <X className="h-3 w-3" />
                                This link has already been added!
                            </p>
                        )}
                    </div>

                    {/* Preview Section */}
                    {newLinkUrl && (
                        <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground">Preview</Label>
                            <div className="p-4 bg-background/50 rounded-lg border border-border/50 animate-in slide-in-from-top-2 duration-200">
                                <div className="flex items-center gap-3">
                                    {showIcon && (
                                        <div className="flex-shrink-0">
                                            {getPlatformIcon(detectPlatform(newLinkUrl))}
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
                                {detectPlatform(newLinkUrl) && (
                                    <p className="text-xs text-primary mt-2 flex items-center gap-1">
                                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary"></span>
                                        Platform detected: {getPlatformName(detectPlatform(newLinkUrl))}
                                    </p>
                                )}
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
                            disabled={!newLinkUrl}
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
