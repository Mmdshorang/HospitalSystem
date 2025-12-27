import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, type UserInfo } from '../api/services/authService';

interface AuthContextType {
  user: UserInfo | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  requestOtp: (phone: string) => Promise<void>;
  verifyOtp: (phone: string, code: string) => Promise<boolean>;
  loginWithOtp: (phone: string, code: string) => Promise<void>;
  login: (phone: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !user;

  useEffect(() => {
    const initializeAuth = async () => {
      if (authService.isAuthenticated()) {
        try {
          const userInfo = await authService.getCurrentUser();
          setUser(userInfo);
        } catch (error) {
          console.error('Failed to get user info:', error);
          authService.logout();
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const requestOtp = async (phone: string) => {
    await authService.sendOtp({ phone });
  };

  const verifyOtp = async (phone: string, code: string) => {
    await authService.verifyOtp({ phone, code });
    return true;
  };

  const loginWithOtp = async (phone: string, code: string) => {
    const response = await authService.loginWithOtp({ phone, code });
    setUser(response.user);
  };

  const login = async (phone: string, password: string) => {
    const response = await authService.login({ phone, password });
    setUser(response.user);
  };

  const register = async (userData: any) => {
    try {
      const response = await authService.register(userData);
      setUser(response.user);
    } catch (error: any) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    requestOtp,
    verifyOtp,
    loginWithOtp,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
