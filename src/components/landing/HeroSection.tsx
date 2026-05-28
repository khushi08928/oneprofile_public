import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Link2 } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "@/lib/axios";
import { themes } from "@/lib/themes";

export function HeroSection() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [themeIndex, setThemeIndex] = useState(0);
    const [isMobile, setIsMobile] = useState(false);
    const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
    const [isChecking, setIsChecking] = useState(false);

    // Dynamic checks for screen width to handle mobile layout safely
    useEffect(() => {
        setIsMobile(window.innerWidth < 640);
        const handleResize = () => {
            setIsMobile(window.innerWidth < 640);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Auto-rotate themes in the mockup preview every 3 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setThemeIndex((prev) => (prev + 1) % themes.length);
        }, 3500);
        return () => clearInterval(interval);
    }, []);

    // Check username availability as the user types
    useEffect(() => {
        if (username.length < 3) {
            setIsAvailable(null);
            setIsChecking(false);
            return;
        }

        setIsChecking(true);
        const delayDebounceFn = setTimeout(async () => {
            try {
                const response = await axios.get(`/api/profile/check-username/${username}`);
                setIsAvailable(response.data.available);
            } catch (err) {
                setIsAvailable(null);
            } finally {
                setIsChecking(false);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [username]);

    const activeTheme = themes[themeIndex];

    const handleClaim = (e: React.FormEvent) => {
        e.preventDefault();
        const cleanUsername = username.toLowerCase().replace(/[^a-z0-9_-]/g, "");
        if (!cleanUsername || cleanUsername.length < 3 || isAvailable === false) return;

        // Store the claimed username so the signup & onboarding flow pre-fills it automatically
        sessionStorage.setItem("claimed_username", cleanUsername);
        
        // Redirect to signup
        navigate({ to: "/signup" as any });
    };

    const containerVariants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.12,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 80,
                damping: 15,
            },
        },
    };

    return (
        <div className="grid lg:grid-cols-12 gap-12 items-center mb-12 pt-4 font-sans w-full overflow-hidden">
            {/* Left Column: Headline and Call-To-Action */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="lg:col-span-7 text-left space-y-8 w-full min-w-0"
            >
                <motion.div
                    variants={itemVariants}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#2C3947]/10 border border-[#2C3947]/20 text-xs font-bold text-[#2C3947] backdrop-blur-sm cursor-default max-w-full"
                >
                    <span className="relative flex h-2 w-2 flex-shrink-0">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2C3947] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2C3947]"></span>
                    </span>
                    <span className="truncate">OneProfile: Everything you are</span>
                </motion.div>

                <div className="space-y-4">
                    <motion.h1
                        variants={itemVariants}
                        className="text-2xl sm:text-5xl lg:text-7xl font-display font-black tracking-tight text-[#2C3947] leading-[1.1] break-words"
                    >
                        Everything you are.{" "}
                        <br className="hidden sm:inline" />
                        <span className="text-[#2C3947]">
                            In one simple link.
                        </span>
                    </motion.h1>

                    <motion.p
                        variants={itemVariants}
                        className="text-sm sm:text-base text-slate-700 max-w-xl leading-relaxed font-semibold"
                    >
                        Join creators, builders, and brands worldwide. Share your projects, socials, and work in seconds with a beautiful, high-converting bio link.
                    </motion.p>
                </div>

                {/* Claim Username Input Bar */}
                <motion.div variants={itemVariants} className="space-y-3 max-w-xl">
                    <form
                        onSubmit={handleClaim}
                        className="w-full p-1.5 bg-white border-2 border-[#2C3947] rounded-2xl sm:rounded-full shadow-[4px_4px_0px_0px_rgba(44,57,71,1)] flex flex-col sm:flex-row items-stretch sm:items-center gap-2 focus-within:shadow-[2px_2px_0px_0px_rgba(44,57,71,1)] focus-within:translate-x-[2px] focus-within:translate-y-[2px] transition-all duration-300"
                    >
                        <div className="flex items-center pl-3 py-2 sm:py-0 text-xs sm:text-sm font-bold text-[#2C3947]/60 select-none flex-1 min-w-0 overflow-hidden">
                            <Link2 className="h-4 w-4 mr-1 text-[#2C3947]/50 flex-shrink-0" />
                            <span className="text-[10px] sm:text-xs md:text-sm truncate text-[#2C3947]/50 max-w-[130px] sm:max-w-[220px] md:max-w-none">oneprofile.madebykhushi.dev/</span>
                            <input
                                type="text"
                                placeholder="yourname"
                                value={username}
                                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))}
                                className="ml-0.5 flex-1 bg-transparent border-0 outline-none p-0 text-xs sm:text-sm font-bold text-[#2C3947] placeholder:text-[#2C3947]/30 focus:ring-0 focus:outline-none min-w-[80px]"
                            />
                            {username.length >= 3 && (
                                <div className="flex items-center gap-1.5 mr-2 shrink-0 select-none">
                                    {isChecking ? (
                                        <span className="h-2.5 w-2.5 rounded-full bg-amber-500 animate-pulse" />
                                    ) : isAvailable ? (
                                        <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" title="Available" />
                                    ) : (
                                        <span className="h-2.5 w-2.5 rounded-full bg-rose-500" title="Taken" />
                                    )}
                                </div>
                            )}
                        </div>
                        <Button
                            type="submit"
                            disabled={username.length < 3 || isAvailable === false || isChecking}
                            className="rounded-xl sm:rounded-full bg-[#2C3947] hover:bg-[#212B36] text-[#FEF9C3] font-black px-6 py-2.5 h-10 shadow-sm transition-all flex items-center justify-center gap-1.5 border border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span>Claim Yours</span>
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    </form>
                    
                    {/* Username Check Feedback */}
                    <div className="h-5 pl-4 text-xs font-bold font-mono transition-all duration-200">
                        {username.length > 0 && username.length < 3 && (
                            <span className="text-slate-500">Username must be at least 3 characters.</span>
                        )}
                        {username.length >= 3 && (
                            <>
                                {isChecking && <span className="text-[#2C3947]/60 animate-pulse">Checking availability...</span>}
                                {!isChecking && isAvailable === true && (
                                    <span className="text-emerald-600">oneprofile.madebykhushi.dev/{username} is available!</span>
                                )}
                                {!isChecking && isAvailable === false && (
                                    <span className="text-rose-600">Username is already taken.</span>
                                )}
                            </>
                        )}
                    </div>
                </motion.div>
            </motion.div>

            {/* Right Column: Premium Rotating Mockup Showcase */}
            <div className="lg:col-span-5 flex justify-center items-center relative">
                {/* Decorative background glow */}
                <div className="absolute w-72 h-72 rounded-full bg-emerald-500/5 blur-[80px] -z-10 animate-pulse" />
                <div className="absolute w-60 h-60 rounded-full bg-indigo-500/5 blur-[80px] -z-10 translate-x-12 translate-y-12" />

                <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 50, rotate: 2 }}
                    animate={{ opacity: 1, scale: 1, y: 0, rotate: isMobile ? 0 : -2 }}
                    transition={{
                        type: "spring",
                        stiffness: 60,
                        damping: 15,
                        delay: 0.35,
                    }}
                    className="relative w-[260px] h-[480px] sm:w-[280px] sm:h-[520px] border-[8px] border-slate-900 rounded-[38px] bg-slate-950 overflow-hidden shadow-2xl flex flex-col ring-4 ring-slate-950/10 hover:rotate-0 transition-all duration-500"
                >
                    {/* Notch */}
                    <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-24 h-4 bg-slate-900 rounded-full z-20 flex items-center justify-center">
                        <div className="w-2.5 h-2.5 rounded-full bg-slate-950/80 absolute left-3" />
                        <div className="w-8 h-0.5 bg-slate-950/80 rounded-full" />
                    </div>

                    {/* Content Area with Shifting Theme */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTheme.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.4 }}
                            className={`w-full h-full flex flex-col items-center px-4 pt-12 pb-6 overflow-hidden ${activeTheme.backgroundClass}`}
                        >
                            {/* Avatar */}
                            <div className="w-14 h-14 rounded-full flex items-center justify-center bg-primary text-primary-foreground font-bold text-base shadow-sm border-2 border-white/20 mb-3 mt-1">
                                OP
                            </div>

                            {/* Info */}
                            <h3 className={`text-xs font-bold text-center truncate w-full ${activeTheme.titleClass}`}>
                                @alex_creator
                            </h3>
                            <p className={`text-[9px] text-center max-w-[180px] mb-4 leading-normal ${activeTheme.bioClass}`}>
                                Designing premium digital experiences.
                            </p>

                            {/* Links Stack */}
                            <div className="w-full space-y-1.5 mb-4">
                                <div className={`w-full py-2 px-3 rounded-lg flex items-center justify-between text-[10px] font-semibold border border-transparent shadow-sm ${activeTheme.buttonClass}`}>
                                    <span>My Portfolio 🚀</span>
                                </div>
                                <div className={`w-full py-2 px-3 rounded-lg flex items-center justify-between text-[10px] font-semibold border border-transparent shadow-sm ${activeTheme.buttonClass}`}>
                                    <span>Latest Project Case Study</span>
                                </div>
                                <div className={`w-full py-2 px-3 rounded-lg flex items-center justify-between text-[10px] font-semibold border border-transparent shadow-sm ${activeTheme.buttonClass}`}>
                                    <span>Substack Newsletter</span>
                                </div>
                            </div>

                            {/* Project Section Preview */}
                            <div className="w-full space-y-2 text-left">
                                <span className={`text-[8px] font-bold uppercase tracking-wider ${activeTheme.bioClass}`}>
                                    Featured Projects
                                </span>
                                <div className={`p-2.5 rounded-lg w-full ${activeTheme.cardClass}`}>
                                    <h4 className={`text-[9px] font-bold mb-0.5 truncate ${activeTheme.titleClass}`}>
                                        VibeScript IDE
                                    </h4>
                                    <p className={`text-[8px] leading-snug ${activeTheme.textClass}`}>
                                        An AI-powered workspace compiler.
                                    </p>
                                </div>
                            </div>

                            {/* Watermark */}
                            <div className="mt-auto pt-2">
                                <span className={`text-[7px] font-semibold tracking-widest uppercase opacity-45`}>
                                    OneProfile
                                </span>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    );
}
