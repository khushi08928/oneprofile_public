import { motion } from "framer-motion";
import { UserCheck, Smile, Link, Rocket } from "lucide-react";

export function HowItWorksSection() {
    const steps = [
        {
            number: "01",
            title: "Choose your username",
            description: "Pick a unique handle that becomes your personal OneProfile URL in one click.",
            icon: <UserCheck className="h-5 w-5 text-emerald-600" />,
            color: "from-emerald-500 to-teal-500",
            hoverShadow: "hover:shadow-emerald-500/10 hover:border-emerald-300",
            iconBg: "bg-emerald-50 border-emerald-100",
        },
        {
            number: "02",
            title: "Complete your profile",
            description: "Add a display name, description, and choose from beautiful curated themes.",
            icon: <Smile className="h-5 w-5 text-indigo-600" />,
            color: "from-indigo-500 to-purple-500",
            hoverShadow: "hover:shadow-indigo-500/10 hover:border-indigo-300",
            iconBg: "bg-indigo-50 border-indigo-100",
        },
        {
            number: "03",
            title: "Add your links",
            description: "Connect all your social profiles, links, projects, and custom bookmarks instantly.",
            icon: <Link className="h-5 w-5 text-pink-600" />,
            color: "from-pink-500 to-rose-500",
            hoverShadow: "hover:shadow-pink-500/10 hover:border-pink-300",
            iconBg: "bg-pink-50 border-pink-100",
        },
        {
            number: "04",
            title: "Preview & launch",
            description: "Review your live mobile preview, share your link, and track visitor analytics.",
            icon: <Rocket className="h-5 w-5 text-amber-600" />,
            color: "from-amber-500 to-orange-500",
            hoverShadow: "hover:shadow-amber-500/10 hover:border-amber-300",
            iconBg: "bg-amber-50 border-amber-100",
        },
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-16 font-sans py-4"
        >
            {/* Header */}
            <div className="text-center space-y-4 max-w-2xl mx-auto">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-3.5xl sm:text-5xl font-display font-black tracking-tight text-[#2C3947] leading-[1.15]"
                >
                    Create and share your link in minutes.
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-sm sm:text-base text-slate-700 font-bold"
                >
                    Four simple steps to launch your consolidated profile dashboard.
                </motion.p>
            </div>

            {/* Grid Container */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
                {/* Decorative Connecting line */}
                <div className="hidden lg:block absolute top-[52px] left-[12%] right-[12%] h-[2px] bg-slate-300/40 -z-10 border-dashed border-t" />

                {steps.map((step, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: idx * 0.1 }}
                        whileHover={{ y: -8 }}
                        className={`relative group bg-white/95 border border-slate-200/70 p-7 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between overflow-hidden ${step.hoverShadow}`}
                    >
                        {/* Custom radial accent background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                        {/* Top: Icon and Step Badge */}
                        <div className="flex items-center justify-between mb-8">
                            <div className={`h-11 w-11 rounded-xl border flex items-center justify-center shadow-sm ${step.iconBg}`}>
                                {step.icon}
                            </div>
                            <span className="text-sm font-extrabold tracking-wider bg-slate-100 text-slate-800 px-3 py-1 rounded-full shadow-inner select-none">
                                Step {step.number}
                            </span>
                        </div>

                        {/* Description */}
                        <div className="space-y-2 mt-auto">
                            <h3 className="text-lg font-black text-slate-800 group-hover:text-[#2C3947] transition-colors">
                                {step.title}
                            </h3>
                            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-semibold">
                                {step.description}
                            </p>
                        </div>

                        {/* Hover bottom colored border strip */}
                        <div className={`absolute bottom-0 left-0 right-0 h-[4px] bg-gradient-to-r ${step.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`} />
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}
