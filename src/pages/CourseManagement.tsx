import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Users, 
  Calendar, 
  Clock, 
  MapPin,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  ChevronDown,
  QrCode,
  Download
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { courseService } from '../services/api';
import QRCodeGenerator from '../components/QRCodeGenerator';

const CourseManagement: React.FC = () => {
  const { currentUser, userRole } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedSemester, setSelectedSemester] = useState('current');
  const [showQRCode, setShowQRCode] = useState<string | null>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [newCourse, setNewCourse] = useState({
    code: '',
    name: '',
    department: '',
    schedule: '',
    time: '',
    location: '',
    semester: 'Fall 2023'
  });

  // Fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        if (!currentUser) return;
        
        let coursesData;
        if (userRole === 'lecturer') {
          coursesData = await courseService.getLecturerCourses(currentUser.id);
        } else {
          coursesData = await courseService.getCourses();
        }
        
        setCourses(coursesData);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };
    
    fetchCourses();
  }, [currentUser, userRole]);

  // Filter courses based on search query and filters
  const filteredCourses = courses.filter(course => {
    const matchesSearch = 
      course.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDepartment = selectedDepartment === 'all' || course.department === selectedDepartment;
    const matchesSemester = selectedSemester === 'all' || 
      (selectedSemester === 'current' && course.semester === 'Fall 2023');
    
    return matchesSearch && matchesDepartment && matchesSemester;
  });

  // Mock departments
  const departments = [
    'Computer Science',
    'Mining Engineering',
    'Geological Engineering',
    'Electrical Engineering',
    'Mechanical Engineering'
  ];

  // Generate QR code for a course
  const generateQRCode = (courseId: string) => {
    setShowQRCode(courseId);
  };

  // Close QR code modal
  const closeQRCodeModal = () => {
    setShowQRCode(null);
  };

  // Handle input change for new course
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewCourse(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission for new course
  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (!currentUser) return;
      
      const courseData = {
        ...newCourse,
        instructorId: currentUser.id,
        instructor: currentUser.displayName || 'Unknown Instructor',
        students: 0,
        createdAt: new Date().toISOString()
      };
      
      await courseService.createCourse(courseData);
      
      // Refresh courses
      let coursesData;
      if (userRole === 'lecturer') {
        coursesData = await courseService.getLecturerCourses(currentUser.id);
      } else {
        coursesData = await courseService.getCourses();
      }
      
      setCourses(coursesData);
      
      // Reset form and close modal
      setNewCourse({
        code: '',
        name: '',
        department: '',
        schedule: '',
        time: '',
        location: '',
        semester: 'Fall 2023'
      });
      setShowAddCourseModal(false);
    } catch (error) {
      console.error('Error adding course:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with search and filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h2 className="text-xl font-semibold">Course Management</h2>
          
          <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
              <ChevronDown className={`h-4 w-4 ml-1 transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
            
            <button
              onClick={() => setShowAddCourseModal(true)}
              className="flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Course
            </button>
          </div>
        </div>
        
        {/* Filters */}
        {showFilters && (
          <div className="p-4 bg-gray-50 rounded-lg mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="department-filter" className="block text-sm font-medium text-gray-700 mb-1">
                  Department
                </label>
                <select
                  id="department-filter"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                >
                  <option value="all">All Departments</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="semester-filter" className="block text-sm font-medium text-gray-700 mb-1">
                  Semester
                </label>
                <select
                  id="semester-filter"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                  value={selectedSemester}
                  onChange={(e) => setSelectedSemester(e.target.value)}
                >
                  <option value="current">Current Semester</option>
                  <option value="all">All Semesters</option>
                  <option value="Fall 2023">Fall 2023</option>
                  <option value="Spring 2023">Spring 2023</option>
                  <option value="Fall 2022">Fall 2022</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <div key={course.id} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{course.name}</h3>
                  <p className="text-sm text-gray-500">{course.code}</p>
                </div>
                <div className="flex space-x-2">
                  <button className="p-1 text-gray-400 hover:text-blue-500">
                    <Edit className="h-5 w-5" />
                  </button>
                  <button className="p-1 text-gray-400 hover:text-red-500">
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              <div className="mt-4 space-y-3">
                <div className="flex items-center text-sm">
                  <Users className="h-4 w-4 text-gray-400 mr-2" />
                  <span>{course.instructor}</span>
                </div>
                
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                  <span>{course.schedule}</span>
                </div>
                
                <div className="flex items-center text-sm">
                  <Clock className="h-4 w-4 text-gray-400 mr-2" />
                  <span>{course.time}</span>
                </div>
                
                <div className="flex items-center text-sm">
                  <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                  <span>{course.location}</span>
                </div>
                
                <div className="flex items-center text-sm">
                  <BookOpen className="h-4 w-4 text-gray-400 mr-2" />
                  <span>{course.department}</span>
                </div>
                
                <div className="flex items-center text-sm">
                  <Users className="h-4 w-4 text-gray-400 mr-2" />
                  <span>{course.students || 0} Students</span>
                </div>
              </div>
              
              <div className="mt-6 flex space-x-3">
                <button
                  onClick={() => generateQRCode(course.id)}
                  className="flex-1 flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <QrCode className="h-4 w-4 mr-2" />
                  Generate QR
                </button>
                
                <button
                  className="flex-1 flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* QR Code Modal */}
      {showQRCode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">
                Attendance QR Code
              </h3>
              <button
                onClick={closeQRCodeModal}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <QRCodeGenerator 
              courseId={showQRCode} 
              courseName={courses.find(c => c.id === showQRCode)?.name || 'Course'} 
              duration={5}
            />
          </div>
        </div>
      )}

      {/* Add Course Modal */}
      {showAddCourseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">
                Add New Course
              </h3>
              <button
                onClick={() => setShowAddCourseModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleAddCourse} className="space-y-4">
              <div>
                <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
                  Course Code
                </label>
                <input
                  type="text"
                  id="code"
                  name="code"
                  required
                  value={newCourse.code}
                  onChange={handleInputChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="e.g., CS101"
                />
              </div>
              
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Course Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={newCourse.name}
                  onChange={handleInputChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="e.g., Introduction to Computer Science"
                />
              </div>
              
              <div>
                <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                  Department
                </label>
                <select
                  id="department"
                  name="department"
                  required
                  value={newCourse.department}
                  onChange={handleInputChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="schedule" className="block text-sm font-medium text-gray-700 mb-1">
                  Schedule
                </label>
                <input
                  type="text"
                  id="schedule"
                  name="schedule"
                  required
                  value={newCourse.schedule}
                  onChange={handleInputChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="e.g., Mon, Wed, Fri"
                />
              </div>
              
              <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                  Time
                </label>
                <input
                  type="text"
                  id="time"
                  name="time"
                  required
                  value={newCourse.time}
                  onChange={handleInputChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="e.g., 10:00 AM - 12:00 PM"
                />
              </div>
              
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  required
                  value={newCourse.location}
                  onChange={handleInputChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="e.g., Room 101"
                />
              </div>
              
              <div>
                <label htmlFor="semester" className="block text-sm font-medium text-gray-700 mb-1">
                  Semester
                </label>
                <select
                  id="semester"
                  name="semester"
                  required
                  value={newCourse.semester}
                  onChange={handleInputChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  <option value="Fall 2023">Fall 2023</option>
                  <option value="Spring 2023">Spring 2023</option>
                  <option value="Fall 2022">Fall 2022</option>
                </select>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddCourseModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  Add Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseManagement;