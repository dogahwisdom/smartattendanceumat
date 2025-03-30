// This file is kept for reference but no longer used
// Mock functions to simulate backend functionality until real backend is implemented

export const mockLoginUser = async (email: string, password: string) => {
  const mockUsers = {
    'student@umat.edu.gh': {
      uid: 'student-123',
      email: 'student@umat.edu.gh',
      displayName: 'John Doe',
      role: 'student'
    },
    'lecturer@umat.edu.gh': {
      uid: 'lecturer-123',
      email: 'lecturer@umat.edu.gh',
      displayName: 'Dr. Jane Smith',
      role: 'lecturer'
    },
    'admin@umat.edu.gh': {
      uid: 'admin-123',
      email: 'admin@umat.edu.gh',
      displayName: 'Admin User',
      role: 'admin'
    }
  };

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = mockUsers[email as keyof typeof mockUsers];
      if (user && password === 'password') {
        resolve(user);
      } else {
        reject(new Error('Invalid email or password'));
      }
    }, 1000);
  });
};

export const mockGetUserRole = async (uid: string) => {
  if (uid.includes('student')) return 'student';
  if (uid.includes('lecturer')) return 'lecturer';
  if (uid.includes('admin')) return 'admin';
  return null;
};

export const mockGetCourses = async () => {
  return [
    { 
      id: 'cs101', 
      code: 'CS101', 
      name: 'Introduction to Computer Science',
      instructor: 'Dr. Jane Smith',
      instructorId: 'lecturer-123',
      department: 'Computer Science',
      schedule: 'Mon, Wed, Fri',
      time: '10:00 AM - 12:00 PM',
      location: 'Room 101',
      semester: 'Fall 2023',
      students: 45
    },
    { 
      id: 'db201', 
      code: 'DB201', 
      name: 'Database Systems',
      instructor: 'Dr. Jane Smith',
      instructorId: 'lecturer-123',
      department: 'Computer Science',
      schedule: 'Tue, Thu',
      time: '2:00 PM - 4:00 PM',
      location: 'Room 203',
      semester: 'Fall 2023',
      students: 38
    }
  ];
};

// Mock attendance marking function
export const markAttendance = async (
  sessionId: string,
  userId: string,
  method: string,
  data: any
) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate 90% success rate
      const success = Math.random() > 0.1;
      
      if (success) {
        resolve({
          success: true,
          message: 'Attendance marked successfully'
        });
      } else {
        resolve({
          success: false,
          message: 'Failed to mark attendance. Please try again.'
        });
      }
    }, 1500);
  });
};

// Mock function to get course attendance
export const getCourseAttendance = async (courseId: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          studentId: 'student-123',
          studentName: 'John Doe',
          status: 'present',
          timestamp: new Date().toISOString(),
          method: 'qr'
        },
        // Add more mock attendance records as needed
      ]);
    }, 1000);
  });
};