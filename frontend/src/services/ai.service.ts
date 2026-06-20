import { api, handleApiError } from "./api";
import type { ImproveResumeRequest, ImproveResumeResponse } from "../types/ai";
import type { ApiResponse } from "../types/api";

export const aiService = {
  /**
   * Improve resume using AI
   */
  improveResume: async (
    resumeId: number,
    data: ImproveResumeRequest
  ): Promise<ImproveResumeResponse> => {
    try {
      const response = await api.post<ApiResponse<ImproveResumeResponse>>(
        `/ai/resumes/${resumeId}/improve`,
        data
      );
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};