import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Authentication services
export const authService = {
  login: async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      
      // Store token in localStorage
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      
      return response.data.user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  logout: async () => {
    try {
      await api.post('/auth/logout');
      localStorage.removeItem('token');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },
  
  resetPassword: async (email: string) => {
    try {
      await api.post('/auth/reset-password', { email });
      return true;
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  },
  
  getCurrentUser: async () => {
    try {
      const response = await api.get('/users/profile');
      return response.data;
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  }
};

// User services
export const userService = {
  updateProfile: async (data: any) => {
    try {
      const response = await api.put('/users/profile', data);
      return response.data;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }
};

// Course services
export const courseService = {
  getCourses: async () => {
    try {
      const response = await api.get('/courses');
      return response.data;
    } catch (error) {
      console.error('Get courses error:', error);
      throw error;
    }
  },
  
  createCourse: async (courseData: any) => {
    try {
      const response = await api.post('/courses', courseData);
      return response.data;
    } catch (error) {
      console.error('Create course error:', error);
      throw error;
    }
  },

  getLecturerCourses: async (lecturerId: string) => {
    try {
      const response = await api.get(`/courses?instructorId=${lecturerId}`);
      return response.data;
    } catch (error) {
      console.error('Get lecturer courses error:', error);
      throw error;
    }
  }
};

// Attendance services
export const attendanceService = {
  createAttendanceSession: async (courseId: string, courseName: string, duration: number) => {
    try {
      const response = await api.post('/attendance/sessions', {
        courseId,
        courseName,
        duration
      });
      return response.data;
    } catch (error) {
      console.error('Create attendance session error:', error);
      throw error;
    }
  },
  
  closeAttendanceSession: async (sessionId: string) => {
    try {
      const response = await api.put(`/attendance/sessions/${sessionId}/close`);
      return response.data;
    } catch (error) {
      console.error('Close attendance session error:', error);
      throw error;
    }
  },
  
  markAttendance: async (sessionId: string, method: string, data: any) => {
    try {
      const response = await api.post('/attendance/mark', {
        sessionId,
        method,
        data
      });
      return response.data;
    } catch (error) {
      console.error('Mark attendance error:', error);
      return { success: false, message: error.response?.data?.message || 'Error marking attendance' };
    }
  },
  
  getCourseAttendance: async (courseId: string) => {
    try {
      const response = await api.get(`/attendance/course/${courseId}`);
      return response.data;
    } catch (error) {
      console.error('Get course attendance error:', error);
      throw error;
    }
  },
  
  getStudentAttendance: async (courseId?: string) => {
    try {
      const url = courseId ? `/attendance/student?courseId=${courseId}` : '/attendance/student';
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Get student attendance error:', error);
      throw error;
    }
  }
};

export default api;