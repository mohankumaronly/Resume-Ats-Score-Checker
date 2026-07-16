// src/components/JobDescriptionInput.tsx

import React from 'react';
import { FiInfo, FiFileText, FiX } from 'react-icons/fi';

interface JobDescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  placeholder?: string;
  disabled?: boolean;
}

const JobDescriptionInput: React.FC<JobDescriptionInputProps> = ({
  value,
  onChange,
  onClear,
  placeholder = 'Paste the job description here for targeted ATS analysis...',
  disabled = false,
}) => {
  const handleClear = () => {
    onChange('');
    if (onClear) onClear();
  };

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-2">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <FiFileText className="w-4 h-4 text-blue-500" />
          Job Description
          <span className="text-xs font-normal text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
            Optional
          </span>
        </label>
        {value && (
          <button
            onClick={handleClear}
            className="text-xs text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1"
            type="button"
          >
            <FiX className="w-3 h-3" />
            Clear
          </button>
        )}
      </div>

      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          rows={4}
          className={`
            w-full px-4 py-3 border rounded-lg 
            focus:ring-2 focus:ring-blue-500 focus:border-transparent 
            outline-none transition resize-y
            bg-white
            text-gray-900
            placeholder:text-gray-400
            ${value ? 'border-blue-300' : 'border-gray-300'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        />
        
        {/* Character counter */}
        <div className="flex justify-between mt-1">
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <FiInfo className="w-3 h-3" />
            <span>Paste a job description for targeted ATS scoring</span>
          </div>
          {value && (
            <span className="text-xs text-gray-400">
              {value.length} characters
            </span>
          )}
        </div>
      </div>

      {/* Example placeholder for first-time users */}
      {!value && !disabled && (
        <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-gray-600">
            💡 <span className="font-medium">Tip:</span> Paste a job description to get:
          </p>
          <ul className="mt-1 text-xs text-gray-500 list-disc list-inside space-y-0.5">
            <li>Match score against the job requirements</li>
            <li>Skills gap analysis (required vs found)</li>
            <li>Missing keywords specific to this role</li>
            <li>Job-specific improvement suggestions</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default JobDescriptionInput;