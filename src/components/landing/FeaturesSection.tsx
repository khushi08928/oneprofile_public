import { motion } from "framer-motion";
import { ArrowUpRight, Link2, Palette, Users } from "lucide-react";

export function FeaturesSection() {
    const containerVariants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.15,
            },
        },
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 40 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut",
            },
        },
    };

    return (
        <div className="space-y-6 mt-6 mb-12">
            <div className="text-center max-w-xl mx-auto space-y-3 mb-12 font-sans">
                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                    className="text-3.5xl sm:text-5xl font-display font-black tracking-tight text-[#2C3947]"
                >
                    Everything you need in one place.
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="text-sm sm:text-base text-slate-600 font-bold"
                >
                    Powering creators with premium visual customization.
                </motion.p>
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.15 }}
                className="grid lg:grid-cols-3 gap-6"
            >
                {/* Bento Card 1: Link Management (Spans 2 columns) - Sage Green */}
                <motion.div
                    variants={cardVariants}
                    className="lg:col-span-2 group relative overflow-hidden rounded-3xl border-2 border-[#2C3947]/20 bg-[#F0F4F6] p-8 hover:border-[#2C3947]/40 hover:shadow-lg transition-all duration-300 flex flex-col justify-between min-h-[320px] font-sans"
                >
                    <div className="flex justify-between items-start gap-4">
                        <div className="space-y-2 max-w-md">
                            <div className="h-10 w-10 rounded-xl bg-[#2C3947] text-[#FEF9C3] flex items-center justify-center mb-2 shadow-sm">
                                <Link2 className="h-5 w-5" />
                            </div>
                            <h3 className="text-2xl font-display font-black text-[#2C3947]">
                                Premium Link Management
                            </h3>
                            <p className="text-sm text-[#2C3947]/95 leading-relaxed font-semibold">
                                Share videos, portfolios, social networks, and products. Clean layouts that guide your audience straight to what matters most.
                            </p>
                        </div>
                    </div>
                    {/* Visual mockup representation */}
                    <div className="mt-6 p-4 rounded-xl bg-white border border-[#2C3947]/10 flex flex-col gap-2 shadow-sm translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                        <div className="h-9 rounded-lg bg-[#FEF9C3]/40 border border-[#2C3947]/15 flex items-center justify-between px-4 text-xs font-bold text-[#2C3947]">
                            <span>Portfolio & Works 🚀</span>
                            <span className="text-[10px] uppercase tracking-wider bg-[#2C3947] text-white px-2 py-0.5 rounded font-black">Active</span>
                        </div>
                        <div className="h-9 rounded-lg bg-slate-50 border border-slate-900/5 flex items-center px-4 text-xs font-bold text-slate-700">
                            Latest GitHub Repositories
                        </div>
                    </div>
                </motion.div>

                {/* Bento Card 2: Custom Profile (Spans 1 column) - Soft Lavender */}
                <motion.div
                    variants={cardVariants}
                    className="lg:col-span-1 group relative overflow-hidden rounded-3xl border-2 border-purple-950/20 bg-[#F3E5F5] p-8 hover:border-purple-950/40 hover:shadow-lg transition-all duration-300 flex flex-col justify-between min-h-[320px] font-sans"
                >
                    <div className="space-y-2">
                        <div className="h-10 w-10 rounded-xl bg-[#4a1c5c] text-[#F3E5F5] flex items-center justify-center mb-2 shadow-sm">
                            <Users className="h-5 w-5" />
                        </div>
                        <h3 className="text-2xl font-display font-black text-[#4a1c5c]">
                            Claim Your Handles
                        </h3>
                        <p className="text-sm text-[#5c2a70] leading-relaxed font-semibold">
                            Own your unique URL handle and establish a unified personal brand across networks.
                        </p>
                    </div>
                    <div className="mt-4 flex items-center gap-2 px-4 py-3 rounded-xl bg-[#4a1c5c] border border-purple-950/30 font-mono text-xs text-[#F3E5F5] select-none shadow-md">
                        <span className="font-bold">oneprofile.madebykhushi.dev/yourname</span>
                        <ArrowUpRight className="h-3 w-3 ml-auto opacity-80 group-hover:scale-125 transition-transform" />
                    </div>
                </motion.div>

                {/* Bento Card 3: Visual Theme Engine (Spans 3 columns to complete the layout) - Brutalism Yellow */}
                <motion.div
                    variants={cardVariants}
                    className="lg:col-span-3 group relative overflow-hidden rounded-3xl border-2 border-yellow-950/20 bg-[#FEF9C3] p-8 hover:border-yellow-950/40 hover:shadow-lg transition-all duration-300 flex flex-col sm:flex-row justify-between items-start sm:items-center min-h-[320px] lg:min-h-[220px] font-sans"
                >
                    <div className="space-y-2 max-w-xl">
                        <div className="h-10 w-10 rounded-xl bg-slate-900 text-[#FEF9C3] flex items-center justify-center mb-2 shadow-sm">
                            <Palette className="h-5 w-5" />
                        </div>
                        <h3 className="text-2xl font-display font-black text-[#3e3b12]">
                            Theme Customization
                        </h3>
                        <p className="text-sm text-[#5e5924] leading-relaxed font-semibold">
                            Choose from gorgeous custom styles: Neo-Brutalism, glassmorphic mesh, or minimal clean.
                        </p>
                    </div>
                    {/* Theme color bubbles */}
                    <div className="mt-4 sm:mt-0 flex gap-2.5 bg-white/60 p-2.5 rounded-xl border border-yellow-950/10 w-fit">
                        <div className="h-6 w-6 rounded-full bg-gradient-to-br from-rose-500 to-purple-600 shadow-sm border border-white/20" />
                        <div className="h-6 w-6 rounded-full bg-emerald-950 shadow-sm border border-white/20" />
                        <div className="h-6 w-6 rounded-full bg-[#fef9c3] shadow-sm border border-black/40" />
                        <div className="h-6 w-6 rounded-full bg-[#0B1528] shadow-sm border border-white/20" />
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}
