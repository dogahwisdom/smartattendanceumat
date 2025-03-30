import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import * as tf from '@tensorflow/tfjs';
import { attendanceService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Camera, RefreshCw, CheckCircle, XCircle, AlertTriangle, Info, Loader2 } from 'lucide-react';

interface FaceRecognitionProps {
  courseId: string;
  sessionId: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

const FaceRecognition: React.FC<FaceRecognitionProps> = ({ 
  courseId, 
  sessionId, 
  onSuccess, 
  onError 
}) => {
  const { currentUser } = useAuth();
  const webcamRef = useRef<Webcam>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [model, setModel] = useState<tf.LayersModel | null>(null);
  const [modelLoading, setModelLoading] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [countdown, setCountdown] = useState<number | null>(null);
  const [faceDetected, setFaceDetected] = useState(false);
  const [detectionInterval, setDetectionInterval] = useState<NodeJS.Timeout | null>(null);

  // Load TensorFlow.js model
  useEffect(() => {
    const loadModel = async () => {
      try {
        setModelLoading(true);
        // In a real app, you would load a pre-trained model
        // For demo purposes, we'll just simulate model loading
        await tf.ready();
        
        // Simulate model loading delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Set model loaded flag
        setModelLoading(false);
      } catch (error) {
        console.error('Error loading model:', error);
        setModelLoading(false);
        setCameraError('Failed to load face recognition model. Please try again.');
      }
    };
    
    loadModel();

    // Cleanup function
    return () => {
      if (detectionInterval) {
        clearInterval(detectionInterval);
      }
    };
  }, []);

  // Simulate face detection
  useEffect(() => {
    if (webcamRef.current && !modelLoading && !cameraError && status === 'idle') {
      const interval = setInterval(() => {
        // Simulate face detection with 80% chance of detecting a face
        const detected = Math.random() > 0.2;
        setFaceDetected(detected);
      }, 1000);
      
      setDetectionInterval(interval);
      
      return () => {
        clearInterval(interval);
      };
    }
  }, [webcamRef.current, modelLoading, cameraError, status]);

  // Handle camera errors
  const handleCameraError = (error: string | DOMException) => {
    console.error('Camera error:', error);
    setCameraError('Could not access camera. Please ensure you have granted camera permissions and try again.');
  };

  // Switch camera (front/back)
  const switchCamera = () => {
    setFacingMode(prevMode => prevMode === 'user' ? 'environment' : 'user');
  };

  // Countdown timer for capture
  useEffect(() => {
    if (countdown === null) return;
    
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else {
      captureImage();
    }
  }, [countdown]);

  // Start countdown for capture
  const startCountdown = () => {
    if (!faceDetected) {
      setMessage('No face detected. Please position your face in the frame.');
      return;
    }
    
    setCountdown(3);
  };

  // Capture image and process
  const captureImage = async () => {
    setCountdown(null);
    
    if (!currentUser) {
      setStatus('error');
      setMessage('You must be logged in to mark attendance');
      if (onError) onError('Authentication required');
      return;
    }

    if (!webcamRef.current) {
      setStatus('error');
      setMessage('Camera not available');
      if (onError) onError('Camera not available');
      return;
    }

    try {
      setIsCapturing(true);
      setStatus('processing');
      setMessage('Verifying your identity...');

      // Capture image from webcam
      const imageSrc = webcamRef.current.getScreenshot();
      
      if (!imageSrc) {
        throw new Error('Failed to capture image');
      }

      // In a real app, you would:
      // 1. Convert image to tensor
      // 2. Preprocess image
      // 3. Run face detection
      // 4. Extract face embeddings
      // 5. Compare with stored embeddings

      // For demo purposes, we'll simulate face recognition with a delay
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      // Simulate 85% success rate
      const isSuccess = Math.random() > 0.15;
      
      if (isSuccess) {
        // Mark attendance using the attendance service
        const result = await attendanceService.markAttendance(sessionId, 'face', {
          timestamp: new Date().toISOString()
        });
        
        if (result.success) {
          setStatus('success');
          setMessage(result.message || 'Identity verified. Attendance marked successfully!');
          
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
        setMessage('Face verification failed. Please try again or use another method.');
        
        if (onError) {
          onError('Face verification failed');
        }
      }
    } catch (error) {
      console.error('Error capturing image:', error);
      setStatus('error');
      setMessage('Error processing face recognition. Please try again.');
      
      if (onError) {
        onError('Error processing face recognition');
      }
    } finally {
      setIsCapturing(false);
    }
  };

  // Reset state
  const resetCapture = () => {
    setStatus('idle');
    setMessage('');
    setCameraError(null);
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
              onClick={resetCapture}
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
            Use facial recognition to verify your identity and mark attendance. Please ensure you are in a well-lit area and look directly at the camera.
          </p>
          
          {cameraError ? (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                <div>
                  <p className="text-sm text-red-700">{cameraError}</p>
                  <button
                    onClick={resetCapture}
                    className="mt-2 text-sm font-medium text-red-700 hover:text-red-800 transition-colors"
                  >
                    Try again
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-md mx-auto border border-gray-300 rounded-lg overflow-hidden bg-black relative">
              <div className="relative aspect-w-4 aspect-h-3 bg-gray-100">
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  videoConstraints={{
                    width: 640,
                    height: 480,
                    facingMode: facingMode
                  }}
                  onUserMediaError={handleCameraError}
                  className="w-full h-full object-cover"
                />
                
                {modelLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70">
                    <div className="text-white text-center">
                      <Loader2 className="h-8 w-8 mx-auto animate-spin mb-2" />
                      <p>Loading face recognition model...</p>
                    </div>
                  </div>
                )}
                
                {/* Face detection indicator */}
                {!modelLoading && status === 'idle' && (
                  <div className="absolute top-3 left-3 flex items-center">
                    <div className={`h-3 w-3 rounded-full mr-2 ${faceDetected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className="text-xs text-white bg-black bg-opacity-50 px-2 py-1 rounded">
                      {faceDetected ? 'Face detected' : 'No face detected'}
                    </span>
                  </div>
                )}
                
                {/* Countdown overlay */}
                {countdown !== null && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="text-white text-center">
                      <div className="text-6xl font-bold">{countdown}</div>
                      <p className="mt-2">Keep still and look at the camera</p>
                    </div>
                  </div>
                )}
                
                {/* Camera controls */}
                <div className="absolute bottom-3 right-3 flex space-x-2">
                  <button
                    onClick={switchCamera}
                    className="p-2 bg-gray-800 bg-opacity-70 rounded-full text-white hover:bg-opacity-90 transition-colors"
                    title="Switch camera"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 12c0 1.2-.5 2.3-1 3.3a4 4 0 0 1-6.7 1.3 3.5 3.5 0 0 0-5.6 0A4 4 0 0 1 1 13.7c1.9-2 3-2.4 4-3.5C6.7 8.6 8 7.8 10 7c.6-.3 2-1 3.5-1 1.3 0 2.7.4 4 1.5 2.1 1.7 3.5 4.3 3.5 4.5z"></path>
                      <path d="M9.7 17.8C8.3 17.4 7.4 16.5 7 15.9"></path>
                      <path d="M14.3 17.8c1.4-.4 2.3-1.3 2.7-1.9"></path>
                      <path d="M5.5 13.8c-.7-.4-1.7-1.2-2.5-2.2"></path>
                      <path d="M18.5 13.8c.7-.4 1.7-1.2 2.5-2.2"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex justify-center mt-4">
            {status === 'idle' ? (
              <button
                onClick={startCountdown}
                disabled={isCapturing || modelLoading || !!cameraError || countdown !== null}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {countdown !== null ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Capturing in {countdown}...
                  </>
                ) : (
                  <>
                    <Camera className="h-5 w-5 mr-2" />
                    Verify & Mark Attendance
                  </>
                )}
              </button>
            ) : status === 'processing' ? (
              <button
                disabled
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md opacity-50 cursor-not-allowed"
              >
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Processing...
              </button>
            ) : null}
          </div>
        </div>
        
        <div className="mt-6 md:mt-0 md:w-80">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <Info className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-blue-800">Face Recognition Tips</h4>
                <ul className="mt-2 text-sm text-blue-700 space-y-2 list-disc pl-5">
                  <li>Ensure your face is clearly visible</li>
                  <li>Find a well-lit area</li>
                  <li>Remove sunglasses or face coverings</li>
                  <li>Look directly at the camera</li>
                  <li>Keep a neutral expression</li>
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
                  Your facial data is processed securely and only used for attendance verification. No images are stored permanently.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaceRecognition;