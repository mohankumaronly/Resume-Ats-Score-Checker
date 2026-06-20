package com.resume.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AIResumeResponse {

    private Long resumeId;
    private String originalResumeDataJson;
    private String improvedResumeDataJson;
}   