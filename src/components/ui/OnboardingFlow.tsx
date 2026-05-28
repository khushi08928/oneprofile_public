import LinksStep from "@/components/onboarding/LinksStep";
import PreviewStep from "@/components/onboarding/PreviewStep";
import ProfileStep from "@/components/onboarding/ProfileStep";
import ThemeStep from "@/components/onboarding/ThemeStep";
import UsernameStep from "@/components/onboarding/UsernameStep";
import axios from "@/lib/axios";
import { useNavigate } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { useEffect, useState } from "react";

type OnboardingStep = "username" | "profile" | "links" | "theme" | "preview";

interface SocialLink {
    id: string;
    title: string;
    url: string;
    platform?: string;
    showIcon: boolean;
    faviconUrl?: string;
}

export default function OnboardingFlow() {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState<OnboardingStep>("username");

    // Username step state
    const [username, setUsername] = useState(() => {
        return sessionStorage.getItem("claimed_username") || "";
    });
    const [isUsernameAvailable, setIsUsernameAvailable] = useState<boolean | null>(() => {
        return sessionStorage.getItem("claimed_username") ? true : null;
    });
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);

    // Profile step state
    const profilePicture = "";
    const [displayName, setDisplayName] = useState("");
    const [bio, setBio] = useState("");

    // Links step state
    const [links, setLinks] = useState<SocialLink[]>([]);

    // Theme step state
    const [theme, setTheme] = useState("default");

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
        { id: "theme", label: "Theme", number: 4 },
        { id: "preview", label: "Preview", number: 5 },
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

    // Debounced username validation - validates automatically while typing
    useEffect(() => {
        if (!username || username.length < 3) {
            setIsUsernameAvailable(null);
            return;
        }

        // Do not check availability again if username matches the claimed one from hero section
        const claimed = sessionStorage.getItem("claimed_username");
        if (username === claimed) {
            setIsUsernameAvailable(true);
            return;
        }

        // Debounce the validation to avoid excessive API calls
        const timeoutId = setTimeout(() => {
            checkUsernameAvailability();
        }, 500); // 500ms debounce

        return () => clearTimeout(timeoutId);
    }, [username]);

    // Re-validate when returning to username step
    useEffect(() => {
        const claimed = sessionStorage.getItem("claimed_username");
        if (username === claimed) {
            setIsUsernameAvailable(true);
            return;
        }

        if (currentStep === 'username' && username && username.length >= 3) {
            // Re-check username availability when user returns to this step
            checkUsernameAvailability();
        }
    }, [currentStep]);

    const handleFinish = async () => {
        try {
            // Save all onboarding data to backend
            await axios.post("/api/profile/complete-onboarding", {
                username,
                displayName,
                bio,
                links,
                profilePicture,
                theme,
            }, {
                withCredentials: true,
            });

            // Delete claimed username from session storage since onboarding is complete
            sessionStorage.removeItem("claimed_username");

            // Redirect to dashboard after successful completion
            // @ts-expect-error - Route types will be inferred after dev server restart
            navigate({ to: "/dashboard" });
        } catch (error) {
            console.error("Failed to complete onboarding:", error);
            // TODO: Show error message to user
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#FEF9C3]/50 via-white to-[#FEF9C3]/30 flex items-center justify-center px-4 sm:px-6 py-6 sm:py-8">
            <div className="w-full max-w-2xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-6 sm:mb-8">
                    <div className="flex items-center space-x-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#2C3947] text-[#FEF9C3] border-2 border-[#2C3947] shadow-[2px_2px_0px_0px_rgba(44,57,71,1)] transition-transform duration-300 hover:rotate-12">
                            <span className="text-xl font-black">O</span>
                        </div>
                        <span className="text-lg sm:text-xl font-black text-[#2C3947] tracking-tight">OneProfile</span>
                    </div>
                </div>

                {/* Progress Steps */}
                <div className="flex items-center justify-between mb-8 sm:mb-12">
                    {steps.map((step, index) => (
                        <div key={step.id} className="flex items-center flex-1">
                            <div className="flex flex-col items-center flex-1">
                                <div
                                    className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 transition-all ${index < currentStepIndex
                                        ? "bg-[#2C3947] border-[#2C3947] text-[#FEF9C3]"
                                        : index === currentStepIndex
                                            ? "border-[#2C3947] text-[#2C3947] bg-[#FEF9C3]/55 font-bold"
                                            : "border-[#2C3947]/20 text-[#2C3947]/40"
                                        }`}
                                >
                                    {index < currentStepIndex ? (
                                        <Check className="h-4 w-4 sm:h-5 sm:w-5" />
                                    ) : (
                                        <span className="text-sm sm:text-base font-bold">{step.number}</span>
                                    )}
                                </div>
                                <span
                                    className={`mt-1.5 sm:mt-2 text-[10px] sm:text-xs font-bold ${index <= currentStepIndex ? "text-[#2C3947]" : "text-[#2C3947]/40"
                                        }`}
                                >
                                    {step.label}
                                </span>
                            </div>
                            {index < steps.length - 1 && (
                                <div
                                    className={`h-0.5 flex-1 mx-1 sm:mx-2 transition-all ${index < currentStepIndex ? "bg-[#2C3947]" : "bg-[#2C3947]/10"
                                        }`}
                                />
                            )}
                        </div>
                    ))}
                </div>

                {/* Step Content */}
                <div className="bg-white border-2 border-[#2C3947] shadow-[6px_6px_0px_0px_rgba(44,57,71,1)] rounded-2xl p-4 sm:p-6 md:p-8">
                    {currentStep === "username" && (
                        <UsernameStep
                            username={username}
                            setUsername={(value) => {
                                 setUsername(value);
                                 // Reset validation state when username changes
                                 setIsUsernameAvailable(null);
                            }}
                            isUsernameAvailable={isUsernameAvailable}
                            isCheckingUsername={isCheckingUsername}
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
                            onContinue={() => setCurrentStep("theme")}
                            onBack={() => setCurrentStep("profile")}
                        />
                    )}

                    {currentStep === "theme" && (
                        <ThemeStep
                            selectedTheme={theme}
                            setSelectedTheme={setTheme}
                            onContinue={() => setCurrentStep("preview")}
                            onBack={() => setCurrentStep("links")}
                        />
                    )}

                    {currentStep === "preview" && (
                        <PreviewStep
                            username={username}
                            profilePicture={profilePicture}
                            displayName={displayName}
                            bio={bio}
                            links={links}
                            theme={theme}
                            onFinish={handleFinish}
                            onBack={() => setCurrentStep("theme")}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
