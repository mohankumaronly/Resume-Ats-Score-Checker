package com.resume.analyzer.service;

import com.resume.analyzer.dto.GroqRequest;
import com.resume.analyzer.dto.GroqResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.RestClientException;

@Service
public class GroqService {

    @Value("${groq.api.key}")
    private String apiKey;

    @Value("${groq.api.url}")
    private String apiUrl;

    @Value("${groq.model:mixtral-8x7b-32768}")
    private String model;

    private final RestTemplate restTemplate;

    @Autowired
    public GroqService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    /**
     * Sends resume text to Groq API for analysis
     *
     * @param resumeText The extracted text from the resume
     * @return The AI analysis response
     * @throws Exception if the API call fails
     */
    public GroqResponse analyzeResume(String resumeText) throws Exception {
        try {
            // Build the prompt
            String prompt = buildPrompt(resumeText);

            // Create request body
// In GroqService.java, update this section:
            GroqRequest request = new GroqRequest.Builder()
                    .model(model)
                    .message("system", "You are an expert ATS (Applicant Tracking System) resume analyzer with 10+ years of experience in HR and recruitment.")
                    .message("user", prompt)
                    .temperature(0.7)
                    .max_tokens(1000)
                    .build();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer " + apiKey);

            // Create HTTP entity
            HttpEntity<GroqRequest> entity = new HttpEntity<>(request, headers);

            // Make the API call
            ResponseEntity<GroqResponse> response = restTemplate.exchange(
                    apiUrl,
                    HttpMethod.POST,
                    entity,
                    GroqResponse.class
            );

            // Check if response is valid
            if (response.getBody() == null || response.getBody().getChoices() == null ||
                    response.getBody().getChoices().isEmpty()) {
                throw new Exception("Invalid response from Groq API: No choices returned");
            }

            return response.getBody();

        } catch (RestClientException e) {
            throw new Exception("Failed to call Groq API: " + e.getMessage(), e);
        } catch (Exception e) {
            throw new Exception("Error analyzing resume: " + e.getMessage(), e);
        }
    }

    /**
     * Builds the prompt for the AI
     */
    private String buildPrompt(String resumeText) {
        return """
                Analyze the following resume and provide a comprehensive evaluation.
                
                Return your response in the following JSON format exactly:
                {
                    "atsScore": <number between 0-100>,
                    "feedback": "<overall feedback summary>",
                    "strengths": ["strength1", "strength2", ...],
                    "weaknesses": ["weakness1", "weakness2", ...],
                    "suggestions": ["suggestion1", "suggestion2", ...]
                }
                
                Guidelines for evaluation:
                1. ATS Score: Rate based on keywords, formatting, relevance, and completeness
                2. Strengths: Highlight strong technical skills, relevant experience, good projects
                3. Weaknesses: Identify missing keywords, gaps in experience, formatting issues
                4. Suggestions: Provide actionable improvements including specific keywords to add
                
                Resume Text:
                %s
                """.formatted(resumeText);
    }
}