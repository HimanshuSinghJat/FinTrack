import React, { createContext, useState, useEffect, useContext } from 'react';
import { loginUser, registerUser, getCurrentUser } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check logged in user on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('fintrack_token');
      const savedUser = localStorage.getItem('fintrack_user');

      if (token && savedUser) {
        try {
          setUser(JSON.parse(savedUser));
          // Verify token validity with backend asynchronously
          const freshUser = await getCurrentUser();
          setUser(freshUser);
          localStorage.setItem('fintrack_user', JSON.stringify(freshUser));
        } catch (err) {
          console.error('Session verification failed:', err.message);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const data = await loginUser({ email, password });
    const userData = { _id: data._id, name: data.name, email: data.email };
    
    localStorage.setItem('fintrack_token', data.token);
    localStorage.setItem('fintrack_user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const register = async (name, email, password) => {
    const data = await registerUser({ name, email, password });
    const userData = { _id: data._id, name: data.name, email: data.email };
    
    localStorage.setItem('fintrack_token', data.token);
    localStorage.setItem('fintrack_user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('fintrack_token');
    localStorage.removeItem('fintrack_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
