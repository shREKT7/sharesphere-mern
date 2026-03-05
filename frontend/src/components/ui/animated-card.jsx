"use client"

import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

export function AnimatedCard({ className, children, delay = 0 }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay }}
            whileHover={{ y: -5, scale: 1.02 }}
            className={cn(
                "group relative overflow-hidden rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm transition-all",
                className
            )}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-neutral-100 to-transparent dark:from-neutral-800/50 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10 w-full h-full flex flex-col">
                {children}
            </div>
        </motion.div>
    )
}
