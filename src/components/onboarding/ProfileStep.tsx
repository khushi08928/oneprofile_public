import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ProfileStepProps {
    profilePicture: string;
    displayName: string;
    setDisplayName: (value: string) => void;
    bio: string;
    setBio: (value: string) => void;
    onContinue: () => void;
    onBack: () => void;
}

export default function ProfileStep({
    profilePicture,
    displayName,
    setDisplayName,
    bio,
    setBio,
    onContinue,
    onBack,
}: ProfileStepProps) {
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
                <h2 className="text-3xl font-black text-[#2C3947] tracking-tight">Complete your profile</h2>
            </div>

            <div className="space-y-6 max-w-md mx-auto">
                <div className="flex flex-col items-center space-y-4">
                    <Label className="font-bold text-xs text-[#2C3947]/80 uppercase tracking-wider">Profile Picture</Label>
                    <div className="relative">
                        {profilePicture ? (
                            <img
                                src={profilePicture}
                                alt="Profile"
                                className="w-24 h-24 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-24 h-24 rounded-2xl bg-[#2C3947]/10 flex items-center justify-center text-[#2C3947] text-2xl font-black border-2 border-[#2C3947] shadow-[4px_4px_0px_0px_rgba(44,57,71,1)] transition-transform duration-300 hover:-rotate-6">
                                {displayName ? getInitials(displayName) : "K"}
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="displayName" className="font-bold text-xs text-[#2C3947]/80 uppercase tracking-wider">Name</Label>
                    <Input
                        id="displayName"
                        type="text"
                        placeholder="Your display name that will be shown on your profile"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="bio" className="font-bold text-xs text-[#2C3947]/80 uppercase tracking-wider">Bio (Optional)</Label>
                    <Textarea
                        id="bio"
                        placeholder="Tell us about yourself"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="resize-none"
                        rows={3}
                    />
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
                    onClick={onContinue}
                    className="bg-[#2C3947] text-[#FEF9C3] hover:bg-[#212B36] font-bold border-2 border-[#2C3947] h-11 px-8 rounded-xl shadow-[3px_3px_0px_0px_rgba(44,57,71,1)] hover:shadow-[1px_1px_0px_0px_rgba(44,57,71,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                >
                    Continue
                </Button>
            </div>
        </div>
    );
}
