package com.resume.analyzer.dto;

import java.util.ArrayList;
import java.util.List;

public class GroqRequest {
    private String model;
    private List<Message> messages;
    private double temperature;
    private int max_tokens;  // ✅ Changed from maxTokens to max_tokens

    // Default constructor
    public GroqRequest() {
    }

    // Constructor with required fields
    public GroqRequest(String model, List<Message> messages, double temperature, int max_tokens) {
        this.model = model;
        this.messages = messages;
        this.temperature = temperature;
        this.max_tokens = max_tokens;
    }

    // Getters and Setters
    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public List<Message> getMessages() {
        return messages;
    }

    public void setMessages(List<Message> messages) {
        this.messages = messages;
    }

    public double getTemperature() {
        return temperature;
    }

    public void setTemperature(double temperature) {
        this.temperature = temperature;
    }

    public int getMax_tokens() {
        return max_tokens;
    }

    public void setMax_tokens(int max_tokens) {
        this.max_tokens = max_tokens;
    }

    // Inner class for message structure
    public static class Message {
        private String role;
        private String content;

        public Message() {
        }

        public Message(String role, String content) {
            this.role = role;
            this.content = content;
        }

        public String getRole() {
            return role;
        }

        public void setRole(String role) {
            this.role = role;
        }

        public String getContent() {
            return content;
        }

        public void setContent(String content) {
            this.content = content;
        }
    }

    // Builder pattern for easy construction
    public static class Builder {
        private String model;
        private List<Message> messages = new ArrayList<>();
        private double temperature = 0.7;
        private int max_tokens = 1000;

        public Builder model(String model) {
            this.model = model;
            return this;
        }

        public Builder message(String role, String content) {
            this.messages.add(new Message(role, content));
            return this;
        }

        public Builder temperature(double temperature) {
            this.temperature = temperature;
            return this;
        }

        public Builder max_tokens(int max_tokens) {
            this.max_tokens = max_tokens;
            return this;
        }

        public GroqRequest build() {
            return new GroqRequest(model, messages, temperature, max_tokens);
        }
    }
}