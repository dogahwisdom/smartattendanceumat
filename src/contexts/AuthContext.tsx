import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

interface User {
  id: number;
  email: string;
  displayName: string;
  role: 'student' | 'lecturer' | 'admin';
  department?: string;
  studentId?: string;
  staffId?: string;
}

interface AuthContextType {
  currentUser: User | null;
  userProfile: any | null;
  loading: boolean;
  userRole: 'student' | 'lecturer' | 'admin' | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetUserPassword: (email: string) => Promise<boolean>;
  updateProfile: (data: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<'student' | 'lecturer' | 'admin' | null>(null);

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (token) {
          const user = await authService.getCurrentUser();
          setCurrentUser(user);
          setUserProfile(user);
          setUserRole(user.role as 'student' | 'lecturer' | 'admin');
        }
      } catch (error) {
        console.error('Auth status check error:', error);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };
    
    checkAuthStatus();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      const user = await authService.login(email, password);
      setCurrentUser(user);
      setUserProfile(user);
      setUserRole(user.role as 'student' | 'lecturer' | 'admin');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await authService.logout();
      setCurrentUser(null);
      setUserProfile(null);
      setUserRole(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  // Reset password function
  const resetUserPassword = async (email: string) => {
    try {
      await authService.resetPassword(email);
      return true;
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  };

  // Update profile function
  const updateProfile = async (data: any) => {
    try {
      await authService.updateProfile(data);
      
      // Refresh user profile
      const updatedUser = await authService.getCurrentUser();
      setCurrentUser(updatedUser);
      setUserProfile(updatedUser);
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  };

  const value = {
    currentUser,
    userProfile,
    loading,
    userRole,
    login,
    logout,
    resetUserPassword,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};