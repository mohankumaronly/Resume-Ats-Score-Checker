package com.resume.analyzer.service;

import com.resume.analyzer.dto.GroqResponse;
import com.resume.analyzer.dto.JobMatchResponse;
import com.resume.analyzer.dto.ResumeResponse;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class ResumeService {

    private final PdfService pdfService;
    private final GroqService groqService;
    private final ObjectMapper objectMapper;

    private static final int DEFAULT_CONFIDENCE = 85;
    private static final int MIN_ATS_FRIENDLY_SCORE = 55;

    @Autowired
    public ResumeService(PdfService pdfService, GroqService groqService) {
        this.pdfService = pdfService;
        this.groqService = groqService;
        this.objectMapper = new ObjectMapper();
    }

    public ResumeResponse analyzeResume(MultipartFile file) throws Exception {
        try {
            String extractedText = pdfService.extractText(file);
            GroqResponse groqResponse = groqService.analyzeResume(extractedText);
            return parseGroqResponse(groqResponse);
        } catch (Exception e) {
            throw new Exception("Failed to analyze resume: " + e.getMessage(), e);
        }
    }

    /**
     * Analyzes resume against a job description with authentication status
     */
    public JobMatchResponse analyzeResumeWithJob(MultipartFile file, String jobDescription, boolean isAuthenticated) throws Exception {
        try {
            // Step 1: Extract text from PDF
            String extractedText = pdfService.extractText(file);

            // Step 2: Send to Groq for job comparison analysis
            GroqResponse groqResponse = groqService.analyzeResumeWithJob(extractedText, jobDescription);

            // Step 3: Parse and structure the response with auth status
            return parseJobMatchResponse(groqResponse, isAuthenticated);

        } catch (Exception e) {
            throw new Exception("Failed to analyze resume with job description: " + e.getMessage(), e);
        }
    }

    /**
     * Parses the Groq API response for job matching with auth status
     */
    private JobMatchResponse parseJobMatchResponse(GroqResponse groqResponse, boolean isAuthenticated) throws Exception {
        try {
            String content = extractContentFromGroqResponse(groqResponse);
            String jsonContent = extractJsonFromContent(content);
            JsonNode rootNode = objectMapper.readTree(jsonContent);
            return buildJobMatchResponse(rootNode, isAuthenticated);
        } catch (Exception e) {
            throw new Exception("Failed to parse job match response: " + e.getMessage(), e);
        }
    }

    /**
     * Builds JobMatchResponse from JSON node with auth status
     */
    private JobMatchResponse buildJobMatchResponse(JsonNode rootNode, boolean isAuthenticated) {
        JobMatchResponse response = new JobMatchResponse();

        // Basic scores (Always visible)
        response.setAtsScore(extractInt(rootNode, "atsScore"));
        response.setMatchScore(extractInt(rootNode, "matchScore"));
        response.setOverallRating(extractString(rootNode, "overallRating"));
        response.setSummary(extractString(rootNode, "summary"));

        // Job-specific fields (Always visible)
        response.setKeywordMatchRate(extractInt(rootNode, "keywordMatchRate"));
        response.setMissingKeywords(extractList(rootNode, "missingKeywords"));
        response.setSkillsGap(extractSkillsGap(rootNode));
        response.setExperienceMatch(extractString(rootNode, "experienceMatch"));
        response.setEducationMatch(extractString(rootNode, "educationMatch"));

        // Section scores (Always visible)
        response.setSectionScores(extractSectionScores(rootNode));

        // 🔒 LOCKED - Only visible when authenticated
        if (isAuthenticated) {
            response.setStrengths(extractList(rootNode, "strengths"));
            response.setWeaknesses(extractList(rootNode, "weaknesses"));
            response.setSuggestions(extractList(rootNode, "suggestions"));
            response.setRecommendedSkills(extractList(rootNode, "recommendedSkills"));
            response.setDetailsLocked(false);
        } else {
            response.setStrengths(List.of("🔒 Login to view strengths"));
            response.setWeaknesses(List.of("🔒 Login to view weaknesses"));
            response.setSuggestions(List.of("🔒 Login to view suggestions"));
            response.setRecommendedSkills(List.of("🔒 Login to view recommended skills"));
            response.setDetailsLocked(true);
        }

        // Other fields
        response.setAtsFriendly(extractBoolean(rootNode, "atsFriendly"));
        response.setAnalysisConfidence(extractInt(rootNode, "analysisConfidence"));
        response.setAnalyzedAt(LocalDateTime.now().toString());

        return response;
    }

    /**
     * Extracts skills gap from JSON
     */
    private Map<String, List<String>> extractSkillsGap(JsonNode rootNode) {
        Map<String, List<String>> skillsGap = new HashMap<>();
        if (rootNode != null && rootNode.has("skillsGap") && rootNode.get("skillsGap").isObject()) {
            JsonNode gapNode = rootNode.get("skillsGap");
            skillsGap.put("required", extractList(gapNode, "required"));
            skillsGap.put("found", extractList(gapNode, "found"));
            skillsGap.put("missing", extractList(gapNode, "missing"));
        }
        return skillsGap;
    }

    /**
     * Helper method to extract int from JSON
     */
    private Integer extractInt(JsonNode node, String field) {
        if (node != null && node.has(field)) {
            try {
                return node.get(field).asInt();
            } catch (Exception e) {
                return 0;
            }
        }
        return 0;
    }

    /**
     * Helper method to extract string from JSON
     */
    private String extractString(JsonNode node, String field) {
        if (node != null && node.has(field)) {
            try {
                return node.get(field).asText();
            } catch (Exception e) {
                return "";
            }
        }
        return "";
    }

    /**
     * Helper method to extract boolean from JSON
     */
    private Boolean extractBoolean(JsonNode node, String field) {
        if (node != null && node.has(field)) {
            try {
                return node.get(field).asBoolean();
            } catch (Exception e) {
                return false;
            }
        }
        return false;
    }

    private ResumeResponse parseGroqResponse(GroqResponse groqResponse) throws Exception {
        try {
            String content = extractContentFromGroqResponse(groqResponse);
            String jsonContent = extractJsonFromContent(content);
            JsonNode rootNode = objectMapper.readTree(jsonContent);
            return buildResumeResponse(rootNode);
        } catch (Exception e) {
            throw new Exception("Failed to parse AI response: " + e.getMessage(), e);
        }
    }

    private String extractContentFromGroqResponse(GroqResponse groqResponse) {
        if (groqResponse.getChoices() == null || groqResponse.getChoices().isEmpty()) {
            throw new IllegalStateException("No choices returned from Groq API");
        }
        return groqResponse.getChoices().get(0).getMessage().getContent();
    }

    private String extractJsonFromContent(String content) {
        if (content == null || content.trim().isEmpty()) {
            throw new IllegalStateException("Empty response from AI");
        }

        // Remove markdown code blocks
        String cleaned = content.replaceAll("```json\\s*", "")
                .replaceAll("```\\s*", "")
                .trim();

        // Try to find JSON object using regex
        Pattern pattern = Pattern.compile("\\{[\\s\\S]*\\}");
        Matcher matcher = pattern.matcher(cleaned);
        if (matcher.find()) {
            cleaned = matcher.group();
        }

        // Fix common JSON issues
        cleaned = cleanJson(cleaned);

        return cleaned;
    }

    private String cleanJson(String json) {
        // Remove trailing commas
        json = json.replaceAll(",\\s*}", "}");
        json = json.replaceAll(",\\s*]", "]");

        // Fix unquoted property names
        json = json.replaceAll("([{,])\\s*([a-zA-Z_][a-zA-Z0-9_]*)\\s*:", "$1\"$2\":");

        // Fix single quotes to double quotes
        json = json.replaceAll("'([^']*)'", "\"$1\"");

        return json.trim();
    }

    private ResumeResponse buildResumeResponse(JsonNode rootNode) {
        Map<String, Integer> sectionScores = extractSectionScores(rootNode);
        Integer normalizedScore = calculateScoreFromSections(sectionScores);

        String overallRating = deriveOverallRating(normalizedScore);
        String summary = extractSummary(rootNode);
        String detailedFeedback = extractDetailedFeedback(rootNode);

        List<String> strengths = extractList(rootNode, "strengths");
        List<String> weaknesses = extractList(rootNode, "weaknesses");
        List<String> missingKeywords = extractList(rootNode, "missingKeywords");
        List<String> recommendedSkills = extractList(rootNode, "recommendedSkills");
        List<String> grammarIssues = extractList(rootNode, "grammarIssues");
        List<String> suggestions = extractList(rootNode, "suggestions");

        Boolean atsFriendly = normalizedScore >= MIN_ATS_FRIENDLY_SCORE;
        Integer analysisConfidence = extractConfidence(rootNode);
        LocalDateTime analyzedAt = LocalDateTime.now();

        return new ResumeResponse(
                normalizedScore, overallRating, summary, detailedFeedback,
                sectionScores, strengths, weaknesses, missingKeywords,
                recommendedSkills, grammarIssues, suggestions,
                atsFriendly, analysisConfidence, analyzedAt
        );
    }

    private Integer calculateScoreFromSections(Map<String, Integer> sectionScores) {
        // Calculate weighted average from section scores
        int total = 0;
        int count = 0;
        for (Integer score : sectionScores.values()) {
            total += score;
            count++;
        }

        if (count == 0) return 50;

        int avgScore = total / count;

        // Apply penalties for weak sections
        int projectScore = sectionScores.getOrDefault("projects", 0);
        int experienceScore = sectionScores.getOrDefault("experience", 0);

        int penalty = 0;
        if (projectScore < 30) penalty += 15;
        if (experienceScore < 30) penalty += 15;
        if (projectScore < 50 && projectScore >= 30) penalty += 8;
        if (experienceScore < 50 && experienceScore >= 30) penalty += 8;

        int finalScore = avgScore - penalty;

        // Ensure score is within range
        if (finalScore > 95) return 95;
        if (finalScore < 20) return 20;
        return finalScore;
    }

    private String deriveOverallRating(Integer atsScore) {
        if (atsScore >= 85) return "Excellent";
        if (atsScore >= 75) return "Very Good";
        if (atsScore >= 65) return "Good";
        if (atsScore >= 50) return "Average";
        return "Needs Improvement";
    }

    private String extractSummary(JsonNode rootNode) {
        if (rootNode != null && rootNode.has("summary")) {
            try {
                return rootNode.get("summary").asText();
            } catch (Exception e) {
                return "Resume analysis completed.";
            }
        }
        return "Resume analysis completed.";
    }

    private String extractDetailedFeedback(JsonNode rootNode) {
        if (rootNode != null && rootNode.has("detailedFeedback")) {
            try {
                return rootNode.get("detailedFeedback").asText();
            } catch (Exception e) {
                return "No detailed feedback provided.";
            }
        }
        return "No detailed feedback provided.";
    }

    private Map<String, Integer> extractSectionScores(JsonNode rootNode) {
        Map<String, Integer> scores = new HashMap<>();

        if (rootNode != null && rootNode.has("sectionScores") && rootNode.get("sectionScores").isObject()) {
            JsonNode scoresNode = rootNode.get("sectionScores");
            scores.put("formatting", getScoreOrDefault(scoresNode, "formatting", 50));
            scores.put("technicalSkills", getScoreOrDefault(scoresNode, "technicalSkills", 50));
            scores.put("experience", getScoreOrDefault(scoresNode, "experience", 50));
            scores.put("projects", getScoreOrDefault(scoresNode, "projects", 50));
            scores.put("education", getScoreOrDefault(scoresNode, "education", 50));
            scores.put("keywords", getScoreOrDefault(scoresNode, "keywords", 50));
        } else {
            scores.put("formatting", 50);
            scores.put("technicalSkills", 50);
            scores.put("experience", 50);
            scores.put("projects", 50);
            scores.put("education", 50);
            scores.put("keywords", 50);
        }

        return scores;
    }

    private Integer getScoreOrDefault(JsonNode node, String fieldName, int defaultValue) {
        if (node != null && node.has(fieldName)) {
            try {
                return node.get(fieldName).asInt();
            } catch (Exception e) {
                return defaultValue;
            }
        }
        return defaultValue;
    }

    private List<String> extractList(JsonNode rootNode, String fieldName) {
        List<String> list = new ArrayList<>();
        if (rootNode != null && rootNode.has(fieldName) && rootNode.get(fieldName).isArray()) {
            try {
                JsonNode arrayNode = rootNode.get(fieldName);
                for (JsonNode item : arrayNode) {
                    list.add(item.asText());
                }
            } catch (Exception e) {
                // Return empty list if parsing fails
            }
        }
        return list;
    }

    private Integer extractConfidence(JsonNode rootNode) {
        if (rootNode != null && rootNode.has("analysisConfidence")) {
            try {
                return rootNode.get("analysisConfidence").asInt();
            } catch (Exception e) {
                return DEFAULT_CONFIDENCE;
            }
        }
        return DEFAULT_CONFIDENCE;
    }
}