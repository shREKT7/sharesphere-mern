import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';
import { MapPin, ShieldCheck, Share2, Handshake } from 'lucide-react';
import { toast } from 'sonner';

export default function ProfilePage() {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState({ shared: 0, borrowed: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUserStats();
    }, [user]);

    const fetchUserStats = async () => {
        try {
            if (!user) return;
            setLoading(true);
            const [sharedRes, borrowedRes] = await Promise.all([
                api.get('/resources'),
                api.get('/borrow/borrowed')
            ]);

            const myShared = (sharedRes.data.data || []).filter(
                (r) => r.owner?._id === user._id || r.owner === user._id
            );

            setStats({
                shared: myShared.length,
                borrowed: (borrowedRes.data.data || []).length
            });
        } catch (error) {
            toast.error('Could not load profile statistics');
        } finally {
            setLoading(false);
        }
    };

    if (!user) return <div className="text-center py-20">Loading profile...</div>;

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* Profile Info */}
                <div className="col-span-1">
                    <Card className="rounded-2xl border-border/50 text-center overflow-hidden">
                        <div className="bg-primary/10 h-32 relative">
                            <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
                                <div className="h-24 w-24 rounded-full bg-background border-4 border-background flex items-center justify-center text-3xl font-bold bg-primary text-primary-foreground shadow-sm">
                                    {user.name?.charAt(0)}
                                </div>
                            </div>
                        </div>
                        <CardHeader className="pt-16 pb-4">
                            <CardTitle className="text-2xl">{user.name}</CardTitle>
                            <p className="text-muted-foreground">{user.email}</p>

                            {user.location && (
                                <div className="flex items-center justify-center gap-1 mt-2 text-muted-foreground text-sm">
                                    <MapPin className="h-4 w-4" />
                                    {user.location}
                                </div>
                            )}
                        </CardHeader>
                        <CardContent className="flex justify-center pb-8 border-b border-border/50 mx-6">
                            <Badge variant="secondary" className="px-3 py-1 text-sm bg-green-500/10 text-green-600 dark:text-green-400 hover:bg-green-500/20">
                                <ShieldCheck className="w-4 h-4 mr-1 inline-block" />
                                Trust Score: {user.trustScore || 100}
                            </Badge>
                        </CardContent>
                    </Card>
                </div>

                {/* Stats & Activity */}
                <div className="col-span-1 md:col-span-2 space-y-6">
                    <h2 className="text-2xl font-bold tracking-tight">Community Impact</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {loading ? (
                            [0, 1].map(i => (
                                <Card key={i} className="rounded-2xl border-border/50">
                                    <CardContent className="p-6 flex items-center gap-4">
                                        <Skeleton className="h-12 w-12 rounded-full shrink-0" />
                                        <div className="flex-1 space-y-2">
                                            <Skeleton className="h-7 w-16" />
                                            <Skeleton className="h-4 w-24" />
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            <>
                                <Card className="rounded-2xl border-border/50">
                                    <CardContent className="p-6 flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center">
                                            <Share2 className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <p className="text-3xl font-bold">{stats.shared}</p>
                                            <p className="text-muted-foreground text-sm">Items Shared</p>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className="rounded-2xl border-border/50">
                                    <CardContent className="p-6 flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-full bg-orange-500/10 text-orange-500 flex items-center justify-center">
                                            <Handshake className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <p className="text-3xl font-bold">{stats.borrowed}</p>
                                            <p className="text-muted-foreground text-sm">Successful Borrows</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
