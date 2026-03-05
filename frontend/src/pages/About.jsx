import React from 'react';
import { motion } from 'framer-motion';

export default function AboutPage() {
    return (
        <div className="container mx-auto px-4 py-16 max-w-4xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <h1 className="text-4xl font-bold mb-6">About ShareSphere</h1>
                <div className="prose prose-lg dark:prose-invert">
                    <p>
                        ShareSphere is a community-driven platform designed to reduce waste and promote sustainable living through the collaborative consumption of resources.
                    </p>
                    <p>
                        We believe that communities thrive when neighbors help neighbors. Instead of buying tools, books, or equipment that you might only use once, ShareSphere allows you to borrow them locally.
                    </p>
                    <h2 className="text-2xl font-semibold mt-8 mb-4">Our Mission</h2>
                    <p>
                        To empower individuals to share their belongings safely and efficiently, strengthening community trust while reducing our collective carbon footprint.
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
