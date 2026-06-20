package com.resume.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ImproveResumeRequest {

    @NotBlank(message = "Target role is required")
    private String targetRole;

    @NotBlank(message = "Experience level is required")
    private String experienceLevel;
}