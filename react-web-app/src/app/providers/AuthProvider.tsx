import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { tokenStorage } from '@/shared/api/client';
import { authApi } from '@/shared/api/auth.api';
import { userApi, UserProfile } from '@/shared/api/user.api';
import type { UserRole } from '@/shared/types';

// Backend user type (aligned with API response)
interface BackendUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  department?: string;
  joinedDate: string;
  isActive?: boolean;
}

interface AuthContextType {
  user: BackendUser | null;
  profile: UserProfile | null;
  role: UserRole | null;
  login: (email: string, password: string) => Promise<{ error: string | null }>;
  signup: (email: string, password: string, fullName: string, role?: UserRole) => Promise<{ error: string | null }>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuthData?: (data: { user: BackendUser; accessToken: string; refreshToken: string }) => void;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<BackendUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing auth on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const accessToken = tokenStorage.getAccessToken();
        if (accessToken) {
          // Try to fetch user profile to verify token
          try {
            const userProfile = await userApi.getProfile();
            setUser({
              id: userProfile.id,
              name: userProfile.name,
              email: userProfile.email,
              role: userProfile.role,
              avatar: userProfile.avatar,
              department: userProfile.department,
              joinedDate: userProfile.joinedDate,
              isActive: userProfile.isActive,
            });
            setProfile(userProfile);
            setRole(userProfile.role);
          } catch (error) {
            // Token invalid, clear it
            tokenStorage.clearTokens();
            setUser(null);
            setProfile(null);
            setRole(null);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        tokenStorage.clearTokens();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<{ error: string | null }> => {
    try {
      const response = await authApi.login({ email, password });
      
      // Store tokens
      tokenStorage.setTokens(response.accessToken, response.refreshToken);
      
      // Set user data
      setUser(response.user);
      setRole(response.user.role);
      
      // Fetch full profile
      try {
        const userProfile = await userApi.getProfile();
        setProfile(userProfile);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      }

      return { error: null };
    } catch (error: any) {
      console.error('Login error:', error);
      return { 
        error: error?.message || error?.response?.data?.message || 'Login failed. Please check your credentials.' 
      };
    }
  };

  const signup = async (
    email: string, 
    password: string, 
    fullName: string,
    userRole?: UserRole
  ): Promise<{ error: string | null }> => {
    try {
      const response = await authApi.register({
        name: fullName,
        email,
        password,
        role: userRole || 'learner',
      });
      
      // Store tokens
      tokenStorage.setTokens(response.accessToken, response.refreshToken);
      
      // Set user data
      setUser(response.user);
      setRole(response.user.role);
      
      // Fetch full profile
      try {
        const userProfile = await userApi.getProfile();
        setProfile(userProfile);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      }

      return { error: null };
    } catch (error: any) {
      console.error('Signup error:', error);
      return { 
        error: error?.message || error?.response?.data?.message || 'Registration failed. Please try again.' 
      };
    }
  };

  const logout = async () => {
    try {
      tokenStorage.clearTokens();
      setUser(null);
      setProfile(null);
      setRole(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const refreshAuth = useCallback(async () => {
    try {
      const accessToken = tokenStorage.getAccessToken();
      if (accessToken) {
        const userProfile = await userApi.getProfile();
        setUser({
          id: userProfile.id,
          name: userProfile.name,
          email: userProfile.email,
          role: userProfile.role,
          avatar: userProfile.avatar,
          department: userProfile.department,
          joinedDate: userProfile.joinedDate,
          isActive: userProfile.isActive,
        });
        setProfile(userProfile);
        setRole(userProfile.role);
      }
    } catch (error) {
      console.error('Refresh auth error:', error);
      tokenStorage.clearTokens();
      setUser(null);
      setProfile(null);
      setRole(null);
    }
  }, []);

  const setAuthData = useCallback((data: { user: BackendUser; accessToken: string; refreshToken: string }) => {
    tokenStorage.setTokens(data.accessToken, data.refreshToken);
    setUser(data.user);
    setRole(data.user.role);
    // Fetch full profile
    userApi.getProfile()
      .then((userProfile) => {
        setProfile(userProfile);
      })
      .catch((error) => {
        console.error('Failed to fetch profile:', error);
      });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        role,
        login,
        signup,
        logout,
        isAuthenticated: !!user && !!tokenStorage.getAccessToken(),
        isLoading,
        setAuthData,
        refreshAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
