'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { TokenProperties } from '@/types';
import { decodeTokenClient, getClientToken } from '@/lib/auth-client';

interface AuthContextType {
    isAuthenticated: boolean;
    user: TokenProperties | null;
    token: string | null;
    loading: boolean;
    refreshAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<TokenProperties | null>(null);
    const [loading, setLoading] = useState(true);

    const refreshAuth = () => {
        const currentToken = getClientToken();
        setToken(currentToken);

        if (currentToken) {
            const decoded = decodeTokenClient(currentToken);
            setUser(decoded);
        } else {
            setUser(null);
        }

        setLoading(false);
    };

    useEffect(() => {
        // Initialize auth state on mount
        const currentToken = getClientToken();
        setToken(currentToken);

        if (currentToken) {
            const decoded = decodeTokenClient(currentToken);
            setUser(decoded);
        }

        setLoading(false);
    }, []);

    const value = {
        isAuthenticated: !!token && !!user,
        user,
        token,
        loading,
        refreshAuth,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
