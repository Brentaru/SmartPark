package com.appdev.smartpark.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Alternative Email Service using Gmail SMTP
 * This is more trusted by educational institutions than Brevo API
 * 
 * To enable Gmail SMTP:
 * 1. Uncomment the spring.mail.* properties in application.properties
 * 2. Generate a Gmail App Password at https://myaccount.google.com/apppasswords
 * 3. Replace EmailService with this service in PasswordResetService
 * 4. Restart the application
 */
@Service
public class GmailEmailService {
    
    private static final Logger logger = LoggerFactory.getLogger(GmailEmailService.class);
    
    @Autowired(required = false)
    private JavaMailSender mailSender;
    
    public void sendPasswordResetEmail(String toEmail, String resetLink) throws Exception {
        if (mailSender == null) {
            throw new Exception("Gmail SMTP is not configured. Please configure spring.mail.* properties in application.properties");
        }
        
        logger.info("Sending password reset email via Gmail SMTP to: {}", toEmail);
        
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        
        helper.setTo(toEmail);
        helper.setSubject("SmartPark - Password Reset Request");
        helper.setFrom("SmartPark <noreply@smartpark.com>");
        
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
        
        helper.setText(htmlContent, true);
        
        mailSender.send(message);
        
        logger.info("Password reset email successfully sent via Gmail SMTP to: {}", toEmail);
    }
}
