package com.resume.analyzer.service;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;

@Service
public class PdfService {

    private static final String CONTENT_TYPE_PDF = "application/pdf";
    private static final int MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

    /**
     * Extracts and cleans text from a PDF file
     *
     * @param file The uploaded PDF file
     * @return Cleaned extracted text content
     * @throws Exception if file is not a valid PDF or extraction fails
     */
    public String extractText(MultipartFile file) throws Exception {
        validateFile(file);
        String rawText = extractRawText(file);
        return cleanExtractedText(rawText);
    }

    /**
     * Validates the uploaded file
     */
    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File is empty. Please upload a valid PDF.");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException("File size exceeds 5MB limit. Please upload a smaller file.");
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.equals(CONTENT_TYPE_PDF)) {
            throw new IllegalArgumentException("Invalid file type. Please upload a PDF file.");
        }
    }

    /**
     * Extracts raw text from PDF using Apache PDFBox
     */
    private String extractRawText(MultipartFile file) throws Exception {
        try (InputStream inputStream = file.getInputStream();
             PDDocument document = Loader.loadPDF(inputStream.readAllBytes())) {

            PDFTextStripper stripper = new PDFTextStripper();
            String extractedText = stripper.getText(document);

            if (extractedText == null || extractedText.trim().isEmpty()) {
                throw new IllegalStateException(
                        "No text could be extracted from the PDF. The file might be image-based or empty."
                );
            }

            return extractedText;
        } catch (IllegalStateException e) {
            throw e;
        } catch (Exception e) {
            throw new Exception("Failed to extract text from PDF: " + e.getMessage(), e);
        }
    }

    /**
     * Cleans the extracted text by fixing common PDF extraction issues
     */
    private String cleanExtractedText(String text) {
        // Fix hyphenated words split across lines (e.g., "Expe-\nrienced" -> "Experienced")
        String cleaned = text.replaceAll("(\\w+)-\\s*\\n\\s*(\\w+)", "$1$2");

        // Fix hyphenated words with spaces (e.g., "Expe- rienced" -> "Experienced")
        cleaned = cleaned.replaceAll("(\\w+)-\\s+(\\w+)", "$1$2");

        // Remove extra whitespace and normalize
        cleaned = cleaned.replaceAll("\\s+", " ").trim();

        return cleaned;
    }
}