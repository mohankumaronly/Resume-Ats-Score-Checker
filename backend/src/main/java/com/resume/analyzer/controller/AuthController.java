package com.resume.analyzer.controller;

import com.resume.analyzer.dto.auth.AuthRequest;
import com.resume.analyzer.dto.auth.AuthResponse;
import com.resume.analyzer.dto.auth.OtpRequest;
import com.resume.analyzer.service.AuthService;
import jakarta.mail.MessagingException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthService authService;

    /**
     * Send OTP to email - Step 1
     * POST /api/auth/send-otp
     */
    @PostMapping("/send-otp")
    public ResponseEntity<AuthResponse> sendOtp(@Valid @RequestBody AuthRequest request) {
        try {
            AuthResponse response = authService.sendOtp(request);
            return ResponseEntity.ok(response);
        } catch (MessagingException e) {
            AuthResponse errorResponse = new AuthResponse();
            errorResponse.setSuccess(false);
            errorResponse.setMessage("Failed to send OTP. Please try again.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        } catch (Exception e) {
            AuthResponse errorResponse = new AuthResponse();
            errorResponse.setSuccess(false);
            errorResponse.setMessage(e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    /**
     * Verify OTP and Login - Step 2
     * POST /api/auth/verify-otp
     */
    @PostMapping("/verify-otp")
    public ResponseEntity<AuthResponse> verifyOtpAndLogin(@Valid @RequestBody OtpRequest request) {
        try {
            AuthResponse response = authService.verifyOtpAndLogin(request);
            if (response.isSuccess()) {
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.badRequest().body(response);
            }
        } catch (Exception e) {
            AuthResponse errorResponse = new AuthResponse();
            errorResponse.setSuccess(false);
            errorResponse.setMessage(e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    /**
     * Resend OTP
     * POST /api/auth/resend-otp
     */
    @PostMapping("/resend-otp")
    public ResponseEntity<AuthResponse> resendOtp(@RequestParam String email) {
        try {
            AuthResponse response = authService.resendOtp(email);
            return ResponseEntity.ok(response);
        } catch (MessagingException e) {
            AuthResponse errorResponse = new AuthResponse();
            errorResponse.setSuccess(false);
            errorResponse.setMessage("Failed to send OTP. Please try again.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        } catch (Exception e) {
            AuthResponse errorResponse = new AuthResponse();
            errorResponse.setSuccess(false);
            errorResponse.setMessage(e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    /**
     * Get current user (Protected)
     * GET /api/auth/me
     */
    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> getCurrentUser(@RequestHeader("Authorization") String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "Unauthorized"));
            }

            String token = authHeader.substring(7);
            // In a real implementation, validate token and get user details

            Map<String, Object> response = new HashMap<>();
            response.put("authenticated", true);
            response.put("message", "User authenticated");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("authenticated", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
        }
    }

    /**
     * Logout (Client side - just remove token)
     * POST /api/auth/logout
     */
    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout() {
        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }
}