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

    private static final double DEFAULT_TEMPERATURE = 0.1;
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
     * Sends resume text to Groq API for AI analysis (Existing method)
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
     * NEW METHOD: Sends resume and job description to Groq API for comparison analysis
     */
    public GroqResponse analyzeResumeWithJob(String resumeText, String jobDescription) throws Exception {
        try {
            String prompt = buildJobComparisonPrompt(resumeText, jobDescription);
            GroqRequest request = buildGroqRequest(prompt);
            HttpEntity<GroqRequest> httpEntity = buildHttpEntity(request);
            return executeApiCall(httpEntity);
        } catch (RestClientException e) {
            throw new Exception("Failed to call Groq API: " + e.getMessage(), e);
        } catch (Exception e) {
            throw new Exception("Error analyzing resume with job description: " + e.getMessage(), e);
        }
    }

    /**
     * NEW METHOD: Builds the prompt for job comparison analysis
     */
    private String buildJobComparisonPrompt(String resumeText, String jobDescription) {
        return """
                You are a strict ATS resume evaluator. Compare the resume against the job description.

                JOB DESCRIPTION:
                %s

                RESUME:
                %s

                Provide a detailed comparison analysis. Return EXACTLY this JSON format:
                {
                    "atsScore": <0-100 - Overall ATS score of the resume>,
                    "matchScore": <0-100 - How well resume matches the job description>,
                    "overallRating": "<Excellent|Very Good|Good|Average|Needs Improvement>",
                    "summary": "<2-3 sentence honest comparison overview>",
                    "keywordMatchRate": <0-100 - Percentage of job keywords found in resume>,
                    "missingKeywords": ["<keywords from job description not in resume>"],
                    "skillsGap": {
                        "required": ["<skills required by the job>"],
                        "found": ["<skills found in resume that match job>"],
                        "missing": ["<skills missing from resume that job requires>"]
                    },
                    "experienceMatch": "<Detailed assessment of experience alignment with job requirements>",
                    "educationMatch": "<Detailed assessment of education alignment with job requirements>",
                    "sectionScores": {
                        "formatting": <0-100>,
                        "technicalSkills": <0-100>,
                        "experience": <0-100>,
                        "projects": <0-100>,
                        "education": <0-100>,
                        "keywords": <0-100>
                    },
                    "strengths": ["<what matches well with the job description>"],
                    "weaknesses": ["<what doesn't match well with the job description>"],
                    "suggestions": ["<specific improvements for this specific job>"],
                    "recommendedSkills": ["<skills to learn for this specific role>"],
                    "atsFriendly": <true/false>,
                    "analysisConfidence": <0-100>
                }
                """.formatted(jobDescription, resumeText);
    }

    private String buildPrompt(String resumeText) {
        return """
                You are a STRICT, CHALLENGING ATS (Applicant Tracking System) resume evaluator.

                ⚠️ CRITICAL: Return ONLY valid JSON. NO markdown, NO explanations, NO extra text.

                SCORING RULES (BE STRICT):
                - USE FULL 0-100 RANGE. DON'T DEFAULT TO 85.
                - If section is MISSING: score 0-20
                - If section is WEAK: score 20-50
                - If section is GOOD: score 50-75
                - If section is EXCELLENT: score 75-100

                SECTION DEDUCTIONS:
                - NO Projects section: -30 points
                - NO Experience: -25 points
                - NO Education: -15 points
                - NO Skills: -20 points
                - No metrics in experience: -20 points
                - Generic skills: -10 points

                Return EXACTLY this JSON (and ONLY this JSON, no other text):
                {
                    "atsScore": 0,
                    "overallRating": "Needs Improvement",
                    "summary": "",
                    "detailedFeedback": "",
                    "sectionScores": {
                        "formatting": 0,
                        "technicalSkills": 0,
                        "experience": 0,
                        "projects": 0,
                        "education": 0,
                        "keywords": 0
                    },
                    "strengths": [],
                    "weaknesses": [],
                    "missingKeywords": [],
                    "recommendedSkills": [],
                    "grammarIssues": [],
                    "suggestions": [],
                    "atsFriendly": false,
                    "analysisConfidence": 0
                }

                Resume Text:
                %s
                """.formatted(resumeText);
    }

    private GroqRequest buildGroqRequest(String prompt) {
        return new GroqRequest.Builder()
                .model(model)
                .message(SYSTEM_ROLE, "You are a strict ATS resume evaluator. Return ONLY valid JSON. No markdown. No explanations. Be critical and honest.")
                .message(USER_ROLE, prompt)
                .temperature(DEFAULT_TEMPERATURE)
                .max_tokens(DEFAULT_MAX_TOKENS)
                .build();
    }

    private HttpEntity<GroqRequest> buildHttpEntity(GroqRequest request) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);
        return new HttpEntity<>(request, headers);
    }

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

    private void validateResponse(ResponseEntity<GroqResponse> response) throws Exception {
        if (response.getBody() == null) {
            throw new Exception("Invalid response from Groq API: Response body is null");
        }
        if (response.getBody().getChoices() == null || response.getBody().getChoices().isEmpty()) {
            throw new Exception("Invalid response from Groq API: No choices returned");
        }
    }
}