package com.resume.builder.controller;

import com.resume.builder.dto.ResumeRequestDTO;
import com.resume.builder.dto.ResumeResponseDTO;
import com.resume.builder.service.ResumeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController
@RequestMapping("/api/resume")
@RequiredArgsConstructor
public class ResumeController {

    private final ResumeService resumeService;

    @PostMapping("/create")
    public ResponseEntity<ResumeResponseDTO> createResume(@RequestBody ResumeRequestDTO request) {
        ResumeResponseDTO response = resumeService.createResumeJob(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/status/{jobId}")
    public ResponseEntity<ResumeResponseDTO> getJobStatus(@PathVariable UUID jobId) {
        ResumeResponseDTO response = resumeService.getJobStatus(jobId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/download/{fileName}")
    public ResponseEntity<byte[]> downloadPdf(@PathVariable String fileName) {
        try {
            String filePath = "generated-pdfs/" + fileName;
            byte[] pdfBytes = java.nio.file.Files.readAllBytes(java.nio.file.Paths.get(filePath));

            return ResponseEntity.ok()
                    .header("Content-Type", "application/pdf")
                    .header("Content-Disposition", "attachment; filename=\"" + fileName + "\"")
                    .body(pdfBytes);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}