import React, { useState, useEffect } from 'react';
import { attendanceService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { MapPin, Loader2, CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';

interface GeolocationAttendanceProps {
  courseId: string;
  sessionId: string;
  coordinates?: { lat: number; lng: number; radius: number };
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

const GeolocationAttendance: React.FC<GeolocationAttendanceProps> = ({
  courseId,
  sessionId,
  coordinates = { lat: 5.6037, lng: -0.1870, radius: 100 }, // Default coordinates (UMaT location)
  onSuccess,
  onError
}) => {
  const { currentUser } = useAuth();
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Get current location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      return;
    }

    setLoading(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lng: longitude });
        
        // Calculate distance from target location
        const dist = calculateDistance(
          latitude, 
          longitude, 
          coordinates.lat, 
          coordinates.lng
        );
        setDistance(dist);
        setLoading(false);
      },
      (error) => {
        setLoading(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError('Location permission denied. Please enable location services.');
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError('Location information is unavailable.');
            break;
          case error.TIMEOUT:
            setLocationError('The request to get location timed out.');
            break;
          default:
            setLocationError('An unknown error occurred while getting location.');
            break;
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // Calculate distance between two coordinates in meters
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371e3; // Earth radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance;
  };

  // Verify location and mark attendance
  const verifyLocation = async () => {
    if (!currentUser) {
      setStatus('error');
      setMessage('You must be logged in to mark attendance');
      if (onError) onError('Authentication required');
      return;
    }

    if (!location) {
      setLocationError('Please get your current location first');
      return;
    }

    try {
      setStatus('processing');
      setMessage('Verifying your location...');

      // Check if user is within the allowed radius
      if (distance !== null && distance <= coordinates.radius) {
        // Mark attendance using the attendance service
        const result = await attendanceService.markAttendance(sessionId, 'geo', {
          timestamp: new Date().toISOString(),
          location: location,
          distance: distance
        });
        
        if (result.success) {
          setStatus('success');
          setMessage(result.message || 'Location verified. Attendance marked successfully!');
          
          if (onSuccess) {
            onSuccess();
          }
        } else {
          setStatus('error');
          setMessage(result.message || 'Failed to mark attendance. Please try again.');
          
          if (onError) {
            onError(result.message || 'Failed to mark attendance');
          }
        }
      } else {
        setStatus('error');
        setMessage(`You are ${Math.round(distance || 0)}m away from the class location. You must be within ${coordinates.radius}m to mark attendance.`);
        
        if (onError) {
          onError('Location verification failed - too far from class');
        }
      }
    } catch (error) {
      console.error('Error verifying location:', error);
      setStatus('error');
      setMessage('Error processing location verification. Please try again.');
      
      if (onError) {
        onError('Error processing location verification');
      }
    }
  };

  // Reset state
  const resetLocation = () => {
    setStatus('idle');
    setMessage('');
    setLocationError(null);
    setLocation(null);
    setDistance(null);
  };

  return (
    <div className="space-y-4">
      {status !== 'idle' && (
        <div className={`mb-6 p-4 rounded-lg ${
          status === 'processing' ? 'bg-blue-50 border border-blue-200' :
          status === 'success' ? 'bg-green-50 border border-green-200' :
          'bg-red-50 border border-red-200'
        }`}>
          <div className="flex items-center">
            {status === 'processing' && (
              <Loader2 className="h-5 w-5 text-blue-500 mr-2 animate-spin" />
            )}
            {status === 'success' && (
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            )}
            {status === 'error' && (
              <XCircle className="h-5 w-5 text-red-500 mr-2" />
            )}
            <p className={`text-sm ${
              status === 'processing' ? 'text-blue-700' :
              status === 'success' ? 'text-green-700' :
              'text-red-700'
            }`}>
              {message}
            </p>
          </div>
          
          {status !== 'processing' && (
            <button
              onClick={resetLocation}
              className="mt-3 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Try again
            </button>
          )}
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-start md:space-x-6">
        <div className="md:flex-1">
          <p className="text-sm text-gray-600 mb-4">
            Use your device's location to verify your presence in the classroom. Your location will be compared with the class location to confirm your attendance.
          </p>
          
          {locationError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                <div>
                  <p className="text-sm text-red-700">{locationError}</p>
                  <button
                    onClick={resetLocation}
                    className="mt-2 text-sm font-medium text-red-700 hover:text-red-800 transition-colors"
                  >
                    Try again
                  </button>
                </div>
              </div>
            </div>
          )}
          
          <div className="bg-white border border-gray-300 rounded-lg p-6 mb-4">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <MapPin className="h-10 w-10 text-blue-600" />
              </div>
              
              <h3 className="text-lg font-medium mb-2">Location Verification</h3>
              
              {location ? (
                <div className="text-center mb-4">
                  <p className="text-sm text-gray-600 mb-1">Your current location:</p>
                  <p className="text-sm font-medium">
                    Lat: {location.lat.toFixed(6)}, Lng: {location.lng.toFixed(6)}
                  </p>
                  
                  {distance !== null && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-600 mb-1">Distance from class:</p>
                      <p className={`text-sm font-medium ${
                        distance <= coordinates.radius ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {Math.round(distance)}m {distance <= coordinates.radius ? '(Within range)' : '(Out of range)'}
                      </p>
                      
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                        <div 
                          className={`h-2.5 rounded-full ${
                            distance <= coordinates.radius ? 'bg-green-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${Math.min(100, (distance / coordinates.radius) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-600 mb-4 text-center">
                  Click the button below to get your current location and verify your presence in class.
                </p>
              )}
              
              {!location ? (
                <button
                  onClick={getCurrentLocation}
                  disabled={loading}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Getting location...
                    </>
                  ) : (
                    <>
                      <MapPin className="h-5 w-5 mr-2" />
                      Get My Location
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={verifyLocation}
                  disabled={status === 'processing'}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {status === 'processing' ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Verify & Mark Attendance
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-6 md:mt-0 md:w-80">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <Info className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-blue-800">Geolocation Tips</h4>
                <ul className="mt-2 text-sm text-blue-700 space-y-2 list-disc pl-5">
                  <li>Enable location services on your device</li>
                  <li>For better accuracy, use GPS if available</li>
                  <li>You must be within {coordinates.radius}m of the class location</li>
                  <li>Stay in the classroom until verification is complete</li>
                  <li>If verification fails, try moving closer to the center of the room</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-yellow-800">Privacy Notice</h4>
                <p className="mt-2 text-sm text-yellow-700">
                  Your location data is only used to verify your presence in the classroom. It is not stored permanently or used for tracking.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeolocationAttendance;