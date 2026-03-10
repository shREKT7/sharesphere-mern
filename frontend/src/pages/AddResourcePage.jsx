import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { toast } from 'sonner';

export default function AddResourcePage() {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        condition: '',
    });
    const [selectedFile, setSelectedFile] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const submitData = new FormData();
            submitData.append("title", formData.title);
            submitData.append("description", formData.description);
            submitData.append("category", formData.category);
            submitData.append("condition", formData.condition);
            if (selectedFile) {
                submitData.append("image", selectedFile);
            }

            const { data } = await api.post('/resources', submitData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (data.success) {
                toast.success('Resource added successfully!');
                navigate('/dashboard');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.response?.data?.errors?.[0]?.message || 'Failed to add resource');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container max-w-2xl px-4 py-12 mx-auto">
            <Card className="rounded-2xl shadow-lg border-border/50">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold tracking-tight">Add a New Resource</CardTitle>
                    <CardDescription>
                        Share your tools, books, or equipment with the community.
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                placeholder="e.g., Power Drill, React Crash Course Book"
                                required
                                value={formData.title}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Input
                                id="description"
                                placeholder="Provide some details about the item..."
                                required
                                value={formData.description}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>
                                <Input
                                    id="category"
                                    placeholder="e.g., Tools, Books, Gardening"
                                    required
                                    value={formData.category}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="condition">Condition</Label>
                                <Input
                                    id="condition"
                                    placeholder="e.g., Like New, Good, Fair"
                                    required
                                    value={formData.condition}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="image">Resource Image</Label>
                            <Input
                                id="image"
                                type="file"
                                accept="image/jpeg, image/png, image/jpg"
                                onChange={handleFileChange}
                            />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full rounded-full" type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Adding Resource...' : 'Add Resource'}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
