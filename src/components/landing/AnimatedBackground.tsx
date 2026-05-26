import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function AnimatedBackground() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };

        const handleScroll = () => {
            setScrollY(window.scrollY);
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
            {/* Emerald/Teal Blob */}
            <motion.div
                className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-400/20 rounded-full blur-3xl"
                animate={{
                    x: mousePosition.x * 0.03,
                    y: mousePosition.y * 0.03 + scrollY * 0.08,
                    scale: [1, 1.15, 1],
                }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
            {/* Amber/Peach Blob */}
            <motion.div
                className="absolute top-[40%] right-[-10%] w-[600px] h-[600px] bg-amber-200/30 rounded-full blur-3xl"
                animate={{
                    x: -mousePosition.x * 0.02,
                    y: -mousePosition.y * 0.02 + scrollY * 0.05,
                    scale: [1, 1.25, 1],
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            {/* Rose/Pink Blob */}
            <motion.div
                className="absolute bottom-[-10%] left-[10%] w-[500px] h-[500px] bg-rose-300/20 rounded-full blur-3xl"
                animate={{
                    x: mousePosition.x * 0.015,
                    y: mousePosition.y * 0.015 - scrollY * 0.06,
                    scale: [1, 1.1, 1],
                }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            />
        </div>
    );
}
