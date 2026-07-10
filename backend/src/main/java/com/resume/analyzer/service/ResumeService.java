package com.resume.analyzer.service;

import com.resume.analyzer.dto.GroqResponse;
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

@Service
public class ResumeService {

    private final PdfService pdfService;
    private final GroqService groqService;
    private final ObjectMapper objectMapper;

    private static final int DEFAULT_CONFIDENCE = 85;
    private static final int MIN_ATS_FRIENDLY_SCORE = 70;

    @Autowired
    public ResumeService(PdfService pdfService, GroqService groqService) {
        this.pdfService = pdfService;
        this.groqService = groqService;
        this.objectMapper = new ObjectMapper();
    }

    /**
     * Analyzes a resume PDF file end-to-end
     *
     * @param file The uploaded PDF file
     * @return Enhanced ResumeResponse containing the analysis
     * @throws Exception if processing fails at any step
     */
    public ResumeResponse analyzeResume(MultipartFile file) throws Exception {
        try {
            // Step 1: Extract text from PDF
            String extractedText = pdfService.extractText(file);

            // Step 2: Send to Groq for AI analysis
            GroqResponse groqResponse = groqService.analyzeResume(extractedText);

            // Step 3: Parse and structure the response
            return parseGroqResponse(groqResponse);

        } catch (Exception e) {
            throw new Exception("Failed to analyze resume: " + e.getMessage(), e);
        }
    }

    /**
     * Parses the Groq API response and converts to ResumeResponse
     */
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

    /**
     * Extracts content from Groq response
     */
    private String extractContentFromGroqResponse(GroqResponse groqResponse) {
        if (groqResponse.getChoices() == null || groqResponse.getChoices().isEmpty()) {
            throw new IllegalStateException("No choices returned from Groq API");
        }
        return groqResponse.getChoices().get(0).getMessage().getContent();
    }

    /**
     * Extracts JSON from content that might be wrapped in markdown code blocks
     */
    private String extractJsonFromContent(String content) {
        return content.replaceAll("```json\\s*", "")
                .replaceAll("```\\s*", "")
                .trim();
    }

    /**
     * Builds ResumeResponse from JSON node
     */
    private ResumeResponse buildResumeResponse(JsonNode rootNode) {
        Integer atsScore = extractAtsScore(rootNode);
        String overallRating = extractOverallRating(rootNode, atsScore);
        String summary = extractSummary(rootNode);
        String detailedFeedback = extractDetailedFeedback(rootNode);

        Map<String, Integer> sectionScores = extractSectionScores(rootNode);

        List<String> strengths = extractList(rootNode, "strengths");
        List<String> weaknesses = extractList(rootNode, "weaknesses");
        List<String> missingKeywords = extractList(rootNode, "missingKeywords");
        List<String> recommendedSkills = extractList(rootNode, "recommendedSkills");
        List<String> grammarIssues = extractList(rootNode, "grammarIssues");
        List<String> suggestions = extractList(rootNode, "suggestions");

        Boolean atsFriendly = extractAtsFriendly(rootNode, atsScore);
        Integer analysisConfidence = extractConfidence(rootNode);
        LocalDateTime analyzedAt = LocalDateTime.now();

        return new ResumeResponse(
                atsScore, overallRating, summary, detailedFeedback,
                sectionScores, strengths, weaknesses, missingKeywords,
                recommendedSkills, grammarIssues, suggestions,
                atsFriendly, analysisConfidence, analyzedAt
        );
    }

    /**
     * Extracts ATS score from JSON
     */
    private Integer extractAtsScore(JsonNode rootNode) {
        return rootNode.has("atsScore") ? rootNode.get("atsScore").asInt() : 0;
    }

    /**
     * Extracts overall rating from JSON or derives from score
     */
    private String extractOverallRating(JsonNode rootNode, Integer atsScore) {
        if (rootNode.has("overallRating")) {
            return rootNode.get("overallRating").asText();
        }
        return deriveOverallRating(atsScore);
    }

    /**
     * Derives overall rating from ATS score
     */
    private String deriveOverallRating(Integer atsScore) {
        if (atsScore >= 90) return "Excellent";
        if (atsScore >= 80) return "Very Good";
        if (atsScore >= 70) return "Good";
        if (atsScore >= 60) return "Average";
        return "Needs Improvement";
    }

    /**
     * Extracts summary from JSON
     */
    private String extractSummary(JsonNode rootNode) {
        return rootNode.has("summary")
                ? rootNode.get("summary").asText()
                : "Resume analysis completed.";
    }

    /**
     * Extracts detailed feedback from JSON
     */
    private String extractDetailedFeedback(JsonNode rootNode) {
        return rootNode.has("detailedFeedback")
                ? rootNode.get("detailedFeedback").asText()
                : "No detailed feedback provided.";
    }

    /**
     * Extracts section scores from JSON with defaults
     */
    private Map<String, Integer> extractSectionScores(JsonNode rootNode) {
        Map<String, Integer> scores = new HashMap<>();

        if (rootNode.has("sectionScores") && rootNode.get("sectionScores").isObject()) {
            JsonNode scoresNode = rootNode.get("sectionScores");
            scores.put("formatting", getScoreOrDefault(scoresNode, "formatting", 70));
            scores.put("technicalSkills", getScoreOrDefault(scoresNode, "technicalSkills", 70));
            scores.put("experience", getScoreOrDefault(scoresNode, "experience", 70));
            scores.put("projects", getScoreOrDefault(scoresNode, "projects", 70));
            scores.put("education", getScoreOrDefault(scoresNode, "education", 70));
            scores.put("keywords", getScoreOrDefault(scoresNode, "keywords", 70));
        } else {
            // Default scores if sectionScores is missing
            scores.put("formatting", 70);
            scores.put("technicalSkills", 70);
            scores.put("experience", 70);
            scores.put("projects", 70);
            scores.put("education", 70);
            scores.put("keywords", 70);
        }

        return scores;
    }

    /**
     * Gets score from JSON node or returns default
     */
    private Integer getScoreOrDefault(JsonNode node, String fieldName, int defaultValue) {
        return node.has(fieldName) ? node.get(fieldName).asInt() : defaultValue;
    }

    /**
     * Extracts a list from JSON node
     */
    private List<String> extractList(JsonNode rootNode, String fieldName) {
        List<String> list = new ArrayList<>();
        if (rootNode.has(fieldName) && rootNode.get(fieldName).isArray()) {
            JsonNode arrayNode = rootNode.get(fieldName);
            for (JsonNode item : arrayNode) {
                list.add(item.asText());
            }
        }
        return list;
    }

    /**
     * Extracts ATS friendly flag from JSON or derives from score
     */
    private Boolean extractAtsFriendly(JsonNode rootNode, Integer atsScore) {
        if (rootNode.has("atsFriendly")) {
            return rootNode.get("atsFriendly").asBoolean();
        }
        return atsScore >= MIN_ATS_FRIENDLY_SCORE;
    }

    /**
     * Extracts confidence level from JSON or returns default
     */
    private Integer extractConfidence(JsonNode rootNode) {
        return rootNode.has("analysisConfidence")
                ? rootNode.get("analysisConfidence").asInt()
                : DEFAULT_CONFIDENCE;
    }
}