import type { TokenProperties } from '@/types';

/**
 * Client-side JWT decoding (without verification)
 * Use only for reading non-sensitive claims
 */
export function decodeTokenClient(token: string): TokenProperties | null {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload as TokenProperties;
    } catch {
        return null;
    }
}

/**
 * Get JWT token from cookie (client-side only)
 */
export function getClientToken(): string | null {
    if (typeof document === 'undefined') return null;

    const cookies = document.cookie.split(';');
    const jwtCookie = cookies.find(c => c.trim().startsWith('jwt='));
    return jwtCookie ? jwtCookie.split('=')[1] : null;
}
