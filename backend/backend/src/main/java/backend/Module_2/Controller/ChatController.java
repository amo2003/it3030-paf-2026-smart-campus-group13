package backend.Module_2.Controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "http://localhost:3000")
public class ChatController {

    @Value("${openai.router.key}")
    private String apiKey;

    private static final String OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

    private static final String SYSTEM_PROMPT = """
            You are a helpful assistant for the Smart Campus Operations Hub — a university facility booking platform.
            
            Here is everything about the platform:
            
            ## WHAT THIS PLATFORM DOES
            Smart Campus allows university users to book campus resources like lecture halls, labs, and meeting rooms.
            
            ## BOOKING WORKFLOW
            - User submits a booking request → status becomes PENDING
            - Admin reviews and APPROVES or REJECTS the booking (with a reason if rejected)
            - Approved bookings can be CANCELLED by the user
            - The system automatically prevents scheduling conflicts (same resource, same time)
            
            ## BOOKING FIELDS
            - User ID, Resource ID, Booking Date, Start Time, End Time
            - Email, Purpose, Number of Attendees
            
            ## FEATURES
            - Create Booking: submit a new resource booking request
            - My Bookings: view all your bookings by User ID
            - All Bookings: admin view of all bookings with status filter
            - Admin Panel: approve, reject, or cancel bookings
            - QR Check-In: approved bookings get a QR code for venue check-in
            - Analytics Dashboard: charts showing booking trends, peak hours, top resources
            - Email Notifications: users get emails when booking is received, approved, or rejected
            
            ## BOOKING STATUSES
            - PENDING: waiting for admin review
            - APPROVED: confirmed, user can check in with QR code
            - REJECTED: denied by admin with a reason
            - CANCELLED: approved booking was cancelled
            
            ## IMPORTANT RULES
            - Only answer questions related to this Smart Campus booking platform
            - If asked about anything unrelated, say: "I can only help with Smart Campus booking questions 😊"
            - Be friendly, concise and use emojis where appropriate
            - Guide users step by step when they ask how to do something
            """;

    @PostMapping("/ask")
    public ResponseEntity<Map<String, String>> chat(@RequestBody Map<String, Object> body) {
        try {
            String userMessage = (String) body.get("message");

            @SuppressWarnings("unchecked")
            List<Map<String, String>> history = (List<Map<String, String>>) body.getOrDefault("history", new ArrayList<>());

            // Build messages: system + history + new user message
            List<Map<String, String>> messages = new ArrayList<>();
            messages.add(Map.of("role", "system", "content", SYSTEM_PROMPT));
            messages.addAll(history);
            messages.add(Map.of("role", "user", "content", userMessage));

            // Build request body
            Map<String, Object> request = new HashMap<>();
            request.put("model",       "openai/gpt-3.5-turbo");
            request.put("messages",    messages);
            request.put("max_tokens",  400);
            request.put("temperature", 0.7);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer " + apiKey);
            headers.set("HTTP-Referer", "http://localhost:3000");
            headers.set("X-Title", "Smart Campus Bot");

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);
            RestTemplate restTemplate = new RestTemplate();

            System.out.println("[ChatBot] Sending request to OpenRouter...");
            System.out.println("[ChatBot] API key prefix: " + (apiKey != null ? apiKey.substring(0, Math.min(12, apiKey.length())) + "..." : "NULL"));

            ResponseEntity<Map> response = restTemplate.postForEntity(OPENROUTER_URL, entity, Map.class);

            System.out.println("[ChatBot] Status: " + response.getStatusCode());
            System.out.println("[ChatBot] Body: " + response.getBody());

            @SuppressWarnings("unchecked")
            List<Map<String, Object>> choices = (List<Map<String, Object>>) response.getBody().get("choices");

            @SuppressWarnings("unchecked")
            Map<String, String> message = (Map<String, String>) choices.get(0).get("message");

            String reply = message.get("content");
            return ResponseEntity.ok(Map.of("reply", reply.trim()));

        } catch (org.springframework.web.client.HttpClientErrorException e) {
            System.err.println("[ChatBot] HTTP error: " + e.getStatusCode() + " — " + e.getResponseBodyAsString());
            return ResponseEntity.status(500).body(Map.of("reply", "API error: " + e.getStatusCode() + " — " + e.getResponseBodyAsString()));

        } catch (org.springframework.web.client.HttpServerErrorException e) {
            System.err.println("[ChatBot] Server error: " + e.getResponseBodyAsString());
            return ResponseEntity.status(500).body(Map.of("reply", "Server error: " + e.getResponseBodyAsString()));

        } catch (Exception e) {
            System.err.println("[ChatBot] Unexpected error: " + e.getClass().getName() + ": " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("reply", "Error: " + e.getMessage()));
        }
    }
}
