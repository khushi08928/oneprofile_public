import { AddEducation } from "@/components/profile/AddEducation";
import { AddLink } from "@/components/profile/AddLink";
import { AddProject } from "@/components/profile/AddProject";
import { ProfileInfo } from "@/components/profile/ProfileInfo";

export default function Profile() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
                <p className="text-muted-foreground">
                    Manage your profile settings and information
                </p>
            </div>

            {/* Profile Info */}
            <ProfileInfo />

            {/* Three Column Layout for Add Buttons */}
            <div className="grid gap-4 lg:grid-cols-3">
                {/* Add Link */}
                <AddLink />

                {/* Add Project */}
                <AddProject />

                {/* Add Education */}
                <AddEducation />
            </div>
        </div>
    );
}
