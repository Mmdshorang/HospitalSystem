import apiClient from "../client";

export interface LoginRequest {
  phone: string;
  password: string;
}

export interface RegisterRequest {
  phone: string;
  nationalCode: string;
  firstName: string;
  lastName: string;
  password?: string;
  confirmPassword?: string;
  dateOfBirth?: string;
  gender?: string;
}

export interface SendOtpRequest {
  phone: string;
}

export interface VerifyOtpRequest {
  phone: string;
  code: string;
}

export interface UserInfo {
  id: number;
  phone: string;
  nationalCode?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
}

export interface AuthResponse {
  token: string;
  user: UserInfo;
}

export const authService = {
  // Login user
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>(
      "/api/auth/login",
      credentials
    );

    // Store token in localStorage
    if (response.data.token) {
      localStorage.setItem("authToken", response.data.token);
    }

    return response.data;
  },

  // Register new user
  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>(
      "/api/auth/register",
      userData
    );

    // Store token in localStorage
    if (response.data.token) {
      localStorage.setItem("authToken", response.data.token);
    }

    return response.data;
  },

  // Send OTP code to phone
  sendOtp: async (payload: SendOtpRequest): Promise<void> => {
    const response = await apiClient.post("/api/auth/send-otp", payload);
    return response.data;
  },

  // Verify OTP code (without login)
  verifyOtp: async (payload: VerifyOtpRequest): Promise<boolean> => {
    await apiClient.post("/api/auth/verify-otp", payload);
    return true;
  },

  // Login via OTP
  loginWithOtp: async (payload: VerifyOtpRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>(
      "/api/auth/login-otp",
      payload
    );

    if (response.data.token) {
      localStorage.setItem("authToken", response.data.token);
    }

    return response.data;
  },

  // Logout user
  logout: (): void => {
    localStorage.removeItem("authToken");
    window.location.href = "/patient/login";
  },

  // Get current user info
  getCurrentUser: async (): Promise<UserInfo> => {
    const response = await apiClient.get<UserInfo>("/api/auth/me");
    return response.data;
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem("authToken");
  },

  // Get stored token
  getToken: (): string | null => {
    return localStorage.getItem("authToken");
  },
};
