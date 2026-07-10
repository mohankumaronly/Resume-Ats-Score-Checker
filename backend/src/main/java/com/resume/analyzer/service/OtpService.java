package com.resume.analyzer.service;

import org.springframework.stereotype.Service;

import java.security.SecureRandom;

@Service
public class OtpService {

    private static final SecureRandom secureRandom = new SecureRandom();
    private static final int OTP_LENGTH = 6;

    /**
     * Generates a 6-digit OTP
     */
    public String generateOtp() {
        // Generate a random 6-digit number
        int otp = 100000 + secureRandom.nextInt(900000);
        return String.valueOf(otp);
    }

    /**
     * Validates if the OTP matches and is not expired
     */
    public boolean validateOtp(String providedOtp, String storedOtp, Long otpExpiryTime) {
        if (providedOtp == null || storedOtp == null || otpExpiryTime == null) {
            return false;
        }

        // Check if OTP matches
        if (!providedOtp.equals(storedOtp)) {
            return false;
        }

        // Check if OTP is expired (5 minutes expiry)
        long currentTime = System.currentTimeMillis();
        return currentTime <= otpExpiryTime;
    }

    /**
     * Gets OTP expiry time (5 minutes from now)
     */
    public long getOtpExpiryTime() {
        return System.currentTimeMillis() + (5 * 60 * 1000); // 5 minutes
    }
}