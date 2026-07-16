package com.resume.analyzer.dto;

import java.util.List;
import java.util.Map;

public class JobMatchResponse {
    // Overall scores
    private Integer atsScore;
    private Integer matchScore;
    private String overallRating;
    private String summary;

    // Job-specific analysis
    private Integer keywordMatchRate;
    private List<String> missingKeywords;
    private Map<String, List<String>> skillsGap;
    private String experienceMatch;
    private String educationMatch;

    // Section scores
    private Map<String, Integer> sectionScores;

    // Lists
    private List<String> strengths;
    private List<String> weaknesses;
    private List<String> suggestions;
    private List<String> recommendedSkills;

    // Boolean
    private Boolean atsFriendly;
    private Integer analysisConfidence;
    private String analyzedAt;

    // Getters and Setters
    public Integer getAtsScore() {
        return atsScore;
    }

    public void setAtsScore(Integer atsScore) {
        this.atsScore = atsScore;
    }

    public Integer getMatchScore() {
        return matchScore;
    }

    public void setMatchScore(Integer matchScore) {
        this.matchScore = matchScore;
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

    public Integer getKeywordMatchRate() {
        return keywordMatchRate;
    }

    public void setKeywordMatchRate(Integer keywordMatchRate) {
        this.keywordMatchRate = keywordMatchRate;
    }

    public List<String> getMissingKeywords() {
        return missingKeywords;
    }

    public void setMissingKeywords(List<String> missingKeywords) {
        this.missingKeywords = missingKeywords;
    }

    public Map<String, List<String>> getSkillsGap() {
        return skillsGap;
    }

    public void setSkillsGap(Map<String, List<String>> skillsGap) {
        this.skillsGap = skillsGap;
    }

    public String getExperienceMatch() {
        return experienceMatch;
    }

    public void setExperienceMatch(String experienceMatch) {
        this.experienceMatch = experienceMatch;
    }

    public String getEducationMatch() {
        return educationMatch;
    }

    public void setEducationMatch(String educationMatch) {
        this.educationMatch = educationMatch;
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

    public List<String> getSuggestions() {
        return suggestions;
    }

    public void setSuggestions(List<String> suggestions) {
        this.suggestions = suggestions;
    }

    public List<String> getRecommendedSkills() {
        return recommendedSkills;
    }

    public void setRecommendedSkills(List<String> recommendedSkills) {
        this.recommendedSkills = recommendedSkills;
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

    public String getAnalyzedAt() {
        return analyzedAt;
    }

    public void setAnalyzedAt(String analyzedAt) {
        this.analyzedAt = analyzedAt;
    }
}