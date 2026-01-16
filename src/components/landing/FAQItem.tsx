import {
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";

interface FAQItemProps {
    value: string;
    question: string;
    answer: string;
}

export function FAQItem({ value, question, answer }: FAQItemProps) {
    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
        >
            <AccordionItem
                value={value}
                className="border border-border/50 rounded-lg bg-card/50 overflow-hidden hover:border-border transition-colors"
            >
                <AccordionTrigger className="hover:no-underline text-foreground px-6 py-5 [&[data-state=open]]:pb-3 hover:bg-card/80 transition-colors">
                    <span className="text-left font-semibold">{question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-foreground/80 px-6 pb-5 pt-2">
                    {answer}
                </AccordionContent>
            </AccordionItem>
        </motion.div>
    );
}
