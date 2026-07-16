import React, { useState, useEffect, useRef } from 'react';
import { FiLoader, FiClock, FiRefreshCw, FiAlertCircle } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import HowItWorks from '../components/HowItWorks';
import Features from '../components/Features';
import Footer from '../components/Footer';
import { resumeApi } from '../services/resumeApi';

const Home: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isRetrying, setIsRetrying] = useState(false);
  const [wakeUpAttempts, setWakeUpAttempts] = useState(0);
  const [isError, setIsError] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [statusMessage, setStatusMessage] = useState('Initializing...');
  const [errorMessage, setErrorMessage] = useState('');
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    if (isLoading || isRetrying) {
      timerRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        setElapsedTime(elapsed);
        
        if (elapsed < 10) {
          setStatusMessage('Waking up the server...');
        } else if (elapsed < 30) {
          setStatusMessage('Server is starting up, please wait...');
        } else if (elapsed < 60) {
          setStatusMessage('This is taking longer than expected...');
        } else if (elapsed < 120) {
          setStatusMessage('Still waking up. Render free tier can be slow...');
        } else {
          setStatusMessage('Taking longer than usual. Please be patient...');
        }
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isLoading, isRetrying]);

  const wakeUpBackend = async () => {
    try {
      setIsRetrying(true);
      setWakeUpAttempts(0);
      setIsError(false);
      setErrorMessage('');
      startTimeRef.current = Date.now();
      
      let isHealthy = false;
      let attempts = 0;
      const maxAttempts = 30;
      let consecutiveFailures = 0;
      
      while (!isHealthy && attempts < maxAttempts) {
        attempts++;
        setWakeUpAttempts(attempts);
        
        try {
          const healthResult = await resumeApi.healthCheck();
          if (healthResult) {
            isHealthy = true;
          } else {
            consecutiveFailures++;
            const waitTime = consecutiveFailures > 3 ? 5000 : 3000;
            if (attempts < maxAttempts) {
              await new Promise(resolve => setTimeout(resolve, waitTime));
            }
          }
        } catch (err) {
          consecutiveFailures++;
          if (attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 3000));
          }
        }
      }
      
      if (!isHealthy) {
        setIsError(true);
        setErrorMessage('Unable to wake up the server after multiple attempts.');
      }
    } catch (err) {
      setIsError(true);
      setErrorMessage('An unexpected error occurred while waking up the server.');
    } finally {
      setIsLoading(false);
      setIsRetrying(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  useEffect(() => {
    wakeUpBackend();
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleRetry = () => {
    setIsLoading(true);
    setIsError(false);
    setErrorMessage('');
    wakeUpBackend();
  };

  if (isLoading || isRetrying) {
    const progress = Math.min((elapsedTime / 90) * 100, 95);
    const isRetryingState = isRetrying && !isLoading;
    
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="w-24 h-24 border-4 border-blue-200 rounded-full"></div>
              <div className="absolute top-0 left-0 w-24 h-24 border-4 border-blue-600 rounded-full animate-spin border-t-transparent"></div>
              <FiLoader className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 text-blue-600 animate-spin" />
            </div>
            
            <h2 className="mt-6 text-2xl font-bold text-gray-900">
              {isRetryingState ? 'Retrying...' : statusMessage}
            </h2>
            
            <p className="mt-2 text-gray-600 flex items-center justify-center gap-2">
              <FiClock className="w-4 h-4" />
              Elapsed: {formatTime(elapsedTime)}
            </p>
            
            <div className="mt-6 w-full max-w-xs">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>{isRetryingState ? 'Retrying...' : 'Waking up...'}</span>
                <span>{Math.min(Math.round(elapsedTime / 2), 45)}s</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-1000"
                  style={{ width: `${Math.min(progress, 95)}%` }}
                ></div>
              </div>
            </div>
            
            <div className="mt-4 text-xs text-gray-400 space-y-1">
              <p>⚡ Render free tier sleeps after 15 minutes of inactivity</p>
              <p>🔄 Attempt {wakeUpAttempts}/30</p>
              {elapsedTime > 45 && (
                <p className="text-yellow-600">⏳ This may take up to 2 minutes on first load</p>
              )}
              {isRetryingState && (
                <p className="text-blue-600">🔄 Retrying connection...</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
              <FiAlertCircle className="w-12 h-12 text-red-600" />
            </div>
            
            <h2 className="mt-6 text-2xl font-bold text-gray-900">
              Server Unavailable
            </h2>
            
            <p className="mt-2 text-gray-600">
              {errorMessage || `Unable to wake up the server after ${Math.round(elapsedTime)} seconds.`}
            </p>
            
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-700 text-left">
              <p className="font-semibold">💡 Possible reasons:</p>
              <ul className="mt-1 list-disc list-inside space-y-1">
                <li>Backend is still deploying</li>
                <li>Render free tier is experiencing high load</li>
                <li>Network connectivity issues</li>
                <li>Backend service might be down</li>
              </ul>
            </div>
            
            <div className="mt-6 flex flex-col sm:flex-row gap-3 w-full">
              <button
                onClick={handleRetry}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <FiRefreshCw className="w-4 h-4" />
                Retry Wake Up
              </button>
              
              <button
                onClick={() => window.location.reload()}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
              >
                Refresh Page
              </button>
            </div>
            
            <p className="mt-4 text-xs text-gray-400">
              ⏱️ Last attempt: {formatTime(elapsedTime)} elapsed
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <div id="how-it-works">
        <HowItWorks />
      </div>
      <div id="features">
        <Features />
      </div>
      <Footer />
    </div>
  );
};

export default Home;