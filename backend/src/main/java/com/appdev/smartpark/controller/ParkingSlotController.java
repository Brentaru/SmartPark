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
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.appdev.smartpark.entity.ParkingSlot;
import com.appdev.smartpark.service.ParkingSlotService;

@RestController
@RequestMapping("/api/parking-slots")
@CrossOrigin(origins = "*")
public class ParkingSlotController {
    
    @Autowired
    private ParkingSlotService parkingSlotService;
    
    // Create parking slot
    @PostMapping
    public ResponseEntity<?> createParkingSlot(@RequestBody ParkingSlot parkingSlot) {
        try {
            ParkingSlot savedSlot = parkingSlotService.createParkingSlot(parkingSlot);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedSlot);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error creating parking slot: " + e.getMessage()));
        }
    }
    
    // Get all parking slots
    @GetMapping
    public ResponseEntity<List<ParkingSlot>> getAllParkingSlots() {
        return ResponseEntity.ok(parkingSlotService.getAllParkingSlots());
    }
    
    // Get parking slot by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getParkingSlotById(@PathVariable Integer id) {
        Optional<ParkingSlot> slot = parkingSlotService.getParkingSlotById(id);
        if (slot.isPresent()) {
            return ResponseEntity.ok(slot.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Parking slot not found"));
        }
    }
    
    // Get slots by status
    @GetMapping("/status/{status}")
    public ResponseEntity<List<ParkingSlot>> getSlotsByStatus(@PathVariable String status) {
        return ResponseEntity.ok(parkingSlotService.getParkingSlotsByStatus(status));
    }
    
    // Get available slots
    @GetMapping("/available")
    public ResponseEntity<List<ParkingSlot>> getAvailableSlots() {
        return ResponseEntity.ok(parkingSlotService.getAvailableSlots());
    }
    
    // Get slots by area
    @GetMapping("/area/{areaId}")
    public ResponseEntity<List<ParkingSlot>> getSlotsByArea(@PathVariable Integer areaId) {
        return ResponseEntity.ok(parkingSlotService.getParkingSlotsByArea(areaId));
    }
    
    // Update parking slot
    @PutMapping("/{id}")
    public ResponseEntity<?> updateParkingSlot(@PathVariable Integer id, @RequestBody ParkingSlot slotDetails) {
        try {
            ParkingSlot updatedSlot = parkingSlotService.updateParkingSlot(id, slotDetails);
            return ResponseEntity.ok(updatedSlot);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", e.getMessage()));
        }
    }
    
    // Update slot status only
    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateSlotStatus(@PathVariable Integer id, @RequestBody Map<String, String> body) {
        try {
            String status = body.get("status");
            ParkingSlot updatedSlot = parkingSlotService.updateSlotStatus(id, status);
            return ResponseEntity.ok(updatedSlot);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", e.getMessage()));
        }
    }
    
    // Delete parking slot
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteParkingSlot(@PathVariable Integer id) {
        try {
            parkingSlotService.deleteParkingSlot(id);
            return ResponseEntity.ok(Map.of("message", "Parking slot deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error deleting parking slot: " + e.getMessage()));
        }
    }
}
