import React, { useState, useEffect } from 'react';
import { 
  Download, 
  Filter, 
  Calendar, 
  User, 
  BookOpen,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  ChevronDown,
  Search
} from 'lucide-react';
import { format } from 'date-fns';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement,
  Title, 
  Tooltip, 
  Legend, 
  ArcElement 
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { useAuth } from '../contexts/AuthContext';
import { getCourses, getCourseAttendance } from '../services/firebase';

// Register ChartJS components
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement,
  Title, 
  Tooltip, 
  Legend,
  ArcElement
);

const AttendanceReports: React.FC = () => {
  const { currentUser, userRole } = useAuth();
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('month');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [courses, setCourses] = useState<any[]>([]);
  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        if (!currentUser) return;
        
        const coursesData = await getCourses();
        setCourses(coursesData);
        
        if (coursesData.length > 0) {
          setSelectedCourse(coursesData[0].id);
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };
    
    fetchCourses();
  }, [currentUser]);

  // Fetch attendance data when selected course changes
  useEffect(() => {
    const fetchAttendanceData = async () => {
      if (!selectedCourse || selectedCourse === 'all') return;
      
      try {
        setLoading(true);
        const data = await getCourseAttendance(selectedCourse);
        setAttendanceData(data);
      } catch (error) {
        console.error('Error fetching attendance data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAttendanceData();
  }, [selectedCourse]);

  // Process attendance data for charts
  const processAttendanceData = () => {
    // Count present, absent, late
    let present = 0;
    let absent = 0;
    let late = 0;
    
    attendanceData.forEach(record => {
      if (record.status === 'present') {
        present++;
      } else if (record.status === 'absent') {
        absent++;
      } else if (record.status === 'late') {
        late++;
      }
    });
    
    return {
      statusData: {
        labels: ['Present', 'Absent', 'Late'],
        datasets: [
          {
            data: [present, absent, late],
            backgroundColor: [
              'rgba(16, 185, 129, 0.7)',
              'rgba(239, 68, 68, 0.7)',
              'rgba(245, 158, 11, 0.7)',
            ],
            borderColor: [
              'rgba(16, 185, 129, 1)',
              'rgba(239, 68, 68, 1)',
              'rgba(245, 158, 11, 1)',
            ],
            borderWidth: 1,
          },
        ],
      },
      weeklyData: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [
          {
            label: 'Present',
            data: [42, 38, 45, 40],
            backgroundColor: 'rgba(16, 185, 129, 0.7)',
          },
          {
            label: 'Absent',
            data: [8, 12, 5, 10],
            backgroundColor: 'rgba(239, 68, 68, 0.7)',
          },
          {
            label: 'Late',
            data: [5, 5, 5, 5],
            backgroundColor: 'rgba(245, 158, 11, 0.7)',
          },
        ],
      }
    };
  };

  // Get chart data
  const { statusData, weeklyData } = processAttendanceData();

  // Mock student attendance data
  const studentAttendanceData = [
    { id: 1, name: 'John Doe', studentId: 'UMT/CS/2023/001', present: 15, absent: 3, late: 2, percentage: 85 },
    { id: 2, name: 'Jane Smith', studentId: 'UMT/CS/2023/002', present: 18, absent: 1, late: 1, percentage: 95 },
    { id: 3, name: 'Michael Johnson', studentId: 'UMT/CS/2023/003', present: 12, absent: 5, late: 3, percentage: 70 },
    { id: 4, name: 'Emily Brown', studentId: 'UMT/CS/2023/004', present: 17, absent: 2, late: 1, percentage: 90 },
    { id: 5, name: 'David Wilson', studentId: 'UMT/CS/2023/005', present: 14, absent: 4, late: 2, percentage: 78 },
    { id: 6, name: 'Sarah Taylor', studentId: 'UMT/CS/2023/006', present: 19, absent: 0, late: 1, percentage: 98 },
    { id: 7, name: 'James Anderson', studentId: 'UMT/CS/2023/007', present: 10, absent: 8, late: 2, percentage: 60 },
    { id: 8, name: 'Olivia Martinez', studentId: 'UMT/CS/2023/008', present: 16, absent: 3, late: 1, percentage: 85 },
  ];

  // Filter students based on search query
  const filteredStudents = studentAttendanceData.filter(student => 
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.studentId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Export attendance data
  const exportAttendanceData = () => {
    // In a real app, you would generate a CSV or Excel file
    alert('Attendance data exported successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Header with filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h2 className="text-xl font-semibold">Attendance Reports</h2>
          
          <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
              <ChevronDown className={`h-4 w-4 ml-1 transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
            
            <button
              onClick={exportAttendanceData}
              className="flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
          </div>
        </div>
        
        {/* Filters */}
        {showFilters && (
          <div className="p-4 bg-gray-50 rounded-lg mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="course-filter" className="block text-sm font-medium text-gray-700 mb-1">
                  Course
                </label>
                <select
                  id="course-filter"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                >
                  <option value="all">All Courses</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="date-range" className="block text-sm font-medium text-gray-700 mb-1">
                  Date Range
                </label>
                <select
                  id="date-range"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                >
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="semester">This Semester</option>
                  <option value="custom">Custom Range</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="search-students" className="block text-sm font-medium text-gray-700 mb-1">
                  Search Students
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="search-students"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="Name or ID"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-blue-100 text-blue-600 mr-3">
                <User className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Students</p>
                <p className="text-xl font-semibold">48</p>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4 border border-green-100">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-green-100 text-green-600 mr-3">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Average Attendance</p>
                <p className="text-xl font-semibold">82.5%</p>
              </div>
            </div>
          </div>
          
          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-100">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-yellow-100 text-yellow-600 mr-3">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Classes Held</p>
                <p className="text-xl font-semibold">20</p>
              </div>
            </div>
          </div>
          
          <div className="bg-red-50 rounded-lg p-4 border border-red-100">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-red-100 text-red-600 mr-3">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-gray-500">At Risk Students</p>
                <p className="text-xl font-semibold">7</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Status Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-4">Attendance Overview</h3>
          <div className="h-64 flex items-center justify-center">
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <Doughnut 
                data={statusData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                    }
                  }
                }} 
              />
            )}
          </div>
        </div>

        {/* Weekly Attendance Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-4">Weekly Attendance</h3>
          <div className="h-64">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <Bar 
                data={weeklyData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    x: {
                      stacked: true,
                    },
                    y: {
                      stacked: true,
                      beginAtZero: true,
                    }
                  }
                }} 
              />
            )}
          </div>
        </div>
      </div>

      {/* Student Attendance Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 pb-0">
          <h3 className="text-lg font-medium">Student Attendance</h3>
          <p className="text-sm text-gray-500 mt-1">
            {dateRange === 'week' ? 'This Week' : 
             dateRange === 'month' ? 'This Month' : 
             dateRange === 'semester' ? 'This Semester' : 'Custom Range'}
            {selectedCourse !== 'all' && ` • ${courses.find(c => c.id === selectedCourse)?.name || ''}`}
          </p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Present
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Absent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Late
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Attendance %
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mr-2"></div>
                      <span>Loading attendance data...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
                          {student.name.charAt(0)}
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{student.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.studentId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-sm text-gray-900">{student.present}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <XCircle className="h-4 w-4 text-red-500 mr-1" />
                        <span className="text-sm text-gray-900">{student.absent}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-yellow-500 mr-1" />
                        <span className="text-sm text-gray-900">{student.late}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className={`h-2.5 rounded-full ${
                            student.percentage >= 90 ? 'bg-green-500' :
                            student.percentage >= 75 ? 'bg-blue-500' :
                            student.percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${student.percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-900">{student.percentage}%</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        student.percentage >= 90 ? 'bg-green-100 text-green-800' :
                        student.percentage >= 75 ? 'bg-blue-100 text-blue-800' :
                        student.percentage >= 60 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {student.percentage >= 90 ? 'Excellent' :
                         student.percentage >= 75 ? 'Good' :
                         student.percentage >= 60 ? 'Average' : 'At Risk'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    No students found matching your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium mb-4">AI-Powered Insights</h3>
        
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">Attendance Patterns</h4>
            <p className="text-sm text-blue-700">
              Attendance tends to drop by 15% on Mondays and Fridays. Consider implementing engaging activities on these days to improve attendance.
            </p>
          </div>
          
          <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-lg">
            <h4 className="font-medium text-yellow-800 mb-2">At-Risk Students</h4>
            <p className="text-sm text-yellow-700">
              7 students have missed more than 3 consecutive classes. Early intervention is recommended to prevent further absenteeism.
            </p>
          </div>
          
          <div className="p-4 bg-green-50 border border-green-100 rounded-lg">
            <h4 className="font-medium text-green-800 mb-2">Improvement Opportunities</h4>
            <p className="text-sm text-green-700">
              Classes with interactive components show 23% higher attendance rates. Consider incorporating more group activities and discussions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceReports;