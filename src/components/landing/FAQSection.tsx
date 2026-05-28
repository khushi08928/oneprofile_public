import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

interface FAQ {
    question: string;
    answer: string;
}

export function FAQSection() {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const faqs: FAQ[] = [
        {
            question: "Is OneProfile really free to use?",
            answer: "Yes! OneProfile is completely free and open-source. You can create your profile page, link your social channels, add unlimited custom bookmarks, and share it with your audience without any subscriptions or hidden fees.",
        },
        {
            question: "How do I claim my custom handle?",
            answer: "Claiming your handle is simple. Type your preferred username in the claim bar at the top of the page, click 'Claim Yours', and complete our quick onboarding process to register it instantly.",
        },
        {
            question: "Is there a limit to how many links I can add?",
            answer: "No, there are absolutely no limits. You can link your YouTube channel, Instagram, Twitter, GitHub repositories, online courses, portfolios, products, or custom payment widgets all in one profile.",
        },
        {
            question: "Do I get access to profile analytics?",
            answer: "Yes! Every user profile features real-time visitor tracking. From your creator dashboard, you can monitor total page views, link click events, and compute click-through-rates (CTR) to understand audience engagement.",
        },
        {
            question: "Can I choose my own colors and themes?",
            answer: "Absolutely! We provide a variety of curated, professionally-designed presets (including Minimal Dark, Neo-Brutalism, and Aurora Glass). You can swap themes instantly from your dashboard as your brand evolves.",
        },
    ];

    const toggleFAQ = (index: number) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    const containerVariants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: "easeOut",
            },
        },
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false, amount: 0.15 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto space-y-12 font-sans py-4"
        >
            {/* Header */}
            <div className="text-center space-y-4">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.15 }}
                    className="text-4xl sm:text-6xl font-display font-black tracking-tight text-white leading-tight"
                >
                    Questions? <span className="text-[#FEF9C3]">Answered.</span>
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: false, amount: 0.15 }}
                    transition={{ delay: 0.1 }}
                    className="text-sm sm:text-base text-[#FEF9C3]/75 font-semibold max-w-lg mx-auto"
                >
                    Everything you need to know about setting up and running your OneProfile hub.
                </motion.p>
            </div>

            {/* Accordion Stack */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.15 }}
                className="space-y-4"
            >
                {faqs.map((faq, index) => {
                    const isOpen = activeIndex === index;
                    return (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            className="bg-[#212B36]/60 border border-[#2C3947]/30 hover:border-[#FEF9C3]/40 hover:bg-[#212B36]/85 rounded-2xl overflow-hidden transition-all duration-300 shadow-sm"
                        >
                            <button
                                onClick={() => toggleFAQ(index)}
                                className="w-full flex items-center justify-between text-left px-6 py-5 focus:outline-none select-none"
                            >
                                <span className="text-base font-black text-white hover:text-[#FEF9C3] pr-4 transition-colors duration-200">
                                    {faq.question}
                                </span>
                                <div className="h-8 w-8 rounded-full border border-[#43556B]/40 bg-[#2C3947] flex items-center justify-center flex-shrink-0 transition-transform duration-200 shadow-sm">
                                    {isOpen ? (
                                        <Minus className="h-4 w-4 text-[#FEF9C3]" />
                                    ) : (
                                        <Plus className="h-4 w-4 text-[#FEF9C3]/80" />
                                    )}
                                </div>
                            </button>

                            <AnimatePresence initial={false}>
                                {isOpen && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.25, ease: "easeInOut" }}
                                    >
                                        <div className="px-6 pb-6 text-sm text-slate-100 leading-relaxed font-semibold">
                                            {faq.answer}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    );
                })}
            </motion.div>
        </motion.div>
    );
}
