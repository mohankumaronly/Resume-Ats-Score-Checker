package com.resume.analyzer;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class AnalyzerApplication {

	public static void main(String[] args) {
		// Load .env file before Spring Boot starts
		Dotenv dotenv = Dotenv.configure()
				.ignoreIfMissing()  // Don't fail if .env doesn't exist
				.load();

		// Set each property from .env as System property
		// This makes them available to Spring's @Value annotation
		dotenv.entries().forEach(entry -> {
			System.setProperty(entry.getKey(), entry.getValue());
		});

		SpringApplication.run(AnalyzerApplication.class, args);
	}
}	