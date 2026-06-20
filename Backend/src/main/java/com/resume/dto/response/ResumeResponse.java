package com.resume.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResumeResponse {

    private Long id;
    private String title;
    private String templateId;
    private String resumeDataJson;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}