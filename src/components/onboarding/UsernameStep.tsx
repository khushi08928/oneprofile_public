import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, X } from "lucide-react";

interface UsernameStepProps {
    username: string;
    setUsername: (value: string) => void;
    isUsernameAvailable: boolean | null;
    isCheckingUsername: boolean;
    onContinue: () => void;
    onBack?: () => void;
}

export default function UsernameStep({
    username,
    setUsername,
    isUsernameAvailable,
    isCheckingUsername,
    onContinue,
}: UsernameStepProps) {
    const appUrl = import.meta.env.VITE_APP_URL || "oneurl.live";

    return (
        <div className="space-y-6">
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-black text-[#2C3947] tracking-tight">Choose your username</h2>
                <p className="text-[#2C3947]/70 font-medium">
                    This will be your unique profile URL.
                    <br />
                    <span className="text-sm">{appUrl}/</span>
                    <span className="text-sm font-bold font-mono">{username || "yourname"}</span>
                </p>
            </div>

            <div className="space-y-2 max-w-md mx-auto">
                <Label htmlFor="username" className="font-bold text-xs text-[#2C3947]/80 uppercase tracking-wider">Username</Label>
                <div className="relative">
                    <Input
                        id="username"
                        type="text"
                        placeholder="Choose a unique username for your profile URL"
                        value={username}
                        onChange={(e) => {
                            setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""));
                        }}
                        className="pr-10"
                    />
                    {isCheckingUsername && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <div className="animate-spin h-4 w-4 border-2 border-[#2C3947] border-t-transparent rounded-full" />
                        </div>
                    )}
                    {!isCheckingUsername && isUsernameAvailable !== null && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            {isUsernameAvailable ? (
                                <Check className="h-4 w-4 text-green-500" />
                            ) : (
                                <X className="h-4 w-4 text-destructive" />
                            )}
                        </div>
                    )}
                </div>
                {isUsernameAvailable && (
                    <p className="text-sm text-green-500 flex items-center gap-1 font-semibold">
                        <Check className="h-3 w-3" />
                        Username is available!
                    </p>
                )}
                {isUsernameAvailable === false && (
                    <p className="text-sm text-destructive font-semibold">Username is already taken</p>
                )}
            </div>

            <div className="flex justify-center pt-4">
                <Button
                    onClick={onContinue}
                    disabled={
                        !username ||
                        username.length < 3 ||
                        isCheckingUsername ||
                        isUsernameAvailable !== true
                    }
                    className="bg-[#2C3947] text-[#FEF9C3] hover:bg-[#212B36] font-bold border-2 border-[#2C3947] h-11 px-8 rounded-xl shadow-[3px_3px_0px_0px_rgba(44,57,71,1)] hover:shadow-[1px_1px_0px_0px_rgba(44,57,71,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                >
                    Continue
                </Button>
            </div>
        </div>
    );
}
