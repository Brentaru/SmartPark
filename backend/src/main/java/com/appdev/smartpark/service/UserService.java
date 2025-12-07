package com.appdev.smartpark.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.appdev.smartpark.entity.User;
import com.appdev.smartpark.repository.UserRepository;

@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    // Create
    public User registerUser(User user) {
        // Hash the password before saving
        if (user.getPassword() != null && !user.getPassword().isEmpty()) {
            String hashedPassword = passwordEncoder.encode(user.getPassword());
            user.setPassword(hashedPassword);
        }
        return userRepository.save(user);
    }
    
    // Read All
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    
    // Read One
    public Optional<User> getUserById(String id) {
        return userRepository.findById(id);
    }
    
    // Read One by Student ID
    public Optional<User> getUserByStudentId(String studentId) {
        return userRepository.findByStudentId(studentId);
    }
    
    // Read One by Plate Number
    public Optional<User> getUserByPlateNumber(String plateNumber) {
        return userRepository.findByPlateNumber(plateNumber);
    }
    
    // Update
    public User updateUser(String id, User userDetails) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        
        user.setFname(userDetails.getFname());
        user.setLname(userDetails.getLname());
        user.setEmail(userDetails.getEmail());
        
        // Only update password if it's provided and not a placeholder
        if (userDetails.getPassword() != null && 
            !userDetails.getPassword().isEmpty() && 
            !userDetails.getPassword().equals("UNCHANGED")) {
            // Hash the new password before saving
            String hashedPassword = passwordEncoder.encode(userDetails.getPassword());
            user.setPassword(hashedPassword);
        }
        
        user.setRole(userDetails.getRole());
        user.setContact(userDetails.getContact());
        
        // Update vehicle fields if provided
        if (userDetails.getPlateNumber() != null && !userDetails.getPlateNumber().isEmpty()) {
            user.setPlateNumber(userDetails.getPlateNumber());
        }
        if (userDetails.getVehicleType() != null && !userDetails.getVehicleType().isEmpty()) {
            user.setVehicleType(userDetails.getVehicleType());
        }
        if (userDetails.getVehicleColor() != null && !userDetails.getVehicleColor().isEmpty()) {
            user.setVehicleColor(userDetails.getVehicleColor());
        }
        
        return userRepository.save(user);
    }
    
    // Delete
    public void deleteUser(String id) {
        userRepository.deleteById(id);
    }
    
    // Login
    public Optional<User> login(String email, String password) {
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isPresent()) {
            String storedPassword = user.get().getPassword();
            // Check if password is BCrypt hashed (starts with $2a$ or $2b$)
            boolean isHashed = storedPassword != null && (storedPassword.startsWith("$2a$") || storedPassword.startsWith("$2b$"));
            
            if (isHashed) {
                // Use BCrypt to compare hashed password
                if (passwordEncoder.matches(password, storedPassword)) {
                    return user;
                }
            } else {
                // Plain-text comparison for legacy accounts
                if (storedPassword != null && storedPassword.equals(password)) {
                    return user;
                }
            }
        }
        return Optional.empty();
    }
    
    // Login by Student ID (now using userID)
    public Optional<User> loginByStudentId(String studentId, String password) {
        // First try to find by student_id column
        Optional<User> user = userRepository.findByStudentId(studentId);
        
        // If not found, try finding by userid (primary key)
        if (!user.isPresent()) {
            user = userRepository.findById(studentId);
        }
        
        if (user.isPresent()) {
            String storedPassword = user.get().getPassword();
            // Check if password is BCrypt hashed (starts with $2a$ or $2b$)
            boolean isHashed = storedPassword != null && (storedPassword.startsWith("$2a$") || storedPassword.startsWith("$2b$"));
            
            if (isHashed) {
                // Use BCrypt to compare hashed password
                if (passwordEncoder.matches(password, storedPassword)) {
                    return user;
                }
            } else {
                // Plain-text comparison for legacy accounts
                if (storedPassword != null && storedPassword.equals(password)) {
                    return user;
                }
            }
        }
        return Optional.empty();
    }
    
    // Check if email exists
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }
}
