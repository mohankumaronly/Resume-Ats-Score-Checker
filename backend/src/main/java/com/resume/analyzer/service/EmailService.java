package com.resume.analyzer.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired
    private JavaMailSender mailSender;

    @Value("${brevo.from.email}")
    private String fromEmail;

    @Value("${brevo.from.name}")
    private String fromName;

    public void sendOtpEmail(String to, String otp, boolean isNewUser) throws MessagingException {
        logger.info("Sending OTP email to: {}, isNewUser: {}", to, isNewUser);
        try {
            String subject = "Your OTP for Resume Analyzer";
            String htmlContent = buildOtpEmailHtml(otp, to.split("@")[0], isNewUser);
            sendEmail(to, subject, htmlContent);
            logger.info("OTP email sent successfully to: {}", to);
        } catch (MessagingException | MailException e) {
            logger.error("Failed to send OTP email to: {}, error: {}", to, e.getMessage(), e);
            throw new MessagingException("Failed to send OTP email: " + e.getMessage(), e);
        }
    }

    public void sendWelcomeEmail(String to) throws MessagingException {
        logger.info("Sending welcome email to: {}", to);
        try {
            String subject = "Welcome to Resume Analyzer! 🎉";
            String htmlContent = buildWelcomeEmailHtml(to.split("@")[0]);
            sendEmail(to, subject, htmlContent);
            logger.info("Welcome email sent successfully to: {}", to);
        } catch (MessagingException | MailException e) {
            logger.error("Failed to send welcome email to: {}, error: {}", to, e.getMessage(), e);
            throw new MessagingException("Failed to send welcome email: " + e.getMessage(), e);
        }
    }

    private void sendEmail(String to, String subject, String htmlContent) throws MessagingException {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, StandardCharsets.UTF_8.name());

            helper.setFrom(fromEmail, fromName);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);

            logger.info("Sending email to: {}, from: {}, subject: {}", to, fromEmail, subject);
            mailSender.send(message);
            logger.info("Email sent successfully to: {}", to);
        } catch (MailException e) {
            logger.error("MailException while sending email to: {}, error: {}", to, e.getMessage(), e);
            throw new MessagingException("Mail server error: " + e.getMessage(), e);
        } catch (MessagingException e) {
            logger.error("MessagingException while sending email to: {}, error: {}", to, e.getMessage(), e);
            throw e;
        } catch (Exception e) {
            logger.error("Unexpected error while sending email to: {}, error: {}", to, e.getMessage(), e);
            throw new MessagingException("Unexpected error: " + e.getMessage(), e);
        }
    }

    private String buildOtpEmailHtml(String otp, String name, boolean isNewUser) {
        String message = isNewUser
                ? "Welcome! Use the following OTP to verify your email and complete your registration."
                : "Use the following OTP to login to your account.";

        return """
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Your OTP Code</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f4;
                        margin: 0;
                        padding: 0;
                    }
                    .container {
                        max-width: 600px;
                        margin: 40px auto;
                        background: #ffffff;
                        border-radius: 10px;
                        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                        overflow: hidden;
                    }
                    .header {
                        background: linear-gradient(135deg, #2563eb, #4f46e5);
                        padding: 30px;
                        text-align: center;
                    }
                    .header h1 {
                        color: #ffffff;
                        margin: 0;
                        font-size: 24px;
                    }
                    .content {
                        padding: 40px 30px;
                        text-align: center;
                    }
                    .content h2 {
                        color: #1f2937;
                        margin-top: 0;
                    }
                    .content p {
                        color: #4b5563;
                        line-height: 1.6;
                    }
                    .otp-code {
                        background: linear-gradient(135deg, #eff6ff, #dbeafe);
                        padding: 20px;
                        border-radius: 12px;
                        margin: 25px auto;
                        display: inline-block;
                        min-width: 200px;
                    }
                    .otp-code span {
                        font-size: 36px;
                        font-weight: 700;
                        color: #2563eb;
                        letter-spacing: 8px;
                        font-family: 'Courier New', monospace;
                    }
                    .expiry-note {
                        color: #ef4444;
                        font-size: 14px;
                        margin-top: 15px;
                    }
                    .footer {
                        background: #f8fafc;
                        padding: 20px 30px;
                        text-align: center;
                        color: #6b7280;
                        font-size: 14px;
                        border-top: 1px solid #e5e7eb;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🔐 Resume Analyzer</h1>
                    </div>
                    <div class="content">
                        <h2>Your OTP Code</h2>
                        <p>Hello <strong>%s</strong>,</p>
                        <p>%s</p>
                        <div class="otp-code">
                            <span>%s</span>
                        </div>
                        <p style="font-size: 14px; color: #6b7280;">
                            This OTP is valid for <strong>5 minutes</strong>.
                        </p>
                        <p class="expiry-note">
                            ⚠️ If you didn't request this OTP, please ignore this email.
                        </p>
                        <p style="font-size: 14px; color: #6b7280; margin-top: 20px;">
                            For security reasons, never share this OTP with anyone.
                        </p>
                    </div>
                    <div class="footer">
                        <p>&copy; 2026 Resume Analyzer. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
            """.formatted(name, message, otp);
    }

    private String buildWelcomeEmailHtml(String name) {
        return """
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Welcome!</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f4;
                        margin: 0;
                        padding: 0;
                    }
                    .container {
                        max-width: 600px;
                        margin: 40px auto;
                        background: #ffffff;
                        border-radius: 10px;
                        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                        overflow: hidden;
                    }
                    .header {
                        background: linear-gradient(135deg, #059669, #10b981);
                        padding: 30px;
                        text-align: center;
                    }
                    .header h1 {
                        color: #ffffff;
                        margin: 0;
                        font-size: 24px;
                    }
                    .content {
                        padding: 40px 30px;
                        text-align: center;
                    }
                    .content h2 {
                        color: #1f2937;
                        margin-top: 0;
                    }
                    .content p {
                        color: #4b5563;
                        line-height: 1.6;
                    }
                    .features {
                        text-align: left;
                        background: #f8fafc;
                        padding: 20px;
                        border-radius: 8px;
                        margin: 20px 0;
                    }
                    .features li {
                        color: #4b5563;
                        margin: 8px 0;
                    }
                    .button {
                        display: inline-block;
                        background: linear-gradient(135deg, #059669, #10b981);
                        color: #ffffff;
                        padding: 12px 30px;
                        border-radius: 8px;
                        text-decoration: none;
                        font-weight: 600;
                        margin: 20px 0;
                    }
                    .footer {
                        background: #f8fafc;
                        padding: 20px 30px;
                        text-align: center;
                        color: #6b7280;
                        font-size: 14px;
                        border-top: 1px solid #e5e7eb;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🎉 Welcome to Resume Analyzer!</h1>
                    </div>
                    <div class="content">
                        <h2>Hello <strong>%s</strong>!</h2>
                        <p>Your account has been successfully verified. You're now ready to start optimizing your resume!</p>
                        <div class="features">
                            <h3 style="color: #1f2937; margin-top: 0;">What you can do now:</h3>
                            <ul style="list-style: none; padding: 0;">
                                <li>✅ Upload your tech resume for ATS analysis</li>
                                <li>✅ Get instant AI-powered feedback using Groq API</li>
                                <li>✅ View detailed section-wise scores</li>
                                <li>✅ Receive actionable improvement suggestions</li>
                                <li>✅ Track your progress over time</li>
                            </ul>
                        </div>
                        <p style="margin-top: 20px;">
                            <a href="http://localhost:5173" class="button">Get Started</a>
                        </p>
                        <p style="font-size: 14px; color: #6b7280;">
                            We're excited to help you land your dream job! 🚀
                        </p>
                    </div>
                    <div class="footer">
                        <p>&copy; 2026 Resume Analyzer. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
            """.formatted(name);
    }
}