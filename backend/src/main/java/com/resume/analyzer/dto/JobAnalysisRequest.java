package com.resume.analyzer.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.web.multipart.MultipartFile;

public class JobAnalysisRequest {

    @NotNull(message = "Resume file is required")
    private MultipartFile resume;

    @NotBlank(message = "Job description is required")
    private String jobDescription;

    // Getters and Setters
    public MultipartFile getResume() {
        return resume;
    }

    public void setResume(MultipartFile resume) {
        this.resume = resume;
    }

    public String getJobDescription() {
        return jobDescription;
    }

    public void setJobDescription(String jobDescription) {
        this.jobDescription = jobDescription;
    }
}