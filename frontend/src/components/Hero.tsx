import React from 'react';
import { FiCheckCircle, FiUsers, FiCode, FiCpu } from 'react-icons/fi';
import UploadResume from './UploadResume';

const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50"></div>
      <div className="absolute top-20 right-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
      
      <div className="relative max-w-6xl mx-auto px-4 py-16 lg:py-20">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6 animate-fade-in">
            <FiCpu className="w-4 h-4" />
            AI-Powered Tech Resume Analysis
          </div>
          
          {/* Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
            Check Your{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Tech Resume's
            </span>
            <br />
            <span className="text-gray-900">ATS Score</span>
          </h1>
          
          {/* Subheading */}
          <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Built for developers, engineers, and tech professionals. 
            Get instant AI-powered feedback powered by{' '}
            <span className="font-semibold text-blue-600">Groq API</span>.
            See how you stack up against ATS systems.
          </p>
          
          {/* Stats */}
          <div className="mt-8 flex flex-wrap justify-center gap-8">
            <div className="flex items-center gap-2 text-gray-700">
              <FiCheckCircle className="w-5 h-5 text-green-500" />
              <span>10,000+ Tech Resumes Analyzed</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <FiUsers className="w-5 h-5 text-blue-500" />
              <span>Trusted by 5,000+ Developers</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <FiCode className="w-5 h-5 text-indigo-500" />
              <span>Powered by Groq AI</span>
            </div>
          </div>
          
          {/* Upload Section */}
          <div className="mt-12">
            <UploadResume />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;