package com.resume.analyzer.controller;

import com.resume.analyzer.dto.JobMatchResponse;
import com.resume.analyzer.dto.ResumeResponse;
import com.resume.analyzer.service.JwtService;
import com.resume.analyzer.service.ResumeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/resume")
@CrossOrigin(origins = "*")
public class ResumeController {

    private final ResumeService resumeService;

    @Autowired
    public ResumeController(ResumeService resumeService) {
        this.resumeService = resumeService;
    }

    /**
     * Endpoint to analyze a resume
     */
    @PostMapping("/analyze")
    public ResponseEntity<?> analyzeResume(@RequestParam("resume") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("Please upload a valid PDF file.");
            }

            if (file.getSize() > 5 * 1024 * 1024) {
                return ResponseEntity.badRequest().body("File size exceeds 5MB limit.");
            }

            ResumeResponse response = resumeService.analyzeResume(file);
            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Validation error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error analyzing resume: " + e.getMessage());
        }
    }

    /**
     * Endpoint to analyze resume against a job description
     * Public endpoint - detailed improvements locked behind login
     */
    @PostMapping("/analyze-with-job")
    public ResponseEntity<?> analyzeResumeWithJob(
            @RequestParam("resume") MultipartFile file,
            @RequestParam("jobDescription") String jobDescription,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        try {
            // Validate file
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("Please upload a valid PDF file.");
            }

            // Validate job description
            if (jobDescription == null || jobDescription.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Job description is required. Please paste the job description.");
            }

            // Check file size
            if (file.getSize() > 5 * 1024 * 1024) {
                return ResponseEntity.badRequest().body("File size exceeds 5MB limit.");
            }

            // Check if user is authenticated (optional)
            boolean isAuthenticated = false;
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                // Token validation is handled by the filter, but we can check here too
                // The token is already validated by JwtAuthenticationFilter
                isAuthenticated = true;
            }

            // Process the resume with job description
            JobMatchResponse response = resumeService.analyzeResumeWithJob(file, jobDescription, isAuthenticated);

            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Validation error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error analyzing resume with job description: " + e.getMessage());
        }
    }

    /**
     * Health check endpoint
     */
    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("Resume Analyzer API is running!");
    }
}