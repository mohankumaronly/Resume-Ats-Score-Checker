package com.resume.builder.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.io.*;
import java.nio.file.*;
import java.util.UUID;

@Service
@Slf4j
public class LatexCompilerService {

    @Value("${latex.temp.dir:/tmp/latex-resumes}")
    private String tempDir;

    public byte[] compileLatexToPdf(String latexScript, UUID jobId) throws Exception {
        // Create job-specific directory
        String jobDir = tempDir + File.separator + jobId.toString();
        File dir = new File(jobDir);
        if (!dir.exists()) {
            dir.mkdirs();
        }

        // Save latex file
        String texFilePath = jobDir + File.separator + "resume.tex";
        Files.writeString(Paths.get(texFilePath), latexScript);

        // Run pdflatex command
        ProcessBuilder pb = new ProcessBuilder(
                "pdflatex",
                "-interaction=nonstopmode",
                "-output-directory=" + jobDir,
                texFilePath
        );
        pb.redirectErrorStream(true);

        Process process = pb.start();
        int exitCode = process.waitFor();

        // Read output for debugging
        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(process.getInputStream()))) {
            String line;
            while ((line = reader.readLine()) != null) {
                log.debug(line);
            }
        }

        if (exitCode != 0) {
            throw new RuntimeException("PDF generation failed with exit code: " + exitCode);
        }

        // Read the generated PDF
        String pdfPath = jobDir + File.separator + "resume.pdf";
        byte[] pdfBytes = Files.readAllBytes(Paths.get(pdfPath));

        // Clean up temp files (optional)
        // cleanupTempFiles(jobDir);

        return pdfBytes;
    }
}