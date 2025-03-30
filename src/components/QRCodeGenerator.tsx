import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode.react';
import { RefreshCw, Download, Clock, CheckCircle, Copy, Loader2 } from 'lucide-react';
import { createAttendanceSession, closeAttendanceSession } from '../services/firebase';

interface QRCodeGeneratorProps {
  courseId: string;
  courseName: string;
  duration?: number; // Duration in minutes
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ 
  courseId, 
  courseName, 
  duration = 15 
}) => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [qrValue, setQrValue] = useState<string>('');
  const [expiryTime, setExpiryTime] = useState<Date | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(duration * 60);
  const [loading, setLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [qrSize, setQrSize] = useState<number>(250);
  const [generating, setGenerating] = useState<boolean>(false);

  // Adjust QR code size based on screen width
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setQrSize(200);
      } else {
        setQrSize(250);
      }
    };

    handleResize(); // Set initial size
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Generate a new QR code
  const generateQRCode = async () => {
    try {
      setLoading(true);
      setGenerating(true);
      
      // Calculate expiry time
      const expiry = new Date();
      expiry.setMinutes(expiry.getMinutes() + duration);
      setExpiryTime(expiry);
      
      // Create a new attendance session in Firebase
      const sessionData = {
        courseName,
        expiryTime: expiry,
        duration: duration * 60, // in seconds
        createdAt: new Date()
      };
      
      const newSessionId = await createAttendanceSession(courseId, sessionData);
      setSessionId(newSessionId);
      
      // Create QR code value (JSON string)
      const qrData = {
        courseId,
        courseName,
        sessionId: newSessionId,
        timestamp: new Date().toISOString(),
        expiry: expiry.toISOString()
      };
      
      setQrValue(JSON.stringify(qrData));
      setTimeLeft(duration * 60);
      setGenerating(false);
    } catch (error) {
      console.error('Error generating QR code:', error);
      setGenerating(false);
    } finally {
      setLoading(false);
    }
  };

  // Update countdown timer
  useEffect(() => {
    if (!expiryTime) return;
    
    const interval = setInterval(() => {
      const now = new Date();
      const secondsLeft = Math.floor((expiryTime.getTime() - now.getTime()) / 1000);
      
      if (secondsLeft <= 0) {
        clearInterval(interval);
        setTimeLeft(0);
        
        // Close the session in Firebase
        if (sessionId) {
          closeAttendanceSession(sessionId).catch(error => {
            console.error('Error closing attendance session:', error);
          });
        }
        
        setSessionId(null);
        setQrValue('');
      } else {
        setTimeLeft(secondsLeft);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [expiryTime, sessionId]);

  // Format time left as MM:SS
  const formatTimeLeft = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Download QR code as image
  const downloadQRCode = () => {
    if (!qrValue) return;
    
    const canvas = document.getElementById('qr-code') as HTMLCanvasElement;
    if (!canvas) return;
    
    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `attendance-qr-${courseId}-${new Date().toISOString().slice(0, 10)}.png`;
    link.href = url;
    link.click();
  };

  // Copy session ID to clipboard
  const copySessionId = () => {
    if (!sessionId) return;
    
    navigator.clipboard.writeText(sessionId);
    setCopied(true);
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow">
      {qrValue ? (
        <div className="flex flex-col items-center w-full">
          <div className="p-6 bg-white border-2 border-gray-200 rounded-lg mb-4 relative">
            <QRCode 
              id="qr-code"
              value={qrValue} 
              size={qrSize} 
              level="H" 
              includeMargin={true}
              renderAs="canvas"
            />
            
            {/* Countdown overlay */}
            <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {formatTimeLeft()}
            </div>
          </div>
          
          <div className="text-center mb-6 w-full">
            <p className="text-sm text-gray-500 mb-1">Course: {courseName}</p>
            <div className="flex items-center justify-center mb-1">
              <p className="text-sm text-gray-500 mr-2">Session ID: {sessionId?.substring(0, 8)}...</p>
              <button 
                onClick={copySessionId}
                className="text-blue-600 hover:text-blue-800 transition-colors"
                title="Copy session ID"
              >
                {copied ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
              <div 
                className={`h-2.5 rounded-full ${
                  timeLeft > duration * 60 * 0.7 ? 'bg-green-500' :
                  timeLeft > duration * 60 * 0.3 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${(timeLeft / (duration * 60)) * 100}%` }}
              ></div>
            </div>
            <p className="text-sm font-medium">
              Expires in: <span className={`font-bold ${
                timeLeft > duration * 60 * 0.7 ? 'text-green-600' :
                timeLeft > duration * 60 * 0.3 ? 'text-yellow-600' : 'text-red-600'
              }`}>{formatTimeLeft()}</span>
            </p>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={generateQRCode}
              disabled={loading}
              className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Regenerate
            </button>
            
            <button
              onClick={downloadQRCode}
              disabled={!qrValue}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </button>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg w-full">
            <h4 className="text-sm font-medium text-blue-800 mb-2">Instructions for Students</h4>
            <ol className="list-decimal pl-5 text-sm text-blue-700 space-y-1">
              <li>Open the UMaT Attendance app</li>
              <li>Go to "Mark Attendance" and select "QR Code"</li>
              <li>Scan this QR code with your device</li>
              <li>Verify your identity if prompted</li>
              <li>Wait for the confirmation message</li>
            </ol>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center w-full">
          <div className="mb-6 text-center">
            <div className="mx-auto w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mb-4">
              <QRCode 
                value="UMaT Attendance" 
                size={50} 
                level="L" 
                renderAs="svg"
              />
            </div>
            <h3 className="text-lg font-medium mb-1">Generate Attendance QR Code</h3>
            <p className="text-sm text-gray-500">
              Create a QR code for students to scan and mark their attendance.
            </p>
          </div>
          
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-6 w-full">
            <h4 className="text-sm font-medium text-yellow-800 mb-2">Important Notes</h4>
            <ul className="list-disc pl-5 text-sm text-yellow-700 space-y-1">
              <li>QR code will be valid for {duration} minutes</li>
              <li>Each student can only scan once per session</li>
              <li>Students must be logged in to mark attendance</li>
              <li>You can regenerate a new QR code at any time</li>
            </ul>
          </div>
          
          <button
            onClick={generateQRCode}
            disabled={loading || generating}
            className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {generating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : loading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Generate QR Code
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default QRCodeGenerator;