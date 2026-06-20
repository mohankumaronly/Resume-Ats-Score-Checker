import { api, handleApiError } from "./api";
import type {
  SendOtpRequest,
  SendOtpResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
  UserResponse,
} from "../types/auth";
import type { ApiResponse } from "../types/api";

export const authService = {
  /**
   * Send OTP to user's email
   */
  sendOtp: async (email: string): Promise<SendOtpResponse> => {
    try {
      const response = await api.post<ApiResponse<SendOtpResponse>>(
        "/auth/send-otp",
        { email } as SendOtpRequest
      );
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Verify OTP and login
   */
  verifyOtp: async (email: string, otp: string): Promise<VerifyOtpResponse> => {
    try {
      const response = await api.post<ApiResponse<VerifyOtpResponse>>(
        "/auth/verify-otp",
        { email, otp } as VerifyOtpRequest
      );
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Get current authenticated user
   */
  getCurrentUser: async (): Promise<UserResponse | null> => {
    try {
      const response = await api.get<ApiResponse<UserResponse>>("/auth/me");
      return response.data.data;
    } catch (error) {
      // Return null if not authenticated
      return null;
    }
  },

  /**
   * Logout user
   */
  logout: async (): Promise<void> => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};