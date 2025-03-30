import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Layouts
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AttendanceMarking from './pages/AttendanceMarking';
import AttendanceReports from './pages/AttendanceReports';
import CourseManagement from './pages/CourseManagement';
import StudentProfile from './pages/StudentProfile';
import LecturerProfile from './pages/LecturerProfile';
import AdminPanel from './pages/AdminPanel';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          
          {/* Protected routes */}
          <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/attendance/mark" element={<AttendanceMarking />} />
            <Route path="/attendance/reports" element={<AttendanceReports />} />
            <Route path="/courses" element={<CourseManagement />} />
            <Route path="/profile/student" element={<StudentProfile />} />
            <Route path="/profile/lecturer" element={<LecturerProfile />} />
            <Route path="/admin" element={<AdminPanel />} />
          </Route>
          
          {/* 404 route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;