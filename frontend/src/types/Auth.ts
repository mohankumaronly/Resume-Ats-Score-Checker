// src/types/Auth.ts

export interface AuthRequest {
    email: string;
}

export interface OtpRequest {
    email: string;
    otp: string;
}

export interface AuthResponse {
    success: boolean;
    token: string | null;
    email: string | null;
    verified: boolean;
    message: string;
    newUser: boolean;
}

export interface User {
    email: string;
    firstName: string;
    lastName: string;
    verified: boolean;
}