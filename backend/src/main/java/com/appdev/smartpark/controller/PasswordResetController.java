package com.appdev.smartpark.controller;

import com.appdev.smartpark.dto.ForgotPasswordRequestDTO;
import com.appdev.smartpark.dto.ResetPasswordRequestDTO;
import com.appdev.smartpark.service.PasswordResetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/password")
public class PasswordResetController {
    
    @Autowired
    private PasswordResetService passwordResetService;
    
    @PostMapping("/forgot")
    public ResponseEntity<Map<String, Object>> forgotPassword(@RequestBody ForgotPasswordRequestDTO request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            passwordResetService.initiatePasswordReset(request.getEmail());
            response.put("success", true);
            response.put("message", "If your email exists in our system, you will receive password reset instructions.");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", "Failed to process password reset request. Please try again.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    @PostMapping("/reset")
    public ResponseEntity<Map<String, Object>> resetPassword(@RequestBody ResetPasswordRequestDTO request) {
        Map<String, Object> response = new HashMap<>();
        
        boolean success = passwordResetService.resetPassword(request.getToken(), request.getNewPassword());
        
        if (success) {
            response.put("success", true);
            response.put("message", "Password has been reset successfully.");
            return ResponseEntity.ok(response);
        } else {
            response.put("success", false);
            response.put("error", "Invalid or expired reset token.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
    
    @GetMapping("/validate-token")
    public ResponseEntity<Map<String, Object>> validateToken(@RequestParam String token) {
        Map<String, Object> response = new HashMap<>();
        
        boolean valid = passwordResetService.validateToken(token);
        response.put("valid", valid);
        
        return ResponseEntity.ok(response);
    }
}
