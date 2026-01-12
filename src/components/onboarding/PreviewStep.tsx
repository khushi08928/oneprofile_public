import { Button } from "@/components/ui/button";
import { Github, Instagram, Linkedin, Link as LinkIcon } from "lucide-react";

interface SocialLink {
    id: string;
    title: string;
    url: string;
    platform?: string;
    showIcon: boolean;
}

interface PreviewStepProps {
    username: string;
    profilePicture: string;
    displayName: string;
    bio: string;
    links: SocialLink[];
    onFinish: () => void;
    onBack: () => void;
}

export default function PreviewStep({
    username,
    profilePicture,
    displayName,
    bio,
    links,
    onFinish,
    onBack,
}: PreviewStepProps) {
    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map(n => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    const getPlatformIcon = (platform?: string) => {
        switch (platform) {
            case "linkedin":
                return <Linkedin className="h-5 w-5 text-[#0A66C2]" />;
            case "github":
                return <Github className="h-5 w-5" />;
            case "instagram":
                return <Instagram className="h-5 w-5 text-[#E4405F]" />;
            default:
                return <LinkIcon className="h-5 w-5" />;
        }
    };

    return (
        <div className="space-y-6">
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold">Preview your profile</h2>
                <p className="text-muted-foreground">
                    This is how your profile will look to visitors
                </p>
            </div>

            <div className="max-w-md mx-auto">
                {/* Profile Preview */}
                <div className="bg-background/50 border border-border/50 rounded-xl p-8 space-y-6">
                    <div className="flex flex-col items-center space-y-4">
                        {profilePicture ? (
                            <img
                                src={profilePicture}
                                alt="Profile"
                                className="w-20 h-20 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-bold">
                                {displayName ? getInitials(displayName) : "K"}
                            </div>
                        )}
                        <div className="text-center">
                            <h3 className="text-xl font-semibold">{displayName || "Your Name"}</h3>
                            <p className="text-sm text-muted-foreground">@{username}</p>
                        </div>
                        {bio && (
                            <p className="text-sm text-muted-foreground text-center">{bio}</p>
                        )}
                    </div>

                    {links.length > 0 ? (
                        <div className="space-y-3">
                            {links.map((link) => (
                                <a
                                    key={link.id}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 p-4 bg-background border border-border rounded-lg hover:border-primary transition-all hover:shadow-md"
                                >
                                    {getPlatformIcon(link.platform)}
                                    <span className="text-sm flex-1 truncate">{link.url}</span>
                                </a>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 border-2 border-dashed border-border rounded-lg">
                            <LinkIcon className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                            <p className="text-sm text-muted-foreground">No links yet</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex justify-center gap-4 pt-4">
                <Button
                    onClick={onBack}
                    variant="outline"
                    className="px-8"
                >
                    Back
                </Button>
                <Button
                    onClick={onFinish}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 px-8"
                >
                    Finish Setup
                </Button>
            </div>
        </div>
    );
}
