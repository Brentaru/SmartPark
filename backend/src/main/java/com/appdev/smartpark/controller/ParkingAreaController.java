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

import com.appdev.smartpark.entity.ParkingArea;
import com.appdev.smartpark.service.ParkingAreaService;

@RestController
@RequestMapping("/api/parking-areas")
@CrossOrigin(origins = "*")
public class ParkingAreaController {
    
    @Autowired
    private ParkingAreaService parkingAreaService;
    
    // Create parking area
    @PostMapping
    public ResponseEntity<?> createParkingArea(@RequestBody ParkingArea parkingArea) {
        try {
            ParkingArea savedArea = parkingAreaService.createParkingArea(parkingArea);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedArea);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error creating parking area: " + e.getMessage()));
        }
    }
    
    // Get all parking areas
    @GetMapping
    public ResponseEntity<List<ParkingArea>> getAllParkingAreas() {
        return ResponseEntity.ok(parkingAreaService.getAllParkingAreas());
    }
    
    // Get parking area by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getParkingAreaById(@PathVariable Integer id) {
        Optional<ParkingArea> area = parkingAreaService.getParkingAreaById(id);
        if (area.isPresent()) {
            return ResponseEntity.ok(area.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Parking area not found"));
        }
    }
    
    // Update parking area
    @PutMapping("/{id}")
    public ResponseEntity<?> updateParkingArea(@PathVariable Integer id, @RequestBody ParkingArea areaDetails) {
        try {
            ParkingArea updatedArea = parkingAreaService.updateParkingArea(id, areaDetails);
            return ResponseEntity.ok(updatedArea);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", e.getMessage()));
        }
    }
    
    // Delete parking area
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteParkingArea(@PathVariable Integer id) {
        try {
            parkingAreaService.deleteParkingArea(id);
            return ResponseEntity.ok(Map.of("message", "Parking area deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error deleting parking area: " + e.getMessage()));
        }
    }
}
