package com.example.cseghrender;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "*")
public class ChatController {

    @Autowired
    private ChatService chatService;

    @PostMapping
    public ResponseEntity<String> chatWithAI(@RequestBody Map<String, String> request) {
        String message = request.get("message");
        String image = request.get("image"); // Optional base64 image
        
        if ((message == null || message.trim().isEmpty()) && (image == null || image.trim().isEmpty())) {
            return ResponseEntity.badRequest().body("Message or Image must be provided.");
        }

        String aiResponse = chatService.getMedicationAdvice(message, image);
        return ResponseEntity.ok(aiResponse);
    }
}
