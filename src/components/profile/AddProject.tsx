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
            <div className="bg-white border-2 border-[#2C3947] rounded-2xl p-6 w-full max-w-md space-y-4 shadow-[4px_4px_0px_0px_rgba(44,57,71,1)] animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-black text-[#2C3947] flex items-center gap-2">
                        <Briefcase className="h-5 w-5 text-[#2C3947]" />
                        Add New Project
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-[#2C3947]/60 hover:text-[#2C3947] transition-colors bg-transparent p-0"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Project Title */}
                    <div className="space-y-2">
                        <Label htmlFor="projectTitle" className="font-bold text-xs text-[#2C3947]/80 uppercase tracking-wider">
                            Project Title <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="projectTitle"
                            value={formData.projectTitle}
                            onChange={(e) =>
                                setFormData({ ...formData, projectTitle: e.target.value })
                            }
                            placeholder="My Awesome Project"
                            required
                            className="border-2 border-[#2C3947]/20 focus-visible:border-[#2C3947] focus-visible:ring-0 rounded-xl h-10 transition-all"
                        />
                    </div>

                    {/* Project Description */}
                    <div className="space-y-2">
                        <Label htmlFor="projectDescription" className="font-bold text-xs text-[#2C3947]/80 uppercase tracking-wider">
                            Description <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                            id="projectDescription"
                            value={formData.projectDescription}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    projectDescription: e.target.value,
                                })
                            }
                            required
                            placeholder="Brief description of your project..."
                            rows={3}
                            className="border-2 border-[#2C3947]/20 focus-visible:border-[#2C3947] focus-visible:ring-0 rounded-xl transition-all resize-none"
                        />
                    </div>

                    {/* Tech Stack */}
                    <div className="space-y-2">
                        <Label htmlFor="techStack" className="font-bold text-xs text-[#2C3947]/80 uppercase tracking-wider">
                            Tech Stack <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="techStack"
                            value={formData.techStack}
                            onChange={(e) =>
                                setFormData({ ...formData, techStack: e.target.value })
                            }
                            placeholder="React, Node.js, MongoDB"
                            required
                            className="border-2 border-[#2C3947]/20 focus-visible:border-[#2C3947] focus-visible:ring-0 rounded-xl h-10 transition-all"
                        />
                        <p className="text-[10px] text-[#2C3947]/60 font-semibold">
                            Separate technologies with commas
                        </p>
                    </div>

                    {/* Project Link */}
                    <div className="space-y-2">
                        <Label htmlFor="projectLink" className="font-bold text-xs text-[#2C3947]/80 uppercase tracking-wider">
                            Project Link <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="projectLink"
                            type="url"
                            value={formData.projectLink}
                            onChange={(e) => setFormData({ ...formData, projectLink: e.target.value })}
                            placeholder="https://github.com/username/project"
                            required
                            className="border-2 border-[#2C3947]/20 focus-visible:border-[#2C3947] focus-visible:ring-0 rounded-xl h-10 transition-all"
                        />
                    </div>



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
                            disabled={saving}
                            className="flex-1 bg-[#2C3947] text-[#FEF9C3] hover:bg-[#212B36] font-bold border-2 border-[#2C3947] h-10 rounded-xl shadow-[2px_2px_0px_0px_rgba(44,57,71,1)] hover:shadow-[1px_1px_0px_0px_rgba(44,57,71,1)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
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

export function AddProject({ onSuccess }: { onSuccess?: () => void }) {
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

            // Refresh state via callback if provided, else reload
            if (onSuccess) {
                onSuccess();
            } else {
                setTimeout(() => window.location.reload(), 500);
            }
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
                className="gap-2 font-bold bg-white text-[#2C3947] border-2 border-[#2C3947] hover:bg-slate-50 h-10 px-4 rounded-xl shadow-[3px_3px_0px_0px_rgba(44,57,71,1)] hover:shadow-[1px_1px_0px_0px_rgba(44,57,71,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
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
