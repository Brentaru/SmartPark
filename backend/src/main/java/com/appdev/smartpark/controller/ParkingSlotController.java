package com.appdev.smartpark.controller;

import java.time.LocalDateTime;
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
import com.appdev.smartpark.dto.ParkingSlotDTO;
import com.appdev.smartpark.dto.ParkingSlotRequestDTO;
import com.appdev.smartpark.entity.ParkingArea;
import com.appdev.smartpark.entity.ParkingRecord;
import com.appdev.smartpark.entity.ParkingSlot;
import com.appdev.smartpark.entity.Vehicle;
import com.appdev.smartpark.service.ParkingAreaService;
import com.appdev.smartpark.service.ParkingRecordService;
import com.appdev.smartpark.service.ParkingSlotService;
import com.appdev.smartpark.service.VehicleService;

@RestController
@RequestMapping("/api/parking-slots")
@CrossOrigin(origins = "*")
public class ParkingSlotController {
    
    @Autowired
    private ParkingSlotService parkingSlotService;
    
    @Autowired
    private ParkingAreaService parkingAreaService;
    
    @Autowired
    private ParkingRecordService parkingRecordService;
    
    @Autowired
    private VehicleService vehicleService;
    
    @Autowired
    private DTOMapper dtoMapper;
    
    // Create parking slot
    @PostMapping
    public ResponseEntity<?> createParkingSlot(@RequestBody ParkingSlotRequestDTO requestDTO) {
        try {
            ParkingArea area = null;
            if (requestDTO.getAreaID() != null) {
                Optional<ParkingArea> areaOpt = parkingAreaService.getParkingAreaById(requestDTO.getAreaID());
                if (areaOpt.isPresent()) {
                    area = areaOpt.get();
                }
            }
            ParkingSlot parkingSlot = dtoMapper.toParkingSlotEntity(requestDTO, area);
            ParkingSlot savedSlot = parkingSlotService.createParkingSlot(parkingSlot);
            ParkingSlotDTO responseDTO = dtoMapper.toParkingSlotDTO(savedSlot);
            return ResponseEntity.status(HttpStatus.CREATED).body(responseDTO);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error creating parking slot: " + e.getMessage()));
        }
    }
    
    // Get all parking slots
    @GetMapping
    public ResponseEntity<List<ParkingSlotDTO>> getAllParkingSlots() {
        List<ParkingSlot> slots = parkingSlotService.getAllParkingSlots();
        List<ParkingSlotDTO> slotDTOs = slots.stream()
                .map(dtoMapper::toParkingSlotDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(slotDTOs);
    }
    
    // Get parking slot by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getParkingSlotById(@PathVariable Integer id) {
        Optional<ParkingSlot> slot = parkingSlotService.getParkingSlotById(id);
        if (slot.isPresent()) {
            ParkingSlotDTO slotDTO = dtoMapper.toParkingSlotDTO(slot.get());
            return ResponseEntity.ok(slotDTO);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Parking slot not found"));
        }
    }
    
