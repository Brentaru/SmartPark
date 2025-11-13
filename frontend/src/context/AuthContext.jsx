import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Base API URL - adjust based on your backend port
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

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
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (err) {
        console.error('Error parsing stored user:', err);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  // Register function
  const register = async (userData) => {
    setError(null);
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, userData);
      
      if (response.data.success) {
        const user = response.data.user;
        setCurrentUser(user);
        localStorage.setItem('user', JSON.stringify(user));
        
        return { success: true, user };
      } else {
        const errorMessage = response.data.error || 'Registration failed';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.response?.data?.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Login function
  const login = async (id, password) => {
    setError(null);
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        id,
        password
      });
      
      if (response.data.success) {
        const user = response.data.user;
        setCurrentUser(user);
        localStorage.setItem('user', JSON.stringify(user));
        
        return { success: true, user };
      } else {
        const errorMessage = response.data.error || 'Login failed';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.response?.data?.message || 'Invalid credentials. Please try again.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Logout function
  const logout = () => {
    setCurrentUser(null);
    setError(null);
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
  };

  // Update user profile
  const updateProfile = async (updates) => {
    setError(null);
    try {
      if (!currentUser) {
        throw new Error('No user logged in');
      }
      
      const response = await axios.put(`${API_BASE_URL}/users/${currentUser.userID}`, updates);
      
      const updatedUser = {
        ...currentUser,
        ...response.data,
        // Map backend fields to frontend fields
        firstName: response.data.fname || response.data.firstName,
        lastName: response.data.lname || response.data.lastName,
        contact: response.data.contact || response.data.contactNumber,
      };
      
      setCurrentUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      return { success: true, user: updatedUser };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update profile';
      setError(errorMessage);
      return { success: false, error: errorMessage };
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
