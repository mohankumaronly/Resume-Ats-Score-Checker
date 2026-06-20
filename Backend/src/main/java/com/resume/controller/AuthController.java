package com.resume.controller;

import com.resume.dto.request.SendOtpRequest;
import com.resume.dto.request.VerifyOtpRequest;
import com.resume.dto.response.ApiResponse;
import com.resume.dto.response.UserResponse;
import com.resume.entity.User;
import com.resume.service.AuthService;
import com.resume.service.JwtService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final JwtService jwtService;

    @PostMapping("/send-otp")
    public ResponseEntity<ApiResponse> sendOtp(@Valid @RequestBody SendOtpRequest request) {
        authService.sendOtp(request.getEmail());
        return ResponseEntity.ok(ApiResponse.success("OTP Sent Successfully"));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<ApiResponse> verifyOtp(@Valid @RequestBody VerifyOtpRequest request,
                                                 HttpServletResponse response) {
        String token = authService.verifyOtp(request.getEmail(), request.getOtp());

        // Set JWT cookie
        jakarta.servlet.http.Cookie cookie = new jakarta.servlet.http.Cookie("token", token);
        cookie.setHttpOnly(true);
        cookie.setSecure(false);
        cookie.setPath("/");
        cookie.setMaxAge((int) Duration.ofDays(7).toSeconds());
        response.addCookie(cookie);

        return ResponseEntity.ok(ApiResponse.success("Login Successful"));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        User user = authService.getCurrentUser(email);

        UserResponse userResponse = new UserResponse(
                user.getId(),
                user.getEmail(),
                user.getName()
        );

        return ResponseEntity.ok(ApiResponse.success("User fetched successfully", userResponse));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse> logout(HttpServletResponse response) {
        jakarta.servlet.http.Cookie cookie = new jakarta.servlet.http.Cookie("token", null);
        cookie.setHttpOnly(true);
        cookie.setSecure(false);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        response.addCookie(cookie);

        return ResponseEntity.ok(ApiResponse.success("Logout Successful"));
    }
}