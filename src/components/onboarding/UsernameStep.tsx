import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, X } from "lucide-react";

interface UsernameStepProps {
    username: string;
    setUsername: (value: string) => void;
    isUsernameAvailable: boolean | null;
    isCheckingUsername: boolean;
    checkUsernameAvailability: () => Promise<void>;
    onContinue: () => void;
    onBack?: () => void;
}

export default function UsernameStep({
    username,
    setUsername,
    isUsernameAvailable,
    isCheckingUsername,
    checkUsernameAvailability,
    onContinue,
}: UsernameStepProps) {
    const appUrl = import.meta.env.VITE_APP_URL || "oneurl.live";

    return (
        <div className="space-y-6">
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold">Choose your username</h2>
                <p className="text-muted-foreground">
                    This will be your unique profile URL.
                    <br />
                    <span className="text-sm">{appUrl}/</span>
                    <span className="text-sm font-mono">{username || "yourname"}</span>
                </p>
            </div>

            <div className="space-y-2 max-w-md mx-auto">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                    <Input
                        id="username"
                        type="text"
                        placeholder="Choose a unique username for your profile URL"
                        value={username}
                        onChange={(e) => {
                            setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""));
                        }}
                        onBlur={checkUsernameAvailability}
                        className="bg-background/50 border-border/50 focus:border-primary transition-colors pr-10"
                    />
                    {isCheckingUsername && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
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
                    <p className="text-sm text-green-500 flex items-center gap-1">
                        <Check className="h-3 w-3" />
                        Username is available!
                    </p>
                )}
                {isUsernameAvailable === false && (
                    <p className="text-sm text-destructive">Username is already taken</p>
                )}
            </div>

            <div className="flex justify-center pt-4">
                <Button
                    onClick={onContinue}
                    disabled={!isUsernameAvailable}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 px-8"
                >
                    Continue
                </Button>
            </div>
        </div>
    );
}
