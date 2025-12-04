package com.appdev.smartpark.controller;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.appdev.smartpark.dto.DTOMapper;
import com.appdev.smartpark.dto.UserDTO;
import com.appdev.smartpark.dto.UserRequestDTO;
import com.appdev.smartpark.entity.User;
import com.appdev.smartpark.service.UserService;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private DTOMapper dtoMapper;
    
    // Register new user
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody UserRequestDTO requestDTO) {
        try {
            if (userService.existsByEmail(requestDTO.getEmail())) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(Map.of("message", "Email already exists"));
            }
            // Convert DTO to Entity
            User user = dtoMapper.toUserEntity(requestDTO);
            // Set userID to be the same as studentId (the actual ID like 99-9999-999)
            user.setUserID(requestDTO.getStudentId());
            User savedUser = userService.registerUser(user);
            // Convert Entity back to DTO (password excluded!)
            UserDTO responseDTO = dtoMapper.toUserDTO(savedUser);
            return ResponseEntity.status(HttpStatus.CREATED).body(responseDTO);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error creating user: " + e.getMessage()));
        }
    }
    
    // Login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        try {
            String studentId = credentials.get("studentId");
            String password = credentials.get("password");
            
            Optional<User> user = userService.loginByStudentId(studentId, password);
            if (user.isPresent()) {
                // Convert to DTO to exclude password
                UserDTO userDTO = dtoMapper.toUserDTO(user.get());
                return ResponseEntity.ok(userDTO);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "Invalid Student ID or password"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error during login: " + e.getMessage()));
        }
    }
    
    // Get all users
    @GetMapping
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        // Convert all users to DTOs (passwords excluded)
        List<UserDTO> userDTOs = users.stream()
                .map(dtoMapper::toUserDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(userDTOs);
    }
    
    // Get user by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable String id) {
        Optional<User> user = userService.getUserById(id);
        if (user.isPresent()) {
            UserDTO userDTO = dtoMapper.toUserDTO(user.get());
            return ResponseEntity.ok(userDTO);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "User not found"));
        }
    }
    
    // Get user by student ID
    @GetMapping("/student/{studentId}")
    public ResponseEntity<?> getUserByStudentId(@PathVariable String studentId) {
        Optional<User> user = userService.getUserByStudentId(studentId);
        if (user.isPresent()) {
            UserDTO userDTO = dtoMapper.toUserDTO(user.get());
            return ResponseEntity.ok(userDTO);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "User not found with student ID: " + studentId));
        }
    }
    
    // Get user by plate number
    @GetMapping("/plate/{plateNumber}")
    public ResponseEntity<?> getUserByPlateNumber(@PathVariable String plateNumber) {
        Optional<User> user = userService.getUserByPlateNumber(plateNumber);
        if (user.isPresent()) {
            UserDTO userDTO = dtoMapper.toUserDTO(user.get());
            return ResponseEntity.ok(userDTO);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "User not found with plate number: " + plateNumber));
        }
    }
    
    // Update user
    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable String id, @RequestBody UserRequestDTO userDetails) {
        try {
            User user = dtoMapper.toUserEntity(userDetails);
            User updatedUser = userService.updateUser(id, user);
            UserDTO responseDTO = dtoMapper.toUserDTO(updatedUser);
            return ResponseEntity.ok(responseDTO);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", e.getMessage()));
        }
    }
    
    // Delete user
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable String id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.ok(Map.of("message", "User deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error deleting user: " + e.getMessage()));
        }
    }
}
