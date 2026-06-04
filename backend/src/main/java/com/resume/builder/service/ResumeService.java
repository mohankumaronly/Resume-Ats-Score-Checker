package com.resume.builder.service;

import com.resume.builder.dto.ResumeRequestDTO;
import com.resume.builder.dto.ResumeResponseDTO;
import com.resume.builder.model.ResumeJob;
import com.resume.builder.repository.ResumeJobRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ResumeService {

    private final ResumeJobRepository resumeJobRepository;

    public ResumeResponseDTO createResumeJob(ResumeRequestDTO request) {
        // Create new resume job entity
        ResumeJob resumeJob = new ResumeJob();
        resumeJob.setTemplateType(request.getTemplateType());
        resumeJob.setUserInput(request.getUserInput());
        resumeJob.setStatus("processing");

        // Save to database
        ResumeJob savedJob = resumeJobRepository.save(resumeJob);

        // Return response
        ResumeResponseDTO response = new ResumeResponseDTO();
        response.setJobId(savedJob.getId());
        response.setStatus(savedJob.getStatus());

        return response;
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