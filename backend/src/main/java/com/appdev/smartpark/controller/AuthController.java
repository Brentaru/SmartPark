package com.appdev.smartpark.controller;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.appdev.smartpark.entity.User;
import com.appdev.smartpark.service.UserService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    
    @Autowired
    private UserService userService;
    
    /**
     * Register a new user
     * Expected request body:
     * {
     *   "id": "21-1234-567",          // Student/Faculty ID (optional - will use email as ID if not provided)
     *   "firstName": "John",
     *   "lastName": "Doe",
     *   "email": "john.doe@cit.edu",
     *   "contactNumber": "09123456789",
     *   "password": "Password123",
     *   "role": "student"
     * }
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> registrationData) {
        try {
            // Extract data from request
            String email = registrationData.get("email");
            String password = registrationData.get("password");
            String firstName = registrationData.get("firstName");
            String lastName = registrationData.get("lastName");
            String contactNumber = registrationData.get("contactNumber");
            String role = registrationData.getOrDefault("role", "student");
            
            // Validate required fields
            if (email == null || email.trim().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("success", false, "error", "Email is required"));
            }
            
            if (password == null || password.trim().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("success", false, "error", "Password is required"));
            }
            
            if (firstName == null || firstName.trim().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("success", false, "error", "First name is required"));
            }
            
            if (lastName == null || lastName.trim().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("success", false, "error", "Last name is required"));
            }
            
            // Check if email already exists
            if (userService.existsByEmail(email)) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(Map.of("success", false, "error", "Email already exists"));
            }
            
            // Create new user
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setPassword(password); // In production, this should be hashed
            newUser.setFname(firstName);
            newUser.setLname(lastName);
            newUser.setContact(contactNumber != null ? contactNumber : "");
            newUser.setRole(role);
            
            // Save user
            User savedUser = userService.registerUser(newUser);
            
            // Prepare response (don't send password back)
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("user", createUserResponse(savedUser));
            response.put("message", "Registration successful");
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("success", false, "error", "Error creating user: " + e.getMessage()));
        }
    }
    
    /**
     * Login user
     * Expected request body:
     * {
     *   "id": "john.doe@cit.edu",  // Can be email or student ID
     *   "password": "Password123"
     * }
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        try {
            String id = credentials.get("id");
            String password = credentials.get("password");
            
            // Validate required fields
            if (id == null || id.trim().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("success", false, "error", "ID/Email is required"));
            }
            
            if (password == null || password.trim().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("success", false, "error", "Password is required"));
            }
            
            // Try to login using email (treating 'id' as email)
            Optional<User> userOptional = userService.login(id, password);
            
            if (userOptional.isPresent()) {
                User user = userOptional.get();
                
                // Prepare response (don't send password back)
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("user", createUserResponse(user));
                response.put("message", "Login successful");
                
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("success", false, "error", "Invalid credentials"));
            }
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("success", false, "error", "Error during login: " + e.getMessage()));
        }
    }
    
    /**
     * Helper method to create user response without password
     */
    private Map<String, Object> createUserResponse(User user) {
        Map<String, Object> userMap = new HashMap<>();
        userMap.put("id", user.getUserID());
        userMap.put("userID", user.getUserID());
        userMap.put("firstName", user.getFname());
        userMap.put("lastName", user.getLname());
        userMap.put("email", user.getEmail());
        userMap.put("role", user.getRole());
        userMap.put("contact", user.getContact());
        return userMap;
    }
}
