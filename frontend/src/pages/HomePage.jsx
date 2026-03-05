import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { BackgroundPaths } from '../components/ui/background-paths';
import { FeatureSection } from '../components/ui/feature-section';
import { AnimatedCard } from '../components/ui/animated-card';
import { motion } from 'framer-motion';
import { Search, MapPin, Handshake, CheckCircle } from 'lucide-react';

const exampleResources = [
    { title: "Power Drill", category: "Tools", image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&q=80&w=800" },
    { title: "Camping Tent", category: "Outdoors", image: "https://images.unsplash.com/photo-1504280390267-33106d152783?auto=format&fit=crop&q=80&w=800" },
    { title: "Engineering Textbook", category: "Books", image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=800" },
    { title: "Portable Projector", category: "Electronics", image: "https://images.unsplash.com/photo-1626307416562-ee853b708976?auto=format&fit=crop&q=80&w=800" }
];

const stats = [
    { value: "1200+", label: "Items Shared" },
    { value: "400+", label: "Active Members" },
    { value: "3000+", label: "Total Borrows" }
];

export default function HomePage() {
    return (
        <div className="flex flex-col min-h-screen">

            {/* 1. Animated Hero Section using Kokonut BackgroundPaths */}
            <section className="relative w-full">
                <BackgroundPaths title="Share More, Waste Less" />
                <div className="absolute bottom-24 left-0 w-full flex justify-center z-20 gap-4 animate-fade-in-up animation-delay-300">
                    <Link to="/register">
                        <Button size="lg" className="rounded-full shadow-xl hover:shadow-2xl transition-all h-14 px-10 text-lg">
                            Get Started
                        </Button>
                    </Link>
                    <Link to="/browse">
                        <Button size="lg" variant="secondary" className="rounded-full shadow-lg h-14 px-10 text-lg bg-white/80 dark:bg-black/50 backdrop-blur hover:bg-white dark:hover:bg-black transition-colors">
                            Browse Resources
                        </Button>
                    </Link>
                </div>
            </section>

            {/* 2. Features Section */}
            <FeatureSection />

            {/* 2.5 How it Works */}
            <section className="py-24 bg-neutral-50 dark:bg-neutral-900 border-y border-neutral-200 dark:border-neutral-800">
                <div className="container mx-auto px-4 md:px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">How It Works</h2>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            Sharing resources in your community is simple, safe, and entirely free.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
                        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="flex flex-col items-center text-center">
                            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6 ring-8 ring-primary/5">
                                <Search className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">1. Find Items</h3>
                            <p className="text-muted-foreground">Search our community catalog for the tools or equipment you need.</p>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="flex flex-col items-center text-center">
                            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6 ring-8 ring-primary/5">
                                <Handshake className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">2. Request to Borrow</h3>
                            <p className="text-muted-foreground">Send a secure request to the owner specifying your dates.</p>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="flex flex-col items-center text-center">
                            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6 ring-8 ring-primary/5">
                                <MapPin className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">3. Meet & Exchange</h3>
                            <p className="text-muted-foreground">Coordinate locally with your neighbor to pick up the item.</p>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }} className="flex flex-col items-center text-center">
                            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6 ring-8 ring-primary/5">
                                <CheckCircle className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">4. Return</h3>
                            <p className="text-muted-foreground">Return the item safely and earn community trust points.</p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* 3. Resource Previews using Kokonut AnimatedCard */}
            <section className="py-24 bg-white dark:bg-neutral-950">
                <div className="container mx-auto px-4 md:px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Discover What's Available</h2>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            From power tools to party supplies, explore hundreds of items shared by your community.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                        {exampleResources.map((resource, i) => (
                            <AnimatedCard key={i} delay={i * 0.1}>
                                <div className="h-48 w-full overflow-hidden">
                                    <img src={resource.image} alt={resource.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                </div>
                                <div className="p-6">
                                    <span className="text-xs font-bold text-primary tracking-wider uppercase mb-2 block">{resource.category}</span>
                                    <h3 className="text-xl font-semibold">{resource.title}</h3>
                                </div>
                            </AnimatedCard>
                        ))}
                    </div>

                    <div className="mt-16 flex justify-center">
                        <Link to="/browse">
                            <Button variant="outline" size="lg" className="rounded-full h-12 px-8">
                                View All Resources
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* 4. Community Stats Section */}
            <section className="py-24 bg-neutral-900 text-white dark:bg-black relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent opacity-50" />
                <div className="container mx-auto px-4 md:px-6 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center divide-y md:divide-y-0 md:divide-x divide-white/10">
                        {stats.map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.2, duration: 0.5 }}
                                className="pt-8 md:pt-0"
                            >
                                <div className="text-5xl md:text-6xl font-bold mb-4">{stat.value}</div>
                                <div className="text-lg text-white/70 tracking-wide uppercase">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. Footer */}
            <footer className="bg-neutral-50 dark:bg-neutral-900 py-16 border-t border-neutral-200 dark:border-neutral-800">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                        <div className="col-span-1 md:col-span-2">
                            <Link to="/" className="text-2xl font-bold tracking-tight text-primary mb-4 block">
                                ShareSphere.
                            </Link>
                            <p className="text-muted-foreground max-w-xs">
                                A modern platform enabling communities to share resources, reduce waste, and build trust.
                            </p>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">Platform</h4>
                            <ul className="space-y-3 flex flex-col items-start">
                                <li><Link to="/browse" className="text-muted-foreground hover:text-primary transition-colors">Browse</Link></li>
                                <li><Link to="/login" className="text-muted-foreground hover:text-primary transition-colors">Login</Link></li>
                                <li><Link to="/register" className="text-muted-foreground hover:text-primary transition-colors">Sign Up</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">Legal & Contact</h4>
                            <ul className="space-y-3 flex flex-col items-start">
                                <li><Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">About Us</Link></li>
                                <li><Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
                                <li><Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link></li>
                                <li><Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-16 pt-8 border-t border-neutral-200 dark:border-neutral-800 text-center text-sm text-neutral-500">
                        © {new Date().getFullYear()} ShareSphere. All rights reserved. Built for community sharing.
                    </div>
                </div>
            </footer>
        </div>
    );
}
