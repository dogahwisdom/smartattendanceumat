import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';
import path from 'path';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Configuration
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Initialize Express app
const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Database setup
let db;
const initializeDatabase = async () => {
  db = await open({
    filename: path.join(__dirname, 'database.sqlite'),
    driver: sqlite3.Database
  });

  // Create tables if they don't exist
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      displayName TEXT NOT NULL,
      role TEXT NOT NULL,
      department TEXT,
      studentId TEXT,
      staffId TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS courses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT NOT NULL,
      name TEXT NOT NULL,
      instructorId INTEGER NOT NULL,
      department TEXT NOT NULL,
      schedule TEXT,
      time TEXT,
      location TEXT,
      semester TEXT,
      students INTEGER DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (instructorId) REFERENCES users (id)
    );

    CREATE TABLE IF NOT EXISTS enrollments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      courseId INTEGER NOT NULL,
      studentId INTEGER NOT NULL,
      status TEXT DEFAULT 'active',
      enrolledAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (courseId) REFERENCES courses (id),
      FOREIGN KEY (studentId) REFERENCES users (id)
    );

    CREATE TABLE IF NOT EXISTS attendance_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      courseId INTEGER NOT NULL,
      courseName TEXT NOT NULL,
      expiryTime DATETIME NOT NULL,
      duration INTEGER NOT NULL,
      active BOOLEAN DEFAULT 1,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      closedAt DATETIME,
      FOREIGN KEY (courseId) REFERENCES courses (id)
    );

    CREATE TABLE IF NOT EXISTS attendance (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sessionId INTEGER NOT NULL,
      studentId INTEGER NOT NULL,
      method TEXT NOT NULL,
      status TEXT NOT NULL,
      data TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (sessionId) REFERENCES attendance_sessions (id),
      FOREIGN KEY (studentId) REFERENCES users (id)
    );
  `);

  // Insert demo users if they don't exist
  const users = await db.all('SELECT * FROM users');
  if (users.length === 0) {
    const hashedPassword = await bcrypt.hash('password', 10);
    
    // Insert demo student
    await db.run(
      'INSERT INTO users (email, password, displayName, role, department, studentId) VALUES (?, ?, ?, ?, ?, ?)',
      ['student@umat.edu.gh', hashedPassword, 'John Doe', 'student', 'Computer Science', 'UMT/CS/2023/001']
    );
    
    // Insert demo lecturer
    await db.run(
      'INSERT INTO users (email, password, displayName, role, department, staffId) VALUES (?, ?, ?, ?, ?, ?)',
      ['lecturer@umat.edu.gh', hashedPassword, 'Dr. Jane Smith', 'lecturer', 'Computer Science', 'UMT/STAFF/2020/042']
    );
    
    // Insert demo admin
    await db.run(
      'INSERT INTO users (email, password, displayName, role, department) VALUES (?, ?, ?, ?, ?)',
      ['admin@umat.edu.gh', hashedPassword, 'Admin User', 'admin', 'Administration']
    );

    // Insert demo courses
    const lecturerId = await db.get('SELECT id FROM users WHERE email = ?', ['lecturer@umat.edu.gh']);
    
    await db.run(
      'INSERT INTO courses (code, name, instructorId, department, schedule, time, location, semester) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      ['CS101', 'Introduction to Computer Science', lecturerId.id, 'Computer Science', 'Mon, Wed, Fri', '10:00 AM - 12:00 PM', 'Room 101', 'Fall 2023']
    );
    
    await db.run(
      'INSERT INTO courses (code, name, instructorId, department, schedule, time, location, semester) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      ['DB201', 'Database Systems', lecturerId.id, 'Computer Science', 'Tue, Thu', '2:00 PM - 4:00 PM', 'Room 203', 'Fall 2023']
    );
  }

  console.log('Database initialized');
};

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

// Routes

// Auth routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    // Create JWT token
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        displayName: user.displayName, 
        role: user.role 
      }, 
      JWT_SECRET, 
      { expiresIn: '24h' }
    );
    
    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: 'strict'
    });
    
    // Return user data (without password)
    const { password: _, ...userData } = user;
    
    res.status(200).json({
      message: 'Login successful',
      user: userData,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ message: 'Logout successful' });
});

app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    // Check if user exists
    const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // In a real app, you would send an email with a reset link
    // For demo purposes, we'll just return success
    
    res.status(200).json({ message: 'Password reset email sent' });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// User routes
app.get('/api/users/profile', authenticateToken, async (req, res) => {
  try {
    const user = await db.get('SELECT id, email, displayName, role, department, studentId, staffId, createdAt, updatedAt FROM users WHERE id = ?', [req.user.id]);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/users/profile', authenticateToken, async (req, res) => {
  try {
    const { displayName, department, phone, address, bio } = req.body;
    
    await db.run(
      'UPDATE users SET displayName = ?, department = ?, phone = ?, address = ?, bio = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
      [displayName, department, phone, address, bio, req.user.id]
    );
    
    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Course routes
app.get('/api/courses', authenticateToken, async (req, res) => {
  try {
    let courses;
    
    if (req.user.role === 'lecturer') {
      courses = await db.all('SELECT * FROM courses WHERE instructorId = ?', [req.user.id]);
    } else {
      courses = await db.all('SELECT * FROM courses');
    }
    
    // Get instructor names
    for (let course of courses) {
      const instructor = await db.get('SELECT displayName FROM users WHERE id = ?', [course.instructorId]);
      course.instructor = instructor ? instructor.displayName : 'Unknown';
    }
    
    res.status(200).json(courses);
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/courses', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'lecturer' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    const { code, name, department, schedule, time, location, semester } = req.body;
    
    const result = await db.run(
      'INSERT INTO courses (code, name, instructorId, department, schedule, time, location, semester) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [code, name, req.user.id, department, schedule, time, location, semester]
    );
    
    const newCourse = await db.get('SELECT * FROM courses WHERE id = ?', [result.lastID]);
    
    res.status(201).json(newCourse);
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Attendance session routes
app.post('/api/attendance/sessions', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'lecturer' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    const { courseId, courseName, duration } = req.body;
    
    // Calculate expiry time
    const expiryTime = new Date();
    expiryTime.setMinutes(expiryTime.getMinutes() + duration);
    
    const result = await db.run(
      'INSERT INTO attendance_sessions (courseId, courseName, expiryTime, duration, active) VALUES (?, ?, ?, ?, ?)',
      [courseId, courseName, expiryTime.toISOString(), duration * 60, true]
    );
    
    res.status(201).json({ 
      id: result.lastID,
      courseId,
      courseName,
      expiryTime: expiryTime.toISOString(),
      duration: duration * 60,
      active: true
    });
  } catch (error) {
    console.error('Create attendance session error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/attendance/sessions/:id/close', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'lecturer' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    const { id } = req.params;
    
    await db.run(
      'UPDATE attendance_sessions SET active = 0, closedAt = CURRENT_TIMESTAMP, updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
      [id]
    );
    
    res.status(200).json({ message: 'Attendance session closed successfully' });
  } catch (error) {
    console.error('Close attendance session error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Attendance marking routes
app.post('/api/attendance/mark', authenticateToken, async (req, res) => {
  try {
    const { sessionId, method, data } = req.body;
    
    // Check if session exists and is active
    const session = await db.get('SELECT * FROM attendance_sessions WHERE id = ?', [sessionId]);
    
    if (!session) {
      return res.status(404).json({ 
        success: false, 
        message: 'Attendance session not found' 
      });
    }
    
    if (!session.active) {
      return res.status(400).json({ 
        success: false, 
        message: 'Attendance session is closed' 
      });
    }
    
    // Check if session has expired
    const expiryTime = new Date(session.expiryTime);
    if (expiryTime < new Date()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Attendance session has expired' 
      });
    }
    
    // Check if student has already marked attendance
    const existingAttendance = await db.get(
      'SELECT * FROM attendance WHERE sessionId = ? AND studentId = ?',
      [sessionId, req.user.id]
    );
    
    if (existingAttendance) {
      return res.status(400).json({ 
        success: false, 
        message: 'Attendance already marked for this session' 
      });
    }
    
    // Determine if student is late
    const now = new Date();
    const createdAt = new Date(session.createdAt);
    const lateThreshold = 10; // 10 minutes
    const isLate = (now.getTime() - createdAt.getTime()) > lateThreshold * 60 * 1000;
    
    // Mark attendance
    await db.run(
      'INSERT INTO attendance (sessionId, studentId, method, status, data) VALUES (?, ?, ?, ?, ?)',
      [sessionId, req.user.id, method, isLate ? 'late' : 'present', JSON.stringify(data)]
    );
    
    res.status(200).json({ 
      success: true, 
      message: isLate ? 'Attendance marked as late' : 'Attendance marked successfully' 
    });
  } catch (error) {
    console.error('Mark attendance error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// Attendance reports routes
app.get('/api/attendance/course/:courseId', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'lecturer' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    const { courseId } = req.params;
    
    // Get all sessions for this course
    const sessions = await db.all(
      'SELECT * FROM attendance_sessions WHERE courseId = ? ORDER BY createdAt DESC',
      [courseId]
    );
    
    // Get attendance records for each session
    const attendanceRecords = [];
    
    for (const session of sessions) {
      const records = await db.all(
        'SELECT a.*, u.displayName, u.studentId FROM attendance a JOIN users u ON a.studentId = u.id WHERE a.sessionId = ?',
        [session.id]
      );
      
      attendanceRecords.push(...records.map(record => ({
        ...record,
        session: {
          id: session.id,
          courseId: session.courseId,
          courseName: session.courseName,
          createdAt: session.createdAt,
          expiryTime: session.expiryTime
        }
      })));
    }
    
    res.status(200).json(attendanceRecords);
  } catch (error) {
    console.error('Get course attendance error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/attendance/student', authenticateToken, async (req, res) => {
  try {
    const { courseId } = req.query;
    
    let query = `
      SELECT a.*, s.courseName, s.courseId, s.createdAt as sessionDate
      FROM attendance a
      JOIN attendance_sessions s ON a.sessionId = s.id
      WHERE a.studentId = ?
    `;
    
    const params = [req.user.id];
    
    if (courseId) {
      query += ' AND s.courseId = ?';
      params.push(courseId);
    }
    
    query += ' ORDER BY s.createdAt DESC';
    
    const records = await db.all(query, params);
    
    // Get course details for each record
    for (const record of records) {
      const course = await db.get('SELECT * FROM courses WHERE id = ?', [record.courseId]);
      record.course = course;
    }
    
    res.status(200).json(records);
  } catch (error) {
    console.error('Get student attendance error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Start server
initializeDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  });