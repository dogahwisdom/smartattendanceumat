import React, { useState, useEffect } from 'react';
import { attendanceService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Smartphone, Loader2, CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';

interface NFCAttendanceProps {
  courseId: string;
  sessionId: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

const NFCAttendance: React.FC<NFCAttendanceProps> = ({
  courseId,
  sessionId,
  onSuccess,
  onError
}) => {
  const { currentUser } = useAuth();
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [nfcSupported, setNfcSupported] = useState<boolean | null>(null);
  const [scanning, setScanning] = useState(false);
  const [nfcReader, setNfcReader] = useState<any>(null);
  const [cardId, setCardId] = useState<string | null>(null);

  // Check if NFC is supported
  useEffect(() => {
    const checkNFCSupport = () => {
      if ('NDEFReader' in window) {
        setNfcSupported(true);
      } else {
        setNfcSupported(false);
      }
    };

    checkNFCSupport();
  }, []);

  // Start NFC scanning
  const startNFCScanning = async () => {
    if (!nfcSupported) {
      setStatus('error');
      setMessage('NFC is not supported on this device');
      if (onError) onError('NFC not supported');
      return;
    }

    try {
      setScanning(true);
      setStatus('processing');
      setMessage('Waiting for NFC card...');

      // @ts-ignore - NDEFReader is not in the TypeScript types yet
      const reader = new NDEFReader();
      setNfcReader(reader);

      await reader.scan();

      reader.addEventListener('reading', ({ serialNumber }: { serialNumber: string }) => {
        setCardId(serialNumber);
        verifyNFC(serialNumber);
      });

      reader.addEventListener('error', (error: any) => {
        console.error('NFC reading error:', error);
        setStatus('error');
        setMessage('Error reading NFC card. Please try again.');
        setScanning(false);
        
        if (onError) onError('Error reading NFC card');
      });
    } catch (error) {
      console.error('Error starting NFC scan:', error);
      setStatus('error');
      setMessage('Could not start NFC scanning. Please ensure NFC is enabled on your device.');
      setScanning(false);
      
      if (onError) onError('Could not start NFC scanning');
    }
  };

  // Stop NFC scanning
  const stopNFCScanning = () => {
    if (nfcReader) {
      // There's no official way to stop scanning in the Web NFC API
      // In a real app, you would need to handle this differently
      setNfcReader(null);
    }
    
    setScanning(false);
    setStatus('idle');
    setMessage('');
  };

  // Verify NFC and mark attendance
  const verifyNFC = async (serialNumber: string) => {
    if (!currentUser) {
      setStatus('error');
      setMessage('You must be logged in to mark attendance');
      setScanning(false);
      if (onError) onError('Authentication required');
      return;
    }

    try {
      setStatus('processing');
      setMessage('Verifying your NFC card...');

      // In a real app, you would verify the NFC card against a database
      // For demo purposes, we'll simulate verification with a delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mark attendance using the attendance service
      const result = await attendanceService.markAttendance(sessionId, 'nfc', {
        timestamp: new Date().toISOString(),
        cardId: serialNumber
      });
      
      if (result.success) {
        setStatus('success');
        setMessage(result.message || 'NFC card verified. Attendance marked successfully!');
        
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
    } catch (error) {
      console.error('Error verifying NFC:', error);
      setStatus('error');
      setMessage('Error processing NFC verification. Please try again.');
      
      if (onError) {
        onError('Error processing NFC verification');
      }
    } finally {
      setScanning(false);
    }
  };

  // Simulate NFC scan (for demo purposes)
  const simulateNFCScan = async () => {
    try {
      setScanning(true);
      setStatus('processing');
      setMessage('Waiting for NFC card...');

      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generate random card ID
      const mockCardId = `UMAT-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;
      setCardId(mockCardId);
      
      // Verify the simulated card
      verifyNFC(mockCardId);
    } catch (error) {
      console.error('Error in NFC simulation:', error);
      setStatus('error');
      setMessage('Error in NFC simulation. Please try again.');
      setScanning(false);
      
      if (onError) onError('Error in NFC simulation');
    }
  };

  // Reset state
  const resetNFC = () => {
    stopNFCScanning();
    setCardId(null);
    setStatus('idle');
    setMessage('');
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
              onClick={resetNFC}
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
            Use your NFC-enabled student ID card to mark attendance. Hold your card against the back of your device to scan.
          </p>
          
          {nfcSupported === false && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                <div>
                  <p className="text-sm text-red-700">
                    NFC is not supported on this device. Please use another attendance method or try a different device.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <div className="bg-white border border-gray-300 rounded-lg p-6 mb-4">
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Smartphone className="h-12 w-12 text-blue-600" />
              </div>
              
              <h3 className="text-lg font-medium mb-2">NFC Card Verification</h3>
              
              {cardId ? (
                <div className="text-center mb-4">
                  <p className="text-sm text-gray-600 mb-1">Card ID:</p>
                  <p className="text-sm font-medium">{cardId}</p>
                </div>
              ) : (
                <p className="text-sm text-gray-600 mb-4 text-center">
                  {nfcSupported === false 
                    ? 'NFC is not supported on this device. Use the simulation button below for demo purposes.'
                    : 'Tap your student ID card on the back of your device to scan.'}
                </p>
              )}
              
              {status === 'idle' && (
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                  {nfcSupported && (
                    <button
                      onClick={startNFCScanning}
                      disabled={scanning}
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {scanning ? (
                        <>
                          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                          Scanning...
                        </>
                      ) : (
                        <>
                          <Smartphone className="h-5 w-5 mr-2" />
                          Scan NFC Card
                        </>
                      )}
                    </button>
                  )}
                  
                  <button
                    onClick={simulateNFCScan}
                    disabled={scanning}
                    className="flex items-center px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {scanning ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Simulating...
                      </>
                    ) : (
                      <>
                        <Smartphone className="h-5 w-5 mr-2" />
                        Simulate NFC Scan
                      </>
                    )}
                  </button>
                </div>
              )}
              
              {scanning && (
                <div className="mt-4 text-center">
                  <div className="inline-block animate-pulse">
                    <Smartphone className="h-10 w-10 text-blue-500" />
                  </div>
                  <p className="text-sm text-gray-600 mt-2">Waiting for NFC card...</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-6 md:mt-0 md:w-80">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <Info className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-blue-800">NFC Scanning Tips</h4>
                <ul className="mt-2 text-sm text-blue-700 space-y-2 list-disc pl-5">
                  <li>Enable NFC on your device</li>
                  <li>Hold your card against the back of your device</li>
                  <li>Keep the card still until scanning completes</li>
                  <li>Try different positions if scanning fails</li>
                  <li>Remove phone case if it's interfering with NFC</li>
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
                  Web NFC is only supported in Chrome for Android. If you're using another browser or device, use the simulation option for demonstration purposes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NFCAttendance;