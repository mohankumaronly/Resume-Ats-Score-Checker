export type SendOtpRequest = {
  email: string;
};

export type SendOtpResponse = {
  message: string;
  success: boolean;
};

export type VerifyOtpRequest = {
  email: string;
  otp: string;
};

export type VerifyOtpResponse = {
  message: string;
  success: boolean;
};

export type UserResponse = {
  id: number;
  email: string;
  name: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AuthContextType = {
  user: UserResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  sendOtp: (email: string) => Promise<void>;
  verifyOtp: (email: string, otp: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<UserResponse | null>; // Fixed: returns UserResponse | null
};