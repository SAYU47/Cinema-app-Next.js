'use client';

import { useRouter } from 'next/navigation';
import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isAuthorized: boolean;
  username: string | null;
  login: (username: string, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('username');

    const auth = !!token;

    setIsAuthorized(auth);
    setUsername(user);
  }, []);

  const login = (username: string, token: string) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('username', username);
    setIsAuthorized(true);
    setUsername(username);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    setIsAuthorized(false);
    setUsername(null);
    router.push('/cinema/movies');
  };

  return (
    <AuthContext.Provider value={{ isAuthorized, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  const isAuthorized = context.isAuthorized;

  return {
    ...context,
    isAuthorized,
  };
};
