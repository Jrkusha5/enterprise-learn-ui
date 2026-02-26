import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role?: UserRole) => Promise<void>;
  loginWithOAuth: (provider: 'google' | 'github' | 'microsoft') => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock user data - in real app, this would come from API
    const mockUser: User = {
      id: 'user-1',
      name: 'Alex Johnson',
      email,
      role: 'student',
      avatar: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/1fd75570-b0d4-4a6c-8569-b2f6b662e289/student-profile-1-e114f209-1772004547190.webp',
    };
    
    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
    setIsLoading(false);
  };

  const register = async (name: string, email: string, password: string, role: UserRole = 'student') => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock user data - in real app, this would come from API
    const mockUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      role,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff`,
    };
    
    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
    setIsLoading(false);
  };

  const loginWithOAuth = async (provider: 'google' | 'github' | 'microsoft') => {
    setIsLoading(true);
    // Simulate OAuth flow
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock OAuth user data - in real app, this would handle OAuth callback
    const providerNames: Record<string, string> = {
      google: 'Google User',
      github: 'GitHub User',
      microsoft: 'Microsoft User',
    };
    
    const mockUser: User = {
      id: `oauth-${provider}-${Date.now()}`,
      name: providerNames[provider],
      email: `user@${provider}.com`,
      role: 'student',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(providerNames[provider])}&background=6366f1&color=fff`,
    };
    
    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        loginWithOAuth,
        logout,
        isLoading,
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
