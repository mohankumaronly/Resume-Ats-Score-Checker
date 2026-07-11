// src/services/resumeApi.ts

import axios from 'axios';
import type { ResumeResponse } from '../types/Resume';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
  timeout: 60000, // 60 seconds timeout for analysis
});

export const resumeApi = {
  /**
   * Check backend health with timeout
   * Returns true if healthy, false otherwise
   */
  healthCheck: async (): Promise<boolean> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/resume/health`, {
        timeout: 10000, // 10 seconds timeout for health check
      });
      return response.status === 200;
    } catch (error) {
      console.log('Health check failed:', error);
      return false;
    }
  },

  /**
   * Upload a resume PDF for analysis
   */
  analyzeResume: async (file: File): Promise<ResumeResponse> => {
    const formData = new FormData();
    formData.append('resume', file);

    try {
      const response = await api.post<ResumeResponse>('/api/resume/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 90000, // 90 seconds for analysis + wake-up
      });
      return response.data;
    } catch (error: any) {
      if (error.response) {
        const errorMessage = error.response.data || 'Failed to analyze resume';
        throw new Error(errorMessage);
      } else if (error.code === 'ECONNABORTED') {
        throw new Error('Request timed out. The server might be waking up. Please try again.');
      } else if (error.request) {
        throw new Error('No response from server. Please check if the backend is running.');
      } else {
        throw new Error('Failed to upload resume: ' + error.message);
      }
    }
  },
};