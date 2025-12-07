package com.appdev.smartpark.controller;

import com.appdev.smartpark.dto.ContactFormDTO;
import com.appdev.smartpark.service.ContactService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/contact")
@CrossOrigin(origins = "http://localhost:3000")
public class ContactController {

    @Autowired
    private ContactService contactService;

    @PostMapping
    public ResponseEntity<Map<String, Object>> submitContactForm(@RequestBody ContactFormDTO contactForm) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            contactService.sendContactEmail(contactForm);
            response.put("success", true);
            response.put("message", "Message sent successfully!");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", "Failed to send message: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
}
