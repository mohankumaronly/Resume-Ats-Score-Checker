export type ApiResponse<T> = {
  message: string;
  success: boolean;
  data: T;
};

export type ApiError = {
  message: string;
  success: false;
  errors?: Record<string, string[]>;
};