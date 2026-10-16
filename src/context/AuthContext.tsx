import React, { createContext, useContext, useState, useEffect } from 'react';
import { CLIENT_CONFIG } from '../data/portalData';

export interface UserSession {
  id: string;
  name: string;
  email: string;
  clientId: string;
  role: 'client' | 'admin';
}

interface AuthContextType {
  user: UserSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; message?: string }>;
  demoLogin: () => void;
  logout: () => void;
}

const DEFAULT_DEMO_USER: UserSession = {
  id: 'usr-kaushal-01',
  name: CLIENT_CONFIG.name,
  email: CLIENT_CONFIG.email,
  clientId: 'client-kaushal-harwani',
  role: 'client',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserSession | null>(() => {
    try {
      const stored = localStorage.getItem('socialdocs_user_session');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to parse stored auth session', e);
    }
    return DEFAULT_DEMO_USER;
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('socialdocs_user_session', JSON.stringify(user));
    } else {
      localStorage.removeItem('socialdocs_user_session');
    }
  }, [user]);

  const login = async (email: string, _password?: string) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 400));

    if (!email || !email.includes('@')) {
      setIsLoading(false);
      return { success: false, message: 'Please enter a valid email address.' };
    }

    const session: UserSession = {
      id: 'usr-session-01',
      name: CLIENT_CONFIG.name,
      email: email,
      clientId: 'client-kaushal-harwani',
      role: 'client',
    };

    setUser(session);
    setIsLoading(false);
    return { success: true };
  };

  const demoLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setUser(DEFAULT_DEMO_USER);
      setIsLoading(false);
    }, 300);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        demoLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
