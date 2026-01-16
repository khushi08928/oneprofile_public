import { motion } from "framer-motion";
import { useState } from "react";

interface StepCardProps {
    title: string;
    description: string;
    delay: number;
}

export function StepCard({ title, description, delay }: StepCardProps) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay }}
            whileHover={{ y: -5 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="relative space-y-4 group cursor-pointer"
        >
            <div className="space-y-2">
                <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">{title}</h3>
                <p className="text-muted-foreground leading-relaxed">{description}</p>
            </div>

            {/* Progress line - only shows on hover */}
            {isHovered && (
                <motion.div
                    className="absolute -bottom-4 left-0 h-1 bg-primary rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    exit={{ width: 0 }}
                    transition={{ duration: 0.3 }}
                />
            )}
        </motion.div>
    );
}
