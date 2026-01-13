import { LinksCard } from "@/components/dashboard/LinksCard";
import { ProjectsCard } from "@/components/dashboard/ProjectsCard";
import { YourUrlCard } from "@/components/dashboard/YourUrlCard";
import { Sparkles } from "lucide-react";

export default function Dashboard() {
    return (
        <div className="min-h-screen pb-12">
            {/* Header Section */}
            <div className="mb-10 pb-8 border-b border-border/40">
                <div className="flex items-start justify-between">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground to-foreground/60 bg-clip-text text-transparent">
                                Dashboard
                            </h1>
                            {/* <Sparkles className="h-7 w-7 text-primary animate-pulse" /> */}
                        </div>
                        <p className="text-muted-foreground text-base max-w-2xl">
                            Manage your profile, showcase your work, and share your unique link with the world
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid gap-8 lg:grid-cols-2 xl:gap-10">
                {/* Left Column - Your URL */}
                <div className="space-y-8">
                    <YourUrlCard />
                </div>

                {/* Right Column - Links & Projects */}
                <div className="space-y-8">
                    <LinksCard />
                    <ProjectsCard />
                </div>
            </div>
        </div>
    );
}
