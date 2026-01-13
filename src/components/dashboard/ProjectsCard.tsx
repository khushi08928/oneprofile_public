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
                <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-primary" />
                    <span>My Projects</span>
                    <span className="ml-auto text-sm font-normal text-muted-foreground">
                        {projects.length} {projects.length === 1 ? 'project' : 'projects'}
                    </span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <p className="text-sm text-muted-foreground">Loading projects...</p>
                ) : projects.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-accent/50">
                            <Briefcase className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="font-semibold text-lg mb-1">No projects yet</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Showcase your work by adding your first project
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Go to Profile page to get started
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {projects.map((project) => (
                            <div
                                key={project.id}
                                className="group p-4 rounded-lg border border-border/50 bg-card hover:border-primary/50 hover:bg-accent/30 hover:shadow-sm transition-all duration-200"
                            >
                                <div className="space-y-3">
                                    <div className="flex items-start justify-between gap-2">
                                        <h4 className="font-semibold text-base group-hover:text-primary transition-colors">
                                            {project.projectTitle}
                                        </h4>
                                        <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                                    </div>

                                    {project.projectDescription && (
                                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                                            {project.projectDescription}
                                        </p>
                                    )}

                                    {project.techStack && project.techStack.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {project.techStack.map((tech, index) => (
                                                <span
                                                    key={index}
                                                    className="text-xs px-2.5 py-1 rounded-md bg-primary/5 text-primary border border-primary/10 font-medium"
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
