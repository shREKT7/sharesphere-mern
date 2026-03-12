import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import {
    Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter
} from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '../components/ui/dialog';
import { toast } from 'sonner';
import { Package, Handshake, Clock, Bell, PlusCircle, Search } from 'lucide-react';

export default function DashboardPage() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('requests');
    const [data, setData] = useState({ requests: [], shared: [], borrowed: [], notifications: [] });
    const [loading, setLoading] = useState(true);

    // Delete modal state
    const [deleteModal, setDeleteModal] = useState({ open: false, resourceId: null });

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
            const { data: res } = await api.patch(`/borrow/${action}/${requestId}`);
            if (res.success) {
                toast.success(`Request ${action}d successfully`);
                fetchDashboardData();
            }
        } catch (error) {
            toast.error(`Failed to ${action} request`);
        }
    };

    const confirmDelete = (resourceId) => {
        setDeleteModal({ open: true, resourceId });
    };

    const handleDeleteResource = async () => {
        try {
            const { data: res } = await api.delete(`/resources/${deleteModal.resourceId}`);
            if (res.success) {
                toast.success('Resource deleted');
                fetchDashboardData();
            }
        } catch (error) {
            toast.error('Failed to delete resource');
        } finally {
            setDeleteModal({ open: false, resourceId: null });
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

    const pendingCount = data.requests.filter(r => r.status === 'Pending').length;
    const unreadCount = data.notifications.filter(n => !n.isRead).length;

    const tabs = [
        { id: 'notifications', label: 'Notifications', badge: unreadCount },
        { id: 'requests', label: 'Received Requests', badge: data.requests.length },
        { id: 'shared', label: 'My Shared Items', badge: data.shared.length },
        { id: 'borrowed', label: 'My Borrowed Items', badge: data.borrowed.length },
    ];

    const SkeletonCard = () => (
        <Card className="rounded-2xl border-border/50">
            <Skeleton className="h-32 w-full rounded-t-2xl rounded-b-none" />
            <CardHeader>
                <Skeleton className="h-5 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardFooter>
                <Skeleton className="h-9 w-full rounded-full" />
            </CardFooter>
        </Card>
    );

    return (
        <div className="container max-w-6xl px-4 md:px-6 py-8 mx-auto">

            {/* Header */}
            <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground mt-2">Welcome back, {user?.name}. Manage your community sharing here.</p>
                </div>
                <Button onClick={() => navigate('/add-resource')} className="rounded-full gap-2 self-start md:self-auto">
                    <PlusCircle className="w-4 h-4" />
                    Share a Resource
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                {[
                    { label: 'Items Shared', value: loading ? '—' : data.shared.length, icon: Package, color: 'blue' },
                    { label: 'Items Borrowed', value: loading ? '—' : data.borrowed.length, icon: Handshake, color: 'orange' },
                    { label: 'Pending Requests', value: loading ? '—' : pendingCount, icon: Clock, color: 'yellow' },
                    { label: 'Notifications', value: loading ? '—' : unreadCount, icon: Bell, color: 'purple' },
                ].map(({ label, value, icon: Icon, color }) => (
                    <Card key={label} className="rounded-2xl border-border/50">
                        <CardContent className="p-5 flex items-center gap-4">
                            <div className={`h-11 w-11 rounded-full bg-${color}-500/10 text-${color}-500 flex items-center justify-center shrink-0`}>
                                <Icon className="h-5 w-5" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-2xl font-bold tracking-tight">{value}</p>
                                <p className="text-muted-foreground text-xs truncate">{label}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Tabs */}
            <div className="flex border-b border-border/50 mb-8 overflow-x-auto">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`pb-4 px-4 font-medium text-sm whitespace-nowrap transition-colors flex items-center gap-2 ${activeTab === tab.id ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        {tab.label}
                        {tab.badge > 0 && (
                            <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                                {tab.badge}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Content grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
                ) : (
                    <>
                        {/* Received Requests */}
                        {activeTab === 'requests' && (
                            data.requests.length > 0 ? data.requests.map((req) => (
                                <Card key={req._id} className="rounded-2xl border-border/50 hover:shadow-md transition-shadow">
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
                                        <div className="text-sm space-y-1 text-muted-foreground">
                                            <p><strong className="text-foreground">From:</strong> {new Date(req.startDate).toLocaleDateString()}</p>
                                            <p><strong className="text-foreground">To:</strong> {new Date(req.endDate).toLocaleDateString()}</p>
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
                            )) : (
                                <div className="col-span-full flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-border rounded-2xl">
                                    <Handshake className="w-12 h-12 text-muted-foreground/50 mb-4" />
                                    <h3 className="text-lg font-semibold mb-1">No requests received yet</h3>
                                    <p className="text-muted-foreground text-sm max-w-xs">When someone requests to borrow your items, they'll appear here.</p>
                                </div>
                            )
                        )}

                        {/* My Shared Items */}
                        {activeTab === 'shared' && (
                            data.shared.length > 0 ? data.shared.map((item) => (
                                <Card key={item._id} className="rounded-2xl border-border/50 hover:shadow-md transition-shadow overflow-hidden group">
                                    <div className="h-36 bg-muted relative rounded-t-2xl overflow-hidden flex items-center justify-center">
                                        {item.imageUrl ? (
                                            <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        ) : (
                                            <span className="text-muted-foreground text-sm">No image provided</span>
                                        )}
                                        <Badge variant={item.availability ? 'default' : 'secondary'} className="absolute top-2 right-2 shadow-sm">
                                            {item.availability ? 'Available' : 'Unavailable'}
                                        </Badge>
                                    </div>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-lg line-clamp-1">{item.title}</CardTitle>
                                        <CardDescription>{item.category} • {item.condition}</CardDescription>
                                    </CardHeader>
                                    <CardFooter>
                                        <Button variant="destructive" className="w-full" onClick={() => confirmDelete(item._id)}>Delete Item</Button>
                                    </CardFooter>
                                </Card>
                            )) : (
                                <div className="col-span-full flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-border rounded-2xl">
                                    <Package className="w-12 h-12 text-muted-foreground/50 mb-4" />
                                    <h3 className="text-lg font-semibold mb-1">You haven't shared any resources yet</h3>
                                    <p className="text-muted-foreground text-sm max-w-xs mb-6">Start helping your community by sharing tools, books or equipment.</p>
                                    <Button asChild className="rounded-full gap-2">
                                        <Link to="/add-resource"><PlusCircle className="w-4 h-4" /> Add Resource</Link>
                                    </Button>
                                </div>
                            )
                        )}

                        {/* My Borrowed Items */}
                        {activeTab === 'borrowed' && (
                            data.borrowed.length > 0 ? data.borrowed.map((item) => (
                                <Card key={item._id} className="rounded-2xl border-border/50 hover:shadow-md transition-shadow">
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
                                        <div className="text-sm space-y-1 text-muted-foreground">
                                            <p><strong className="text-foreground">From:</strong> {new Date(item.startDate).toLocaleDateString()}</p>
                                            <p><strong className="text-foreground">To:</strong> {new Date(item.endDate).toLocaleDateString()}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            )) : (
                                <div className="col-span-full flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-border rounded-2xl">
                                    <Search className="w-12 h-12 text-muted-foreground/50 mb-4" />
                                    <h3 className="text-lg font-semibold mb-1">You haven't borrowed anything yet</h3>
                                    <p className="text-muted-foreground text-sm max-w-xs mb-6">Browse the community marketplace to find useful resources.</p>
                                    <Button asChild variant="outline" className="rounded-full gap-2">
                                        <Link to="/browse"><Search className="w-4 h-4" /> Browse Resources</Link>
                                    </Button>
                                </div>
                            )
                        )}

                        {/* Notifications */}
                        {activeTab === 'notifications' && (
                            data.notifications.length > 0 ? data.notifications.map((notif) => (
                                <Card key={notif._id} className={`rounded-2xl border-border/50 hover:shadow-md transition-shadow ${!notif.isRead ? 'bg-primary/5 border-primary/20' : ''}`}>
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <CardDescription>{new Date(notif.createdAt).toLocaleString()}</CardDescription>
                                            {!notif.isRead && <Badge className="shrink-0">New</Badge>}
                                        </div>
                                        <CardTitle className="text-base mt-2 leading-relaxed font-medium">{notif.message}</CardTitle>
                                    </CardHeader>
                                    {!notif.isRead && (
                                        <CardFooter>
                                            <Button variant="outline" size="sm" onClick={() => handleMarkRead(notif._id)}>Mark as Read</Button>
                                        </CardFooter>
                                    )}
                                </Card>
                            )) : (
                                <div className="col-span-full flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-border rounded-2xl">
                                    <Bell className="w-12 h-12 text-muted-foreground/50 mb-4" />
                                    <h3 className="text-lg font-semibold mb-1">No notifications yet</h3>
                                    <p className="text-muted-foreground text-sm">You'll be notified about borrow requests and updates here.</p>
                                </div>
                            )
                        )}
                    </>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            <Dialog open={deleteModal.open} onOpenChange={(open) => setDeleteModal({ open, resourceId: null })}>
                <DialogContent className="sm:max-w-md rounded-2xl">
                    <DialogHeader>
                        <DialogTitle>Delete Resource</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this resource? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="outline" onClick={() => setDeleteModal({ open: false, resourceId: null })}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteResource}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
