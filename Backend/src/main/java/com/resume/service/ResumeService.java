package com.resume.service;

import com.resume.dto.request.CreateResumeRequest;
import com.resume.dto.request.UpdateResumeRequest;
import com.resume.dto.response.ResumeResponse;
import com.resume.dto.response.ResumeSummaryResponse;
import com.resume.entity.Resume;
import com.resume.entity.User;
import com.resume.exception.ResumeNotFoundException;
import com.resume.exception.TemplateNotFoundException;
import com.resume.repository.ResumeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ResumeService {

    private final ResumeRepository resumeRepository;
    private final AuthHelperService authHelperService;
    private final TemplateService templateService;

    @Transactional
    public ResumeResponse createResume(CreateResumeRequest request) {
        // Validate template exists
        if (!templateService.isValidTemplate(request.getTemplateId())) {
            throw new TemplateNotFoundException("Template not found with id: " + request.getTemplateId());
        }

        User currentUser = authHelperService.getCurrentLoggedInUser();

        Resume resume = new Resume();
        resume.setTitle(request.getTitle());
        resume.setTemplateId(request.getTemplateId());
        resume.setResumeDataJson(request.getResumeDataJson());
        resume.setUser(currentUser);

        Resume savedResume = resumeRepository.save(resume);

        return mapToResumeResponse(savedResume);
    }

    public List<ResumeSummaryResponse> getAllResumes() {
        User currentUser = authHelperService.getCurrentLoggedInUser();

        return resumeRepository.findAllByUserIdOrderByUpdatedAtDesc(currentUser.getId())
                .stream()
                .map(this::mapToResumeSummaryResponse)
                .collect(Collectors.toList());
    }

    public ResumeResponse getResumeById(Long resumeId) {
        User currentUser = authHelperService.getCurrentLoggedInUser();

        Resume resume = resumeRepository.findByIdAndUserId(resumeId, currentUser.getId())
                .orElseThrow(() -> new ResumeNotFoundException("Resume not found with id: " + resumeId));

        return mapToResumeResponse(resume);
    }

    @Transactional
    public ResumeResponse updateResume(Long resumeId, UpdateResumeRequest request) {
        // Validate template exists
        if (!templateService.isValidTemplate(request.getTemplateId())) {
            throw new TemplateNotFoundException("Template not found with id: " + request.getTemplateId());
        }

        User currentUser = authHelperService.getCurrentLoggedInUser();

        Resume resume = resumeRepository.findByIdAndUserId(resumeId, currentUser.getId())
                .orElseThrow(() -> new ResumeNotFoundException("Resume not found with id: " + resumeId));

        resume.setTitle(request.getTitle());
        resume.setTemplateId(request.getTemplateId());
        resume.setResumeDataJson(request.getResumeDataJson());

        Resume updatedResume = resumeRepository.save(resume);

        return mapToResumeResponse(updatedResume);
    }

    @Transactional
    public void deleteResume(Long resumeId) {
        User currentUser = authHelperService.getCurrentLoggedInUser();

        Resume resume = resumeRepository.findByIdAndUserId(resumeId, currentUser.getId())
                .orElseThrow(() -> new ResumeNotFoundException("Resume not found with id: " + resumeId));

        resumeRepository.delete(resume);
    }

    private ResumeResponse mapToResumeResponse(Resume resume) {
        return new ResumeResponse(
                resume.getId(),
                resume.getTitle(),
                resume.getTemplateId(),
                resume.getResumeDataJson(),
                resume.getCreatedAt(),
                resume.getUpdatedAt()
        );
    }

    private ResumeSummaryResponse mapToResumeSummaryResponse(Resume resume) {
        return new ResumeSummaryResponse(
                resume.getId(),
                resume.getTitle(),
                resume.getTemplateId(),
                resume.getUpdatedAt()
        );
    }
}