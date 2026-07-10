// src/components/HowItWorks.tsx

import React from 'react';
import { FiUpload, FiCpu, FiBarChart2 } from 'react-icons/fi';

interface Step {
  icon: React.ReactNode;
  title: string;
  description: string;
  step: number;
}

const steps: Step[] = [
  {
    icon: <FiUpload className="w-8 h-8" />,
    title: 'Upload Your Resume',
    description: 'Drag and drop your PDF resume or click to browse and select your file.',
    step: 1
  },
  {
    icon: <FiCpu className="w-8 h-8" />,
    title: 'AI Analysis',
    description: 'Our AI analyzes your resume against key ATS criteria and industry standards.',
    step: 2
  },
  {
    icon: <FiBarChart2 className="w-8 h-8" />,
    title: 'Get Your Score',
    description: 'Receive your ATS score with detailed breakdowns and improvement suggestions.',
    step: 3
  }
];

const HowItWorks: React.FC = () => {
  return (
    <section className="py-16 px-4 bg-gray-50/50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">
            How It Works
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Get your resume analyzed in three simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div key={step.step} className="relative">
              {/* Connector line */}
              {step.step < 3 && (
                <div className="hidden md:block absolute top-12 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-0.5 bg-blue-200">
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                </div>
              )}
              
              <div className="flex flex-col items-center text-center">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-3xl">
                    {step.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-bold flex items-center justify-center">
                    {step.step}
                  </div>
                </div>
                <h3 className="mt-4 text-xl font-semibold text-gray-900">
                  {step.title}
                </h3>
                <p className="mt-2 text-gray-600 max-w-sm">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;