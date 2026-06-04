package com.resume.builder.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResumeResponseDTO {

    private UUID jobId;

    private String status;

    private String downloadUrl;

    private String errorMessage;
}