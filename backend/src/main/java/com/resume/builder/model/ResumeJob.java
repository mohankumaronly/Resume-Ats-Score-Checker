package com.resume.builder.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "resume_jobs")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResumeJob {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "template_type", nullable = false)
    private String templateType;

    @Column(name = "status", nullable = false)
    private String status;

    @Column(name = "user_input", columnDefinition = "TEXT")
    private String userInput;

    @Column(name = "latex_script", columnDefinition = "TEXT")
    private String latexScript;

    @Column(name = "pdf_url")
    private String pdfUrl;

    @Column(name = "error_message", columnDefinition = "TEXT")
    private String errorMessage;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null) {
            status = "processing";
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}