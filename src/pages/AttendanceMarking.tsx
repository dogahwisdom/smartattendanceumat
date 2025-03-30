import React, { useState, useEffect } from 'react';
import { 
  QrCode, 
  Camera, 
  MapPin, 
  Smartphone, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Info,
  Loader2
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import QRCodeScanner from '../components/QRCodeScanner';
import FaceRecognition from '../components/FaceRecognition';
import GeolocationAttendance from '../components/GeolocationAttendance';
import NFCAttendance from '../components/NFCAttendance';
import { getCourses } from '../services/firebase';

const AttendanceMarking: React.FC = () => {
  const { currentUser, userRole } = useAuth();
  const [activeMethod, setActiveMethod] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [courseId, setCourseId] = useState<string>('');
  const [sessionId, setSessionId] = useState<string>('demo-session-123'); // Default session for demo
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const coursesData = await getCourses();
        setCourses(coursesData);
        
        if (coursesData.length > 0) {
          setCourseId(coursesData[0].id);
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCourses();
  }, []);

  // Handle method selection
  const handleMethodSelect = (method: string) => {
    setActiveMethod(method);
    setSuccess(null);
    setError(null);
  };

  // Handle course selection
  const handleCourseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCourseId(e.target.value);
  };

  // Handle success callback
  const handleSuccess = (message: string) => {
    setSuccess(message);
    setError(null);
    setActiveMethod(null);
  };

  // Handle error callback
  const handleError = (message: string) => {
    setError(message);
    setSuccess(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Mark Attendance</h2>
        
        {/* Course Selection */}
        <div className="mb-6">
          <label htmlFor="course-select" className="block text-sm font-medium text-gray-700 mb-1">
            Select Course
          </label>
          {loading ? (
            <div className="flex items-center space-x-2">
              <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
              <span className="text-sm text-gray-500">Loading courses...</span>
            </div>
          ) : (
            <select
              id="course-select"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
              value={courseId}
              onChange={handleCourseChange}
            >
              {courses.length > 0 ? (
                courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.name}
                  </option>
                ))
              ) : (
                <option value="">No courses available</option>
              )}
            </select>
          )}
        </div>
        
        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-green-700">{success}</p>
          </div>
        )}
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
            <XCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
        
        {/* Attendance Methods */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* QR Code Method */}
          <div 
            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
              activeMethod === 'qr' 
                ? 'bg-blue-50 border-blue-200' 
                : 'hover:bg-gray-50 border-gray-200'
            }`}
            onClick={() => handleMethodSelect('qr')}
          >
            <div className="flex flex-col items-center text-center">
              <div className={`p-3 rounded-full ${
                activeMethod === 'qr' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
              } mb-3`}>
                <QrCode className="h-6 w-6" />
              </div>
              <h3 className="font-medium">QR Code</h3>
              <p className="text-sm text-gray-500 mt-1">
                Scan the QR code displayed by your lecturer
              </p>
            </div>
          </div>
          
          {/* Face Recognition Method */}
          <div 
            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
              activeMethod === 'face' 
                ? 'bg-blue-50 border-blue-200' 
                : 'hover:bg-gray-50 border-gray-200'
            }`}
            onClick={() => handleMethodSelect('face')}
          >
            <div className="flex flex-col items-center text-center">
              <div className={`p-3 rounded-full ${
                activeMethod === 'face' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
              } mb-3`}>
                <Camera className="h-6 w-6" />
              </div>
              <h3 className="font-medium">Face Recognition</h3>
              <p className="text-sm text-gray-500 mt-1">
                Use your camera to verify your identity
              </p>
            </div>
          </div>
          
          {/* Geolocation Method */}
          <div 
            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
              activeMethod === 'geo' 
                ? 'bg-blue-50 border-blue-200' 
                : 'hover:bg-gray-50 border-gray-200'
            }`}
            onClick={() => handleMethodSelect('geo')}
          >
            <div className="flex flex-col items-center text-center">
              <div className={`p-3 rounded-full ${
                activeMethod === 'geo' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
              } mb-3`}>
                <MapPin className="h-6 w-6" />
              </div>
              <h3 className="font-medium">Geolocation</h3>
              <p className="text-sm text-gray-500 mt-1">
                Verify your presence in the classroom
              </p>
            </div>
          </div>
          
          {/* NFC Method */}
          <div 
            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
              activeMethod === 'nfc' 
                ? 'bg-blue-50 border-blue-200' 
                : 'hover:bg-gray-50 border-gray-200'
            }`}
            onClick={() => handleMethodSelect('nfc')}
          >
            <div className="flex flex-col items-center text-center">
              <div className={`p-3 rounded-full ${
                activeMethod === 'nfc' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
              } mb-3`}>
                <Smartphone className="h-6 w-6" />
              </div>
              <h3 className="font-medium">NFC</h3>
              <p className="text-sm text-gray-500 mt-1">
                Tap your student ID card on the reader
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Active Method Content */}
      {activeMethod && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium">
              {activeMethod === 'qr' && 'QR Code Scanner'}
              {activeMethod === 'face' && 'Face Recognition'}
              {activeMethod === 'geo' && 'Geolocation Verification'}
              {activeMethod === 'nfc' && 'NFC Verification'}
            </h3>
            <button
              onClick={() => setActiveMethod(null)}
              className="text-gray-400 hover:text-gray-500 transition-colors"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* QR Code Scanner */}
          {activeMethod === 'qr' && (
            <QRCodeScanner 
              onSuccess={(sessionId) => handleSuccess(`Attendance marked successfully for ${courses.find(c => c.id === courseId)?.name || 'course'}`)}
              onError={handleError}
            />
          )}
          
          {/* Face Recognition */}
          {activeMethod === 'face' && (
            <FaceRecognition 
              courseId={courseId}
              sessionId={sessionId}
              onSuccess={() => handleSuccess(`Attendance marked successfully for ${courses.find(c => c.id === courseId)?.name || 'course'}`)}
              onError={handleError}
            />
          )}
          
          {/* Geolocation */}
          {activeMethod === 'geo' && (
            <GeolocationAttendance 
              courseId={courseId}
              sessionId={sessionId}
              onSuccess={() => handleSuccess(`Attendance marked successfully for ${courses.find(c => c.id === courseId)?.name || 'course'}`)}
              onError={handleError}
            />
          )}
          
          {/* NFC */}
          {activeMethod === 'nfc' && (
            <NFCAttendance 
              courseId={courseId}
              sessionId={sessionId}
              onSuccess={() => handleSuccess(`Attendance marked successfully for ${courses.find(c => c.id === courseId)?.name || 'course'}`)}
              onError={handleError}
            />
          )}
        </div>
      )}

      {/* Information Section */}
      {!activeMethod && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-4">Attendance Information</h3>
          
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start">
                <Info className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-blue-800">Multiple Verification Methods</h4>
                  <p className="mt-1 text-sm text-blue-700">
                    Choose from QR code scanning, facial recognition, geolocation, or NFC to mark your attendance. Each method provides a secure way to verify your presence in class.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-yellow-800">Important Note</h4>
                  <p className="mt-1 text-sm text-yellow-700">
                    Attendance can only be marked during the designated class time and within the allowed timeframe set by your lecturer. Make sure to mark your attendance promptly.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                <h4 className="font-medium mb-2 flex items-center">
                  <QrCode className="h-5 w-5 text-blue-500 mr-2" />
                  QR Code Scanning
                </h4>
                <p className="text-sm text-gray-600">
                  Scan the QR code displayed by your lecturer at the beginning of class. This is the quickest method for marking attendance.
                </p>
              </div>
              
              <div className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                <h4 className="font-medium mb-2 flex items-center">
                  <Camera className="h-5 w-5 text-blue-500 mr-2" />
                  Face Recognition
                </h4>
                <p className="text-sm text-gray-600">
                  Use your device's camera to verify your identity. This method ensures that you are physically present in class.
                </p>
              </div>
              
              <div className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                <h4 className="font-medium mb-2 flex items-center">
                  <MapPin className="h-5 w-5 text-blue-500 mr-2" />
                  Geolocation
                </h4>
                <p className="text-sm text-gray-600">
                  Verify your presence in the classroom using your device's GPS. This method confirms you are within the designated area.
                </p>
              </div>
              
              <div className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                <h4 className="font-medium mb-2 flex items-center">
                  <Smartphone className="h-5 w-5 text-blue-500 mr-2" />
                  NFC Verification
                </h4>
                <p className="text-sm text-gray-600">
                  Tap your student ID card on an NFC reader to mark your attendance. This method requires an NFC-enabled device and student ID.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceMarking;