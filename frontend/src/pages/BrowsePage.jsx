import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';
import { Input } from '../components/ui/input';
import { toast } from 'sonner';
import { Package } from 'lucide-react';

export default function BrowsePage() {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);

    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('All');
    const [condition, setCondition] = useState('All');
    const [availability, setAvailability] = useState('true');

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchResources();
        }, 300);
        return () => clearTimeout(delayDebounceFn);
    }, [search, category, condition, availability]);

    const fetchResources = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (search) params.append('search', search);
            if (category && category !== 'All') params.append('category', category);
            if (condition && condition !== 'All') params.append('condition', condition);
            if (availability !== 'all') params.append('availability', availability);

            const { data } = await api.get(`/resources?${params.toString()}`);
            if (data.success) {
                setResources(data.data);
            }
        } catch (error) {
            toast.error('Failed to load resources');
        } finally {
            setLoading(false);
        }
    };

    const handleRequestBorrow = async (resourceId) => {
        if (!user) {
            toast.error('You must be logged in to request a resource');
            return;
        }

        try {
            // Using basic dates for demo (Starts tomorrow, ends in 7 days)
            const startDate = new Date();
            startDate.setDate(startDate.getDate() + 1);
            const endDate = new Date();
            endDate.setDate(endDate.getDate() + 7);

            const { data } = await api.post('/borrow/request', {
                resourceId,
                startDate,
                endDate
            });

            if (data.success) {
                toast.success('Borrow request sent successfully!');
                fetchResources(); // Refresh list
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to send request');
        }
    };

    return (
        <div className="container px-4 md:px-6 py-8 mx-auto">
            <div className="flex flex-col mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Browse Resources</h1>
                <p className="text-muted-foreground mt-2">Discover tools and items shared by your community.</p>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-8 bg-neutral-50 dark:bg-neutral-900/50 p-4 rounded-xl border border-border/50 shadow-sm animate-fade-in">
                <div className="flex-1">
                    <Input
                        placeholder="Search resources by title or description..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="bg-white dark:bg-neutral-950"
                    />
                </div>
                <select
                    className="flex h-10 w-full md:w-auto min-w-[140px] items-center justify-between rounded-md border border-input bg-white dark:bg-neutral-950 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                >
                    <option value="All">All Categories</option>
                    <option value="Tools">Tools</option>
                    <option value="Books">Books</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Outdoors">Outdoors</option>
                    <option value="Home">Home</option>
                </select>
                <select
                    className="flex h-10 w-full md:w-auto min-w-[140px] items-center justify-between rounded-md border border-input bg-white dark:bg-neutral-950 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                >
                    <option value="All">Any Condition</option>
                    <option value="New">New</option>
                    <option value="Like New">Like New</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                </select>
                <select
                    className="flex h-10 w-full md:w-auto min-w-[140px] items-center justify-between rounded-md border border-input bg-white dark:bg-neutral-950 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={availability}
                    onChange={(e) => setAvailability(e.target.value)}
                >
                    <option value="true">Available Only</option>
                    <option value="all">All Items</option>
                    <option value="false">Currently Borrowed</option>
                </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {loading ? (
                    Array.from({ length: 8 }).map((_, i) => (
                        <Card key={i} className="rounded-2xl overflow-hidden border-border/50">
                            <Skeleton className="h-48 w-full rounded-none" />
                            <CardHeader className="pb-2">
                                <Skeleton className="h-4 w-1/4 mb-2" />
                                <Skeleton className="h-6 w-3/4" />
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-4 w-full mb-2" />
                                <Skeleton className="h-4 w-5/6" />
                            </CardContent>
                            <CardFooter>
                                <Skeleton className="h-10 w-full rounded-full" />
                            </CardFooter>
                        </Card>
                    ))
                ) : resources.length > 0 ? (
                    resources.map((resource) => (
                        <Card key={resource._id} className="rounded-2xl overflow-hidden border-border/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group cursor-default">
                            {/* Image */}
                            <div className="h-48 overflow-hidden bg-muted relative">
                                {resource.imageUrl ? (
                                    <img src={resource.imageUrl} alt={resource.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground bg-secondary/30 gap-2">
                                        <Package className="w-10 h-10 opacity-30" />
                                        <span className="text-xs">No image</span>
                                    </div>
                                )}
                                {/* Availability badge overlay */}
                                <div className="absolute top-3 left-3">
                                    <Badge variant={resource.availability ? 'default' : 'secondary'} className="shadow-sm text-xs">
                                        {resource.availability ? '● Available' : '○ Unavailable'}
                                    </Badge>
                                </div>
                            </div>

                            {/* Body */}
                            <CardHeader className="pb-2 flex-grow">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs font-bold text-primary uppercase tracking-wider">{resource.category}</span>
                                    <Badge variant="outline" className="text-xs font-normal">{resource.condition}</Badge>
                                </div>
                                <CardTitle className="text-lg line-clamp-1">{resource.title}</CardTitle>
                                <CardDescription className="line-clamp-2 mt-1">{resource.description}</CardDescription>
                            </CardHeader>

                            {/* Footer */}
                            <CardFooter className="flex flex-col gap-3 pt-4 border-t border-border/50 bg-muted/10">
                                <div className="flex items-center gap-2 w-full">
                                    <div className="h-7 w-7 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                                        {resource.owner?.name?.charAt(0) || 'U'}
                                    </div>
                                    <span className="text-sm text-muted-foreground truncate">{resource.owner?.name}</span>
                                </div>
                                <Button
                                    className="w-full rounded-full"
                                    disabled={!resource.availability || (user && resource.owner?._id === user._id)}
                                    onClick={() => handleRequestBorrow(resource._id)}
                                >
                                    {user && resource.owner?._id === user._id ? 'Your Item' : 'Request to Borrow'}
                                </Button>
                            </CardFooter>
                        </Card>
                    ))
                ) : (
                    <div className="col-span-full py-24 text-center">
                        <h3 className="text-xl font-medium text-muted-foreground">No resources available at the moment.</h3>
                        <p className="text-muted-foreground mt-2">Check back later or add your own items!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
