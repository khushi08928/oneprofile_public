import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import axios from "@/lib/axios";
import { Briefcase, Plus, X } from "lucide-react";
import { useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";

interface ProjectFormData {
    projectTitle: string;
    projectDescription: string;
    techStack: string;
    projectLink: string;
}

interface AddProjectDialogProps {
    open: boolean;
    onClose: () => void;
    formData: ProjectFormData;
    setFormData: (data: ProjectFormData) => void;
    saving: boolean;
    handleSubmit: (e: React.FormEvent) => void;
}

function AddProjectDialog({
    open,
    onClose,
    formData,
    setFormData,
    saving,
    handleSubmit,
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
                        <Input
                            id="projectLink"
                            type="url"
                            value={formData.projectLink}
                            onChange={(e) => setFormData({ ...formData, projectLink: e.target.value })}
                            placeholder="https://github.com/username/project"
                            required
                        />
                    </div>



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
            />
        </>
    );
}
