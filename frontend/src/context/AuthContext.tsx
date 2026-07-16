import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { authApi } from '../services/authApi';

interface AuthContextType {
    isAuthenticated: boolean;
    email: string | null;
    verified: boolean;
    login: (email: string, token: string) => void;
    logout: () => void;
    setVerified: (verified: boolean) => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [email, setEmail] = useState<string | null>(null);
    const [verified, setVerified] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check if user is already logged in
        const token = authApi.getToken();
        const userEmail = authApi.getUserEmail();
        const userVerified = localStorage.getItem('user_verified') === 'true';

        if (token && userEmail) {
            setIsAuthenticated(true);
            setEmail(userEmail);
            setVerified(userVerified);
        }
        setIsLoading(false);
    }, []);

    const login = (email: string, token: string) => {
        authApi.saveAuthData(token, email, true);
        setIsAuthenticated(true);
        setEmail(email);
        setVerified(true);
    };

    const logout = () => {
        authApi.logout();
        setIsAuthenticated(false);
        setEmail(null);
        setVerified(false);
    };

    const setVerifiedStatus = (status: boolean) => {
        setVerified(status);
        localStorage.setItem('user_verified', String(status));
    };

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                email,
                verified,
                login,
                logout,
                setVerified: setVerifiedStatus,
                isLoading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};