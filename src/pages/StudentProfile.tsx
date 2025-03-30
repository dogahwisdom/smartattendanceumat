import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  BookOpen, 
  CheckCircle2,
  XCircle,
  Clock,
  Edit,
  Camera,
  Save
} from 'lucide-react';

const StudentProfile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  
  // Mock student data
  const [studentData, setStudentData] = useState({
    name: 'John Doe',
    studentId: 'UMT/CS/2023/001',
    email: 'john.doe@student.umat.edu.gh',
    phone: '+233 20 123 4567',
    department: 'Computer Science',
    level: '300',
    dateOfBirth: '1999-05-15',
    address: 'Student Hostel, Block A, Room 105, Tarkwa',
    enrollmentDate: '2021-09-01',
    bio: 'Computer Science student with interest in artificial intelligence and machine learning.',
  });

  // Mock attendance data
  const attendanceData = [
    { id: 1, course: 'Introduction to Computer Science', date: '2023-05-15', status: 'Present', time: '10:05 AM' },
    { id: 2, course: 'Database Systems', date: '2023-05-15', status: 'Present', time: '2:00 PM' },
    { id: 3, course: 'Artificial Intelligence', date: '2023-05-14', status: 'Absent', time: 'N/A' },
    { id: 4, course: 'Computer Networks', date: '2023-05-14', status: 'Late', time: '1:15 PM' },
    { id: 5, course: 'Introduction to Computer Science', date: '2023-05-13', status: 'Present', time: '10:02 AM' },
  ];

  // Mock enrolled courses
  const enrolledCourses = [
    { id: 'cs101', code: 'CS101', name: 'Introduction to Computer Science', instructor: 'Dr. John Smith', attendance: 90 },
    { id: 'db201', code: 'DB201', name: 'Database Systems', instructor: 'Dr. Emily Johnson', attendance: 85 },
    { id: 'ai301', code: 'AI301', name: 'Artificial Intelligence', instructor: 'Dr. Michael Brown', attendance: 70 },
    { id: 'net401', code: 'NET401', name: 'Computer Networks', instructor: 'Dr. Sarah Wilson', attendance: 80 },
  ];

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setStudentData(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    // In a real app, you would save the data to the backend here
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="bg-gradient-to-r from-blue-800 to-blue-600 h-32"></div>
        <div className="px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col md:flex-row md:items-center">
            <div className="-mt-16 md:-mt-20">
              <div className="h-24 w-24 md:h-32 md:w-32 rounded-full border-4 border-white bg-blue-100 flex items-center justify-center relative">
                <User className="h-12 w-12 md:h-16 md:w-16 text-blue-600" />
                {!isEditing && (
                  <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-1.5 rounded-full">
                    <Camera className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
            <div className="mt-4 md:mt-0 md:ml-6">
              <h1 className="text-2xl font-bold">{studentData.name}</h1>
              <div className="flex flex-col md:flex-row md:items-center text-gray-600 mt-1">
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full md:mr-2">
                  {studentData.studentId}
                </span>
                <span className="mt-1 md:mt-0">{studentData.department} • Level {studentData.level}</span>
              </div>
            </div>
          </div>
          
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="mt-4 md:mt-0 flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="mt-4 md:mt-0 flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Personal Information */}
        <div className="md:col-span-1 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
          
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={studentData.name}
                  onChange={handleInputChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={studentData.email}
                  onChange={handleInputChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={studentData.phone}
                  onChange={handleInputChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
              
              <div>
                <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  value={studentData.dateOfBirth}
                  onChange={handleInputChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
              
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={studentData.address}
                  onChange={handleInputChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
              
              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                  Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  rows={3}
                  value={studentData.bio}
                  onChange={handleInputChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                ></textarea>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="flex items-start">
                <Mail className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="text-sm">{studentData.email}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Phone className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Phone</p>
                  <p className="text-sm">{studentData.phone}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Date of Birth</p>
                  <p className="text-sm">{new Date(studentData.dateOfBirth).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Address</p>
                  <p className="text-sm">{studentData.address}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Enrollment Date</p>
                  <p className="text-sm">{new Date(studentData.enrollmentDate).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="pt-2">
                <p className="text-sm font-medium text-gray-500 mb-1">Bio</p>
                <p className="text-sm">{studentData.bio}</p>
              </div>
            </div>
          )}
        </div>

        {/* Enrolled Courses */}
        <div className="md:col-span-2 bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 pb-0">
            <h2 className="text-lg font-semibold mb-4">Enrolled Courses</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Instructor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Attendance
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {enrolledCourses.map((course) => (
                  <tr key={course.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="p-2 rounded-full bg-blue-100 text-blue-600 mr-3">
                          <BookOpen className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{course.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {course.code}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {course.instructor}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className={`h-2.5 rounded-full ${
                            course.attendance >= 90 ? 'bg-green-500' :
                            course.attendance >= 75 ? 'bg-blue-500' :
                            course.attendance >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${course.attendance}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-900">{course.attendance}%</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Recent Attendance */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 pb-0">
          <h2 className="text-lg font-semibold mb-4">Recent Attendance</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {attendanceData.map((attendance) => (
                <tr key={attendance.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {attendance.course}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(attendance.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {attendance.time}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      attendance.status === 'Present' 
                        ? 'bg-green-100 text-green-800' 
                        : attendance.status === 'Absent' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {attendance.status === 'Present' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                      {attendance.status === 'Absent' && <XCircle className="w-3 h-3 mr-1" />}
                      {attendance.status === 'Late' && <Clock className="w-3 h-3 mr-1" />}
                      {attendance.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;