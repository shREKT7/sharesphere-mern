import React from 'react';

export default function PrivacyPage() {
    return (
        <div className="container mx-auto px-4 py-16 max-w-4xl">
            <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
            <div className="prose prose-lg dark:prose-invert">
                <p>Last updated: March 2026</p>
                <h2 className="text-2xl font-semibold mt-8 mb-4">1. Information We Collect</h2>
                <p>We collect information you provide directly to us when you register, including your name, email address, password, and location data.</p>
                <h2 className="text-2xl font-semibold mt-8 mb-4">2. How We Use Your Information</h2>
                <p>We use the information to facilitate community sharing, authenticate users, and improve the ShareSphere platform. Your email is used for platform notifications regarding borrow requests.</p>
                <h2 className="text-2xl font-semibold mt-8 mb-4">3. Data Security</h2>
                <p>We implement strict security measures including encrypted passwords and protected API routes to ensure your personal data is safe from unauthorized access.</p>
            </div>
        </div>
    );
}
