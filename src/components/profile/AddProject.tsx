import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import axios from "@/lib/axios";
import { AlertCircle, Briefcase, CheckCircle2, Loader2, Plus, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";

interface ProjectFormData {
    projectTitle: string;
    projectDescription: string;
    techStack: string;
    projectLink: string;
}

interface ValidationState {
    isValidating: boolean;
    isValid: boolean | null;
    message: string;
    faviconUrl?: string;
}

interface AddProjectDialogProps {
    open: boolean;
    onClose: () => void;
    formData: ProjectFormData;
    setFormData: (data: ProjectFormData) => void;
    saving: boolean;
    handleSubmit: (e: React.FormEvent) => void;
    validationState: ValidationState;
    onUrlChange: (url: string) => void;
}

function AddProjectDialog({
    open,
    onClose,
    formData,
    setFormData,
    saving,
    handleSubmit,
    validationState,
    onUrlChange,
}: AddProjectDialogProps) {
    if (!open) return null;

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
                        <Briefcase className="h-5 w-5" />
                        Add New Project
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Project Title */}
                    <div className="space-y-2">
                        <Label htmlFor="projectTitle">
                            Project Title <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="projectTitle"
                            value={formData.projectTitle}
                            onChange={(e) =>
                                setFormData({ ...formData, projectTitle: e.target.value })
                            }
                            placeholder="My Awesome Project"
                            required
                        />
                    </div>

                    {/* Project Description */}
                    <div className="space-y-2">
                        <Label htmlFor="projectDescription">Description</Label>
                        <Textarea
                            id="projectDescription"
                            value={formData.projectDescription}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    projectDescription: e.target.value,
                                })
                            }
                            placeholder="Brief description of your project..."
                            rows={3}
                        />
                    </div>

                    {/* Tech Stack */}
                    <div className="space-y-2">
                        <Label htmlFor="techStack">Tech Stack</Label>
                        <Input
                            id="techStack"
                            value={formData.techStack}
                            onChange={(e) =>
                                setFormData({ ...formData, techStack: e.target.value })
                            }
                            placeholder="React, Node.js, MongoDB"
                        />
                        <p className="text-xs text-muted-foreground">
                            Separate technologies with commas
                        </p>
                    </div>

                    {/* Project Link */}
                    <div className="space-y-2">
                        <Label htmlFor="projectLink">
                            Project Link <span className="text-destructive">*</span>
                        </Label>
                        <div className="relative">
                            <Input
                                id="projectLink"
                                type="url"
                                value={formData.projectLink}
                                onChange={(e) => onUrlChange(e.target.value)}
                                placeholder="https://github.com/username/project"
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

                    {/* Preview Section */}
                    {formData.projectLink && validationState.isValid && validationState.faviconUrl && (
                        <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground">Preview</Label>
                            <div className="p-3 bg-background/50 rounded-lg border border-border/50">
                                <div className="flex items-center gap-3">
                                    {validationState.faviconUrl && (
                                        <div className="flex-shrink-0">
                                            <img
                                                src={validationState.faviconUrl}
                                                alt="Favicon"
                                                className="h-5 w-5 rounded"
                                                onError={(e) => {
                                                    e.currentTarget.style.display = 'none';
                                                }}
                                            />
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">
                                            {formData.projectTitle || "Project"}
                                        </p>
                                        <p className="text-xs text-muted-foreground truncate">
                                            {formData.projectLink}
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
                            {saving ? "Adding..." : "Add Project"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
}

export function AddProject() {
    const [showDialog, setShowDialog] = useState(false);
    const [formData, setFormData] = useState<ProjectFormData>({
        projectTitle: "",
        projectDescription: "",
        techStack: "",
        projectLink: "",
    });
    const [saving, setSaving] = useState(false);
    const [validationState, setValidationState] = useState<ValidationState>({
        isValidating: false,
        isValid: null,
        message: "",
    });

    // Debounce timer ref
    const debounceTimerRef = useRef<number | null>(null);

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
        setFormData((prev) => ({
            ...prev,
            projectLink: url,
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
            const projectData = {
                projectTitle: formData.projectTitle,
                projectDescription: formData.projectDescription,
                techStack: formData.techStack
                    ? formData.techStack.split(",").map((t) => t.trim()).filter(t => t.length > 0)
                    : [],
                projectLink: formData.projectLink,
            };

            await axios.post("/api/project", projectData, {
                withCredentials: true,
            });

            // Reset form
            setFormData({
                projectTitle: "",
                projectDescription: "",
                techStack: "",
                projectLink: "",
            });
            setValidationState({
                isValidating: false,
                isValid: null,
                message: "",
            });
            setShowDialog(false);
            toast.success("Project added successfully!");

            // Refresh page to show new project
            setTimeout(() => window.location.reload(), 500);
        } catch (error) {
            console.error("Error saving project:", error);
            toast.error("Failed to save project. Please try again.");
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
                Add Project
            </Button>
            <AddProjectDialog
                open={showDialog}
                onClose={() => setShowDialog(false)}
                formData={formData}
                setFormData={setFormData}
                saving={saving}
                handleSubmit={handleSubmit}
                validationState={validationState}
                onUrlChange={handleUrlChange}
            />
        </>
    );
}
