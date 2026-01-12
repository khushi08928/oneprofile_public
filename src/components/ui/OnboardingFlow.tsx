"use client";

import LinksStep from "@/components/onboarding/LinksStep";
import PreviewStep from "@/components/onboarding/PreviewStep";
import ProfileStep from "@/components/onboarding/ProfileStep";
import UsernameStep from "@/components/onboarding/UsernameStep";
import axios from "@/lib/axios";
import { useNavigate } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { useEffect, useState } from "react";

type OnboardingStep = "username" | "profile" | "links" | "preview";

interface SocialLink {
    id: string;
    title: string;
    url: string;
    platform?: string;
    showIcon: boolean;
}

export default function OnboardingFlow() {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState<OnboardingStep>("username");

    // Username step state
    const [username, setUsername] = useState("");
    const [isUsernameAvailable, setIsUsernameAvailable] = useState<boolean | null>(null);
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);

    // Profile step state
    const profilePicture = "";
    const [displayName, setDisplayName] = useState("");
    const [bio, setBio] = useState("");

    // Links step state
    const [links, setLinks] = useState<SocialLink[]>([]);

    // Fetch user's name on component mount to pre-fill display name
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get("/api/auth/me", {
                    withCredentials: true,
                });

                if (response.status === 200 && response.data) {
                    // Pre-fill display name with user's name from signup
                    setDisplayName(response.data.name || "");
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUserData();
    }, []);

    const steps = [
        { id: "username", label: "Username", number: 1 },
        { id: "profile", label: "Profile", number: 2 },
        { id: "links", label: "Links", number: 3 },
        { id: "preview", label: "Preview", number: 4 },
    ];

    const currentStepIndex = steps.findIndex(s => s.id === currentStep);

    const checkUsernameAvailability = async () => {
        if (!username || username.length < 3) {
            setIsUsernameAvailable(null);
            return;
        }

        setIsCheckingUsername(true);
        try {
            const response = await axios.get(`/api/profile/check-username/${username}`);
            setIsUsernameAvailable(response.data.available);
        } catch (error) {
            console.error("Error checking username:", error);
            setIsUsernameAvailable(null);
        } finally {
            setIsCheckingUsername(false);
        }
    };

    const handleFinish = async () => {
        try {
            // Save all onboarding data to backend
            await axios.post("/api/profile/complete-onboarding", {
                username,
                displayName,
                bio,
                links,
                profilePicture,
            }, {
                withCredentials: true,
            });

            // Redirect to dashboard after successful completion
            // @ts-expect-error - Route types will be inferred after dev server restart
            navigate({ to: "/dashboard" });
        } catch (error) {
            console.error("Failed to complete onboarding:", error);
            // TODO: Show error message to user
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-6 py-8">
            <div className="w-full max-w-2xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                            <span className="text-lg font-bold">O</span>
                        </div>
                        <span className="text-xl font-semibold tracking-tight">OneURL</span>
                    </div>
                </div>

                {/* Progress Steps */}
                <div className="flex items-center justify-between mb-12">
                    {steps.map((step, index) => (
                        <div key={step.id} className="flex items-center flex-1">
                            <div className="flex flex-col items-center flex-1">
                                <div
                                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${index < currentStepIndex
                                        ? "bg-primary border-primary text-primary-foreground"
                                        : index === currentStepIndex
                                            ? "border-primary text-primary"
                                            : "border-border text-muted-foreground"
                                        }`}
                                >
                                    {index < currentStepIndex ? (
                                        <Check className="h-5 w-5" />
                                    ) : (
                                        <span className="font-semibold">{step.number}</span>
                                    )}
                                </div>
                                <span
                                    className={`mt-2 text-xs font-medium ${index <= currentStepIndex ? "text-foreground" : "text-muted-foreground"
                                        }`}
                                >
                                    {step.label}
                                </span>
                            </div>
                            {index < steps.length - 1 && (
                                <div
                                    className={`h-0.5 flex-1 mx-2 transition-all ${index < currentStepIndex ? "bg-primary" : "bg-border"
                                        }`}
                                />
                            )}
                        </div>
                    ))}
                </div>

                {/* Step Content */}
                <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-8">
                    {currentStep === "username" && (
                        <UsernameStep
                            username={username}
                            setUsername={setUsername}
                            isUsernameAvailable={isUsernameAvailable}
                            isCheckingUsername={isCheckingUsername}
                            checkUsernameAvailability={checkUsernameAvailability}
                            onContinue={() => setCurrentStep("profile")}
                        />
                    )}

                    {currentStep === "profile" && (
                        <ProfileStep
                            profilePicture={profilePicture}
                            displayName={displayName}
                            setDisplayName={setDisplayName}
                            bio={bio}
                            setBio={setBio}
                            onContinue={() => setCurrentStep("links")}
                            onBack={() => setCurrentStep("username")}
                        />
                    )}

                    {currentStep === "links" && (
                        <LinksStep
                            links={links}
                            setLinks={setLinks}
                            onContinue={() => setCurrentStep("preview")}
                            onBack={() => setCurrentStep("profile")}
                        />
                    )}

                    {currentStep === "preview" && (
                        <PreviewStep
                            username={username}
                            profilePicture={profilePicture}
                            displayName={displayName}
                            bio={bio}
                            links={links}
                            onFinish={handleFinish}
                            onBack={() => setCurrentStep("links")}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
