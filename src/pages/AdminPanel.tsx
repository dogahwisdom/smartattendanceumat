import React, { useState } from 'react';
import { 
  Users, 
  BookOpen, 
  Settings, 
  Database, 
  Server,
  Bell,
  Shield,
  Upload,
  Download,
  Search,
  Plus,
  Edit,
  Trash2,
  RefreshCw,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'courses' | 'system' | 'integrations'>('users');
  const [searchQuery, setSearchQuery] = useState('');
  const [showImportModal, setShowImportModal] = useState(false);
  const [importType, setImportType] = useState<'students' | 'lecturers' | 'courses' | null>(null);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importStatus, setImportStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');

  // Mock users data
  const users = [
    { id: 1, name: 'John Doe', email: 'john.doe@student.umat.edu.gh', role: 'student', department: 'Computer Science', status: 'active' },
    { id: 2, name: 'Jane Smith', email: 'jane.smith@student.umat.edu.gh', role: 'student', department: 'Mining Engineering', status: 'active' },
    { id: 3, name: 'Dr. Michael Brown', email: 'michael.brown@lecturer.umat.edu.gh', role: 'lecturer', department: 'Computer Science', status: 'active' },
    { id: 4, name: 'Dr. Emily Johnson', email: 'emily.johnson@lecturer.umat.edu.gh', role: 'lecturer', department: 'Geological Engineering', status: 'active' },
    { id: 5, name: 'Admin User', email: 'admin@umat.edu.gh', role: 'admin', department: 'Administration', status: 'active' },
    { id: 6, name: 'David Wilson', email: 'david.wilson@student.umat.edu.gh', role: 'student', department: 'Electrical Engineering', status: 'inactive' },
  ];

  // Mock courses data
  const courses = [
    { id: 'cs101', code: 'CS101', name: 'Introduction to Computer Science', department: 'Computer Science', students: 45, status: 'active' },
    { id: 'db201', code: 'DB201', name: 'Database Systems', department: 'Computer Science', students: 38, status: 'active' },
    { id: 'ai301', code: 'AI301', name: 'Artificial Intelligence', department: 'Computer Science', students: 32, status: 'active' },
    { id: 'min201', code: 'MIN201', name: 'Introduction to Mining Engineering', department: 'Mining Engineering', students: 50, status: 'active' },
    { id: 'geo301', code: 'GEO301', name: 'Geology for Engineers', department: 'Geological Engineering', students: 42, status: 'active' },
    { id: 'net401', code: 'NET401', name: 'Computer Networks', department: 'Computer Science', students: 28, status: 'inactive' },
  ];

  // Mock system status
  const systemStatus = {
    server: 'Online',
    database: 'Connected',
    storage: '45% used (450GB/1TB)',
    lastBackup: '2023-05-15 03:00 AM',
    apiStatus: 'Operational',
  };

  // Mock integrations
  const integrations = [
    { id: 'moodle', name: 'Moodle LMS', status: 'Connected', lastSync: '2023-05-15 08:30 AM' },
    { id: 'blackboard', name: 'Blackboard', status: 'Connected', lastSync: '2023-05-15 09:15 AM' },
    { id: 'canvas', name: 'Canvas LMS', status: 'Not Connected', lastSync: 'N/A' },
    { id: 'sms', name: 'SMS Gateway', status: 'Connected', lastSync: '2023-05-15 10:00 AM' },
    { id: 'email', name: 'Email Service', status: 'Connected', lastSync: '2023-05-15 10:30 AM' },
  ];

  // Filter users based on search query
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter courses based on search query
  const filteredCourses = courses.filter(course => 
    course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle file import
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImportFile(e.target.files[0]);
    }
  };

  // Handle import submission
  const handleImportSubmit = () => {
    if (!importFile || !importType) return;
    
    setImportStatus('processing');
    
    // Simulate import process
    setTimeout(() => {
      // 90% chance of success
      if (Math.random() > 0.1) {
        setImportStatus('success');
      } else {
        setImportStatus('error');
      }
    }, 2000);
  };

  // Reset import modal
  const resetImportModal = () => {
    setImportFile(null);
    setImportType(null);
    setImportStatus('idle');
  };

  // Close import modal
  const closeImportModal = () => {
    resetImportModal();
    setShowImportModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Admin Panel Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-semibold">Admin Panel</h2>
          
          <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <button
              onClick={() => {
                setShowImportModal(true);
                resetImportModal();
              }}
              className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Upload className="h-4 w-4 mr-2" />
              Import
            </button>
            
            <button
              className="flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </button>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="mt-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-6">
            <button
              onClick={() => setActiveTab('users')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'users'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Users
              </div>
            </button>
            
            <button
              onClick={() => setActiveTab('courses')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'courses'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <BookOpen className="h-5 w-5 mr-2" />
                Courses
              </div>
            </button>
            
            <button
              onClick={() => setActiveTab('system')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'system'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                System
              </div>
            </button>
            
            <button
              onClick={() => setActiveTab('integrations')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'integrations'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <Database className="h-5 w-5 mr-2" />
                Integrations
              </div>
            </button>
          </nav>
        </div>
      </div>

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
                          {user.name.charAt(0)}
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.role === 'admin' 
                          ? 'bg-purple-100 text-purple-800' 
                          : user.role === 'lecturer' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-green-100 text-green-800'
                      }`}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredUsers.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No users found matching your search criteria.</p>
            </div>
          )}
        </div>
      )}

      {/* Courses Tab */}
      {activeTab === 'courses' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
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
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Students
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCourses.map((course) => (
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
                      {course.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {course.students}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        course.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredCourses.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No courses found matching your search criteria.</p>
            </div>
          )}
        </div>
      )}

      {/* System Tab */}
      {activeTab === 'system' && (
        <div className="space-y-6">
          {/* System Status */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium mb-4">System Status</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-green-100 text-green-600 mr-3">
                    <Server className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Server Status</p>
                    <p className="text-sm font-semibold text-green-600">{systemStatus.server}</p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-green-100 text-green-600 mr-3">
                    <Database className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Database Status</p>
                    <p className="text-sm font-semibold text-green-600">{systemStatus.database}</p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-blue-100 text-blue-600 mr-3">
                    <Database className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Storage</p>
                    <p className="text-sm font-semibold">{systemStatus.storage}</p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-blue-100 text-blue-600 mr-3">
                    <Download className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Last Backup</p>
                    <p className="text-sm font-semibold">{systemStatus.lastBackup}</p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-green-100 text-green-600 mr-3">
                    <Server className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">API Status</p>
                    <p className="text-sm font-semibold text-green-600">{systemStatus.apiStatus}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex space-x-4">
              <button className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Status
              </button>
              
              <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                <Download className="h-4 w-4 mr-2" />
                Backup Now
              </button>
            </div>
          </div>
          
          {/* System Settings */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium mb-4">System Settings</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-blue-100 text-blue-600 mr-3">
                    <Bell className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Notification Settings</p>
                    <p className="text-sm text-gray-500">Configure email and SMS notifications</p>
                  </div>
                </div>
                <button className="text-blue-600 hover:text-blue-900">
                  <Edit className="h-4 w-4" />
                </button>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-blue-100 text-blue-600 mr-3">
                    <Shield className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Security Settings</p>
                    <p className="text-sm text-gray-500">Configure authentication and access control</p>
                  </div>
                </div>
                <button className="text-blue-600 hover:text-blue-900">
                  <Edit className="h-4 w-4" />
                </button>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-blue-100 text-blue-600 mr-3">
                    <Database className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Database Settings</p>
                    <p className="text-sm text-gray-500">Configure database connections and backups</p>
                  </div>
                </div>
                <button className="text-blue-600 hover:text-blue-900">
                  <Edit className="h-4 w-4" />
                </button>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-blue-100 text-blue-600 mr-3">
                    <Settings className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">General Settings</p>
                    <p className="text-sm text-gray-500">Configure system-wide settings</p>
                  </div>
                </div>
                <button className="text-blue-600 hover:text-blue-900">
                  <Edit className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Integrations Tab */}
      {activeTab === 'integrations' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-4">Integrations</h3>
          
          <div className="space-y-4">
            {integrations.map((integration) => (
              <div key={integration.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center">
                  <div className={`p-2 rounded-full ${
                    integration.status === 'Connected' 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-gray-100 text-gray-600'
                  } mr-3`}>
                    <Database className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{integration.name}</p>
                    <div className="flex items-center mt-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        integration.status === 'Connected' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      } mr-2`}>
                        {integration.status}
                      </span>
                      {integration.status === 'Connected' && (
                        <span className="text-xs text-gray-500">
                          Last sync: {integration.lastSync}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <button className={`px-3 py-1 rounded-md text-sm font-medium ${
                  integration.status === 'Connected' 
                    ? 'text-red-600 hover:text-red-900' 
                    : 'text-blue-600 hover:text-blue-900'
                }`}>
                  {integration.status === 'Connected' ? 'Disconnect' : 'Connect'}
                </button>
              </div>
            ))}
          </div>
          
          <div className="mt-6">
            <button className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add New Integration
            </button>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">
                Import Data
              </h3>
              <button
                onClick={closeImportModal}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {importStatus === 'idle' && (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Import Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setImportType('students')}
                      className={`p-3 border rounded-md flex items-center justify-center ${
                        importType === 'students' 
                          ? 'border-blue-500 bg-blue-50 text-blue-700' 
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <Users className="h-5 w-5 mr-2" />
                      Students
                    </button>
                    <button
                      onClick={() => setImportType('lecturers')}
                      className={`p-3 border rounded-md flex items-center justify-center ${
                        importType === 'lecturers' 
                          ? 'border-blue-500 bg-blue-50 text-blue-700' 
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <Users className="h-5 w-5 mr-2" />
                      Lecturers
                    </button>
                    <button
                      onClick={() => setImportType('courses')}
                      className={`p-3 border rounded-md flex items-center justify-center ${
                        importType === 'courses' 
                          ? 'border-blue-500 bg-blue-50 text-blue-700' 
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <BookOpen className="h-5 w-5 mr-2" />
                      Courses
                    </button>
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Upload File
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                        >
                          <span>Upload a file</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                            accept=".csv,.xlsx,.xls"
                            onChange={handleFileChange}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">CSV, Excel files up to 10MB</p>
                    </div>
                  </div>
                  {importFile && (
                    <p className="mt-2 text-sm text-gray-600">
                      Selected file: {importFile.name}
                    </p>
                  )}
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={closeImportModal}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleImportSubmit}
                    disabled={!importFile || !importType}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Import
                  </button>
                </div>
              </>
            )}
            
            {importStatus === 'processing' && (
              <div className="text-center py-6">
                <RefreshCw className="h-12 w-12 text-blue-500 mx-auto mb-4 animate-spin" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Processing Import</h3>
                <p className="text-gray-500">
                  Please wait while we process your file. This may take a few moments.
                </p>
              </div>
            )}
            
            {importStatus === 'success' && (
              <div className="text-center py-6">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Import Successful</h3>
                <p className="text-gray-500 mb-4">
                  Your data has been successfully imported into the system.
                </p>
                <button
                  onClick={closeImportModal}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  Close
                </button>
              </div>
            )}
            
            {importStatus === 'error' && (
              <div className="text-center py-6">
                <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Import Failed</h3>
                <p className="text-gray-500 mb-4">
                  There was an error processing your import. Please check your file and try again.
                </p>
                <div className="flex justify-center space-x-3">
                  <button
                    onClick={closeImportModal}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setImportStatus('idle')}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;