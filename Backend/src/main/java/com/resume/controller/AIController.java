package com.resume.controller;

import com.resume.dto.request.ImproveResumeRequest;
import com.resume.dto.response.AIResumeResponse;
import com.resume.dto.response.ApiResponse;
import com.resume.service.AIService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AIController {

    private final AIService aiService;

    @PostMapping("/resumes/{resumeId}/improve")
    public ResponseEntity<ApiResponse> improveResume(
            @PathVariable Long resumeId,
            @Valid @RequestBody ImproveResumeRequest request) {
        AIResumeResponse response = aiService.improveResume(resumeId, request);
        return ResponseEntity.ok(ApiResponse.success("Resume improved successfully", response));
    }
}