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
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.appdev.smartpark.dto.DTOMapper;
import com.appdev.smartpark.dto.ParkingRecordDTO;
import com.appdev.smartpark.dto.ParkingRecordRequestDTO;
import com.appdev.smartpark.entity.ParkingRecord;
import com.appdev.smartpark.entity.ParkingSlot;
import com.appdev.smartpark.entity.User;
import com.appdev.smartpark.entity.Vehicle;
import com.appdev.smartpark.service.ParkingRecordService;
import com.appdev.smartpark.service.ParkingSlotService;
import com.appdev.smartpark.service.UserService;
import com.appdev.smartpark.service.VehicleService;

@RestController
@RequestMapping("/api/parking-records")
@CrossOrigin(origins = "*")
public class ParkingRecordController {
    
    @Autowired
    private ParkingRecordService parkingRecordService;
    
    @Autowired
    private VehicleService vehicleService;
    
    @Autowired
    private ParkingSlotService parkingSlotService;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private DTOMapper dtoMapper;
    
    // Debug endpoint to check database contents
    @GetMapping("/debug/all")
    public ResponseEntity<?> debugAllRecords() {
        System.out.println("🔍 DEBUG: Checking all parking records in database");
        List<ParkingRecord> records = parkingRecordService.getAllParkingRecords();
        
        System.out.println("📊 Total records: " + records.size());
        records.forEach(record -> {
            System.out.println("\n--- Record ID: " + record.getRecordID() + " ---");
            System.out.println("   Entry Time: " + record.getEntryTime());
            System.out.println("   Exit Time: " + record.getExitTime());
            
            if (record.getParkingSlot() != null) {
                System.out.println("   Slot ID: " + record.getParkingSlot().getSlotID());
                System.out.println("   Slot Location: " + record.getParkingSlot().getLocation());
            } else {
                System.out.println("   ⚠️ Slot is NULL");
            }
            
            if (record.getVehicle() != null) {
                System.out.println("   Vehicle ID: " + record.getVehicle().getVehicleID());
                System.out.println("   Plate Number: " + record.getVehicle().getPlateNumber());
                if (record.getVehicle().getUser() != null) {
                    System.out.println("   Owner: " + record.getVehicle().getUser().getUserID());
                }
            } else {
                System.out.println("   ⚠️ Vehicle is NULL");
            }
            
            if (record.getVerifiedByUser() != null) {
                System.out.println("   Verified By: " + record.getVerifiedByUser().getFname() + " " + record.getVerifiedByUser().getLname());
            } else {
                System.out.println("   ⚠️ Verified By is NULL");
            }
        });
        
        return ResponseEntity.ok(Map.of(
            "totalRecords", records.size(),
            "message", "Check server logs for full details"
        ));
    }
    
