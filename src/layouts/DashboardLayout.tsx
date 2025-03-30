import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  LayoutDashboard, 
  CalendarCheck, 
  BarChart2, 
  BookOpen, 
  User, 
  Settings, 
  LogOut,
  Menu,
  X,
  Bell,
  School,
  ChevronDown,
  Sun,
  Moon,
  Search
} from 'lucide-react';

const DashboardLayout: React.FC = () => {
  const { currentUser, userRole, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById('sidebar');
      if (isMobile && sidebarOpen && sidebar && !sidebar.contains(event.target as Node)) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobile, sidebarOpen]);

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // In a real app, you would apply dark mode classes to the document
  };

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would implement search functionality
    alert(`Searching for: ${searchQuery}`);
  };

  // Navigation items based on user role
  const navItems = [
    { 
      path: '/dashboard', 
      name: 'Dashboard', 
      icon: <LayoutDashboard className="w-5 h-5" />, 
      roles: ['student', 'lecturer', 'admin'] 
    },
    { 
      path: '/attendance/mark', 
      name: 'Mark Attendance', 
      icon: <CalendarCheck className="w-5 h-5" />, 
      roles: ['student', 'lecturer'] 
    },
    { 
      path: '/attendance/reports', 
      name: 'Attendance Reports', 
      icon: <BarChart2 className="w-5 h-5" />, 
      roles: ['lecturer', 'admin'] 
    },
    { 
      path: '/courses', 
      name: 'Courses', 
      icon: <BookOpen className="w-5 h-5" />, 
      roles: ['student', 'lecturer', 'admin'] 
    },
    { 
      path: userRole === 'student' ? '/profile/student' : '/profile/lecturer', 
      name: 'Profile', 
      icon: <User className="w-5 h-5" />, 
      roles: ['student', 'lecturer', 'admin'] 
    },
    { 
      path: '/admin', 
      name: 'Admin Panel', 
      icon: <Settings className="w-5 h-5" />, 
      roles: ['admin'] 
    },
  ];

  // Filter navigation items based on user role
  const filteredNavItems = navItems.filter(item => 
    item.roles.includes(userRole as 'student' | 'lecturer' | 'admin')
  );

  // Mock notifications
  const notifications = [
    { id: 1, title: 'New attendance session', message: 'CS101 attendance session started', time: '5 minutes ago', read: false },
    { id: 2, title: 'Attendance marked', message: 'Your attendance for DB201 was marked', time: '1 hour ago', read: false },
    { id: 3, title: 'Course added', message: 'You were added to AI301 course', time: '2 days ago', read: true },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside 
        id="sidebar"
        className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-blue-800 text-white transition duration-300 ease-in-out lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-blue-700">
          <div className="flex items-center space-x-2">
            <School className="w-8 h-8" />
            <span className="text-xl font-bold">UMaT Attendance</span>
          </div>
          <button 
            className="p-1 rounded-md lg:hidden hover:bg-blue-700"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-4">
          <div className="mb-6 text-center">
            <div className="w-20 h-20 mx-auto mb-2 rounded-full bg-blue-700 flex items-center justify-center">
              <span className="text-2xl font-bold">{currentUser?.displayName?.charAt(0) || 'U'}</span>
            </div>
            <h3 className="text-lg font-semibold">{currentUser?.displayName || 'User'}</h3>
            <p className="text-sm text-blue-200 capitalize">{userRole || 'User'}</p>
          </div>

          <nav className="space-y-1">
            {filteredNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-md transition-colors ${
                  location.pathname === item.path
                    ? 'bg-blue-900 text-white'
                    : 'text-blue-100 hover:bg-blue-700'
                }`}
                onClick={() => isMobile && setSidebarOpen(false)}
              >
                {item.icon}
                <span className="ml-3">{item.name}</span>
              </Link>
            ))}

            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 mt-4 text-blue-100 rounded-md hover:bg-blue-700 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="ml-3">Logout</span>
            </button>
          </nav>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top navbar */}
        <header className="flex items-center justify-between px-4 py-3 bg-white shadow lg:px-6">
          <div className="flex items-center">
            <button
              className="p-1 mr-4 rounded-md lg:hidden hover:bg-gray-100"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-semibold hidden sm:block">
              {filteredNavItems.find(item => item.path === location.pathname)?.name || 'Dashboard'}
            </h1>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="hidden md:block relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-4 h-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search..."
                className="w-full py-2 pl-10 pr-4 text-sm bg-gray-100 border border-transparent rounded-md focus:outline-none focus:bg-white focus:border-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>

            {/* Dark mode toggle */}
            <button 
              onClick={toggleDarkMode}
              className="p-2 text-gray-500 rounded-full hover:bg-gray-100"
              title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            {/* Notifications */}
            <div className="relative">
              <button 
                className="p-2 text-gray-500 rounded-full hover:bg-gray-100 relative"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
              >
                <Bell className="w-5 h-5" />
                {notifications.some(n => !n.read) && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>

              {/* Notifications dropdown */}
              {notificationsOpen && (
                <div className="absolute right-0 z-10 w-80 mt-2 bg-white rounded-md shadow-lg">
                  <div className="p-3 border-b border-gray-200">
                    <h3 className="text-sm font-semibold">Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length > 0 ? (
                      <div className="divide-y divide-gray-200">
                        {notifications.map((notification) => (
                          <div 
                            key={notification.id} 
                            className={`p-4 hover:bg-gray-50 ${!notification.read ? 'bg-blue-50' : ''}`}
                          >
                            <div className="flex justify-between">
                              <h4 className="text-sm font-medium">{notification.title}</h4>
                              <span className="text-xs text-gray-500">{notification.time}</span>
                            </div>
                            <p className="mt-1 text-sm text-gray-600">{notification.message}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 text-center text-gray-500">
                        No notifications
                      </div>
                    )}
                  </div>
                  <div className="p-2 text-center border-t border-gray-200">
                    <button className="text-sm text-blue-600 hover:text-blue-800">
                      Mark all as read
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* User menu */}
            <div className="relative">
              <button 
                className="flex items-center text-sm rounded-full focus:outline-none"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                  {currentUser?.displayName?.charAt(0) || 'U'}
                </div>
                <ChevronDown className="w-4 h-4 ml-1 text-gray-500" />
              </button>

              {/* User dropdown */}
              {userMenuOpen && (
                <div className="absolute right-0 z-10 w-48 mt-2 bg-white rounded-md shadow-lg">
                  <div className="py-1">
                    <Link
                      to={userRole === 'student' ? '/profile/student' : '/profile/lecturer'}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Your Profile
                    </Link>
                    <Link
                      to="/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;