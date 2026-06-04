package com.resume.builder.service;

import com.resume.builder.dto.GroqRequestDTO;
import com.resume.builder.dto.GroqResponseDTO;
import com.resume.builder.config.GroqConfig;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
@Slf4j
public class GroqService {

    private final RestTemplate restTemplate;
    private final GroqConfig groqConfig;

    private static final String GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

    public String generateLaTeX(String userInput, String templateType, String additionalNotes) {
        String prompt = buildPrompt(userInput, templateType, additionalNotes);

        GroqRequestDTO request = new GroqRequestDTO();
        GroqRequestDTO.Message systemMessage = new GroqRequestDTO.Message();
        systemMessage.setRole("system");
        systemMessage.setContent("You are a LaTeX expert. Generate ONLY valid LaTeX code, no explanations.");

        GroqRequestDTO.Message userMessage = new GroqRequestDTO.Message();
        userMessage.setRole("user");
        userMessage.setContent(prompt);

        request.getMessages().add(systemMessage);
        request.getMessages().add(userMessage);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(groqConfig.getGroqApiKey());

        HttpEntity<GroqRequestDTO> entity = new HttpEntity<>(request, headers);

        try {
            ResponseEntity<GroqResponseDTO> response = restTemplate.exchange(
                    GROQ_API_URL,
                    HttpMethod.POST,
                    entity,
                    GroqResponseDTO.class
            );

            if (response.getBody() != null && response.getBody().getChoices() != null) {
                String latex = response.getBody().getChoices().get(0).getMessage().getContent();
                log.info("LaTeX generated successfully");
                return latex;
            }
        } catch (Exception e) {
            log.error("Error calling Groq API: {}", e.getMessage());
            throw new RuntimeException("Failed to generate LaTeX: " + e.getMessage());
        }

        throw new RuntimeException("No response from Groq API");
    }

    private String buildPrompt(String userInput, String templateType, String additionalNotes) {
        return String.format("""
            Generate a professional LaTeX resume script.
            
            Template Style: %s
            
            User Information:
            %s
            
            Additional Requirements:
            %s
            
            Requirements:
            - Use \\documentclass[11pt]{article}
            - Include sections: Contact, Summary, Experience, Education, Skills
            - Make it clean and modern
            - Output ONLY valid LaTeX code
            """,
                templateType, userInput, additionalNotes != null ? additionalNotes : "None");
    }
}