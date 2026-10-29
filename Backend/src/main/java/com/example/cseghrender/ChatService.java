package com.example.cseghrender;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

import java.util.Map;
import java.util.List;
import java.util.HashMap;

@Service
public class ChatService {

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url}")
    private String apiUrl;

    private final RestTemplate restTemplate;

    public ChatService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public String getMedicationAdvice(String prompt, String imageBase64) {
        String urlString = apiUrl;
        java.net.URI uri = java.net.URI.create(urlString);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + apiKey);

        String systemContext = "You are a concise emergency medical assistant." +
                "For any injury/problem described or shown in the image:" +
                "1. Identify the injury if an image is provided." +
                "2. Give step-by-step first aid (numbered list)" +
                "3. Name specific medicine if relevant (e.g., Take 1 tablet of Aspirin)" +
                "4. Mention first aid supplies if needed (e.g., Clean with Betadine)" +
                "5. ALWAYS end with: Seek professional medical help immediately " +
                "Keep responses short, safe, and actionable.";

        Map<String, Object> requestBody = new HashMap<>();
        // Use vision model if image is present, else use standard model
        if (imageBase64 != null && !imageBase64.isEmpty()) {
            requestBody.put("model", "llama-3.2-90b-vision-preview");
        } else {
            requestBody.put("model", "llama-3.3-70b-versatile");
        }

        List<Map<String, Object>> messages = new java.util.ArrayList<>();

        Map<String, Object> systemMsg = new HashMap<>();
        systemMsg.put("role", "system");
        systemMsg.put("content", systemContext);
        messages.add(systemMsg);

        Map<String, Object> userMsg = new HashMap<>();
        userMsg.put("role", "user");

        if (imageBase64 != null && !imageBase64.isEmpty()) {
            List<Map<String, Object>> userContent = new java.util.ArrayList<>();

            Map<String, Object> textPart = new HashMap<>();
            textPart.put("type", "text");
            textPart.put("text", prompt != null && !prompt.isEmpty() ? prompt
                    : "Analyze this injury and provide first aid instructions.");
            userContent.add(textPart);

            Map<String, Object> imagePart = new HashMap<>();
            imagePart.put("type", "image_url");
            Map<String, String> imageUrl = new HashMap<>();
            // Assuming imageBase64 is just the data part or includes prefix
            String formattedBase64 = imageBase64.startsWith("data:") ? imageBase64
                    : "data:image/jpeg;base64," + imageBase64;
            imageUrl.put("url", formattedBase64);
            imagePart.put("image_url", imageUrl);
            userContent.add(imagePart);

            userMsg.put("content", userContent);
        } else {
            userMsg.put("content", prompt);
        }

        messages.add(userMsg);
        requestBody.put("messages", messages);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

        try {
            @SuppressWarnings("unchecked")
            Map<String, Object> response = restTemplate.postForObject(uri, request, Map.class);

            if (response != null && response.containsKey("choices")) {
                @SuppressWarnings("unchecked")
                List<Map<String, Object>> choices = (List<Map<String, Object>>) response.get("choices");
                if (!choices.isEmpty()) {
                    Map<String, Object> choice = choices.get(0);
                    @SuppressWarnings("unchecked")
                    Map<String, Object> message = (Map<String, Object>) choice.get("message");
                    return (String) message.get("content");
                }
            }
            return "No response received from AI.";

        } catch (Exception e) {
            return "Error while interacting with AI: " + e.getMessage();
        }
    }
}