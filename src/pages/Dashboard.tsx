import { EducationCard } from "@/components/dashboard/EducationCard";
import { LinksCard } from "@/components/dashboard/LinksCard";
import { ProjectsCard } from "@/components/dashboard/ProjectsCard";
import { YourUrlCard } from "@/components/dashboard/YourUrlCard";

export default function Dashboard() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">
                    Welcome to your OneURL dashboard
                </p>
            </div>

            {/* Main Content Grid */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Left Column - Your URL & Links */}
                <div className="space-y-6">
                    <YourUrlCard />
                    <LinksCard />
                </div>

                {/* Right Column - Projects & Education */}
                <div className="space-y-6">
                    <ProjectsCard />
                    <EducationCard />
                </div>
            </div>
        </div>
    );
}
