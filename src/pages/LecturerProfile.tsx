import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  BookOpen, 
  Users,
  Edit,
  Camera,
  Save,
  Calendar,
  Clock,
  Briefcase
} from 'lucide-react';

const LecturerProfile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  
  // Mock lecturer data
  const [lecturerData, setLecturerData] = useState({
    name: 'Dr. John Smith',
    staffId: 'UMT/STAFF/2020/042',
    email: 'john.smith@lecturer.umat.edu.gh',
    phone: '+233 20 987 6543',
    department: 'Computer Science',
    position: 'Associate Professor',
    office: 'Faculty Building, Room 205',
    officeHours: 'Mon, Wed: 2:00 PM - 4:00 PM',
    joinDate: '2020-08-15',
    specialization: 'Artificial Intelligence, Machine Learning',
    bio: 'Computer Science professor with over 10 years of experience in AI research and teaching. Published author with multiple papers in top-tier journals.',
  });

  // Mock courses taught
  const coursesTaught = [
    { id: 'cs101', code: 'CS101', name: 'Introduction to Computer Science', students: 45, schedule: 'Mon, Wed, Fri 10:00 AM - 12:00 PM' },
    { id: 'ai301', code: 'AI301', name: 'Artificial Intelligence', students: 32, schedule: 'Tue, Thu 9:00 AM - 11:00 AM' },
    { id: 'ml401', code: 'ML401', name: 'Machine Learning', students: 28, schedule: 'Mon, Wed 1:00 PM - 3:00 PM' },
  ];

  // Mock upcoming classes
  const upcomingClasses = [
    { id: 1, course: 'Introduction to Computer Science', time: '10:00 AM - 12:00 PM', location: 'Room 101', date: 'Today' },
    { id: 2, course: 'Artificial Intelligence', time: '9:00 AM - 11:00 AM', location: 'Room 105', date: 'Tomorrow' },
    { id: 3, course: 'Machine Learning', time: '1:00 PM - 3:00 PM', location: 'Room 203', date: 'May 18, 2023' },
  ];

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setLecturerData(prev => ({ ...prev, [name]: value }));
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
              <h1 className="text-2xl font-bold">{lecturerData.name}</h1>
              <div className="flex flex-col md:flex-row md:items-center text-gray-600 mt-1">
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full md:mr-2">
                  {lecturerData.staffId}
                </span>
                <span className="mt-1 md:mt-0">{lecturerData.department} • {lecturerData.position}</span>
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
                  value={lecturerData.name}
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
                  value={lecturerData.email}
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
                  value={lecturerData.phone}
                  onChange={handleInputChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
              
              <div>
                <label htmlFor="office" className="block text-sm font-medium text-gray-700 mb-1">
                  Office
                </label>
                <input
                  type="text"
                  id="office"
                  name="office"
                  value={lecturerData.office}
                  onChange={handleInputChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
              
              <div>
                <label htmlFor="officeHours" className="block text-sm font-medium text-gray-700 mb-1">
                  Office Hours
                </label>
                <input
                  type="text"
                  id="officeHours"
                  name="officeHours"
                  value={lecturerData.officeHours}
                  onChange={handleInputChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
              
              <div>
                <label htmlFor="specialization" className="block text-sm font-medium text-gray-700 mb-1">
                  Specialization
                </label>
                <input
                  type="text"
                  id="specialization"
                  name="specialization"
                  value={lecturerData.specialization}
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
                  value={lecturerData.bio}
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
                  <p className="text-sm">{lecturerData.email}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Phone className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Phone</p>
                  <p className="text-sm">{lecturerData.phone}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Office</p>
                  <p className="text-sm">{lecturerData.office}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Clock className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Office Hours</p>
                  <p className="text-sm">{lecturerData.officeHours}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Briefcase className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Specialization</p>
                  <p className="text-sm">{lecturerData.specialization}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Join Date</p>
                  <p className="text-sm">{new Date(lecturerData.joinDate).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="pt-2">
                <p className="text-sm font-medium text-gray-500 mb-1">Bio</p>
                <p className="text-sm">{lecturerData.bio}</p>
              </div>
            </div>
          )}
        </div>

        {/* Courses Taught */}
        <div className="md:col-span-2 bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 pb-0">
            <h2 className="text-lg font-semibold mb-4">Courses Taught</h2>
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
                    Schedule
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Students
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {coursesTaught.map((course) => (
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
                      {course.schedule}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="text-sm text-gray-900">{course.students}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Upcoming Classes */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Upcoming Classes</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {upcomingClasses.map((cls) => (
            <div key={cls.id} className="border rounded-lg p-4 hover:bg-gray-50">
              <div className="flex items-center mb-2">
                <div className="p-2 rounded-full bg-blue-100 text-blue-600 mr-2">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">{cls.date}</p>
                </div>
              </div>
              
              <h3 className="font-medium mb-1">{cls.course}</h3>
              
              <div className="space-y-1 text-sm text-gray-500">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{cls.time}</span>
                </div>
                
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{cls.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LecturerProfile;