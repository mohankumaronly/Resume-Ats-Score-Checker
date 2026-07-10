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
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

@Service
public class GroqService {

    private static final double DEFAULT_TEMPERATURE = 0.3;
    private static final int DEFAULT_MAX_TOKENS = 1500;
    private static final String SYSTEM_ROLE = "system";
    private static final String USER_ROLE = "user";

    @Value("${groq.api.key}")
    private String apiKey;

    @Value("${groq.api.url}")
    private String apiUrl;

    @Value("${groq.model:llama-3.3-70b-versatile}")
    private String model;

    private final RestTemplate restTemplate;

    @Autowired
    public GroqService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    /**
     * Sends resume text to Groq API for AI analysis
     *
     * @param resumeText The extracted text from the resume
     * @return GroqResponse containing the AI analysis
     * @throws Exception if the API call fails
     */
    public GroqResponse analyzeResume(String resumeText) throws Exception {
        try {
            String prompt = buildPrompt(resumeText);
            GroqRequest request = buildGroqRequest(prompt);
            HttpEntity<GroqRequest> httpEntity = buildHttpEntity(request);

            return executeApiCall(httpEntity);

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

                Return your response in EXACTLY this JSON format:
                {
                    "atsScore": <number between 0-100>,
                    "overallRating": "<Excellent|Very Good|Good|Average|Needs Improvement>",
                    "summary": "<2-3 sentence overview of the resume>",
                    "detailedFeedback": "<Detailed explanation of strengths and areas for improvement>",
                    "sectionScores": {
                        "formatting": <0-100>,
                        "technicalSkills": <0-100>,
                        "experience": <0-100>,
                        "projects": <0-100>,
                        "education": <0-100>,
                        "keywords": <0-100>
                    },
                    "strengths": ["<strength1>", "<strength2>", ...],
                    "weaknesses": ["<weakness1>", "<weakness2>", ...],
                    "missingKeywords": ["<keyword1>", "<keyword2>", ...],
                    "recommendedSkills": ["<skill1>", "<skill2>", ...],
                    "grammarIssues": ["<issue1>", "<issue2>", ...],
                    "suggestions": ["<suggestion1>", "<suggestion2>", ...],
                    "atsFriendly": <true/false>,
                    "analysisConfidence": <number between 0-100>
                }

                Important Guidelines:
                1. Base ALL analysis ONLY on the resume content provided
                2. Do NOT assume skills or experience not mentioned
                3. Do NOT say a skill is missing if it already exists in the resume
                4. Be specific and actionable in suggestions
                5. If a section is empty in the resume, score it lower
                6. For missingKeywords, only include keywords relevant to the candidate's field
                7. recommendedSkills should be skills the candidate could learn next
                8. Grammar issues should be specific, not generic
                9. analysisConfidence should reflect how confident you are in the analysis
                10. Do NOT use the candidate's name in the response - keep it generic

                Resume Text:
                %s
                """.formatted(resumeText);
    }

    /**
     * Builds Groq API request object
     */
    private GroqRequest buildGroqRequest(String prompt) {
        return new GroqRequest.Builder()
                .model(model)
                .message(SYSTEM_ROLE, "You are an expert ATS (Applicant Tracking System) resume analyzer with 10+ years of experience in HR and recruitment. You provide detailed, accurate, and actionable feedback.")
                .message(USER_ROLE, prompt)
                .temperature(DEFAULT_TEMPERATURE)
                .max_tokens(DEFAULT_MAX_TOKENS)
                .build();
    }

    /**
     * Builds HTTP entity with headers and request body
     */
    private HttpEntity<GroqRequest> buildHttpEntity(GroqRequest request) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        return new HttpEntity<>(request, headers);
    }

    /**
     * Executes the API call to Groq
     */
    private GroqResponse executeApiCall(HttpEntity<GroqRequest> httpEntity) throws Exception {
        ResponseEntity<GroqResponse> response = restTemplate.exchange(
                apiUrl,
                HttpMethod.POST,
                httpEntity,
                GroqResponse.class
        );

        validateResponse(response);
        return response.getBody();
    }

    /**
     * Validates the API response
     */
    private void validateResponse(ResponseEntity<GroqResponse> response) throws Exception {
        if (response.getBody() == null) {
            throw new Exception("Invalid response from Groq API: Response body is null");
        }

        if (response.getBody().getChoices() == null || response.getBody().getChoices().isEmpty()) {
            throw new Exception("Invalid response from Groq API: No choices returned");
        }
    }
}