package com.resume.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendOtp(String to, String otp) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject("Your OTP for Resume Builder");
            message.setText("Your OTP is: " + otp + "\n\nThis OTP is valid for 5 minutes.");
            message.setFrom("rockrangerz801@gmail.com");

            log.info("Sending OTP to: {}", to);
            mailSender.send(message);
            log.info("OTP sent successfully to: {}", to);
        } catch (Exception e) {
            log.error("Failed to send OTP to: {}", to, e);
            throw e;
        }
    }
}