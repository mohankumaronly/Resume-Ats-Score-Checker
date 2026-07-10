// src/components/BlurredImprovements.tsx

import React from 'react';
import { FiLock } from 'react-icons/fi';

interface BlurredImprovementsProps {
  children: React.ReactNode;
}

const BlurredImprovements: React.FC<BlurredImprovementsProps> = ({ children }) => {
  return (
    <div className="relative">
      <div className="filter blur-sm select-none pointer-events-none opacity-60">
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-lg text-center">
          <FiLock className="w-12 h-12 text-blue-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-900">Login to Unlock</h3>
          <p className="text-sm text-gray-600 mt-1 max-w-xs">
            Sign in to view detailed improvements, strengths, and personalized suggestions for your resume.
          </p>
          <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlurredImprovements;