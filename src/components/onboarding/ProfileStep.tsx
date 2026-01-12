import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ProfileStepProps {
    profilePicture: string;
    setProfilePicture: (value: string) => void;
    displayName: string;
    setDisplayName: (value: string) => void;
    bio: string;
    setBio: (value: string) => void;
    onContinue: () => void;
    onBack: () => void;
}

export default function ProfileStep({
    profilePicture,
    setProfilePicture,
    displayName,
    setDisplayName,
    bio,
    setBio,
    onContinue,
    onBack,
}: ProfileStepProps) {
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePicture(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map(n => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div className="space-y-6">
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold">Complete your profile</h2>
            </div>

            <div className="space-y-6 max-w-md mx-auto">
                <div className="flex flex-col items-center space-y-4">
                    <Label>Profile Picture</Label>
                    <div className="relative">
                        {profilePicture ? (
                            <img
                                src={profilePicture}
                                alt="Profile"
                                className="w-24 h-24 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold">
                                {displayName ? getInitials(displayName) : "K"}
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="displayName">Name</Label>
                    <Input
                        id="displayName"
                        type="text"
                        placeholder="Your display name that will be shown on your profile"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="bg-background/50 border-border/50 focus:border-primary transition-colors"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="bio">Bio (Optional)</Label>
                    <Textarea
                        id="bio"
                        placeholder="Tell us about yourself"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="bg-background/50 border-border/50 focus:border-primary transition-colors resize-none"
                        rows={3}
                    />
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
                    onClick={onContinue}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 px-8"
                >
                    Continue
                </Button>
            </div>
        </div>
    );
}
