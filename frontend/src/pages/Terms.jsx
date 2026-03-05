import React from 'react';

export default function TermsPage() {
    return (
        <div className="container mx-auto px-4 py-16 max-w-4xl">
            <h1 className="text-4xl font-bold mb-6">Terms of Service</h1>
            <div className="prose prose-lg dark:prose-invert">
                <p>Last updated: March 2026</p>
                <h2 className="text-2xl font-semibold mt-8 mb-4">1. Acceptance of Terms</h2>
                <p>By accessing or using ShareSphere, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the service.</p>
                <h2 className="text-2xl font-semibold mt-8 mb-4">2. User Responsibilities</h2>
                <p>Users must provide accurate information when registering and sharing items. You are responsible for ensuring that any item offered is safe to use and accurately described.</p>
                <h2 className="text-2xl font-semibold mt-8 mb-4">3. Borrowing Rules</h2>
                <p>Borrowers must return items in the same condition they were received. Any damages may result in platform penalties or direct compensation requirements.</p>
            </div>
        </div>
    );
}
