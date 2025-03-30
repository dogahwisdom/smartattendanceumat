import React, { useState, useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { markAttendance } from '../services/firebase';
import { useAuth } from '../contexts/AuthContext';
import { CheckCircle, XCircle, Loader2, AlertTriangle, Info } from 'lucide-react';

interface QRCodeScannerProps {
  onSuccess?: (sessionId: string) => void;
  onError?: (error: string) => void;
}

const QRCodeScanner: React.FC<QRCodeScannerProps> = ({ onSuccess, onError }) => {
  const { currentUser } = useAuth();
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string>('');
  const [courseInfo, setCourseInfo] = useState<{ id: string, name: string } | null>(null);
  const scannerRef = useRef<any>(null);
  const scannerDivRef = useRef<HTMLDivElement>(null);
  const [scannerInitialized, setScannerInitialized] = useState(false);

  useEffect(() => {
    if (scannerDivRef.current && !scannerRef.current && !scannerInitialized) {
      setScannerInitialized(true);
      
      const config = { 
        fps: 10, 
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
        rememberLastUsedCamera: true,
        showTorchButtonIfSupported: true,
        showZoomSliderIfSupported: true,
        defaultZoomValueIfSupported: 1
      };
      
      scannerRef.current = new Html5QrcodeScanner(
        "qr-reader",
        config,
        false
      );
      
      scannerRef.current.render(
        (decodedText: string) => {
          handleQRCodeSuccess(decodedText);
        },
        (errorMessage: string) => {
          // Don't show errors for normal scanning process
          if (errorMessage.includes("No QR code found")) {
            return;
          }
          console.error(errorMessage);
        }
      );
    }

    return () => {
      if (scannerRef.current) {
        try {
          scannerRef.current.clear();
        } catch (error) {
          console.error("Error clearing scanner:", error);
        }
        scannerRef.current = null;
        setScannerInitialized(false);
      }
    };
  }, [scannerDivRef.current]);

  const handleQRCodeSuccess = async (decodedText: string) => {
    if (!currentUser) {
      setStatus('error');
      setMessage('You must be logged in to mark attendance');
      if (onError) onError('Authentication required');
      return;
    }

    setStatus('processing');
    setMessage('Verifying QR code...');
    
    try {
      // Parse QR code data
      const qrData = JSON.parse(decodedText);
      
      if (!qrData.courseId || !qrData.sessionId) {
        throw new Error('Invalid QR code');
      }
      
      // Check if QR code is expired
      const expiry = new Date(qrData.expiry);
      if (expiry < new Date()) {
        setStatus('error');
        setMessage('This QR code has expired. Please ask for a new one.');
        if (onError) onError('QR code expired');
        return;
      }
      
      // Mark attendance in Firebase
      const result = await markAttendance(
        qrData.sessionId, 
        currentUser.uid, 
        'qr', 
        { timestamp: new Date().toISOString() }
      );
      
      if (result.success) {
        // Update state
        setScanResult(decodedText);
        setCourseInfo({
          id: qrData.courseId,
          name: qrData.courseName
        });
        setStatus('success');
        setMessage(result.message || `Attendance marked successfully for ${qrData.courseName}`);
        
        // Call onSuccess callback if provided
        if (onSuccess) {
          onSuccess(qrData.sessionId);
        }
      } else {
        setStatus('error');
        setMessage(result.message || 'Failed to mark attendance. Please try again.');
        
        // Call onError callback if provided
        if (onError) {
          onError(result.message || 'Failed to mark attendance');
        }
      }
    } catch (error) {
      console.error('Error processing QR code:', error);
      setStatus('error');
      setMessage('Invalid QR code. Please try again.');
      
      // Call onError callback if provided
      if (onError) {
        onError('Failed to process QR code');
      }
    }
  };

  const resetScanner = () => {
    setScanResult(null);
    setStatus('idle');
    setMessage('');
    setCourseInfo(null);
    
    // Reinitialize scanner
    if (scannerRef.current) {
      try {
        scannerRef.current.clear();
      } catch (error) {
        console.error("Error clearing scanner:", error);
      }
      scannerRef.current = null;
      setScannerInitialized(false);
    }
    
    setTimeout(() => {
      if (scannerDivRef.current) {
        const config = { 
          fps: 10, 
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
          rememberLastUsedCamera: true,
          showTorchButtonIfSupported: true,
          showZoomSliderIfSupported: true
        };
        
        scannerRef.current = new Html5QrcodeScanner(
          "qr-reader",
          config,
          false
        );
        
        scannerRef.current.render(
          (decodedText: string) => {
            handleQRCodeSuccess(decodedText);
          },
          (errorMessage: string) => {
            // Don't show errors for normal scanning process
            if (errorMessage.includes("No QR code found")) {
              return;
            }
            console.error(errorMessage);
          }
        );
        
        setScannerInitialized(true);
      }
    }, 100);
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
              onClick={resetScanner}
              className="mt-3 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Scan another QR code
            </button>
          )}
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-start md:space-x-6">
        <div className="md:flex-1">
          <p className="text-sm text-gray-600 mb-4">
            Scan the QR code displayed by your lecturer to mark your attendance. Position the QR code within the scanning area.
          </p>
          
          <div 
            id="qr-reader" 
            ref={scannerDivRef}
            className="max-w-md mx-auto border border-gray-300 rounded-lg overflow-hidden"
          ></div>
          
          {/* Custom styling for scanner UI */}
          <style jsx>{`
            #qr-reader {
              width: 100%;
              max-width: 500px;
            }
            #qr-reader__dashboard_section_csr button {
              background-color: #2563eb !important;
              color: white !important;
              border-radius: 0.375rem !important;
              padding: 0.5rem 1rem !important;
              font-size: 0.875rem !important;
            }
            #qr-reader__dashboard_section_fsr button {
              background-color: #2563eb !important;
              color: white !important;
              border-radius: 0.375rem !important;
              padding: 0.5rem 1rem !important;
              font-size: 0.875rem !important;
            }
            #qr-reader__status_span {
              background-color: rgba(59, 130, 246, 0.1) !important;
              color: #1e40af !important;
              padding: 0.25rem 0.5rem !important;
              border-radius: 0.25rem !important;
              font-size: 0.875rem !important;
            }
          `}</style>
        </div>
        
        <div className="mt-6 md:mt-0 md:w-80">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <Info className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-blue-800">QR Code Scanning Tips</h4>
                <ul className="mt-2 text-sm text-blue-700 space-y-2 list-disc pl-5">
                  <li>Ensure the QR code is well-lit</li>
                  <li>Hold your device steady</li>
                  <li>Position the QR code within the scanning area</li>
                  <li>Make sure the entire QR code is visible</li>
                  <li>If scanning fails, try adjusting the distance</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-yellow-800">Important Note</h4>
                <p className="mt-2 text-sm text-yellow-700">
                  Each QR code is valid for a limited time and can only be used once per student. Make sure to scan it within the time limit.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCodeScanner;