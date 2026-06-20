package com.resume.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.resume.dto.request.ImproveResumeRequest;
import com.resume.dto.response.AIResumeResponse;
import com.resume.entity.Resume;
import com.resume.entity.User;
import com.resume.exception.ResumeNotFoundException;
import com.resume.exception.UserNotFoundException;
import com.resume.repository.ResumeRepository;
import com.resume.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class AIService {

    private final ResumeRepository resumeRepository;
    private final UserRepository userRepository;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${groq.api.key}")
    private String groqApiKey;

    @Value("${groq.api.url}")
    private String groqApiUrl;

    @Value("${groq.api.model}")
    private String groqModel;

    private User getCurrentLoggedInUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found with email: " + email));
    }

    public AIResumeResponse improveResume(Long resumeId, ImproveResumeRequest request) {
        User currentUser = getCurrentLoggedInUser();

        Resume resume = resumeRepository.findByIdAndUserId(resumeId, currentUser.getId())
                .orElseThrow(() -> new ResumeNotFoundException("Resume not found with id: " + resumeId));

        String originalJson = resume.getResumeDataJson();

        try {
            log.info("Calling Groq API to improve resume for resumeId: {}", resumeId);

            String improvedJson = callGroqToImproveResume(originalJson, request);

            log.info("Resume improved successfully for resumeId: {}", resumeId);

            return new AIResumeResponse(
                    resumeId,
                    originalJson,
                    improvedJson
            );
        } catch (Exception e) {
            log.error("Error calling Groq API for resumeId {}: {}", resumeId, e.getMessage(), e);
            throw new RuntimeException("Failed to improve resume: " + e.getMessage());
        }
    }

    private String callGroqToImproveResume(String originalResumeJson, ImproveResumeRequest request) throws Exception {
        String prompt = buildResumeImprovePrompt(originalResumeJson, request);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(groqApiKey);

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", groqModel);
        requestBody.put("messages", List.of(
                Map.of(
                        "role", "system",
                        "content",
                        """
                        You are a professional resume editor.

                        Your task is to improve only the wording, grammar, clarity, professionalism, and ATS readability of the provided resume content.

                        STRICT RULES:
                        1. Do not invent any new skills, projects, certifications, links, companies, or achievements.
                        2. Do not add new fields or new sections that are not already present in the input JSON.
                        3. Do not remove existing fields.
                        4. Keep the same overall JSON structure and keys.
                        5. Only rewrite text inside existing fields.
                        6. Return only valid raw JSON with no markdown and no explanation.
                        """
                ),
                Map.of("role", "user", "content", prompt)
        ));
        requestBody.put("temperature", 0.3);
        requestBody.put("max_tokens", 2048);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        log.info("Sending request to Groq API");
        ResponseEntity<String> response = restTemplate.postForEntity(groqApiUrl, entity, String.class);

        if (!response.getStatusCode().is2xxSuccessful()) {
            throw new RuntimeException("Groq API returned error: " + response.getStatusCode());
        }

        return extractImprovedJsonFromGroqResponse(response.getBody());
    }

    private String buildResumeImprovePrompt(String resumeJson, ImproveResumeRequest request) {
        return String.format(
                """
                Improve the following resume for the target role: %s
                Experience level: %s

                STRICT RULES:
                1. Do NOT invent any new skills, projects, companies, certifications, or experience.
                2. Only improve wording, grammar, clarity, professionalism, and ATS readability.
                3. Keep the same overall JSON structure and the same existing keys.
                4. If a field is missing in the original JSON, do NOT add it.
                5. Return ONLY valid JSON and nothing else.

                Original Resume JSON:
                %s

                Return ONLY the improved JSON with no additional text.
                """,
                request.getTargetRole(),
                request.getExperienceLevel(),
                resumeJson
        );
    }

    private String extractImprovedJsonFromGroqResponse(String responseBody) throws Exception {
        JsonNode root = objectMapper.readTree(responseBody);
        JsonNode contentNode = root.path("choices").path(0).path("message").path("content");

        if (contentNode.isMissingNode()) {
            throw new RuntimeException("Invalid response from Groq API");
        }

        String content = contentNode.asText().trim();

        // Remove markdown code blocks if present
        content = content.replaceAll("```json\\s*", "");
        content = content.replaceAll("```\\s*", "");

        // Validate if it's valid JSON
        try {
            objectMapper.readTree(content);
        } catch (Exception e) {
            log.error("Invalid JSON from Groq: {}", content);
            throw new RuntimeException("Groq returned invalid JSON response");
        }

        return content;
    }
}