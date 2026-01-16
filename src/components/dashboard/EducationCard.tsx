import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "@/lib/axios";
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
                    <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="text-base sm:text-lg">My Education</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <p className="text-sm text-muted-foreground">Loading education...</p>
                ) : education.length === 0 ? (
                    <div className="text-center py-8 sm:py-12 border-2 border-dashed border-border rounded-lg">
                        <GraduationCap className="h-10 w-10 sm:h-12 sm:w-12 mx-auto text-muted-foreground mb-2 sm:mb-3" />
                        <h3 className="font-semibold text-sm sm:text-base mb-1">No education yet</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground px-4">
                            Go to Profile page to add your educational background
                        </p>
                    </div>
                ) : (
                    <div className="space-y-2.5 sm:space-y-3">
                        {education.map((edu) => (
                            <div
                                key={edu.id}
                                className="p-3 sm:p-4 rounded-lg border border-border/50 hover:border-border hover:bg-accent/50 transition-all"
                            >
                                <div className="flex items-start justify-between gap-2 mb-1">
                                    <h4 className="font-semibold text-sm sm:text-base">{edu.degree || "Education"}</h4>
                                    {edu.grade && (
                                        <span className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full bg-primary/10 text-primary whitespace-nowrap">
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
