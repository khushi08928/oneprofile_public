import { motion } from "framer-motion";

export function LandingFooter() {
    return (
        <footer className="border-t border-border/40 py-12 px-4 sm:px-6 lg:px-8">
            <div className="container mx-auto max-w-6xl">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="flex flex-col md:flex-row justify-between items-center gap-4"
                >
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center space-x-2"
                    >
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                            <span className="text-lg font-bold">O</span>
                        </div>
                        <span className="text-xl font-semibold tracking-tight">OneProfile</span>
                    </motion.div>
                    <p className="text-sm text-muted-foreground">
                        The open-source link in bio tool.
                    </p>
                </motion.div>
            </div>
        </footer>
    );
}
