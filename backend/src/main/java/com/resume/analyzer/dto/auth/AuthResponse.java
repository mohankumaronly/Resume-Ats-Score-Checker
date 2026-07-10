package com.resume.analyzer.dto.auth;

public class AuthResponse {
    private String token;
    private String email;
    private boolean verified;
    private String message;
    private boolean success;
    private boolean newUser;

    public AuthResponse() {}

    public AuthResponse(String token, String email, boolean verified) {
        this.token = token;
        this.email = email;
        this.verified = verified;
        this.success = true;
        this.newUser = false;
    }

    // Getters and Setters
    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public boolean isVerified() {
        return verified;
    }

    public void setVerified(boolean verified) {
        this.verified = verified;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public boolean isNewUser() {
        return newUser;
    }

    public void setNewUser(boolean newUser) {
        this.newUser = newUser;
    }
}