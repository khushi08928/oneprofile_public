import { Accordion } from "@/components/ui/accordion";
import { motion } from "framer-motion";
import { FAQItem } from "./FAQItem";

export function FAQSection() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-32 max-w-3xl mx-auto"
        >
            <div className="text-center space-y-4 mb-12">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-3xl sm:text-4xl font-bold tracking-tight"
                >
                    Frequently Asked Questions
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-lg text-muted-foreground"
                >
                    Everything you need to know about OneProfile
                </motion.p>
            </div>

            <Accordion type="single" collapsible className="w-full space-y-4">
                <FAQItem
                    value="item-1"
                    question="Is OneProfile really free?"
                    answer="Yes! OneProfile is completely free and open-source. You can create your profile, add unlimited links, and share it with anyone without any cost."
                />
                <FAQItem
                    value="item-2"
                    question="Can I customize my profile URL?"
                    answer="Absolutely! When you sign up, you choose your unique username which becomes your profile URL."
                />
                <FAQItem
                    value="item-3"
                    question="How many links can I add?"
                    answer="There's no limit! Add as many links as you need - social media profiles, projects, portfolio, blog posts, or anything else you want to share."
                />
                <FAQItem
                    value="item-4"
                    question="Is my data secure?"
                    answer="Yes! We take security seriously. Your data is encrypted, and we follow industry best practices to keep your information safe. Plus, being open-source means our code is transparent and auditable."
                />
                <FAQItem
                    value="item-5"
                    question="Can I see other people's profiles?"
                    answer="Yes! You can visit any profile by going to https://oneprofile-seven.vercel.app/username to get inspiration and discover interesting people."
                />
            </Accordion>
        </motion.div>
    );
}