    // Create parking record
    @PostMapping
    public ResponseEntity<?> createParkingRecord(
            @RequestBody ParkingRecordRequestDTO requestDTO,
            @org.springframework.web.bind.annotation.RequestParam(value = "skipNotification", defaultValue = "false") boolean skipNotification) {
        try {
            System.out.println("🚗 Received parking record request (skipNotification=" + skipNotification + "):");
            System.out.println("   Vehicle ID: " + requestDTO.getVehicleID());
            System.out.println("   Slot ID: " + requestDTO.getSlotID());
            System.out.println("   Entry Time: " + requestDTO.getEntryTime());
            System.out.println("   Exit Time: " + requestDTO.getExitTime());
            
            Vehicle vehicle = null;
            if (requestDTO.getVehicleID() != null) {
                Optional<Vehicle> vehicleOpt = vehicleService.getVehicleById(requestDTO.getVehicleID());
                if (vehicleOpt.isPresent()) {
                    vehicle = vehicleOpt.get();
                }
            }
            
            ParkingSlot slot = null;
            if (requestDTO.getSlotID() != null) {
                Optional<ParkingSlot> slotOpt = parkingSlotService.getParkingSlotById(requestDTO.getSlotID());
                if (slotOpt.isPresent()) {
                    slot = slotOpt.get();
                }
            }
            
            User verifiedByUser = null;
            if (requestDTO.getVerifiedByUserId() != null) {
                Optional<User> userOpt = userService.getUserById(requestDTO.getVerifiedByUserId());
                if (userOpt.isPresent()) {
                    verifiedByUser = userOpt.get();
                }
            }
            
            ParkingRecord parkingRecord = dtoMapper.toParkingRecordEntity(requestDTO, vehicle, slot, verifiedByUser);
            ParkingRecord savedRecord = parkingRecordService.createParkingRecord(parkingRecord, skipNotification);
            ParkingRecordDTO responseDTO = dtoMapper.toParkingRecordDTO(savedRecord);
            System.out.println("✅ Parking record created successfully with ID: " + savedRecord.getRecordID());
            return ResponseEntity.status(HttpStatus.CREATED).body(responseDTO);
        } catch (Exception e) {
            System.err.println("❌ Error creating parking record: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error creating parking record: " + e.getMessage()));
        }
    }
    
    // Get all parking records
    @GetMapping
    public ResponseEntity<List<ParkingRecordDTO>> getAllParkingRecords() {
        System.out.println("📋 GET /parking-records - Fetching all parking records");
        List<ParkingRecord> records = parkingRecordService.getAllParkingRecords();
        System.out.println("   Found " + records.size() + " records in database");
        
        List<ParkingRecordDTO> recordDTOs = records.stream()
                .peek(record -> System.out.println("   - Record ID: " + record.getRecordID() + 
                        ", Slot: " + (record.getParkingSlot() != null ? record.getParkingSlot().getLocation() : "NULL") +
                        ", EntryTime: " + record.getEntryTime() +
                        ", Vehicle: " + (record.getVehicle() != null ? record.getVehicle().getPlateNumber() : "NULL")))
                .map(dtoMapper::toParkingRecordDTO)
                .collect(Collectors.toList());
        
        System.out.println("   Returning " + recordDTOs.size() + " DTOs");
        return ResponseEntity.ok(recordDTOs);
    }
    
    // Get parking record by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getParkingRecordById(@PathVariable Integer id) {
        Optional<ParkingRecord> record = parkingRecordService.getParkingRecordById(id);
        if (record.isPresent()) {
            ParkingRecordDTO recordDTO = dtoMapper.toParkingRecordDTO(record.get());
            return ResponseEntity.ok(recordDTO);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Parking record not found"));
        }
    }
    
    // Get records by user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ParkingRecordDTO>> getRecordsByUser(@PathVariable String userId) {
        System.out.println("📋 GET /parking-records/user/" + userId + " - Fetching records for user");
        List<ParkingRecord> records = parkingRecordService.getParkingRecordsByUser(userId);
        System.out.println("   Found " + records.size() + " records for user " + userId);
        
        List<ParkingRecordDTO> recordDTOs = records.stream()
                .peek(record -> System.out.println("   - Record ID: " + record.getRecordID() + 
                        ", Slot: " + (record.getParkingSlot() != null ? record.getParkingSlot().getLocation() : "NULL") +
                        ", EntryTime: " + record.getEntryTime() +
                        ", Vehicle: " + (record.getVehicle() != null ? record.getVehicle().getPlateNumber() : "NULL")))
                .map(dtoMapper::toParkingRecordDTO)
                .collect(Collectors.toList());
        
        System.out.println("   Returning " + recordDTOs.size() + " DTOs");
        return ResponseEntity.ok(recordDTOs);
    }
    
    // Get records by vehicle
    @GetMapping("/vehicle/{vehicleId}")
    public ResponseEntity<List<ParkingRecordDTO>> getRecordsByVehicle(@PathVariable Integer vehicleId) {
        List<ParkingRecord> records = parkingRecordService.getParkingRecordsByVehicle(vehicleId);
        List<ParkingRecordDTO> recordDTOs = records.stream()
                .map(dtoMapper::toParkingRecordDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(recordDTOs);
    }
    
    // Get records by slot
    @GetMapping("/slot/{slotId}")
    public ResponseEntity<List<ParkingRecordDTO>> getRecordsBySlot(@PathVariable Integer slotId) {
        List<ParkingRecord> records = parkingRecordService.getParkingRecordsBySlot(slotId);
        List<ParkingRecordDTO> recordDTOs = records.stream()
                .map(dtoMapper::toParkingRecordDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(recordDTOs);
    }
    
    // Get active records
    @GetMapping("/active")
    public ResponseEntity<List<ParkingRecordDTO>> getActiveRecords() {
        List<ParkingRecord> records = parkingRecordService.getActiveRecords();
        List<ParkingRecordDTO> recordDTOs = records.stream()
                .map(dtoMapper::toParkingRecordDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(recordDTOs);
    }
    
    // Update parking record
    @PutMapping("/{id}")
    public ResponseEntity<?> updateParkingRecord(@PathVariable Integer id, @RequestBody ParkingRecordRequestDTO requestDTO) {
        try {
            Vehicle vehicle = null;
            if (requestDTO.getVehicleID() != null) {
                Optional<Vehicle> vehicleOpt = vehicleService.getVehicleById(requestDTO.getVehicleID());
                if (vehicleOpt.isPresent()) {
                    vehicle = vehicleOpt.get();
                }
            }
            
            ParkingSlot slot = null;
            if (requestDTO.getSlotID() != null) {
                Optional<ParkingSlot> slotOpt = parkingSlotService.getParkingSlotById(requestDTO.getSlotID());
                if (slotOpt.isPresent()) {
                    slot = slotOpt.get();
                }
            }
            
            User verifiedByUser = null;
            if (requestDTO.getVerifiedByUserId() != null) {
                Optional<User> userOpt = userService.getUserById(requestDTO.getVerifiedByUserId());
                if (userOpt.isPresent()) {
                    verifiedByUser = userOpt.get();
                }
            }
            
            ParkingRecord recordDetails = dtoMapper.toParkingRecordEntity(requestDTO, vehicle, slot, verifiedByUser);
            ParkingRecord updatedRecord = parkingRecordService.updateParkingRecord(id, recordDetails);
            ParkingRecordDTO responseDTO = dtoMapper.toParkingRecordDTO(updatedRecord);
            return ResponseEntity.ok(responseDTO);
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
            ParkingRecordDTO responseDTO = dtoMapper.toParkingRecordDTO(updatedRecord);
            return ResponseEntity.ok(responseDTO);
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
