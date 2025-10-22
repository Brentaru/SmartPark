package com.appdev.smartpark.controller;

import java.util.List;
import java.util.Map;
import java.util.Optional;

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

import com.appdev.smartpark.entity.Guard;
import com.appdev.smartpark.service.GuardService;

@RestController
@RequestMapping("/api/guards")
@CrossOrigin(origins = "*")
public class GuardController {
    
    @Autowired
    private GuardService guardService;
    
    // Create guard
    @PostMapping
    public ResponseEntity<?> createGuard(@RequestBody Guard guard) {
        try {
            Guard savedGuard = guardService.createGuard(guard);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedGuard);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error creating guard: " + e.getMessage()));
        }
    }
    
    // Get all guards
    @GetMapping
    public ResponseEntity<List<Guard>> getAllGuards() {
        return ResponseEntity.ok(guardService.getAllGuards());
    }
    
    // Get guard by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getGuardById(@PathVariable Integer id) {
        Optional<Guard> guard = guardService.getGuardById(id);
        if (guard.isPresent()) {
            return ResponseEntity.ok(guard.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Guard not found"));
        }
    }
    
    // Update guard
    @PutMapping("/{id}")
    public ResponseEntity<?> updateGuard(@PathVariable Integer id, @RequestBody Guard guardDetails) {
        try {
            Guard updatedGuard = guardService.updateGuard(id, guardDetails);
            return ResponseEntity.ok(updatedGuard);
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
