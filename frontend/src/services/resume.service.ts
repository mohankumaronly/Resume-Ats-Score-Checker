import { api, handleApiError } from "./api";
import type {
  ResumeSummary,
  ResumeDetail,
  CreateResumeRequest,
  UpdateResumeRequest,
} from "../types/resume";
import type { ApiResponse } from "../types/api";

export const resumeService = {
  /**
   * Create a new resume
   */
  createResume: async (
    data: CreateResumeRequest
  ): Promise<ResumeDetail> => {
    try {
      const response = await api.post<ApiResponse<ResumeDetail>>(
        "/resumes",
        data
      );
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Get all resumes for current user
   */
  getAllResumes: async (): Promise<ResumeSummary[]> => {
    try {
      const response = await api.get<ApiResponse<ResumeSummary[]>>("/resumes");
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Get resume by ID
   */
  getResumeById: async (resumeId: number): Promise<ResumeDetail> => {
    try {
      const response = await api.get<ApiResponse<ResumeDetail>>(
        `/resumes/${resumeId}`
      );
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Update resume
   */
  updateResume: async (
    resumeId: number,
    data: UpdateResumeRequest
  ): Promise<ResumeDetail> => {
    try {
      const response = await api.put<ApiResponse<ResumeDetail>>(
        `/resumes/${resumeId}`,
        data
      );
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Delete resume
   */
  deleteResume: async (resumeId: number): Promise<void> => {
    try {
      await api.delete(`/resumes/${resumeId}`);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};