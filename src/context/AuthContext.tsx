import React, { createContext, useContext, useState, useEffect } from 'react';
import { type User } from '../types';
import api from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const savedToken = localStorage.getItem('token');
        if (savedToken) {
          const response = await api.get('/auth/me');
          setUser(response.data.data);
          setToken(savedToken);
        }
      } catch (error) {
        localStorage.removeItem('token');
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, []);

  const setAuth = (user: User, token: string) => {
    localStorage.setItem('token', token);
    setUser(user);
    setToken(token);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, setAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);