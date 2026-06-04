package com.resume.builder.config;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DotenvConfig {

    static {
        try {
            Dotenv dotenv = Dotenv.configure()
                    .directory("./")
                    .ignoreIfMissing()
                    .load();

            dotenv.entries().forEach(entry -> {
                System.setProperty(entry.getKey(), entry.getValue());
            });

            System.out.println("✅ Environment variables loaded from .env file");
            System.out.println("📊 DB_HOST: " + System.getProperty("DB_HOST"));
        } catch (Exception e) {
            System.out.println("⚠️ No .env file found, using system environment variables");
        }
    }
}