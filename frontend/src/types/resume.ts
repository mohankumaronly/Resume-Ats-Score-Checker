export type PersonalInfo = {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  website?: string;
};

export type ResumeData = {
  personalInfo: PersonalInfo;
  skills: string[];
  summary: string;
  experience?: Array<{
    company: string;
    position: string;
    startDate: string;
    endDate?: string;
    description: string;
  }>;
  education?: Array<{
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate?: string;
  }>;
};

export type ResumeSummary = {
  id: number;
  title: string;
  templateId: string;
  updatedAt: string;
  createdAt: string;
};

export type ResumeDetail = {
  id: number;
  title: string;
  templateId: string;
  resumeDataJson: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateResumeRequest = {
  title: string;
  templateId: string;
  resumeDataJson: string;
};

export type UpdateResumeRequest = {
  title: string;
  templateId: string;
  resumeDataJson: string;
};