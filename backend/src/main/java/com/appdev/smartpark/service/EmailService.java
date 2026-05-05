package com.appdev.smartpark.service;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import org.json.JSONObject;
import org.json.JSONArray;

@Service
public class EmailService {
    
    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);
    
    private static final String BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

    @Value("${app.brevo.api-key:}")
    private String brevoApiKey;

    @Value("${app.email.sender:}")
    private String senderEmail;

    @Value("${app.email.sender-name:SmartPark}")
    private String senderName;
    
    public void sendPasswordResetEmail(String toEmail, String resetLink) throws Exception {
        if (brevoApiKey == null || brevoApiKey.isBlank() || senderEmail == null || senderEmail.isBlank()) {
            throw new Exception("Email service is not configured. Set BREVO_API_KEY and EMAIL_SENDER.");
        }

        HttpClient client = HttpClient.newHttpClient();
        
        // Create email JSON payload
        JSONObject emailJson = new JSONObject();
        
        // Sender
        JSONObject sender = new JSONObject();
        sender.put("email", senderEmail);
        sender.put("name", senderName);
        emailJson.put("sender", sender);
        
        // Recipient
        JSONArray to = new JSONArray();
        JSONObject recipient = new JSONObject();
        recipient.put("email", toEmail);
        to.put(recipient);
        emailJson.put("to", to);
        
        // Subject
        emailJson.put("subject", "SmartPark - Password Reset Request");
        
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
                        padding: 48px 32px;
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
                        font-size: 28px;
                        font-weight: 600;
                        margin: 0;
                    }
                    .content { 
                        padding: 48px 32px;
                        background: white;
                    }
                    .content h2 {
                        font-size: 24px;
                        font-weight: 600;
                        color: #111827;
                        margin-bottom: 16px;
                    }
                    .content p {
                        color: #4b5563;
                        margin-bottom: 16px;
                        font-size: 16px;
                    }
                    .button-container {
                        text-align: center;
                        margin: 32px 0;
                    }
                    .button { 
                        display: inline-block;
                        padding: 16px 48px;
                        background: linear-gradient(135deg, #dc2626 0%%, #991b1b 100%%);
                        color: white;
                        text-decoration: none;
                        border-radius: 12px;
                        font-weight: 600;
                        font-size: 16px;
                        box-shadow: 0 4px 6px rgba(220, 38, 38, 0.3);
                        transition: transform 0.2s;
                    }
                    .button:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 6px 8px rgba(220, 38, 38, 0.4);
                    }
                    .info-box { 
                        background: #fef2f2;
                        border-left: 4px solid #dc2626;
                        padding: 20px;
                        margin: 24px 0;
                        border-radius: 8px;
                    }
                    .info-box strong {
                        display: flex;
                        align-items: center;
                        color: #991b1b;
                        font-size: 16px;
                        margin-bottom: 12px;
                    }
                    .info-box ul {
                        margin-left: 20px;
                        color: #7f1d1d;
                    }
                    .info-box li {
                        margin: 8px 0;
                        font-size: 14px;
                    }
                    .link-box {
                        background: #f9fafb;
                        border: 1px solid #e5e7eb;
                        border-radius: 8px;
                        padding: 16px;
                        margin: 24px 0;
                    }
                    .link-box p {
                        color: #6b7280;
                        font-size: 14px;
                        margin-bottom: 8px;
                    }
                    .link-text {
                        word-break: break-all;
                        color: #dc2626;
                        font-size: 14px;
                        font-family: monospace;
                    }
                    .footer { 
                        background: #f9fafb;
                        text-align: center;
                        padding: 32px;
                        border-top: 1px solid #e5e7eb;
                    }
                    .footer p {
                        color: #6b7280;
                        font-size: 14px;
                        margin: 8px 0;
                    }
                    .divider {
                        height: 1px;
                        background: #e5e7eb;
                        margin: 32px 0;
                    }
                </style>
            </head>
            <body>
                <div class="email-wrapper">
                    <div class="header">
                        <div class="logo">S</div>
                        <h1>SmartPark Password Reset</h1>
                    </div>
                    <div class="content">
                        <h2>Reset Your Password</h2>
                        <p>We received a request to reset your password for your SmartPark account.</p>
                        <p>Click the button below to create a new password:</p>
                        
                        <div class="button-container">
                            <a href="%s" class="button">Reset Password</a>
                        </div>
                        
                        <div class="info-box">
                            <strong>⚠️ Security Notice</strong>
                            <ul>
                                <li>This link will expire in 24 hours</li>
                                <li>If you didn't request this, please ignore this email</li>
                                <li>Never share this link with anyone</li>
                            </ul>
                        </div>
                        
                        <div class="divider"></div>
                        
                        <div class="link-box">
                            <p>Or copy and paste this link into your browser:</p>
                            <div class="link-text">%s</div>
                        </div>
                    </div>
                    <div class="footer">
                        <p>This is an automated message from SmartPark.</p>
                        <p>Please do not reply to this email.</p>
                        <p style="margin-top: 16px;">&copy; 2025 SmartPark. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
            """, resetLink, resetLink);
        
        emailJson.put("htmlContent", htmlContent);
        
        // Create HTTP request
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(BREVO_API_URL))
            .header("accept", "application/json")
            .header("content-type", "application/json")
            .header("api-key", brevoApiKey)
            .POST(HttpRequest.BodyPublishers.ofString(emailJson.toString()))
            .build();
        
        // Send request
        logger.info("Sending password reset email to: {}", toEmail);
        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        
        logger.info("Brevo API Response - Status: {}, Body: {}", response.statusCode(), response.body());
        
        if (response.statusCode() != 201 && response.statusCode() != 200) {
            logger.error("Failed to send email to {}. Status: {}, Response: {}", toEmail, response.statusCode(), response.body());
            throw new Exception("Failed to send email: " + response.body());
        }
        
        logger.info("Password reset email successfully sent to: {}", toEmail);
    }
}
