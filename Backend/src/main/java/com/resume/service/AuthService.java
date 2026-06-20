package com.resume.service;

import com.resume.entity.User;
import com.resume.exception.UserNotFoundException;
import com.resume.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final OtpService otpService;
    private final EmailService emailService;
    private final JwtService jwtService;
    private final UserRepository userRepository;

    @Transactional
    public void sendOtp(String email) {
        String otp = otpService.generateOtp();
        otpService.saveOtp(email, otp);
        emailService.sendOtp(email, otp);
    }

    @Transactional
    public String verifyOtp(String email, String otp) {
        // Validate OTP
        otpService.validateOtp(email, otp);

        // Create or get user
        User user = userRepository.findByEmail(email)
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setEmail(email);
                    newUser.setVerified(true);
                    return userRepository.save(newUser);
                });

        if (!user.isVerified()) {
            user.setVerified(true);
            userRepository.save(user);
        }

        // Generate JWT
        return jwtService.generateToken(email);
    }

    public User getCurrentUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found with email: " + email));
    }
}