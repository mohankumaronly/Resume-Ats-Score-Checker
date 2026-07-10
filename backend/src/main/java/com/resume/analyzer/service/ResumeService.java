package com.resume.analyzer.service;

import com.resume.analyzer.dto.GroqResponse;
import com.resume.analyzer.dto.ResumeResponse;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@Service
public class ResumeService {

    private final PdfService pdfService;
    private final GroqService groqService;
    private final ObjectMapper objectMapper;

    @Autowired
    public ResumeService(PdfService pdfService, GroqService groqService) {
        this.pdfService = pdfService;
        this.groqService = groqService;
        this.objectMapper = new ObjectMapper();
    }

    /**
     * Analyzes a resume PDF file
     *
     * @param file The uploaded PDF file
     * @return ResumeResponse containing the analysis
     * @throws Exception if processing fails
     */
    public ResumeResponse analyzeResume(MultipartFile file) throws Exception {
        try {
            // Step 1: Extract text from PDF
            String extractedText = pdfService.extractText(file);

            // Step 2: Send to Groq for analysis
            GroqResponse groqResponse = groqService.analyzeResume(extractedText);

            // Step 3: Parse AI response and convert to ResumeResponse
            return parseGroqResponse(groqResponse);

        } catch (Exception e) {
            // Re-throw with meaningful message
            throw new Exception("Failed to analyze resume: " + e.getMessage(), e);
        }
    }

    /**
     * Parses the Groq API response and converts to ResumeResponse
     */
    private ResumeResponse parseGroqResponse(GroqResponse groqResponse) throws Exception {
        try {
            // Get the AI's response content
            String content = groqResponse.getChoices().get(0).getMessage().getContent();

            // Extract JSON from the content (handle markdown code blocks if present)
            String jsonContent = extractJsonFromContent(content);

            // Parse JSON
            JsonNode rootNode = objectMapper.readTree(jsonContent);

            // Extract fields from JSON
            Integer atsScore = rootNode.has("atsScore") ? rootNode.get("atsScore").asInt() : 0;
            String feedback = rootNode.has("feedback") ? rootNode.get("feedback").asText() : "No feedback provided";

            List<String> strengths = extractList(rootNode, "strengths");
            List<String> weaknesses = extractList(rootNode, "weaknesses");
            List<String> suggestions = extractList(rootNode, "suggestions");

            // Create and return the response
            return new ResumeResponse(atsScore, feedback, strengths, weaknesses, suggestions);

        } catch (Exception e) {
            throw new Exception("Failed to parse AI response: " + e.getMessage(), e);
        }
    }

    /**
     * Extracts JSON from content that might be wrapped in markdown code blocks
     */
    private String extractJsonFromContent(String content) {
        // Remove markdown code blocks if present
        String cleaned = content.replaceAll("```json\\s*", "")
                .replaceAll("```\\s*", "")
                .trim();
        return cleaned;
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
}