import { AddLink } from "@/components/profile/AddLink";
import { AddProject } from "@/components/profile/AddProject";
import { ProfileInfo } from "@/components/profile/ProfileInfo";
import { motion } from "framer-motion";
import { Settings2 } from "lucide-react";

export default function Profile() {
    return (
        <div className="space-y-6 sm:space-y-8 pb-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2.5">
                    <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Settings2 className="h-5 w-5 text-primary" />
                    </div>
                    Profile
                </h1>
                <p className="text-sm text-muted-foreground mt-1.5">
                    Update your info, links, and projects — all in one place
                </p>
            </motion.div>

            {/* Profile Info */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.1 }}
            >
                <ProfileInfo />
            </motion.div>

            {/* Add Link & Project Grid */}
            <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: 0.2 }}
                >
                    <AddLink />
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: 0.28 }}
                >
                    <AddProject />
                </motion.div>
            </div>
        </div>
    );
}
