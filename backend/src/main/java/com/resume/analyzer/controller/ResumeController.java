package com.resume.analyzer.controller;

import com.resume.analyzer.dto.ResumeResponse;
import com.resume.analyzer.service.ResumeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/resume")
@CrossOrigin(origins = "*")  // Allow React frontend to access this API
public class ResumeController {

    private final ResumeService resumeService;

    @Autowired
    public ResumeController(ResumeService resumeService) {
        this.resumeService = resumeService;
    }

    /**
     * Endpoint to analyze a resume
     *
     * @param file The uploaded PDF file
     * @return ResponseEntity containing the analysis result
     */
    @PostMapping("/analyze")
    public ResponseEntity<?> analyzeResume(@RequestParam("resume") MultipartFile file) {
        try {
            // Validate file
            if (file.isEmpty()) {
                return ResponseEntity
                        .badRequest()
                        .body("Please upload a valid PDF file.");
            }

            // Check file size (limit to 5MB)
            if (file.getSize() > 5 * 1024 * 1024) {
                return ResponseEntity
                        .badRequest()
                        .body("File size exceeds 5MB limit. Please upload a smaller file.");
            }

            // Process the resume
            ResumeResponse response = resumeService.analyzeResume(file);

            // Return success response
            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            // Handle validation errors
            return ResponseEntity
                    .badRequest()
                    .body("Validation error: " + e.getMessage());

        } catch (Exception e) {
            // Handle all other errors
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error analyzing resume: " + e.getMessage());
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