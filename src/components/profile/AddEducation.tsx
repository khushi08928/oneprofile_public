import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import axios from "@/lib/axios";
import { GraduationCap, Plus, X } from "lucide-react";
import { useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";

// Institution types from backend interface
const INSTITUTION_TYPES = [
    { value: "school", label: "School" },
    { value: "college", label: "College" },
    { value: "university", label: "University" },
    { value: "other", label: "Other" },
] as const;

interface EducationFormData {
    institutionType: string;
    institutionName: string;
    degree: string;
    fieldOfStudy: string;
    startDate: string;
    endDate: string;
}

interface AddEducationDialogProps {
    open: boolean;
    onClose: () => void;
    formData: EducationFormData;
    setFormData: (data: EducationFormData) => void;
    saving: boolean;
    handleSubmit: (e: React.FormEvent) => void;
}

function AddEducationDialog({
    open,
    onClose,
    formData,
    setFormData,
    saving,
    handleSubmit,
}: AddEducationDialogProps) {
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
            <div className="bg-card border border-border rounded-lg p-5 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        <GraduationCap className="h-5 w-5" />
                        Add Education
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3">
                    {/* Institution Type */}
                    <div className="space-y-1.5">
                        <Label htmlFor="institutionType">
                            Institution Type <span className="text-destructive">*</span>
                        </Label>
                        <Select
                            value={formData.institutionType}
                            onValueChange={(value) =>
                                setFormData({ ...formData, institutionType: value })
                            }
                            required
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent className="z-[10000]">
                                {INSTITUTION_TYPES.map((type) => (
                                    <SelectItem key={type.value} value={type.value}>
                                        {type.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Institution Name */}
                    <div className="space-y-1.5">
                        <Label htmlFor="institutionName">
                            Institution Name <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="institutionName"
                            value={formData.institutionName}
                            onChange={(e) =>
                                setFormData({ ...formData, institutionName: e.target.value })
                            }
                            placeholder="University Name"
                            required
                        />
                    </div>

                    {/* Degree */}
                    <div className="space-y-1.5">
                        <Label htmlFor="degree">Degree</Label>
                        <Input
                            id="degree"
                            value={formData.degree}
                            onChange={(e) =>
                                setFormData({ ...formData, degree: e.target.value })
                            }
                            placeholder="Bachelor's Degree"
                        />
                    </div>

                    {/* Field of Study */}
                    <div className="space-y-1.5">
                        <Label htmlFor="fieldOfStudy">Field of Study</Label>
                        <Input
                            id="fieldOfStudy"
                            value={formData.fieldOfStudy}
                            onChange={(e) =>
                                setFormData({ ...formData, fieldOfStudy: e.target.value })
                            }
                            placeholder="Computer Science"
                        />
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label htmlFor="startDate">Start Date</Label>
                            <Input
                                id="startDate"
                                type="date"
                                value={formData.startDate}
                                onChange={(e) =>
                                    setFormData({ ...formData, startDate: e.target.value })
                                }
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="endDate">End Date</Label>
                            <Input
                                id="endDate"
                                type="date"
                                value={formData.endDate}
                                onChange={(e) =>
                                    setFormData({ ...formData, endDate: e.target.value })
                                }
                            />
                        </div>
                    </div>
                    <p className="text-xs text-muted-foreground -mt-1">
                        Leave end date empty if ongoing
                    </p>

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
                            {saving ? "Adding..." : "Add Education"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
}

export function AddEducation() {
    const [showDialog, setShowDialog] = useState(false);
    const [formData, setFormData] = useState<EducationFormData>({
        institutionType: "",
        institutionName: "",
        degree: "",
        fieldOfStudy: "",
        startDate: "",
        endDate: "",
    });
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            // Convert dates to ISO 8601 datetime format
            const educationData = {
                institutionType: formData.institutionType,
                institutionName: formData.institutionName,
                degree: formData.degree || undefined,
                fieldOfStudy: formData.fieldOfStudy || undefined,
                startDate: formData.startDate ? new Date(formData.startDate).toISOString() : undefined,
                endDate: formData.endDate ? new Date(formData.endDate).toISOString() : undefined,
            };

            await axios.post("/api/profile/education", educationData, {
                withCredentials: true,
            });

            // Reset form
            setFormData({
                institutionType: "",
                institutionName: "",
                degree: "",
                fieldOfStudy: "",
                startDate: "",
                endDate: "",
            });
            setShowDialog(false);

            // Show success toast
            toast.success("Education added successfully!");

            // Refresh page to show new education
            setTimeout(() => window.location.reload(), 500);
        } catch (error) {
            console.error("Error saving education:", error);
            toast.error("Failed to save education. Please try again.");
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
                Add Education
            </Button>
            <AddEducationDialog
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
