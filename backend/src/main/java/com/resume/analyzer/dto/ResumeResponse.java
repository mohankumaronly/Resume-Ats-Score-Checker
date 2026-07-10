package com.resume.analyzer.dto;

import java.util.List;

public class ResumeResponse {
    private Integer atsScore;
    private String feedback;
    private List<String> strengths;
    private List<String> weaknesses;
    private List<String> suggestions;

    // Default constructor (required for JSON serialization)
    public ResumeResponse() {
    }

    // Parameterized constructor for easy object creation
    public ResumeResponse(Integer atsScore, String feedback, List<String> strengths,
                          List<String> weaknesses, List<String> suggestions) {
        this.atsScore = atsScore;
        this.feedback = feedback;
        this.strengths = strengths;
        this.weaknesses = weaknesses;
        this.suggestions = suggestions;
    }

    // Getters and Setters
    public Integer getAtsScore() {
        return atsScore;
    }

    public void setAtsScore(Integer atsScore) {
        this.atsScore = atsScore;
    }

    public String getFeedback() {
        return feedback;
    }

    public void setFeedback(String feedback) {
        this.feedback = feedback;
    }

    public List<String> getStrengths() {
        return strengths;
    }

    public void setStrengths(List<String> strengths) {
        this.strengths = strengths;
    }

    public List<String> getWeaknesses() {
        return weaknesses;
    }

    public void setWeaknesses(List<String> weaknesses) {
        this.weaknesses = weaknesses;
    }

    public List<String> getSuggestions() {
        return suggestions;
    }

    public void setSuggestions(List<String> suggestions) {
        this.suggestions = suggestions;
    }

    // toString() method for debugging
    @Override
    public String toString() {
        return "ResumeResponse{" +
                "atsScore=" + atsScore +
                ", feedback='" + feedback + '\'' +
                ", strengths=" + strengths +
                ", weaknesses=" + weaknesses +
                ", suggestions=" + suggestions +
                '}';
    }
}