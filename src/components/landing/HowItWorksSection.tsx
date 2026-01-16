import { motion } from "framer-motion";
import { StepCard } from "./StepCard";

export function HowItWorksSection() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-32 space-y-12"
        >
            <div className="text-center space-y-4">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-3xl sm:text-4xl font-bold tracking-tight"
                >
                    How it works
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-lg text-muted-foreground"
                >
                    Four simple steps to get started
                </motion.p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
                <StepCard
                    title="Choose your username"
                    description="Pick a unique username that becomes your personal OneProfile URL."
                    delay={0}
                />
                <StepCard
                    title="Complete your profile"
                    description="Add your display name and bio to personalize your page."
                    delay={0.1}
                />
                <StepCard
                    title="Add your links"
                    description="Connect all your social media, projects, and important links."
                    delay={0.2}
                />
                <StepCard
                    title="Preview & launch"
                    description="Review your profile and share your unique link with the world."
                    delay={0.3}
                />
            </div>
        </motion.div>
    );
}
