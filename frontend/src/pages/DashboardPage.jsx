import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { toast } from 'sonner';

export default function DashboardPage() {
    const { user } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState('requests'); // requests, shared, borrowed, notifications
    const [data, setData] = useState({ requests: [], shared: [], borrowed: [], notifications: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const [reqRes, borrowedRes, allResourcesRes, notifRes] = await Promise.all([
                api.get('/borrow/requests'),
                api.get('/borrow/borrowed'),
                api.get('/resources'),
                api.get('/notifications')
            ]);

            const myShared = (allResourcesRes.data.data || []).filter(
                (r) => r.owner?._id === user?._id || r.owner === user?._id
            );

            setData({
                requests: reqRes.data.data || [],
                borrowed: borrowedRes.data.data || [],
                shared: myShared,
                notifications: notifRes.data.data || []
            });
        } catch (error) {
            toast.error('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (action, requestId) => {
        try {
            const { data } = await api.patch(`/borrow/${action}/${requestId}`);
            if (data.success) {
                toast.success(`Request ${action}d successfully`);
                fetchDashboardData();
            }
        } catch (error) {
            toast.error(`Failed to ${action} request`);
        }
    };

    const handleDeleteResource = async (resourceId) => {
        if (!window.confirm('Are you sure you want to delete this resource?')) return;
        try {
            const { data } = await api.delete(`/resources/${resourceId}`);
            if (data.success) {
                toast.success('Resource deleted');
                fetchDashboardData();
            }
        } catch (error) {
            toast.error('Failed to delete resource');
        }
    };

    const handleMarkRead = async (notificationId) => {
        try {
            await api.patch(`/notifications/${notificationId}/read`);
            fetchDashboardData();
        } catch (error) {
            console.error('Failed to mark read', error);
        }
    };

    return (
        <div className="container max-w-6xl px-4 md:px-6 py-8 mx-auto">
            <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground mt-2">Welcome back, {user?.name}. Manage your community sharing here.</p>
                </div>
            </div>

            <div className="flex border-b border-border/50 mb-8 overflow-x-auto">
                <button
                    onClick={() => setActiveTab('notifications')}
                    className={`pb-4 px-4 font-medium text-sm whitespace-nowrap transition-colors ${activeTab === 'notifications' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                >
                    Notifications {data.notifications.filter(n => !n.isRead).length > 0 && (
                        <span className="ml-1 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                            {data.notifications.filter(n => !n.isRead).length}
                        </span>
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('requests')}
                    className={`pb-4 px-4 font-medium text-sm whitespace-nowrap transition-colors ${activeTab === 'requests' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                >
                    Received Requests ({data.requests.length})
                </button>
                <button
                    onClick={() => setActiveTab('shared')}
                    className={`pb-4 px-4 font-medium text-sm whitespace-nowrap transition-colors ${activeTab === 'shared' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                >
                    My Shared Items ({data.shared.length})
                </button>
                <button
                    onClick={() => setActiveTab('borrowed')}
                    className={`pb-4 px-4 font-medium text-sm whitespace-nowrap transition-colors ${activeTab === 'borrowed' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                >
                    My Borrowed Items ({data.borrowed.length})
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full py-12 text-center text-muted-foreground">Loading dashboard data...</div>
                ) : (
                    <>
                        {activeTab === 'requests' && data.requests.map((req) => (
                            <Card key={req._id} className="rounded-2xl border-border/50">
                                <CardHeader>
                                    <CardTitle className="text-lg flex justify-between items-center">
                                        {req.resourceId?.title}
                                        <Badge variant={req.status === 'Pending' ? 'secondary' : req.status === 'Approved' ? 'default' : req.status === 'Returned' ? 'outline' : 'destructive'}>
                                            {req.status}
                                        </Badge>
                                    </CardTitle>
                                    <CardDescription>Requested by: {req.borrowerId?.name}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-sm space-y-1">
                                        <p><strong>From:</strong> {new Date(req.startDate).toLocaleDateString()}</p>
                                        <p><strong>To:</strong> {new Date(req.endDate).toLocaleDateString()}</p>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex gap-2">
                                    {req.status === 'Pending' && (
                                        <>
                                            <Button className="w-full" onClick={() => handleAction('approve', req._id)}>Approve</Button>
                                            <Button variant="destructive" className="w-full" onClick={() => handleAction('reject', req._id)}>Reject</Button>
                                        </>
                                    )}
                                    {req.status === 'Approved' && (
                                        <Button variant="outline" className="w-full" onClick={() => handleAction('return', req._id)}>Confirm Returned</Button>
                                    )}
                                </CardFooter>
                            </Card>
                        ))}

                        {activeTab === 'shared' && data.shared.map((item) => (
                            <Card key={item._id} className="rounded-2xl border-border/50">
                                <div className="h-32 bg-muted relative rounded-t-2xl overflow-hidden">
                                    {item.imageUrl && <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />}
                                    <Badge variant={item.availability ? "default" : "secondary"} className="absolute top-2 right-2">
                                        {item.availability ? 'Available' : 'Unavailable'}
                                    </Badge>
                                </div>
                                <CardHeader>
                                    <CardTitle className="text-lg">{item.title}</CardTitle>
                                    <CardDescription className="line-clamp-1">{item.category} • {item.condition}</CardDescription>
                                </CardHeader>
                                <CardFooter>
                                    <Button variant="destructive" className="w-full" onClick={() => handleDeleteResource(item._id)}>Delete Item</Button>
                                </CardFooter>
                            </Card>
                        ))}

                        {activeTab === 'borrowed' && data.borrowed.map((item) => (
                            <Card key={item._id} className="rounded-2xl border-border/50">
                                <CardHeader>
                                    <CardTitle className="text-lg flex justify-between items-center">
                                        {item.resourceId?.title}
                                        <Badge variant={item.status === 'Pending' ? 'secondary' : item.status === 'Approved' ? 'default' : item.status === 'Returned' ? 'outline' : 'destructive'}>
                                            {item.status}
                                        </Badge>
                                    </CardTitle>
                                    <CardDescription>Owner: {item.ownerId?.name}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-sm space-y-1">
                                        <p><strong>From:</strong> {new Date(item.startDate).toLocaleDateString()}</p>
                                        <p><strong>To:</strong> {new Date(item.endDate).toLocaleDateString()}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        {activeTab === 'notifications' && data.notifications.map((notif) => (
                            <Card key={notif._id} className={`rounded-2xl border-border/50 ${!notif.isRead ? 'bg-primary/5' : ''}`}>
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <CardDescription>{new Date(notif.createdAt).toLocaleString()}</CardDescription>
                                        {!notif.isRead && <Badge>New</Badge>}
                                    </div>
                                    <CardTitle className="text-base mt-2 leading-relaxed">{notif.message}</CardTitle>
                                </CardHeader>
                                {!notif.isRead && (
                                    <CardFooter>
                                        <Button variant="outline" size="sm" onClick={() => handleMarkRead(notif._id)}>Mark as Read</Button>
                                    </CardFooter>
                                )}
                            </Card>
                        ))}

                        {!loading && data[activeTab].length === 0 && (
                            <div className="col-span-full py-12 text-center text-muted-foreground border-2 border-dashed border-border rounded-xl">
                                No items found for this category.
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
