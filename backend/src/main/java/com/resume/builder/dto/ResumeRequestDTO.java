package com.resume.builder.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResumeRequestDTO {

    private String userInput;

    private String templateType;

    private String additionalNotes;
}