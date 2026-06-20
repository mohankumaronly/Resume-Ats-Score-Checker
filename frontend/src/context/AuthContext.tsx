import React, { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/auth.service";
import type { UserResponse, AuthContextType } from "../types/auth";
import toast from "react-hot-toast";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = async (): Promise<UserResponse | null> => {
    try {
      const userData = await authService.getCurrentUser();
      setUser(userData);
      return userData;
    } catch (error) {
      setUser(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const sendOtp = async (email: string) => {
    try {
      await authService.sendOtp(email);
      toast.success("OTP sent to your email!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to send OTP");
      throw error;
    }
  };

  const verifyOtp = async (email: string, otp: string) => {
    try {
      await authService.verifyOtp(email, otp);
      toast.success("Login successful!");
      await refreshUser();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Invalid OTP");
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      toast.success("Logged out successfully!");
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        sendOtp,
        verifyOtp,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};