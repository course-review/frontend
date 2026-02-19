import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Routes that require authentication
const protectedRoutes = ['/admin', '/add'];

// OAuth redirect configuration
const AUTHORIZATION_URL = 'https://n.ethz.ch/~lteufelbe/auth'; // TODO: Consider making this an env var

async function verifyToken(token: string): Promise<boolean> {
    try {
        const publicKeyString = process.env.NEXT_PUBLIC_JWT_PUBLIC_KEY;

        if (!publicKeyString) {
            console.error('JWT public key not configured');
            return false;
        }

        const publicKeyBuffer = Uint8Array.from(atob(publicKeyString), (c) => c.charCodeAt(0));

        const publicKey = await crypto.subtle.importKey(
            'spki',
            publicKeyBuffer,
            {
                name: 'RSASSA-PKCS1-v1_5',
                hash: 'SHA-256',
            },
            true,
            ['verify']
        );

        const { payload } = await jwtVerify(token, publicKey);

        // Ensure the token is for a student
        if (!payload.student) {
            return false;
        }

        return true;
    } catch (error) {
        console.error('JWT verification failed:', error);
        return false;
    }
}

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Check if the route requires authentication
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

    if (isProtectedRoute) {
        const token = request.cookies.get('jwt')?.value;

        if (!token || !(await verifyToken(token))) {
            // Redirect to authorization endpoint with callback
            const redirectUrl = `${request.nextUrl.origin}/tokenset`;
            const originUrl = pathname;
            const authUrl = `${AUTHORIZATION_URL}?redirect=${encodeURIComponent(redirectUrl)}&origin=${encodeURIComponent(originUrl)}`;

            return NextResponse.redirect(authUrl);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
