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

// NEW: Job Match Response Interface
export interface SkillsGap {
  required: string[];
  found: string[];
  missing: string[];
}

export interface JobMatchResponse {
  // Overall scores
  atsScore: number;
  matchScore: number;
  overallRating: string;
  summary: string;
  
  // Job-specific analysis
  keywordMatchRate: number;
  missingKeywords: string[];
  skillsGap: SkillsGap;
  experienceMatch: string;
  educationMatch: string;
  
  // Section scores
  sectionScores: SectionScores;
  
  // Locked/Unlocked fields
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  recommendedSkills: string[];
  detailsLocked: boolean;
  
  // Other fields
  atsFriendly: boolean;
  analysisConfidence: number;
  analyzedAt: string;
}

export interface UploadState {
  file: File | null;
  jobDescription: string;
  isUploading: boolean;
  error: string | null;
  result: ResumeResponse | JobMatchResponse | null;
  analysisMode: 'generic' | 'job-specific';
}