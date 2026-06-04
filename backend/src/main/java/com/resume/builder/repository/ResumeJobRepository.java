package com.resume.builder.repository;

import com.resume.builder.model.ResumeJob;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;

@Repository
public interface ResumeJobRepository extends JpaRepository<ResumeJob, UUID> {
}   