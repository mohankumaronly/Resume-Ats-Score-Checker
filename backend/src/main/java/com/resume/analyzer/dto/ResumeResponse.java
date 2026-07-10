package com.resume.analyzer.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public class ResumeResponse {
    // Core fields
    private Integer atsScore;
    private String overallRating;
    private String summary;
    private String detailedFeedback;

    // Section scores
    private Map<String, Integer> sectionScores;

    // Lists
    private List<String> strengths;
    private List<String> weaknesses;
    private List<String> missingKeywords;
    private List<String> recommendedSkills;
    private List<String> grammarIssues;
    private List<String> suggestions;

    // Boolean flags
    private Boolean atsFriendly;

    // New fields
    private Integer analysisConfidence;
    private LocalDateTime analyzedAt;

    // Default constructor
    public ResumeResponse() {
    }

    // Parameterized constructor
    public ResumeResponse(Integer atsScore, String overallRating, String summary,
                          String detailedFeedback, Map<String, Integer> sectionScores,
                          List<String> strengths, List<String> weaknesses,
                          List<String> missingKeywords, List<String> recommendedSkills,
                          List<String> grammarIssues, List<String> suggestions,
                          Boolean atsFriendly, Integer analysisConfidence, LocalDateTime analyzedAt) {
        this.atsScore = atsScore;
        this.overallRating = overallRating;
        this.summary = summary;
        this.detailedFeedback = detailedFeedback;
        this.sectionScores = sectionScores;
        this.strengths = strengths;
        this.weaknesses = weaknesses;
        this.missingKeywords = missingKeywords;
        this.recommendedSkills = recommendedSkills;
        this.grammarIssues = grammarIssues;
        this.suggestions = suggestions;
        this.atsFriendly = atsFriendly;
        this.analysisConfidence = analysisConfidence;
        this.analyzedAt = analyzedAt;
    }

    // Getters and Setters
    public Integer getAtsScore() {
        return atsScore;
    }

    public void setAtsScore(Integer atsScore) {
        this.atsScore = atsScore;
    }

    public String getOverallRating() {
        return overallRating;
    }

    public void setOverallRating(String overallRating) {
        this.overallRating = overallRating;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public String getDetailedFeedback() {
        return detailedFeedback;
    }

    public void setDetailedFeedback(String detailedFeedback) {
        this.detailedFeedback = detailedFeedback;
    }

    public Map<String, Integer> getSectionScores() {
        return sectionScores;
    }

    public void setSectionScores(Map<String, Integer> sectionScores) {
        this.sectionScores = sectionScores;
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

    public List<String> getMissingKeywords() {
        return missingKeywords;
    }

    public void setMissingKeywords(List<String> missingKeywords) {
        this.missingKeywords = missingKeywords;
    }

    public List<String> getRecommendedSkills() {
        return recommendedSkills;
    }

    public void setRecommendedSkills(List<String> recommendedSkills) {
        this.recommendedSkills = recommendedSkills;
    }

    public List<String> getGrammarIssues() {
        return grammarIssues;
    }

    public void setGrammarIssues(List<String> grammarIssues) {
        this.grammarIssues = grammarIssues;
    }

    public List<String> getSuggestions() {
        return suggestions;
    }

    public void setSuggestions(List<String> suggestions) {
        this.suggestions = suggestions;
    }

    public Boolean getAtsFriendly() {
        return atsFriendly;
    }

    public void setAtsFriendly(Boolean atsFriendly) {
        this.atsFriendly = atsFriendly;
    }

    public Integer getAnalysisConfidence() {
        return analysisConfidence;
    }

    public void setAnalysisConfidence(Integer analysisConfidence) {
        this.analysisConfidence = analysisConfidence;
    }

    public LocalDateTime getAnalyzedAt() {
        return analyzedAt;
    }

    public void setAnalyzedAt(LocalDateTime analyzedAt) {
        this.analyzedAt = analyzedAt;
    }

    @Override
    public String toString() {
        return "ResumeResponse{" +
                "atsScore=" + atsScore +
                ", overallRating='" + overallRating + '\'' +
                ", summary='" + summary + '\'' +
                ", detailedFeedback='" + detailedFeedback + '\'' +
                ", sectionScores=" + sectionScores +
                ", strengths=" + strengths +
                ", weaknesses=" + weaknesses +
                ", missingKeywords=" + missingKeywords +
                ", recommendedSkills=" + recommendedSkills +
                ", grammarIssues=" + grammarIssues +
                ", suggestions=" + suggestions +
                ", atsFriendly=" + atsFriendly +
                ", analysisConfidence=" + analysisConfidence +
                ", analyzedAt=" + analyzedAt +
                '}';
    }
}