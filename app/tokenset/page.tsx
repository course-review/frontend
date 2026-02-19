'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

/**
 * Token callback page - handles JWT token from SWITCH AAI authentication
 */
function TokenSetContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const token = searchParams.get('token');
        const origin = searchParams.get('origin') || '/';

        if (token) {
            // Set the JWT cookie
            document.cookie = `jwt=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Strict`;

            // Redirect to origin or home
            router.push(origin);
        } else {
            // No token provided, redirect to home
            router.push('/');
        }
    }, [searchParams, router]);

    return (
        <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Authenticating...</h1>
            <p className="text-muted-foreground">Please wait while we log you in.</p>
        </div>
    );
}

export default function TokenSetPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <TokenSetContent />
        </Suspense>
    );
}
