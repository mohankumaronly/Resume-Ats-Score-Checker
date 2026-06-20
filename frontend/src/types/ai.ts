export type ImproveResumeRequest = {
  targetRole: string;
  experienceLevel: 'fresher' | 'mid-level' | 'senior' | 'lead';
};

export type ImproveResumeResponse = {
  resumeId: number;
  originalResumeDataJson: string;
  improvedResumeDataJson: string;
};