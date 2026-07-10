package com.resume.analyzer.service;

import com.resume.analyzer.dto.auth.AuthRequest;
import com.resume.analyzer.dto.auth.AuthResponse;
import com.resume.analyzer.dto.auth.OtpRequest;
import com.resume.analyzer.entity.User;
import com.resume.analyzer.repository.UserRepository;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashSet;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private OtpService otpService;

    /**
     * Send OTP to user - handles both new and existing users
     */
    @Transactional
    public AuthResponse sendOtp(AuthRequest request) throws MessagingException {
        boolean isNewUser = false;
        User user = userRepository.findByEmail(request.getEmail()).orElse(null);

        // If user doesn't exist, create new user
        if (user == null) {
            user = new User();
            user.setEmail(request.getEmail());
            // Use email prefix as name (e.g., "john" from "john@example.com")
            String emailPrefix = request.getEmail().split("@")[0];
            user.setFirstName(emailPrefix);
            user.setLastName("");
            user.setVerified(false);
            user.setRoles(new HashSet<>());
            user.getRoles().add("USER");
            isNewUser = true;
        }

        // Generate OTP
        String otp = otpService.generateOtp();
        user.setOtpCode(otp);
        user.setOtpExpiry(LocalDateTime.now().plusMinutes(5));
        userRepository.save(user);

        // Send OTP email with isNewUser flag
        emailService.sendOtpEmail(user.getEmail(), otp, isNewUser);

        AuthResponse response = new AuthResponse();
        response.setSuccess(true);
        response.setNewUser(isNewUser);
        response.setEmail(user.getEmail());
        response.setVerified(user.isVerified());

        if (isNewUser) {
            response.setMessage("OTP sent successfully! Please check your email to verify and complete registration.");
        } else {
            response.setMessage("OTP sent successfully! Please check your email to login.");
        }

        return response;
    }

    /**
     * Verify OTP and authenticate user
     */
    @Transactional
    public AuthResponse verifyOtpAndLogin(OtpRequest request) throws MessagingException {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found. Please request OTP first."));

        // Validate OTP
        if (user.getOtpCode() == null || user.getOtpExpiry() == null) {
            AuthResponse response = new AuthResponse();
            response.setSuccess(false);
            response.setMessage("No OTP found. Please request a new OTP.");
            return response;
        }

        if (!user.getOtpCode().equals(request.getOtp())) {
            AuthResponse response = new AuthResponse();
            response.setSuccess(false);
            response.setMessage("Invalid OTP. Please try again.");
            return response;
        }

        if (user.getOtpExpiry().isBefore(LocalDateTime.now())) {
            AuthResponse response = new AuthResponse();
            response.setSuccess(false);
            response.setMessage("OTP has expired. Please request a new OTP.");
            return response;
        }

        // Clear OTP after successful verification
        user.setOtpCode(null);
        user.setOtpExpiry(null);
        user.setLastLogin(LocalDateTime.now());

        boolean wasNewUser = !user.isVerified();

        // If user was not verified, mark as verified now
        if (!user.isVerified()) {
            user.setVerified(true);
            // Send welcome email only for new users
            emailService.sendWelcomeEmail(user.getEmail());
        }

        userRepository.save(user);

        // Generate JWT token
        String token = jwtService.generateToken(user.getEmail());

        AuthResponse response = new AuthResponse();
        response.setSuccess(true);
        response.setToken(token);
        response.setEmail(user.getEmail());
        response.setVerified(true);
        response.setNewUser(wasNewUser);

        if (wasNewUser) {
            response.setMessage("Email verified and login successful! Welcome to Resume Analyzer.");
        } else {
            response.setMessage("Login successful! Welcome back.");
        }

        return response;
    }

    /**
     * Resend OTP to user
     */
    @Transactional
    public AuthResponse resendOtp(String email) throws MessagingException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Generate new OTP
        String otp = otpService.generateOtp();
        user.setOtpCode(otp);
        user.setOtpExpiry(LocalDateTime.now().plusMinutes(5));
        userRepository.save(user);

        // Send OTP email (existing user, so isNewUser = false)
        emailService.sendOtpEmail(user.getEmail(), otp, false);

        AuthResponse response = new AuthResponse();
        response.setSuccess(true);
        response.setMessage("New OTP sent to your email. Please verify within 5 minutes.");
        response.setEmail(user.getEmail());

        return response;
    }

    /**
     * Get user by email
     */
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    /**
     * Check if user exists
     */
    public boolean userExists(String email) {
        return userRepository.existsByEmail(email);
    }

    /**
     * Get user by ID
     */
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    /**
     * Update user profile
     */
    @Transactional
    public User updateUser(Long id, String firstName, String lastName) {
        User user = getUserById(id);
        if (firstName != null && !firstName.isEmpty()) {
            user.setFirstName(firstName);
        }
        if (lastName != null && !lastName.isEmpty()) {
            user.setLastName(lastName);
        }
        return userRepository.save(user);
    }

    /**
     * Delete user account
     */
    @Transactional
    public void deleteUser(Long id) {
        User user = getUserById(id);
        userRepository.delete(user);
    }
}