    // Get slots by status
    @GetMapping("/status/{status}")
    public ResponseEntity<List<ParkingSlotDTO>> getSlotsByStatus(@PathVariable String status) {
        List<ParkingSlot> slots = parkingSlotService.getParkingSlotsByStatus(status);
        List<ParkingSlotDTO> slotDTOs = slots.stream()
                .map(dtoMapper::toParkingSlotDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(slotDTOs);
    }
    
    // Get available slots
    @GetMapping("/available")
    public ResponseEntity<List<ParkingSlotDTO>> getAvailableSlots() {
        List<ParkingSlot> slots = parkingSlotService.getAvailableSlots();
        List<ParkingSlotDTO> slotDTOs = slots.stream()
                .map(dtoMapper::toParkingSlotDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(slotDTOs);
    }
    
    // Get slots by area
    @GetMapping("/area/{areaId}")
    public ResponseEntity<List<ParkingSlotDTO>> getSlotsByArea(@PathVariable Integer areaId) {
        List<ParkingSlot> slots = parkingSlotService.getParkingSlotsByArea(areaId);
        List<ParkingSlotDTO> slotDTOs = slots.stream()
                .map(dtoMapper::toParkingSlotDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(slotDTOs);
    }
    
    // Update parking slot
    @PutMapping("/{id}")
    public ResponseEntity<?> updateParkingSlot(@PathVariable Integer id, @RequestBody ParkingSlotRequestDTO requestDTO) {
        try {
            ParkingArea area = null;
            if (requestDTO.getAreaID() != null) {
                Optional<ParkingArea> areaOpt = parkingAreaService.getParkingAreaById(requestDTO.getAreaID());
                if (areaOpt.isPresent()) {
                    area = areaOpt.get();
                }
            }
            ParkingSlot slotDetails = dtoMapper.toParkingSlotEntity(requestDTO, area);
            ParkingSlot updatedSlot = parkingSlotService.updateParkingSlot(id, slotDetails);
            ParkingSlotDTO responseDTO = dtoMapper.toParkingSlotDTO(updatedSlot);
            return ResponseEntity.ok(responseDTO);
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
            ParkingSlotDTO responseDTO = dtoMapper.toParkingSlotDTO(updatedSlot);
            return ResponseEntity.ok(responseDTO);
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
    
    // Reserve a parking slot (Staff/Guard only)
    @PostMapping("/{id}/reserve")
    public ResponseEntity<?> reserveSlot(@PathVariable Integer id, @RequestBody Map<String, Object> reservationData) {
        try {
            String userId = String.valueOf(reservationData.get("userId"));
            String reservedFor = String.valueOf(reservationData.get("reservedFor"));
            
            ParkingSlot reservedSlot = parkingSlotService.reserveSlot(id, userId, reservedFor);
            ParkingSlotDTO responseDTO = dtoMapper.toParkingSlotDTO(reservedSlot);
            return ResponseEntity.ok(responseDTO);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        }
    }
    
    // Cancel reservation
    @PostMapping("/{id}/cancel-reservation")
    public ResponseEntity<?> cancelReservation(@PathVariable Integer id) {
        try {
            ParkingSlot slot = parkingSlotService.cancelReservation(id);
            ParkingSlotDTO responseDTO = dtoMapper.toParkingSlotDTO(slot);
            return ResponseEntity.ok(responseDTO);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    // Accept a reservation - Mark as Occupied and clear reservation fields
    @PostMapping("/{id}/accept-reservation")
    public ResponseEntity<?> acceptReservation(@PathVariable Integer id) {
        try {
            ParkingSlot slot = parkingSlotService.acceptReservation(id);
            ParkingSlotDTO responseDTO = dtoMapper.toParkingSlotDTO(slot);
            return ResponseEntity.ok(responseDTO);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    // Decline a reservation - Mark as Available and clear reservation fields
    @PostMapping("/{id}/decline-reservation")
    public ResponseEntity<?> declineReservation(@PathVariable Integer id) {
        try {
            ParkingSlot slot = parkingSlotService.declineReservation(id);
            ParkingSlotDTO responseDTO = dtoMapper.toParkingSlotDTO(slot);
            return ResponseEntity.ok(responseDTO);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    // Manual parking by guard - Check if plate is registered and create record
    @PostMapping("/{id}/manual-park")
    public ResponseEntity<?> manualParkVehicle(@PathVariable Integer id, @RequestBody Map<String, String> body) {
        try {
            String plateNumber = body.get("plateNumber");
            if (plateNumber == null || plateNumber.trim().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("message", "Plate number is required"));
            }

            System.out.println("🚗 Manual parking for slot " + id + " with plate: " + plateNumber);
            
            // Update slot status to Occupied first
            ParkingSlot slot = parkingSlotService.updateSlotStatus(id, "Occupied");
            
            // Try to find the vehicle by plate number
            Optional<Vehicle> vehicleOpt = vehicleService.getVehicleByPlateNumber(plateNumber);
            
            if (vehicleOpt.isPresent()) {
                Vehicle vehicle = vehicleOpt.get();
                System.out.println("✅ Found registered vehicle: " + plateNumber + " owned by user: " + vehicle.getUser().getUserID());
                
                // Create parking record linked to the vehicle owner
                ParkingRecord record = new ParkingRecord();
                record.setVehicle(vehicle);
                record.setParkingSlot(slot);
                record.setVerifiedByUser(vehicle.getUser()); // Link to the vehicle owner
                record.setEntryTime(LocalDateTime.now());
                record.setExitTime(null);
                
                ParkingRecord savedRecord = parkingRecordService.createParkingRecord(record);
                System.out.println("✅ Parking record created with ID: " + savedRecord.getRecordID());
                
                ParkingSlotDTO responseDTO = dtoMapper.toParkingSlotDTO(slot);
                return ResponseEntity.ok(Map.of(
                    "message", "Slot occupied and record created for registered vehicle",
                    "slot", responseDTO,
                    "registered", true,
                    "userID", vehicle.getUser().getUserID()
                ));
            } else {
                System.out.println("⚠️ Vehicle not registered: " + plateNumber + " - Slot marked as occupied without record");
                
                // Vehicle not registered - slot is occupied but no record created
                ParkingSlotDTO responseDTO = dtoMapper.toParkingSlotDTO(slot);
                return ResponseEntity.ok(Map.of(
                    "message", "Slot occupied - vehicle not registered in system",
                    "slot", responseDTO,
                    "registered", false
                ));
            }
        } catch (Exception e) {
            System.err.println("❌ Error in manual parking: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error processing manual parking: " + e.getMessage()));
        }
    }
    
    // Get reserved slots
    @GetMapping("/reserved")
    public ResponseEntity<List<ParkingSlotDTO>> getReservedSlots() {
        List<ParkingSlot> slots = parkingSlotService.getReservedSlots();
        List<ParkingSlotDTO> slotDTOs = slots.stream()
                .map(dtoMapper::toParkingSlotDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(slotDTOs);
    }
    
    // Get slots reserved by a specific user
    @GetMapping("/reserved/user/{userId}")
    public ResponseEntity<List<ParkingSlot>> getSlotsByReservedBy(@PathVariable String userId) {
        return ResponseEntity.ok(parkingSlotService.getSlotsByReservedBy(userId));
    }
}
