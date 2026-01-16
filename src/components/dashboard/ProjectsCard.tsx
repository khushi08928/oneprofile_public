import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "@/lib/axios";
import { Briefcase, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";

interface Project {
    id: string;
    projectTitle: string;
    projectDescription?: string;
    techStack?: string[];
    projectLink: string;
}

export function ProjectsCard() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                // TODO: Replace with actual endpoint when available
                const response = await axios.get("/api/project", {
                    withCredentials: true,
                });

                if (response.status === 200 && response.data) {
                    // Backend returns { projects: [...] }
                    setProjects(response.data.projects || []);
                }
            } catch (error) {
                console.error("Error fetching projects:", error);
                setProjects([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                    <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                        <span className="text-base sm:text-lg">My Projects</span>
                    </div>
                    <span className="text-xs sm:text-sm font-normal text-muted-foreground sm:ml-auto">
                        {projects.length} {projects.length === 1 ? 'project' : 'projects'}
                    </span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <p className="text-sm text-muted-foreground">Loading projects...</p>
                ) : projects.length === 0 ? (
                    <div className="text-center py-8 sm:py-12">
                        <div className="flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-full bg-accent/50">
                            <Briefcase className="h-7 w-7 sm:h-8 sm:w-8 text-muted-foreground" />
                        </div>
                        <h3 className="font-semibold text-base sm:text-lg mb-1">No projects yet</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 px-4">
                            Showcase your work by adding your first project
                        </p>
                        <p className="text-[10px] sm:text-xs text-muted-foreground">
                            Go to Profile page to get started
                        </p>
                    </div>
                ) : (
                    <div className="space-y-2.5 sm:space-y-3">
                        {projects.map((project) => (
                            <div
                                key={project.id}
                                className="group p-3 sm:p-4 rounded-lg border border-border/50 bg-card hover:border-primary/50 hover:bg-accent/30 hover:shadow-sm transition-all duration-200"
                            >
                                <div className="space-y-2 sm:space-y-3">
                                    <div className="flex items-start justify-between gap-2">
                                        <h4 className="font-semibold text-sm sm:text-base group-hover:text-primary transition-colors">
                                            {project.projectTitle}
                                        </h4>
                                        <ExternalLink className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                                    </div>

                                    {project.projectDescription && (
                                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-2">
                                            {project.projectDescription}
                                        </p>
                                    )}

                                    {project.techStack && project.techStack.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {project.techStack.map((tech, index) => (
                                                <span
                                                    key={index}
                                                    className="text-[10px] sm:text-xs px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md bg-primary/5 text-primary border border-primary/10 font-medium"
                                                >
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    <a
                                        href={project.projectLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline font-medium"
                                    >
                                        View Project
                                        <span className="text-xs">→</span>
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
