import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";
import { Briefcase } from "lucide-react";
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
                    <Briefcase className="h-5 w-5" />
                    My Projects
                </CardTitle>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <p className="text-sm text-muted-foreground">Loading projects...</p>
                ) : projects.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed border-border rounded-lg">
                        <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                        <h3 className="font-semibold mb-1">No projects yet</h3>
                        <p className="text-sm text-muted-foreground">
                            Go to Profile page to add your first project
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {projects.map((project) => (
                            <div
                                key={project.id}
                                className="p-4 rounded-lg border border-border/50 hover:border-border hover:bg-accent/50 transition-all"
                            >
                                <h4 className="font-semibold mb-1">{project.projectTitle}</h4>
                                {project.projectDescription && (
                                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                                        {project.projectDescription}
                                    </p>
                                )}
                                {project.techStack && project.techStack.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mb-2">
                                        {project.techStack.map((tech, index) => (
                                            <span
                                                key={index}
                                                className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary"
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
                                    className="text-xs text-primary hover:underline"
                                >
                                    View Project →
                                </a>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
