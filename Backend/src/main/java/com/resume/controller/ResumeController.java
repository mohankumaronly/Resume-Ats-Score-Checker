package com.resume.controller;

import com.resume.dto.request.CreateResumeRequest;
import com.resume.dto.request.UpdateResumeRequest;
import com.resume.dto.response.ApiResponse;
import com.resume.dto.response.ResumeResponse;
import com.resume.dto.response.ResumeSummaryResponse;
import com.resume.service.ResumeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resumes")
@RequiredArgsConstructor
public class ResumeController {

    private final ResumeService resumeService;

    @PostMapping
    public ResponseEntity<ApiResponse> createResume(@Valid @RequestBody CreateResumeRequest request) {
        ResumeResponse response = resumeService.createResume(request);
        return ResponseEntity.ok(ApiResponse.success("Resume created successfully", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse> getAllResumes() {
        List<ResumeSummaryResponse> responses = resumeService.getAllResumes();
        return ResponseEntity.ok(ApiResponse.success("Resumes fetched successfully", responses));
    }

    @GetMapping("/{resumeId}")
    public ResponseEntity<ApiResponse> getResumeById(@PathVariable Long resumeId) {
        ResumeResponse response = resumeService.getResumeById(resumeId);
        return ResponseEntity.ok(ApiResponse.success("Resume fetched successfully", response));
    }

    @PutMapping("/{resumeId}")
    public ResponseEntity<ApiResponse> updateResume(
            @PathVariable Long resumeId,
            @Valid @RequestBody UpdateResumeRequest request) {
        ResumeResponse response = resumeService.updateResume(resumeId, request);
        return ResponseEntity.ok(ApiResponse.success("Resume updated successfully", response));
    }

    @DeleteMapping("/{resumeId}")
    public ResponseEntity<ApiResponse> deleteResume(@PathVariable Long resumeId) {
        resumeService.deleteResume(resumeId);
        return ResponseEntity.ok(ApiResponse.success("Resume deleted successfully"));
    }
}