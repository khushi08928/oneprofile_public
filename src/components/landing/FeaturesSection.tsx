import { motion } from "framer-motion";
import { ArrowUpRight, BarChart3, Link2, Palette, Users } from "lucide-react";

export function FeaturesSection() {
    return (
        <div className="space-y-6 mt-6 mb-12">
            <div className="text-center max-w-xl mx-auto space-y-3 mb-12">
                <h2 className="text-3.5xl sm:text-5xl font-display font-black tracking-tight text-[#2C3947]">
                    Everything you need in one place.
                </h2>
                <p className="text-sm sm:text-base text-slate-600 font-bold">
                    Powering creators with premium visual customization and live analytics.
                </p>
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="grid lg:grid-cols-3 gap-6"
            >
                {/* Bento Card 1: Link Management (Spans 2 columns) - Sage Green */}
                <div className="lg:col-span-2 group relative overflow-hidden rounded-3xl border-2 border-[#2C3947]/20 bg-[#F0F4F6] p-8 hover:border-[#2C3947]/40 hover:shadow-lg transition-all duration-300 flex flex-col justify-between min-h-[320px]">
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
                </div>

                {/* Bento Card 2: Custom Profile (Spans 1 column) - Soft Lavender */}
                <div className="lg:col-span-1 group relative overflow-hidden rounded-3xl border-2 border-purple-950/20 bg-[#F3E5F5] p-8 hover:border-purple-950/40 hover:shadow-lg transition-all duration-300 flex flex-col justify-between min-h-[320px]">
                    <div className="space-y-2">
                        <div className="h-10 w-10 rounded-xl bg-[#4a1c5c] text-[#F3E5F5] flex items-center justify-center mb-2 shadow-sm">
                            <Users className="h-5 w-5" />
                        </div>
                        <h3 className="text-2xl font-display font-black text-[#4a1c5c]">
                            Claim Your Handles
                        </h3>
                        <p className="text-sm text-[#5c2a70] leading-relaxed font-semibold">
                            Own your unique subdomain handle and establish a unified personal brand across networks.
                        </p>
                    </div>
                    <div className="mt-4 flex items-center gap-2 px-4 py-3 rounded-xl bg-[#4a1c5c] border border-purple-950/30 font-mono text-xs text-[#F3E5F5] select-none shadow-md">
                        <span className="font-bold">oneprofile.madebykhushi.dev/yourname</span>
                        <ArrowUpRight className="h-3 w-3 ml-auto opacity-80 group-hover:scale-125 transition-transform" />
                    </div>
                </div>

                {/* Bento Card 3: Visual Theme Engine (Spans 1 column) - Brutalism Yellow (Screenshot color!) */}
                <div className="lg:col-span-1 group relative overflow-hidden rounded-3xl border-2 border-yellow-950/20 bg-[#FEF9C3] p-8 hover:border-yellow-950/40 hover:shadow-lg transition-all duration-300 flex flex-col justify-between min-h-[320px]">
                    <div className="space-y-2">
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
                    <div className="mt-4 flex gap-2.5 bg-white/60 p-2.5 rounded-xl border border-yellow-950/10 w-fit">
                        <div className="h-6 w-6 rounded-full bg-gradient-to-br from-rose-500 to-purple-600 shadow-sm border border-white/20" />
                        <div className="h-6 w-6 rounded-full bg-emerald-950 shadow-sm border border-white/20" />
                        <div className="h-6 w-6 rounded-full bg-[#fef9c3] shadow-sm border border-black/40" />
                        <div className="h-6 w-6 rounded-full bg-[#0B1528] shadow-sm border border-white/20" />
                    </div>
                </div>

                {/* Bento Card 4: Click Analytics (Spans 2 columns) - Sky Blue */}
                <div className="lg:col-span-2 group relative overflow-hidden rounded-3xl border-2 border-sky-950/20 bg-[#E1F5FE] p-8 hover:border-sky-950/40 hover:shadow-lg transition-all duration-300 flex flex-col justify-between min-h-[320px]">
                    <div className="flex justify-between items-start gap-4">
                        <div className="space-y-2 max-w-md">
                            <div className="h-10 w-10 rounded-xl bg-[#0a3f5c] text-[#E1F5FE] flex items-center justify-center mb-2 shadow-sm">
                                <BarChart3 className="h-5 w-5" />
                            </div>
                            <h3 className="text-2xl font-display font-black text-[#0a3f5c]">
                                Real-Time Analytics
                            </h3>
                            <p className="text-sm text-[#1e587a] leading-relaxed font-semibold">
                                Track total profile views, button clicks, and monitor click-through-rates (CTR) over time to measure link engagement.
                            </p>
                        </div>
                    </div>
                    {/* Mock chart layout */}
                    <div className="mt-6 flex items-end gap-2 h-18 w-full max-w-[240px] border-b border-sky-950/20 pb-1.5 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                        <div className="flex-1 bg-[#0a3f5c]/20 h-6 rounded-t" />
                        <div className="flex-1 bg-[#0a3f5c]/35 h-10 rounded-t" />
                        <div className="flex-1 bg-[#0a3f5c]/50 h-8 rounded-t" />
                        <div className="flex-1 bg-[#0a3f5c]/70 h-12 rounded-t" />
                        <div className="flex-1 bg-[#0a3f5c] h-16 rounded-t shadow-sm" />
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
