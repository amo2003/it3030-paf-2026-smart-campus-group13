package backend.Module_2.Controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin("*")
public class ChatController {
    private String openRouterApiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    // System prompt — tells AI to act as Smart Campus assistant
    private static final String SYSTEM_PROMPT =
            "You are a helpful assistant for the Smart Campus Operations Hub at SLIIT university. " +
                    "You help users with booking facilities like lecture halls, labs, meeting rooms and equipment. " +
                    "The booking workflow is: PENDING → APPROVED/REJECTED. Approved bookings can be CANCELLED. " +
                    "The system prevents scheduling conflicts. Admin can approve or reject bookings with a reason. " +
                    "Keep your answers short, friendly, and relevant to campus facility bookings only. " +
                    "Use emojis where appropriate. If asked about unrelated topics, politely redirect to booking help.";

    @PostMapping("/ask")
    public ResponseEntity<Map<String, String>> ask(@RequestBody Map<String, String> body) {
        String message  = body.getOrDefault("message", "").trim();
        String step     = body.getOrDefault("step", "start");
        String userName = body.getOrDefault("userName", "");

        String reply;
        String nextStep;

        try {
            switch (step) {

                case "start":
                    if (message.toLowerCase().contains("hi") || message.toLowerCase().contains("hello")) {
                        reply    = "Hi 👋 What is your name?";
                        nextStep = "getName";
                    } else {
                        reply    = "Please type 'Hi' to start the chat.";
                        nextStep = "start";
                    }
                    break;

                case "getName":
                    reply    = "Nice to meet you, " + message + "! 😊 How can I help you today?\n\n" +
                            "1️⃣ How to create a booking\n" +
                            "2️⃣ How to cancel a booking\n" +
                            "3️⃣ Booking approval process\n" +
                            "4️⃣ Ask me anything about bookings";
                    nextStep = "showOptions";
                    break;

                case "showOptions":
                    String lower = message.toLowerCase();
                    if (message.equals("1") || lower.contains("create") || lower.contains("book")) {
                        reply    = callOpenRouter(userName, "Explain how to create a booking in the Smart Campus system step by step.");
                        nextStep = "end";
                    } else if (message.equals("2") || lower.contains("cancel")) {
                        reply    = callOpenRouter(userName, "Explain how to cancel a booking in the Smart Campus system.");
                        nextStep = "end";
                    } else if (message.equals("3") || lower.contains("approv") || lower.contains("reject")) {
                        reply    = callOpenRouter(userName, "Explain the booking approval workflow: PENDING, APPROVED, REJECTED, CANCELLED.");
                        nextStep = "end";
                    } else if (message.equals("4")) {
                        reply    = callOpenRouter(userName, message);
                        nextStep = "end";
                    } else {
                        reply    = "Please select option 1, 2, 3 or type your question for option 4.";
                        nextStep = "showOptions";
                    }
                    break;

                case "end":
                    // Free chat — send directly to AI
                    if (message.toLowerCase().contains("hi") || message.toLowerCase().contains("restart")) {
                        reply    = "Sure! Let's start again. What is your name?";
                        nextStep = "getName";
                    } else {
                        reply    = callOpenRouter(userName, message);
                        nextStep = "end";
                    }
                    break;

                default:
                    reply    = "Please type 'Hi' to start the chat.";
                    nextStep = "start";
            }

        } catch (Exception e) {
            reply    = "Sorry, I'm having trouble connecting right now. Please try again.";
            nextStep = step;
        }

        Map<String, String> response = new HashMap<>();
        response.put("reply",    reply);
        response.put("nextStep", nextStep);
        return ResponseEntity.ok(response);
    }

    private String callOpenRouter(String userName, String userMessage) {
        String url = "https://openrouter.ai/api/v1/chat/completions";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + openRouterApiKey);
        headers.set("HTTP-Referer", "http://localhost:3000");
        headers.set("X-Title", "Smart Campus Bot");

        Map<String, Object> systemMsg = new HashMap<>();
        systemMsg.put("role",    "system");
        systemMsg.put("content", SYSTEM_PROMPT);

        Map<String, Object> userMsg = new HashMap<>();
        userMsg.put("role",    "user");
        userMsg.put("content", (userName.isEmpty() ? "" : "User name: " + userName + ". ") + userMessage);

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model",    "openai/gpt-3.5-turbo");
        requestBody.put("messages", List.of(systemMsg, userMsg));

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);

        // Parse response
        List<Map<String, Object>> choices = (List<Map<String, Object>>) response.getBody().get("choices");
        Map<String, Object> firstChoice   = choices.get(0);
        Map<String, Object> msgObj        = (Map<String, Object>) firstChoice.get("message");
        return msgObj.get("content").toString().trim();
    }
}
