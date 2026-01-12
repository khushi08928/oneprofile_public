import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";
import { GraduationCap } from "lucide-react";
import { useEffect, useState } from "react";

interface Education {
    id: string;
    institutionName: string;
    degree?: string;
    fieldOfStudy?: string;
    startDate?: string;
    endDate?: string;
    grade?: string;
}

export function EducationCard() {
    const [education, setEducation] = useState<Education[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEducation = async () => {
            try {
                const response = await axios.get("/api/profile/me/profile", {
                    withCredentials: true,
                });

                if (response.status === 200 && response.data) {
                    // Backend returns { profile: { education: [...] } }
                    const profileEducation = response.data.profile?.education || [];
                    setEducation(profileEducation);
                }
            } catch (error) {
                console.error("Error fetching education:", error);
                setEducation([]);
            } finally {
                setLoading(false);
            }
        };

        fetchEducation();
    }, []);

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    My Education
                </CardTitle>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <p className="text-sm text-muted-foreground">Loading education...</p>
                ) : education.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed border-border rounded-lg">
                        <GraduationCap className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                        <h3 className="font-semibold mb-1">No education yet</h3>
                        <p className="text-sm text-muted-foreground">
                            Go to Profile page to add your educational background
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {education.map((edu) => (
                            <div
                                key={edu.id}
                                className="p-4 rounded-lg border border-border/50 hover:border-border hover:bg-accent/50 transition-all"
                            >
                                <div className="flex items-start justify-between mb-1">
                                    <h4 className="font-semibold">{edu.degree || "Education"}</h4>
                                    {edu.grade && (
                                        <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                                            {edu.grade}
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-muted-foreground mb-1">
                                    {edu.institutionName}
                                </p>
                                {edu.fieldOfStudy && (
                                    <p className="text-sm text-muted-foreground mb-2">
                                        {edu.fieldOfStudy}
                                    </p>
                                )}
                                {edu.startDate && (
                                    <p className="text-xs text-muted-foreground">
                                        {formatDate(edu.startDate)} -{" "}
                                        {edu.endDate ? formatDate(edu.endDate) : "Present"}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
