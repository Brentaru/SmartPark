import React, { createContext, useContext, useState, useEffect } from 'react';
import mockDataService from '../data/mockData';

// Create Auth Context
const AuthContext = createContext(null);

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check for existing session on mount
  useEffect(() => {
    const user = mockDataService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
    setLoading(false);
  }, []);

  // Register function
  const register = async (userData) => {
    setError(null);
    try {
      // Generate a student ID if not provided
      const newUserData = {
        ...userData,
        id: userData.id || `STU-${Date.now()}`,
      };

      const user = mockDataService.registerUser(newUserData);
      
      // Auto-login after registration
      const loggedInUser = mockDataService.loginUser(newUserData.id, userData.password);
      setCurrentUser(loggedInUser);
      
      return { success: true, user: loggedInUser };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  // Login function
  const login = async (id, password) => {
    setError(null);
    try {
      const user = mockDataService.loginUser(id, password);
      setCurrentUser(user);
      return { success: true, user };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  // Logout function
  const logout = () => {
    mockDataService.logoutUser();
    setCurrentUser(null);
    setError(null);
  };

  // Update user profile
  const updateProfile = async (updates) => {
    setError(null);
    try {
      if (!currentUser) {
        throw new Error('No user logged in');
      }
      const updatedUser = mockDataService.updateUser(currentUser.id, updates);
      setCurrentUser(updatedUser);
      return { success: true, user: updatedUser };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return currentUser !== null;
  };

  // Check user role
  const hasRole = (role) => {
    return currentUser && currentUser.role === role;
  };

  const value = {
    currentUser,
    loading,
    error,
    register,
    login,
    logout,
    updateProfile,
    isAuthenticated,
    hasRole,
    setError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
