import { motion } from "framer-motion";
import { Link2, Share, Users } from "lucide-react";
import { FeatureCard } from "./FeatureCard";

export function FeaturesSection() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-32"
        >
            <FeatureCard
                icon={<Link2 className="h-6 w-6" />}
                title="Link Management"
                description="Add, edit, and organize your links effortlessly. Keep your audience directed to what matters most."
                delay={0}
            />
            <FeatureCard
                icon={<Users className="h-6 w-6" />}
                title="Custom Profile"
                description="Claim your unique username and personalize your profile with a custom bio."
                delay={0.1}
            />
            <FeatureCard
                icon={<Share className="h-6 w-6" />}
                title="Share Everywhere"
                description="Share your unique profile link across all platforms and reach your audience anywhere."
                delay={0.3}
            />
        </motion.div>
    );
}
