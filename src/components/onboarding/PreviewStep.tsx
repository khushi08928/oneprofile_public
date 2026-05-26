import { Button } from "@/components/ui/button";
import { getThemeById } from "@/lib/themes";
import { Github, Instagram, Linkedin, Link as LinkIcon } from "lucide-react";

interface SocialLink {
    id: string;
    title: string;
    url: string;
    platform?: string;
    showIcon: boolean;
    faviconUrl?: string;
}

interface PreviewStepProps {
    username: string;
    profilePicture: string;
    displayName: string;
    bio: string;
    links: SocialLink[];
    theme: string;
    onFinish: () => void;
    onBack: () => void;
}

export default function PreviewStep({
    username,
    profilePicture,
    displayName,
    bio,
    links,
    theme,
    onFinish,
    onBack,
}: PreviewStepProps) {
    const themeObj = getThemeById(theme);

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
                <h2 className="text-3xl font-black text-[#2C3947] tracking-tight">Preview your profile</h2>
                <p className="text-sm text-[#2C3947]/70 font-semibold">
                    This is how your profile will look to visitors
                </p>
            </div>

            <div className="max-w-xs mx-auto w-full">
                {/* Profile Preview with theme background simulating a mobile screen */}
                <div className="border-4 border-[#2C3947] rounded-[32px] p-3 bg-white shadow-[8px_8px_0px_0px_rgba(44,57,71,1)] overflow-hidden">
                    <div className={`rounded-[24px] p-6 space-y-6 relative overflow-y-auto max-h-[440px] custom-phone-scrollbar ${themeObj.backgroundClass} ${themeObj.fontClass}`}>
                        <div className="flex flex-col items-center space-y-4">
                            {profilePicture ? (
                                <img
                                    src={profilePicture}
                                    alt="Profile"
                                    className="w-20 h-20 rounded-full object-cover border-2 border-white/20"
                                />
                            ) : (
                                <div className="w-20 h-20 rounded-2xl bg-[#2C3947]/10 flex items-center justify-center text-[#2C3947] text-xl font-black border-2 border-[#2C3947] shadow-[3px_3px_0px_0px_rgba(44,57,71,1)]">
                                    {displayName ? getInitials(displayName) : "K"}
                                </div>
                            )}
                            <div className="text-center">
                                <h3 className={`text-xl font-black ${themeObj.titleClass}`}>{displayName || "Your Name"}</h3>
                                <p className={`text-xs opacity-75 font-semibold ${themeObj.bioClass}`}>@{username}</p>
                            </div>
                            {bio && (
                                <p className={`text-xs text-center ${themeObj.textClass}`}>{bio}</p>
                            )}
                        </div>

                        {links.length > 0 ? (
                            <div className="space-y-3">
                                {links.map((link) => {
                                    const hasTitle = !!link.title;
                                    return (
                                        <a
                                            key={link.id}
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`flex items-center p-3 rounded-xl border border-transparent shadow-sm hover:translate-y-[-1px] transition-all duration-200 ${themeObj.cardClass} ${hasTitle ? "gap-3" : "justify-center"}`}
                                        >
                                            <div className="flex-shrink-0 flex items-center justify-center">
                                                {link.faviconUrl ? (
                                                    <img
                                                        src={link.faviconUrl}
                                                        alt=""
                                                        className="h-4 w-4 rounded object-cover"
                                                        onError={(e) => {
                                                            e.currentTarget.style.display = 'none';
                                                        }}
                                                    />
                                                ) : (
                                                    getPlatformIcon(link.platform)
                                                )}
                                            </div>
                                            {hasTitle && (
                                                <span className={`text-xs flex-1 truncate font-semibold ${themeObj.textClass}`}>{link.title}</span>
                                            )}
                                        </a>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-8 border-2 border-dashed border-border/30 rounded-lg">
                                <LinkIcon className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                                <p className="text-xs text-muted-foreground">No links yet</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex justify-center gap-4 pt-4">
                <Button
                    onClick={onBack}
                    variant="outline"
                    className="px-8 border-2 border-[#2C3947] font-bold text-[#2C3947] rounded-xl hover:bg-slate-50 transition-all h-11"
                >
                    Back
                </Button>
                <Button
                    onClick={onFinish}
                    className="bg-[#2C3947] text-[#FEF9C3] hover:bg-[#212B36] font-bold border-2 border-[#2C3947] h-11 px-8 rounded-xl shadow-[3px_3px_0px_0px_rgba(44,57,71,1)] hover:shadow-[1px_1px_0px_0px_rgba(44,57,71,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                >
                    Finish Setup
                </Button>
            </div>
        </div>
    );
}
