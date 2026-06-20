package com.resume.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResumeSummaryResponse {

    private Long id;
    private String title;
    private String templateId;
    private LocalDateTime updatedAt;
}