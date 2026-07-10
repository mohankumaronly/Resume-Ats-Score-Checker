package com.resume.analyzer.service;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;

@Service
public class PdfService {

    /**
     * Extracts text from a PDF file
     *
     * @param file The uploaded PDF file
     * @return Extracted text content
     * @throws Exception if file is not a valid PDF or extraction fails
     */
    public String extractText(MultipartFile file) throws Exception {
        // Validate that the file is not empty
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File is empty. Please upload a valid PDF.");
        }

        // Validate file type
        String contentType = file.getContentType();
        if (contentType == null || !contentType.equals("application/pdf")) {
            throw new IllegalArgumentException("Invalid file type. Please upload a PDF file.");
        }

        // Extract text using PDFBox
        try (InputStream inputStream = file.getInputStream();
             PDDocument document = Loader.loadPDF(inputStream.readAllBytes())) {

            PDFTextStripper stripper = new PDFTextStripper();
            String extractedText = stripper.getText(document);

            // Remove extra whitespace and normalize the text
            String cleanedText = extractedText.replaceAll("\\s+", " ").trim();

            // Check if text was actually extracted
            if (cleanedText.isEmpty()) {
                throw new IllegalStateException("No text could be extracted from the PDF. The file might be image-based or empty.");
            }

            return cleanedText;
        } catch (Exception e) {
            // Wrap any exception with a meaningful message
            throw new Exception("Failed to extract text from PDF: " + e.getMessage(), e);
        }
    }
}