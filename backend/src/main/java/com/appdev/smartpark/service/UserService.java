package com.appdev.smartpark.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.appdev.smartpark.entity.User;
import com.appdev.smartpark.repository.UserRepository;

@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    // Create
    public User registerUser(User user) {
        return userRepository.save(user);
    }
    
    // Read All
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    
    // Read One
    public Optional<User> getUserById(Integer id) {
        return userRepository.findById(id);
    }
    
    // Update
    public User updateUser(Integer id, User userDetails) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        
        user.setFname(userDetails.getFname());
        user.setLname(userDetails.getLname());
        user.setEmail(userDetails.getEmail());
        user.setPassword(userDetails.getPassword());
        user.setRole(userDetails.getRole());
        user.setContact(userDetails.getContact());
        
        return userRepository.save(user);
    }
    
    // Delete
    public void deleteUser(Integer id) {
        userRepository.deleteById(id);
    }
    
    // Login
    public Optional<User> login(String email, String password) {
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isPresent() && user.get().getPassword().equals(password)) {
            return user;
        }
        return Optional.empty();
    }
    
    // Check if email exists
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }
}
