// src/components/LoadingSpinner.tsx

import React from 'react';
import { FiLoader } from 'react-icons/fi';

interface LoadingSpinnerProps {
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = 'Analyzing your resume...' 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative">
        <div className="w-20 h-20 border-4 border-blue-200 rounded-full"></div>
        <div className="absolute top-0 left-0 w-20 h-20 border-4 border-blue-600 rounded-full animate-spin border-t-transparent"></div>
        <FiLoader className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-blue-600 animate-spin-slow" />
      </div>
      <p className="mt-6 text-lg font-medium text-gray-700 animate-pulse">
        {message}
      </p>
      <p className="mt-2 text-sm text-gray-500">
        This may take a few seconds
      </p>
      <div className="mt-4 flex space-x-1">
        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;