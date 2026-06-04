package com.resume.builder.service;

import com.resume.builder.dto.ResumeRequestDTO;
import com.resume.builder.dto.ResumeResponseDTO;
import com.resume.builder.model.ResumeJob;
import com.resume.builder.repository.ResumeJobRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.io.*;
import java.nio.file.*;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ResumeService {

    private final ResumeJobRepository resumeJobRepository;
    private final GroqService groqService;
    private final LatexCompilerService latexCompilerService;

    @Value("${server.port:8080}")
    private String serverPort;

    @Transactional
    public ResumeResponseDTO createResumeJob(ResumeRequestDTO request) {
        // Create new resume job entity
        ResumeJob resumeJob = new ResumeJob();
        resumeJob.setTemplateType(request.getTemplateType());
        resumeJob.setUserInput(request.getUserInput());
        resumeJob.setStatus("processing");

        // Save to database
        ResumeJob savedJob = resumeJobRepository.save(resumeJob);
        log.info("Created resume job with ID: {}", savedJob.getId());

        try {
            // Generate LaTeX using Groq
            String latexScript = groqService.generateLaTeX(
                    request.getUserInput(),
                    request.getTemplateType(),
                    request.getAdditionalNotes()
            );
            savedJob.setLatexScript(latexScript);

            // Compile LaTeX to PDF
            byte[] pdfBytes = latexCompilerService.compileLatexToPdf(latexScript, savedJob.getId());

            // Save PDF to storage (local file for now)
            String pdfUrl = savePdfToStorage(pdfBytes, savedJob.getId());
            savedJob.setPdfUrl(pdfUrl);
            savedJob.setStatus("completed");

            resumeJobRepository.save(savedJob);
            log.info("PDF generated and job completed for ID: {}", savedJob.getId());

        } catch (Exception e) {
            log.error("Failed to generate PDF: {}", e.getMessage());
            savedJob.setStatus("failed");
            savedJob.setErrorMessage(e.getMessage());
            resumeJobRepository.save(savedJob);
        }

        // Return response
        ResumeResponseDTO response = new ResumeResponseDTO();
        response.setJobId(savedJob.getId());
        response.setStatus(savedJob.getStatus());
        response.setDownloadUrl(savedJob.getPdfUrl());
        response.setErrorMessage(savedJob.getErrorMessage());

        return response;
    }

    private String savePdfToStorage(byte[] pdfBytes, UUID jobId) throws IOException {
        // Create PDFs directory if not exists
        String pdfDir = "generated-pdfs";
        File dir = new File(pdfDir);
        if (!dir.exists()) {
            dir.mkdirs();
        }

        // Save PDF file
        String fileName = jobId.toString() + ".pdf";
        String filePath = pdfDir + File.separator + fileName;
        Files.write(Paths.get(filePath), pdfBytes);

        // Return download URL
        return "http://localhost:" + serverPort + "/api/resume/download/" + fileName;
    }

    public ResumeResponseDTO getJobStatus(UUID jobId) {
        ResumeJob resumeJob = resumeJobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found with id: " + jobId));

        ResumeResponseDTO response = new ResumeResponseDTO();
        response.setJobId(resumeJob.getId());
        response.setStatus(resumeJob.getStatus());
        response.setDownloadUrl(resumeJob.getPdfUrl());
        response.setErrorMessage(resumeJob.getErrorMessage());

        return response;
    }
}