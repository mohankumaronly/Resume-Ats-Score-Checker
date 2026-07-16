// src/services/resumeApi.ts

import axios from 'axios';
import type { ResumeResponse, JobMatchResponse } from '../types/Resume';
import { authApi } from './authApi';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
  timeout: 60000,
});

export const resumeApi = {
  healthCheck: async (): Promise<boolean> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/resume/health`, {
        timeout: 10000,
      });
      return response.status === 200;
    } catch (error) {
      console.log('Health check failed:', error);
      return false;
    }
  },

  /**
   * Generic resume analysis (Existing)
   */
  analyzeResume: async (file: File): Promise<ResumeResponse> => {
    const formData = new FormData();
    formData.append('resume', file);

    try {
      const response = await api.post<ResumeResponse>('/api/resume/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 90000,
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

  /**
   * NEW: Analyze resume with job description
   * Public endpoint - detailed improvements locked behind login
   */
  analyzeWithJob: async (file: File, jobDescription: string): Promise<JobMatchResponse> => {
    const formData = new FormData();
    formData.append('resume', file);
    formData.append('jobDescription', jobDescription);

    try {
      // Get auth token if available (optional)
      const token = authApi.getToken();
      const headers: any = {
        'Content-Type': 'multipart/form-data',
      };
      
      // Add Authorization header only if user is logged in
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await api.post<JobMatchResponse>('/api/resume/analyze-with-job', formData, {
        headers,
        timeout: 90000,
      });
      return response.data;
    } catch (error: any) {
      if (error.response) {
        const errorMessage = error.response.data || 'Failed to analyze resume with job description';
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