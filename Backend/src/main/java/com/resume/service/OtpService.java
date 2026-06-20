package com.resume.service;

import com.resume.entity.Otp;
import com.resume.exception.InvalidOtpException;
import com.resume.exception.OtpExpiredException;
import com.resume.repository.OtpRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class OtpService {

    private final OtpRepository otpRepository;

    public String generateOtp() {
        SecureRandom random = new SecureRandom();
        int otp = 100000 + random.nextInt(900000);
        return String.valueOf(otp);
    }

    @Transactional
    public void saveOtp(String email, String otp) {
        // Delete existing OTPs for this email
        otpRepository.deleteByEmail(email);

        Otp otpEntity = new Otp();
        otpEntity.setEmail(email);
        otpEntity.setOtp(otp);
        otpEntity.setExpiresAt(LocalDateTime.now().plusMinutes(5));
        otpEntity.setUsed(false);

        otpRepository.save(otpEntity);
    }

    @Transactional
    public void validateOtp(String email, String otp) {
        Otp otpEntity = otpRepository.findByEmailAndOtpAndUsedFalse(email, otp)
                .orElseThrow(() -> new InvalidOtpException("Invalid OTP"));

        if (otpEntity.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new OtpExpiredException("OTP has expired");
        }

        // Mark OTP as used
        otpEntity.setUsed(true);
        otpRepository.save(otpEntity);
    }
}