import apiClient from '../client';
import type { LoginRequest, RegisterRequest, AuthResponse, UserInfo } from '../generated-types';

export const authService = {
  // Login user
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/api/auth/login', credentials);
    
    // Store token in localStorage
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
    }
    
    return response.data;
  },

  // Register new user
  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/api/auth/register', userData);
    
    // Store token in localStorage
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
    }
    
    return response.data;
  },

  // Logout user
  logout: (): void => {
    localStorage.removeItem('authToken');
    window.location.href = '/login';
  },

  // Get current user info
  getCurrentUser: async (): Promise<UserInfo> => {
    const response = await apiClient.get<UserInfo>('/api/auth/me');
    return response.data;
  },

  // Validate token
  validateToken: async (): Promise<boolean> => {
    try {
      await apiClient.post('/api/auth/validate');
      return true;
    } catch {
      return false;
    }
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('authToken');
  },

  // Get stored token
  getToken: (): string | null => {
    return localStorage.getItem('authToken');
  }
};
