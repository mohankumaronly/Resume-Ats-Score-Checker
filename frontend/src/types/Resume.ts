// src/types/Resume.ts

export interface SectionScores {
  formatting: number;
  technicalSkills: number;
  experience: number;
  projects: number;
  education: number;
  keywords: number;
}

export interface ResumeResponse {
  atsScore: number;
  overallRating: string;
  summary: string;
  detailedFeedback: string;
  sectionScores: SectionScores;
  strengths: string[];
  weaknesses: string[];
  missingKeywords: string[];
  recommendedSkills: string[];
  grammarIssues: string[];
  suggestions: string[];
  atsFriendly: boolean;
  analysisConfidence: number;
  analyzedAt: string;
}

export interface UploadState {
  file: File | null;
  isUploading: boolean;
  error: string | null;
  result: ResumeResponse | null;
}