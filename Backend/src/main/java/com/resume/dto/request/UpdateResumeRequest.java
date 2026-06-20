package com.resume.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdateResumeRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Template ID is required")
    private String templateId;

    @NotBlank(message = "Resume data is required")
    private String resumeDataJson;
}