import React, { createContext, useContext, useState, useEffect } from 'react';
import { userAPI } from '../api/api';

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
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setCurrentUser(user);
      } catch (err) {
        console.error('Error parsing stored user:', err);
        localStorage.removeItem('currentUser');
      }
    }
    setLoading(false);
  }, []);

  // Register function
  const register = async (userData) => {
    setError(null);
    try {
      const result = await userAPI.register(userData);
      
      if (result.success) {
        const user = result.data;
        // Format user data for frontend
        const formattedUser = {
          id: user.userID,
          userID: user.userID,
          studentId: user.studentId,
          email: user.email,
          firstName: user.fname,
          lastName: user.lname,
          role: user.role,
          contactNumber: user.contact,
          plateNumber: user.plateNumber,
          vehicleType: user.vehicleType,
          vehicleColor: user.vehicleColor,
          profilePictureUrl: user.profilePictureUrl || ''
        };
        
        setCurrentUser(formattedUser);
        localStorage.setItem('currentUser', JSON.stringify(formattedUser));
        
        return { success: true, user: formattedUser };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  // Detect role based on ID format
  const detectRoleFromId = (studentId) => {
    const studentFormat = /^\d{2}-\d{4}-\d{3}$/;  // xx-xxxx-xxx
    const staffFormat = /^\d{2}-\d{4}-\d{4}$/;    // xx-xxxx-xxxx
    const guardFormat = /^\d{2}-\d{3}-\d{3}$/;    // xx-xxx-xxx
    
    if (studentFormat.test(studentId)) return 'student';
    if (staffFormat.test(studentId)) return 'staff';
    if (guardFormat.test(studentId)) return 'guard';
    return null;
  };

  // Login function
  const login = async (studentId, password) => {
    setError(null);
    try {
      const result = await userAPI.login(studentId, password);
      
      if (result.success) {
        const user = result.data;
        
        // Auto-detect correct role from ID format
        const detectedRole = detectRoleFromId(studentId);
        const correctRole = detectedRole || user.role;
        
        // Format user data for frontend
        const formattedUser = {
          id: user.userID,
          userID: user.userID,
          studentId: user.studentId,
          email: user.email,
          firstName: user.fname,
          lastName: user.lname,
          role: correctRole,
          contactNumber: user.contact,
          plateNumber: user.plateNumber,
          vehicleType: user.vehicleType,
          vehicleColor: user.vehicleColor,
          profilePictureUrl: user.profilePictureUrl || ''
        };
        
        setCurrentUser(formattedUser);
        localStorage.setItem('currentUser', JSON.stringify(formattedUser));
        
        return { success: true, user: formattedUser };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  // Logout function
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    setError(null);
  };

  // Update user profile
  const updateProfile = async (updates) => {
    setError(null);
    try {
      if (!currentUser) {
        throw new Error('No user logged in');
      }
      
      const result = await userAPI.updateUser(currentUser.id, {
        fname: updates.firstName,
        lname: updates.lastName,
        email: updates.email,
        contact: updates.contactNumber,
        role: updates.role
      });
      
      if (result.success) {
        const user = result.data;
        const formattedUser = {
          id: user.userID,
          email: user.email,
          firstName: user.fname,
          lastName: user.lname,
          role: user.role,
          contactNumber: user.contact
        };
        
        setCurrentUser(formattedUser);
        localStorage.setItem('currentUser', JSON.stringify(formattedUser));
        
        return { success: true, user: formattedUser };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
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

  // Update user profile in context (without API call)
  const updateUserProfile = (updatedUser) => {
    setCurrentUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
  };

  // Update user (generic method that updates context after successful API call)
  const updateUser = (updatedUserData) => {
    // Handle both frontend format (firstName, lastName) and backend format (fname, lname)
    const formattedUser = {
      id: updatedUserData.userID || updatedUserData.id || currentUser?.id,
      userID: updatedUserData.userID || updatedUserData.id || currentUser?.userID,
      studentId: updatedUserData.studentId || currentUser?.studentId,
      email: updatedUserData.email || currentUser?.email,
      firstName: updatedUserData.firstName || updatedUserData.fname || currentUser?.firstName,
      lastName: updatedUserData.lastName || updatedUserData.lname || currentUser?.lastName,
      role: updatedUserData.role || currentUser?.role,
      contactNumber: updatedUserData.contactNumber || updatedUserData.contact || currentUser?.contactNumber,
      plateNumber: updatedUserData.plateNumber || currentUser?.plateNumber,
      vehicleType: updatedUserData.vehicleType || currentUser?.vehicleType,
      vehicleColor: updatedUserData.vehicleColor || currentUser?.vehicleColor,
      profilePictureUrl: updatedUserData.profilePictureUrl || currentUser?.profilePictureUrl || ''
    };
    
    // Update both state and localStorage
    setCurrentUser(formattedUser);
    localStorage.setItem('currentUser', JSON.stringify(formattedUser));
    
    // Log for debugging
    console.log('✅ User context updated:', formattedUser);
    
    return formattedUser;
  };

  const value = {
    currentUser,
    loading,
    error,
    register,
    login,
    logout,
    updateProfile,
    updateUserProfile,
    updateUser,
    isAuthenticated,
    hasRole,
    setError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
