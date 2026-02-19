import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import type { TokenProperties } from '@/types';

/**
 * Decode and verify JWT token using RSA public key
 */
export async function decodeToken(token: string): Promise<TokenProperties> {
    const publicKeyString = process.env.NEXT_PUBLIC_JWT_PUBLIC_KEY;

    if (!publicKeyString) {
        throw new Error('JWT public key not configured');
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

    // Verify the token
    const { payload } = await jwtVerify(token, publicKey);
    return payload as unknown as TokenProperties;
}

/**
 * Check if the current user is authenticated as a student
 * Server-side only - use in Server Components, Server Actions, or proxy
 */
export async function studentAuth(): Promise<boolean> {
    const cookieStore = await cookies();
    const token = cookieStore.get('jwt')?.value;

    if (!token) {
        return false; // No token, unauthorized
    }

    try {
        // Ensure the token is for a student
        const props = await decodeToken(token);
        if (!props.student) {
            return false;
        }
        return true;
    } catch (error) {
        console.error('JWT verification failed:', error);
        return false;
    }
}

/**
 * Get the JWT token from cookies
 * Server-side only
 */
export async function getToken(): Promise<string | undefined> {
    const cookieStore = await cookies();
    return cookieStore.get('jwt')?.value;
}
