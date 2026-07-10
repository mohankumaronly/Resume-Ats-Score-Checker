// src/components/UploadResume.tsx

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUpload, FiFile, FiX, FiArrowRight } from 'react-icons/fi';
import type { ResumeResponse } from '../types/Resume';
import { resumeApi } from '../services/resumeApi';
import LoadingSpinner from './LoadingSpinner';
import ResultCard from './ResultCard';

const UploadResume: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ResumeResponse | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        setError('Please upload a PDF file');
        return;
      }
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError('File size exceeds 5MB limit');
        return;
      }
      setFile(selectedFile);
      setError(null);
      setResult(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    multiple: false
  });

  const handleAnalyze = async () => {
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      const response = await resumeApi.analyzeResume(file);
      setResult(response);
    } catch (err: any) {
      setError(err.message || 'Failed to analyze resume. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setError(null);
    setResult(null);
  };

  // Handle reset from ResultCard
  const handleReset = () => {
    setFile(null);
    setError(null);
    setResult(null);
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isUploading) {
    return <LoadingSpinner message="Analyzing your resume..." />;
  }

  if (result) {
    return <ResultCard result={result} onReset={handleReset} />;
  }

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer
          transition-all duration-300
          ${isDragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/50'
          }
          ${error ? 'border-red-500 bg-red-50' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center">
          <div className={`
            w-20 h-20 rounded-full flex items-center justify-center mb-4
            ${isDragActive ? 'bg-blue-100' : 'bg-blue-50'}
          `}>
            <FiUpload className={`
              w-10 h-10
              ${isDragActive ? 'text-blue-600' : 'text-blue-500'}
            `} />
          </div>
          
          <h3 className="text-xl font-semibold text-gray-900">
            {isDragActive ? 'Drop your resume here' : 'Upload your resume'}
          </h3>
          
          <p className="mt-2 text-gray-600">
            {isDragActive 
              ? 'Release to upload' 
              : 'Drag & drop your PDF resume, or click to browse'
            }
          </p>
          
          <p className="mt-1 text-sm text-gray-500">
            Supports PDF files up to 5MB
          </p>

          {error && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}
        </div>
      </div>

      {file && !isUploading && (
        <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <FiFile className="w-8 h-8 text-blue-500 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate">
                {file.name}
              </p>
              <p className="text-sm text-gray-500">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={handleRemoveFile}
              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
              type="button"
            >
              <FiX className="w-5 h-5" />
            </button>
            <button
              onClick={handleAnalyze}
              className="flex-1 sm:flex-none px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              type="button"
            >
              Analyze Resume
              <FiArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadResume;