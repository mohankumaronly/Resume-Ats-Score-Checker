import axios from 'axios';
import type { ResumeResponse } from '../types/Resume';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

export const resumeApi = {
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
      });
      return response.data;
    } catch (error: any) {
      if (error.response) {
        const errorMessage = error.response.data || 'Failed to analyze resume';
        throw new Error(errorMessage);
      } else if (error.request) {
        throw new Error('No response from server. Please check if the backend is running.');
      } else {
        throw new Error('Failed to upload resume: ' + error.message);
      }
    }
  },

  /**
   * Health check endpoint
   */
  healthCheck: async (): Promise<string> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/resume/health`);
      return response.data;
    } catch (error) {
      throw new Error('Backend service is not available');
    }
  },
};