package com.resume.repository;

import com.resume.entity.Otp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OtpRepository extends JpaRepository<Otp, Long> {

    Optional<Otp> findByEmailAndOtpAndUsedFalse(String email, String otp);

    void deleteByEmail(String email);
}