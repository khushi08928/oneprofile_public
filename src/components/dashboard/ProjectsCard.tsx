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
                const response = await axios.get("/api/project", {
                    withCredentials: true,
                });

                if (response.status === 200 && response.data) {
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
        <div className="rounded-xl border border-border/40 bg-card p-5 sm:p-6 h-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                        <Briefcase className="h-4 w-4 text-amber-400" />
                    </div>
                    <h3 className="font-semibold text-sm">Projects</h3>
                </div>
                <span className="text-xs text-muted-foreground px-2 py-0.5 rounded-full bg-accent/30">
                    {projects.length}
                </span>
            </div>

            {/* Content */}
            {loading ? (
                <div className="space-y-3">
                    {[1, 2].map(i => (
                        <div key={i} className="h-20 bg-accent/20 rounded-lg animate-pulse" />
                    ))}
                </div>
            ) : projects.length === 0 ? (
                <div className="text-center py-8">
                    <div className="h-12 w-12 rounded-xl bg-accent/30 flex items-center justify-center mx-auto mb-3">
                        <Briefcase className="h-6 w-6 text-muted-foreground/50" />
                    </div>
                    <p className="text-sm font-medium text-foreground/60 mb-1">No projects yet</p>
                    <p className="text-xs text-muted-foreground">Showcase your work from the Profile page</p>
                </div>
            ) : (
                <div className="space-y-2">
                    {projects.map((project) => (
                        <a
                            key={project.id}
                            href={project.projectLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group block p-3 sm:p-3.5 rounded-lg hover:bg-accent/25 transition-all duration-200"
                        >
                            <div className="flex items-start justify-between gap-2 mb-1.5">
                                <h4 className="font-medium text-sm group-hover:text-primary transition-colors truncate">
                                    {project.projectTitle}
                                </h4>
                                <ExternalLink className="h-3.5 w-3.5 text-muted-foreground/0 group-hover:text-muted-foreground/60 transition-all flex-shrink-0 mt-0.5" />
                            </div>

                            {project.projectDescription && (
                                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-2">
                                    {project.projectDescription}
                                </p>
                            )}

                            {project.techStack && project.techStack.length > 0 && (
                                <div className="flex flex-wrap gap-1.5">
                                    {project.techStack.slice(0, 4).map((tech, index) => (
                                        <span
                                            key={index}
                                            className="text-[10px] px-2 py-0.5 rounded-md bg-primary/5 text-primary/80 border border-primary/10 font-medium"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                    {project.techStack.length > 4 && (
                                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-accent/30 text-muted-foreground">
                                            +{project.techStack.length - 4}
                                        </span>
                                    )}
                                </div>
                            )}
                        </a>
                    ))}
                </div>
            )}
        </div>
    );
}
