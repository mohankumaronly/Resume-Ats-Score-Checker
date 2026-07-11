// src/pages/Home.tsx

import React, { useState, useEffect } from 'react';
import { FiLoader, FiClock } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import HowItWorks from '../components/HowItWorks';
import Features from '../components/Features';
import Footer from '../components/Footer';
import { resumeApi } from '../services/resumeApi';

const Home: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [wakeUpAttempts, setWakeUpAttempts] = useState(0);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const wakeUpBackend = async () => {
      try {
        setIsLoading(true);
        setWakeUpAttempts(0);
        setIsError(false);
        
        let isHealthy = false;
        let attempts = 0;
        const maxAttempts = 10;
        
        while (!isHealthy && attempts < maxAttempts) {
          attempts++;
          setWakeUpAttempts(attempts);
          
          try {
            await resumeApi.healthCheck();
            isHealthy = true;
          } catch (err) {
            console.log(`Health check attempt ${attempts} failed, retrying...`);
            if (attempts < maxAttempts) {
              await new Promise(resolve => setTimeout(resolve, 3000));
            }
          }
        }
        
        if (!isHealthy) {
          setIsError(true);
        }
      } catch (err) {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };
    
    wakeUpBackend();
  }, []);

  // Show loading state while backend is waking up
  if (isLoading) {
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
              Waking up the server...
            </h2>
            
            <p className="mt-2 text-gray-600 flex items-center justify-center gap-2">
              <FiClock className="w-4 h-4" />
              This may take 15-30 seconds
            </p>
            
            <div className="mt-6 w-full max-w-xs">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Attempt {wakeUpAttempts}/10</span>
                <span>{Math.min(wakeUpAttempts * 3, 30)}s</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-600 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((wakeUpAttempts / 10) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
            
            <p className="mt-4 text-xs text-gray-400">
              ⚡ The server sleeps after 15 minutes of inactivity on the free tier
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state if backend fails to wake up
  if (isError) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-5xl">⚠️</span>
            </div>
            
            <h2 className="mt-6 text-2xl font-bold text-gray-900">
              Server Unavailable
            </h2>
            
            <p className="mt-2 text-gray-600">
              Unable to wake up the server. Please try refreshing the page or check back later.
            </p>
            
            <button
              onClick={() => window.location.reload()}
              className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show the actual app when backend is ready
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