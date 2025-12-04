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
import com.appdev.smartpark.dto.GuardDTO;
import com.appdev.smartpark.dto.GuardRequestDTO;
import com.appdev.smartpark.entity.Guard;
import com.appdev.smartpark.entity.User;
import com.appdev.smartpark.service.GuardService;
import com.appdev.smartpark.service.UserService;

@RestController
@RequestMapping("/api/guards")
@CrossOrigin(origins = "*")
public class GuardController {
    
    @Autowired
    private GuardService guardService;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private DTOMapper dtoMapper;
    
    // Create guard
    @PostMapping
    public ResponseEntity<?> createGuard(@RequestBody GuardRequestDTO requestDTO) {
        try {
            User verifiedBy = null;
            if (requestDTO.getVerifiedByUserID() != null) {
                Optional<User> user = userService.getUserById(requestDTO.getVerifiedByUserID());
                if (user.isPresent()) {
                    verifiedBy = user.get();
                }
            }
            Guard guard = dtoMapper.toGuardEntity(requestDTO, verifiedBy);
            Guard savedGuard = guardService.createGuard(guard);
            GuardDTO responseDTO = dtoMapper.toGuardDTO(savedGuard);
            return ResponseEntity.status(HttpStatus.CREATED).body(responseDTO);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error creating guard: " + e.getMessage()));
        }
    }
    
    // Get all guards
    @GetMapping
    public ResponseEntity<List<GuardDTO>> getAllGuards() {
        List<Guard> guards = guardService.getAllGuards();
        List<GuardDTO> guardDTOs = guards.stream()
                .map(dtoMapper::toGuardDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(guardDTOs);
    }
    
    // Get guard by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getGuardById(@PathVariable Integer id) {
        Optional<Guard> guard = guardService.getGuardById(id);
        if (guard.isPresent()) {
            GuardDTO guardDTO = dtoMapper.toGuardDTO(guard.get());
            return ResponseEntity.ok(guardDTO);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Guard not found"));
        }
    }
    
    // Update guard
    @PutMapping("/{id}")
    public ResponseEntity<?> updateGuard(@PathVariable Integer id, @RequestBody GuardRequestDTO requestDTO) {
        try {
            User verifiedBy = null;
            if (requestDTO.getVerifiedByUserID() != null) {
                Optional<User> user = userService.getUserById(requestDTO.getVerifiedByUserID());
                if (user.isPresent()) {
                    verifiedBy = user.get();
                }
            }
            Guard guardDetails = dtoMapper.toGuardEntity(requestDTO, verifiedBy);
            Guard updatedGuard = guardService.updateGuard(id, guardDetails);
            GuardDTO responseDTO = dtoMapper.toGuardDTO(updatedGuard);
            return ResponseEntity.ok(responseDTO);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", e.getMessage()));
        }
    }
    
    // Delete guard
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteGuard(@PathVariable Integer id) {
        try {
            guardService.deleteGuard(id);
            return ResponseEntity.ok(Map.of("message", "Guard deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error deleting guard: " + e.getMessage()));
        }
    }
}
