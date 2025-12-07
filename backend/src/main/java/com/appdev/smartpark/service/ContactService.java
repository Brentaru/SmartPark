package com.appdev.smartpark.service;

import com.appdev.smartpark.dto.ContactFormDTO;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import org.json.JSONObject;
import org.json.JSONArray;

@Service
public class ContactService {
    
    private static final Logger logger = LoggerFactory.getLogger(ContactService.class);
    private static final String BREVO_API_KEY = "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";
    private static final String BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";
    private static final String SENDER_EMAIL = "brentunabia11@gmail.com";
    private static final String SENDER_NAME = "SmartPark Contact Form";
    private static final String RECIPIENT_EMAIL = "brentunabia11@gmail.com";
    
    public void sendContactEmail(ContactFormDTO contactForm) throws Exception {
        HttpClient client = HttpClient.newHttpClient();
        
        // Create email JSON payload
        JSONObject emailJson = new JSONObject();
        
        // Sender
        JSONObject sender = new JSONObject();
        sender.put("email", SENDER_EMAIL);
        sender.put("name", SENDER_NAME);
        emailJson.put("sender", sender);
        
        // Recipient
        JSONArray to = new JSONArray();
        JSONObject recipient = new JSONObject();
        recipient.put("email", RECIPIENT_EMAIL);
        to.put(recipient);
        emailJson.put("to", to);
        
        // Reply-to (user's email)
        JSONObject replyTo = new JSONObject();
        replyTo.put("email", contactForm.getEmail());
        replyTo.put("name", contactForm.getName());
        emailJson.put("replyTo", replyTo);
        
        // Subject
        emailJson.put("subject", "SmartPark Contact Form - Message from " + contactForm.getName());
        
        // HTML Content
        String htmlContent = String.format("""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body { 
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                        line-height: 1.6; 
                        color: #1f2937;
                        background-color: #f3f4f6;
                        padding: 40px 20px;
                    }
                    .email-wrapper { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
                    .header { 
                        background: linear-gradient(135deg, #dc2626 0%%, #991b1b 100%%);
                        padding: 32px;
                        text-align: center;
                    }
                    .logo { 
                        width: 64px;
                        height: 64px;
                        background: white;
                        border-radius: 50%%;
                        display: inline-flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 32px;
                        font-weight: bold;
                        color: #dc2626;
                        margin-bottom: 16px;
                    }
                    .header h1 { 
                        color: white;
                        font-size: 24px;
                        font-weight: 600;
                        margin: 0;
                    }
                    .content { 
                        padding: 32px;
                        background: white;
                    }
                    .info-box {
                        background: #f9fafb;
                        border: 1px solid #e5e7eb;
                        border-radius: 8px;
                        padding: 16px;
                        margin-bottom: 20px;
                    }
                    .info-box p {
                        margin: 8px 0;
                        color: #4b5563;
                    }
                    .info-box strong {
                        color: #111827;
                    }
                    .message-box {
                        background: #fef2f2;
                        border-left: 4px solid #dc2626;
                        padding: 20px;
                        margin: 20px 0;
                        border-radius: 8px;
                    }
                    .message-box p {
                        color: #1f2937;
                        white-space: pre-wrap;
                        word-wrap: break-word;
                    }
                    .footer { 
                        background: #f9fafb;
                        text-align: center;
                        padding: 24px;
                        border-top: 1px solid #e5e7eb;
                    }
                    .footer p {
                        color: #6b7280;
                        font-size: 14px;
                    }
                </style>
            </head>
            <body>
                <div class="email-wrapper">
                    <div class="header">
                        <div class="logo">S</div>
                        <h1>New Contact Form Message</h1>
                    </div>
                    <div class="content">
                        <div class="info-box">
                            <p><strong>From:</strong> %s</p>
                            <p><strong>Email:</strong> %s</p>
                        </div>
                        
                        <h3 style="color: #111827; margin-bottom: 12px;">Message:</h3>
                        <div class="message-box">
                            <p>%s</p>
                        </div>
                        
                        <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">
                            You can reply directly to this email to respond to %s.
                        </p>
                    </div>
                    <div class="footer">
                        <p>This message was sent via the SmartPark contact form.</p>
                        <p>&copy; 2025 SmartPark. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
            """, 
            contactForm.getName(), 
            contactForm.getEmail(), 
            contactForm.getMessage().replace("\n", "<br>"),
            contactForm.getName()
        );
        
        emailJson.put("htmlContent", htmlContent);
        
        // Create HTTP request
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(BREVO_API_URL))
            .header("accept", "application/json")
            .header("content-type", "application/json")
            .header("api-key", BREVO_API_KEY)
            .POST(HttpRequest.BodyPublishers.ofString(emailJson.toString()))
            .build();
        
        // Send request
        logger.info("Sending contact form email from: {} ({})", contactForm.getName(), contactForm.getEmail());
        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        
        logger.info("Brevo API Response - Status: {}, Body: {}", response.statusCode(), response.body());
        
        if (response.statusCode() != 201 && response.statusCode() != 200) {
            logger.error("Failed to send contact email. Status: {}, Response: {}", response.statusCode(), response.body());
            throw new Exception("Failed to send email: " + response.body());
        }
        
        logger.info("Contact form email successfully sent from: {}", contactForm.getEmail());
    }
}
