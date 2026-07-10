// src/services/authApi.ts

import axios from 'axios';
import type { AuthRequest, OtpRequest, AuthResponse } from '../types/Auth';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const authApi = {
    /**
     * Send OTP to email
     */
    sendOtp: async (email: string): Promise<AuthResponse> => {
        try {
            const request: AuthRequest = { email };
            const response = await api.post<AuthResponse>('/api/auth/send-otp', request);
            return response.data;
        } catch (error: any) {
            if (error.response) {
                return error.response.data;
            }
            throw new Error('Network error. Please try again.');
        }
    },

    /**
     * Verify OTP and login
     */
    verifyOtp: async (email: string, otp: string): Promise<AuthResponse> => {
        try {
            const request: OtpRequest = { email, otp };
            const response = await api.post<AuthResponse>('/api/auth/verify-otp', request);
            return response.data;
        } catch (error: any) {
            if (error.response) {
                return error.response.data;
            }
            throw new Error('Network error. Please try again.');
        }
    },

    /**
     * Resend OTP
     */
    resendOtp: async (email: string): Promise<AuthResponse> => {
        try {
            const response = await api.post<AuthResponse>(`/api/auth/resend-otp?email=${encodeURIComponent(email)}`);
            return response.data;
        } catch (error: any) {
            if (error.response) {
                return error.response.data;
            }
            throw new Error('Network error. Please try again.');
        }
    },

    /**
     * Logout (client side)
     */
    logout: () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_email');
        localStorage.removeItem('user_verified');
    },

    /**
     * Check if user is authenticated
     */
    isAuthenticated: (): boolean => {
        const token = localStorage.getItem('auth_token');
        return !!token;
    },

    /**
     * Get auth token
     */
    getToken: (): string | null => {
        return localStorage.getItem('auth_token');
    },

    /**
     * Get user email
     */
    getUserEmail: (): string | null => {
        return localStorage.getItem('user_email');
    },

    /**
     * Save auth data
     */
    saveAuthData: (token: string, email: string, verified: boolean) => {
        localStorage.setItem('auth_token', token);
        localStorage.setItem('user_email', email);
        localStorage.setItem('user_verified', String(verified));
    },
};  