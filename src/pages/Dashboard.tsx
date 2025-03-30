import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Users, 
  BookOpen, 
  CalendarCheck, 
  AlertTriangle,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle
} from 'lucide-react';
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
import { Line, Bar, Doughnut } from 'react-chartjs-2';

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

const Dashboard: React.FC = () => {
  const { userRole } = useAuth();

  // Mock data for charts
  const attendanceData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
    datasets: [
      {
        label: 'Attendance Rate (%)',
        data: [85, 90, 88, 95, 92, 89],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.3,
      },
    ],
  };

  const courseAttendanceData = {
    labels: ['Database Systems', 'AI & ML', 'Computer Networks', 'Software Engineering', 'Web Development'],
    datasets: [
      {
        label: 'Attendance Rate (%)',
        data: [92, 85, 78, 95, 88],
        backgroundColor: [
          'rgba(59, 130, 246, 0.7)',
          'rgba(16, 185, 129, 0.7)',
          'rgba(245, 158, 11, 0.7)',
          'rgba(99, 102, 241, 0.7)',
          'rgba(236, 72, 153, 0.7)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const attendanceStatusData = {
    labels: ['Present', 'Absent', 'Late'],
    datasets: [
      {
        data: [75, 15, 10],
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
  };

  // Mock upcoming classes
  const upcomingClasses = [
    { id: 1, course: 'Database Systems', time: '10:00 AM - 12:00 PM', location: 'Room 101', date: 'Today' },
    { id: 2, course: 'AI & Machine Learning', time: '2:00 PM - 4:00 PM', location: 'Room 203', date: 'Today' },
    { id: 3, course: 'Computer Networks', time: '9:00 AM - 11:00 AM', location: 'Room 105', date: 'Tomorrow' },
  ];

  // Mock recent attendance
  const recentAttendance = [
    { id: 1, course: 'Software Engineering', date: '2023-05-15', status: 'Present', time: '10:05 AM' },
    { id: 2, course: 'Web Development', date: '2023-05-14', status: 'Present', time: '2:00 PM' },
    { id: 3, course: 'Database Systems', date: '2023-05-13', status: 'Absent', time: 'N/A' },
    { id: 4, course: 'AI & Machine Learning', date: '2023-05-12', status: 'Late', time: '10:15 AM' },
  ];

  // Mock attendance alerts
  const attendanceAlerts = [
    { id: 1, course: 'Computer Networks', message: 'Attendance below 75%', severity: 'high' },
    { id: 2, course: 'Database Systems', message: 'Missed 2 consecutive classes', severity: 'medium' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
            <CalendarCheck className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Overall Attendance</p>
            <p className="text-2xl font-semibold">89.5%</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Enrolled Courses</p>
            <p className="text-2xl font-semibold">5</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Attendance Alerts</p>
            <p className="text-2xl font-semibold">2</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Attendance Trend</p>
            <p className="text-2xl font-semibold">+5.2%</p>
          </div>
        </div>
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Trend Chart */}
        <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Attendance Trend</h2>
          <div className="h-64">
            <Line 
              data={attendanceData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: false,
                    min: 50,
                    max: 100,
                  }
                }
              }} 
            />
          </div>
        </div>

        {/* Attendance Status Doughnut */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Attendance Status</h2>
          <div className="h-64 flex items-center justify-center">
            <Doughnut 
              data={attendanceStatusData} 
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
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Course Attendance */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Course Attendance</h2>
          <div className="h-64">
            <Bar 
              data={courseAttendanceData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: false,
                    min: 50,
                    max: 100,
                  }
                },
                plugins: {
                  legend: {
                    display: false,
                  }
                }
              }} 
            />
          </div>
        </div>

        {/* Upcoming Classes */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Upcoming Classes</h2>
          <div className="space-y-4">
            {upcomingClasses.map((cls) => (
              <div key={cls.id} className="flex items-center p-3 border rounded-lg hover:bg-gray-50">
                <div className="p-2 rounded-full bg-blue-100 text-blue-600 mr-3">
                  <Clock className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{cls.course}</h3>
                  <p className="text-sm text-gray-500">{cls.date}, {cls.time}</p>
                  <p className="text-sm text-gray-500">{cls.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Attendance */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 pb-0">
            <h2 className="text-lg font-semibold">Recent Attendance</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentAttendance.map((attendance) => (
                  <tr key={attendance.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{attendance.course}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{attendance.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{attendance.time}</td>
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

        {/* Attendance Alerts */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Attendance Alerts</h2>
          {attendanceAlerts.length > 0 ? (
            <div className="space-y-4">
              {attendanceAlerts.map((alert) => (
                <div 
                  key={alert.id} 
                  className={`p-4 rounded-lg border ${
                    alert.severity === 'high' 
                      ? 'border-red-200 bg-red-50' 
                      : 'border-yellow-200 bg-yellow-50'
                  }`}
                >
                  <div className="flex items-start">
                    <div className={`p-1.5 rounded-full ${
                      alert.severity === 'high' 
                        ? 'bg-red-100 text-red-600' 
                        : 'bg-yellow-100 text-yellow-600'
                    } mr-3`}>
                      <AlertTriangle className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">{alert.course}</h3>
                      <p className="text-sm">{alert.message}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No attendance alerts</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;