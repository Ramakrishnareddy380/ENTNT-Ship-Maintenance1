import React, { createContext, useContext, useState, useEffect } from 'react';
import { authenticateUser, getUserById } from '../utils/localStorageUtils';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check for existing session on initialization
  useEffect(() => {
    const checkExistingSession = () => {
      const userId = localStorage.getItem('entnt_user_id');
      if (userId) {
        const user = getUserById(userId);
        if (user) {
          setUser(user);
        } else {
          // Invalid user ID in localStorage, clear it
          localStorage.removeItem('entnt_user_id');
        }
      }
      setLoading(false);
    };

    checkExistingSession();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const authenticatedUser = authenticateUser(email, password);
      
      if (authenticatedUser) {
        setUser(authenticatedUser);
        localStorage.setItem('entnt_user_id', authenticatedUser.id);
        setLoading(false);
        return true;
      } else {
        setError('Invalid email or password');
        setLoading(false);
        return false;
      }
    } catch (err) {
      setError('An error occurred during login');
      setLoading(false);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('entnt_user_id');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout }}>
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