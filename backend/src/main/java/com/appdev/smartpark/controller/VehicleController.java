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
import com.appdev.smartpark.dto.VehicleDTO;
import com.appdev.smartpark.dto.VehicleRequestDTO;
import com.appdev.smartpark.entity.User;
import com.appdev.smartpark.entity.Vehicle;
import com.appdev.smartpark.service.UserService;
import com.appdev.smartpark.service.VehicleService;

@RestController
@RequestMapping("/api/vehicles")
@CrossOrigin(origins = "*")
public class VehicleController {
    
    @Autowired
    private VehicleService vehicleService;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private DTOMapper dtoMapper;
    
    // Create vehicle
    @PostMapping
    public ResponseEntity<?> createVehicle(@RequestBody VehicleRequestDTO requestDTO) {
        try {
            Optional<User> user = userService.getUserById(requestDTO.getUserID());
            if (user.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "User not found"));
            }
            Vehicle vehicle = dtoMapper.toVehicleEntity(requestDTO, user.get());
            Vehicle savedVehicle = vehicleService.createVehicle(vehicle);
            VehicleDTO responseDTO = dtoMapper.toVehicleDTO(savedVehicle);
            return ResponseEntity.status(HttpStatus.CREATED).body(responseDTO);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error creating vehicle: " + e.getMessage()));
        }
    }
    
    // Get all vehicles
    @GetMapping
    public ResponseEntity<List<VehicleDTO>> getAllVehicles() {
        List<Vehicle> vehicles = vehicleService.getAllVehicles();
        List<VehicleDTO> vehicleDTOs = vehicles.stream()
                .map(dtoMapper::toVehicleDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(vehicleDTOs);
    }
    
    // Get vehicle by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getVehicleById(@PathVariable Integer id) {
        Optional<Vehicle> vehicle = vehicleService.getVehicleById(id);
        if (vehicle.isPresent()) {
            VehicleDTO vehicleDTO = dtoMapper.toVehicleDTO(vehicle.get());
            return ResponseEntity.ok(vehicleDTO);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Vehicle not found"));
        }
    }
    
    // Get vehicle by plate number
    @GetMapping("/plate/{plateNumber}")
    public ResponseEntity<?> getVehicleByPlateNumber(@PathVariable String plateNumber) {
        Optional<Vehicle> vehicle = vehicleService.getVehicleByPlateNumber(plateNumber);
        if (vehicle.isPresent()) {
            VehicleDTO vehicleDTO = dtoMapper.toVehicleDTO(vehicle.get());
            return ResponseEntity.ok(vehicleDTO);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Vehicle not found with plate number: " + plateNumber));
        }
    }
    
    // Get vehicles by user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<VehicleDTO>> getVehiclesByUser(@PathVariable String userId) {
        List<Vehicle> vehicles = vehicleService.getVehiclesByUser(userId);
        List<VehicleDTO> vehicleDTOs = vehicles.stream()
                .map(dtoMapper::toVehicleDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(vehicleDTOs);
    }
    
    // Update vehicle
    @PutMapping("/{id}")
    public ResponseEntity<?> updateVehicle(@PathVariable Integer id, @RequestBody VehicleRequestDTO requestDTO) {
        try {
            Optional<User> user = userService.getUserById(requestDTO.getUserID());
            if (user.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "User not found"));
            }
            Vehicle vehicle = dtoMapper.toVehicleEntity(requestDTO, user.get());
            Vehicle updatedVehicle = vehicleService.updateVehicle(id, vehicle);
            VehicleDTO responseDTO = dtoMapper.toVehicleDTO(updatedVehicle);
            return ResponseEntity.ok(responseDTO);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", e.getMessage()));
        }
    }
    
    // Delete vehicle
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteVehicle(@PathVariable Integer id) {
        try {
            vehicleService.deleteVehicle(id);
            return ResponseEntity.ok(Map.of("message", "Vehicle deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error deleting vehicle: " + e.getMessage()));
        }
    }
}
