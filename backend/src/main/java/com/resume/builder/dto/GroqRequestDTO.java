package com.resume.builder.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;
import java.util.ArrayList;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GroqRequestDTO {
    private String model = "llama-3.1-8b-instant";
    private List<Message> messages = new ArrayList<>();
    private Double temperature = 0.7;
    private Integer max_tokens = 4000;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Message {
        private String role;
        private String content;
    }
}