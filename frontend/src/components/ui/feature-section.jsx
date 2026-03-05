"use client"

import { motion } from "framer-motion"
import { ShieldCheck, Recycle, Users } from "lucide-react"

const features = [
    {
        title: "Community Resource Sharing",
        description: "Connect with people in your local area. Build trust and strengthen community bonds through mutual sharing and responsible borrowing.",
        icon: <Users className="h-6 w-6" />,
    },
    {
        title: "Borrow Instead of Buying",
        description: "Don't buy tools or equipment you only need once. Borrow from your neighbors and save money while reducing clutter in your home.",
        icon: <ShieldCheck className="h-6 w-6" />,
    },
    {
        title: "Sustainable Living",
        description: "Reduce the environmental impact of consumerism. Promote circular economy and lower your carbon footprint with collaborative consumption.",
        icon: <Recycle className="h-6 w-6" />,
    },
]

export function FeatureSection() {
    return (
        <section className="py-24 bg-neutral-50 dark:bg-neutral-900/50 relative overflow-hidden flex flex-col items-center">
            <div className="absolute top-0 inset-x-0 h-px w-full bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent" />

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16 max-w-3xl mx-auto"
                >
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Why ShareSphere?</h2>
                    <p className="text-muted-foreground text-lg">
                        Join a growing community dedicated to sustainable living through collaborative consumption and smart resource management.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 max-w-6xl mx-auto">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ delay: index * 0.2, duration: 0.5 }}
                            className="flex flex-col items-center text-center group"
                        >
                            <div className="h-16 w-16 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 shadow-sm flex items-center justify-center mb-6 text-neutral-700 dark:text-neutral-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-300">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                            <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
