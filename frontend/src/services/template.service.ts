import { api, handleApiError } from "./api";
import type { Template } from "../types/template";
import type { ApiResponse } from "../types/api";

export const templateService = {
  /**
   * Get all available templates
   */
  getAllTemplates: async (): Promise<Template[]> => {
    try {
      const response = await api.get<ApiResponse<Template[]>>("/templates");
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Get template by ID
   */
  getTemplateById: async (templateId: string): Promise<Template> => {
    try {
      const response = await api.get<ApiResponse<Template>>(
        `/templates/${templateId}`
      );
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};