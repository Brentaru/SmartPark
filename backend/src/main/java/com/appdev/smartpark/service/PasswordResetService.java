package com.appdev.smartpark.service;

import com.appdev.smartpark.entity.PasswordResetToken;
import com.appdev.smartpark.entity.User;
import com.appdev.smartpark.repository.PasswordResetTokenRepository;
import com.appdev.smartpark.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class PasswordResetService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordResetTokenRepository tokenRepository;
    
    @Autowired
    private EmailService emailService;

    @Value("${app.frontend-url:http://localhost:3000}")
    private String frontendUrl;
    
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    
    @Transactional
    public void initiatePasswordReset(String email) throws Exception {
        // Find user by email
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isEmpty()) {
            // Don't reveal if email exists or not for security
            return;
        }
        
        User user = userOptional.get();
        
        // Delete any existing tokens for this user
        tokenRepository.deleteByUser(user);
        
        // Generate unique token
        String token = UUID.randomUUID().toString();
        
        // Create token with 24 hour expiry
        LocalDateTime expiryDate = LocalDateTime.now().plusHours(24);
        PasswordResetToken resetToken = new PasswordResetToken(token, user, expiryDate);
        tokenRepository.save(resetToken);
        
        // Create reset link (frontend URL)
        String resetLink = frontendUrl.replaceAll("/+$", "") + "/reset-password?token=" + token;
        
        // Send email
        emailService.sendPasswordResetEmail(email, resetLink);
    }
    
    @Transactional
    public boolean resetPassword(String token, String newPassword) {
        Optional<PasswordResetToken> tokenOptional = tokenRepository.findByToken(token);
        
        if (tokenOptional.isEmpty()) {
            return false;
        }
        
        PasswordResetToken resetToken = tokenOptional.get();
        
        // Check if token is expired or already used
        if (resetToken.isExpired() || resetToken.isUsed()) {
            return false;
        }
        
        // Update user password
        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        
        // Mark token as used
        resetToken.setUsed(true);
        tokenRepository.save(resetToken);
        
        return true;
    }
    
    public boolean validateToken(String token) {
        Optional<PasswordResetToken> tokenOptional = tokenRepository.findByToken(token);
        
        if (tokenOptional.isEmpty()) {
            return false;
        }
        
        PasswordResetToken resetToken = tokenOptional.get();
        return !resetToken.isExpired() && !resetToken.isUsed();
    }
}
