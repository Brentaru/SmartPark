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

import com.appdev.smartpark.entity.ParkingRecord;
import com.appdev.smartpark.service.ParkingRecordService;

@RestController
@RequestMapping("/api/parking-records")
@CrossOrigin(origins = "*")
public class ParkingRecordController {
    
    @Autowired
    private ParkingRecordService parkingRecordService;
    
    // Create parking record
    @PostMapping
    public ResponseEntity<?> createParkingRecord(@RequestBody ParkingRecord parkingRecord) {
        try {
            ParkingRecord savedRecord = parkingRecordService.createParkingRecord(parkingRecord);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedRecord);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error creating parking record: " + e.getMessage()));
        }
    }
    
    // Get all parking records
    @GetMapping
    public ResponseEntity<List<ParkingRecord>> getAllParkingRecords() {
        return ResponseEntity.ok(parkingRecordService.getAllParkingRecords());
    }
    
    // Get parking record by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getParkingRecordById(@PathVariable Integer id) {
        Optional<ParkingRecord> record = parkingRecordService.getParkingRecordById(id);
        if (record.isPresent()) {
            return ResponseEntity.ok(record.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Parking record not found"));
        }
    }
    
    // Get records by vehicle
    @GetMapping("/vehicle/{vehicleId}")
    public ResponseEntity<List<ParkingRecord>> getRecordsByVehicle(@PathVariable Integer vehicleId) {
        return ResponseEntity.ok(parkingRecordService.getParkingRecordsByVehicle(vehicleId));
    }
    
    // Get records by slot
    @GetMapping("/slot/{slotId}")
    public ResponseEntity<List<ParkingRecord>> getRecordsBySlot(@PathVariable Integer slotId) {
        return ResponseEntity.ok(parkingRecordService.getParkingRecordsBySlot(slotId));
    }
    
    // Get active records
    @GetMapping("/active")
    public ResponseEntity<List<ParkingRecord>> getActiveRecords() {
        return ResponseEntity.ok(parkingRecordService.getActiveRecords());
    }
    
    // Update parking record
    @PutMapping("/{id}")
    public ResponseEntity<?> updateParkingRecord(@PathVariable Integer id, @RequestBody ParkingRecord recordDetails) {
        try {
            ParkingRecord updatedRecord = parkingRecordService.updateParkingRecord(id, recordDetails);
            return ResponseEntity.ok(updatedRecord);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", e.getMessage()));
        }
    }
    
    // Update exit time (checkout)
    @PatchMapping("/{id}/checkout")
    public ResponseEntity<?> checkout(@PathVariable Integer id) {
        try {
            ParkingRecord updatedRecord = parkingRecordService.updateExitTime(id);
            return ResponseEntity.ok(updatedRecord);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", e.getMessage()));
        }
    }
    
    // Delete parking record
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteParkingRecord(@PathVariable Integer id) {
        try {
            parkingRecordService.deleteParkingRecord(id);
            return ResponseEntity.ok(Map.of("message", "Parking record deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error deleting parking record: " + e.getMessage()));
        }
    }
}
