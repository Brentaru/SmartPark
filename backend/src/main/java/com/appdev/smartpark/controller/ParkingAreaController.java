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
import com.appdev.smartpark.dto.ParkingAreaDTO;
import com.appdev.smartpark.dto.ParkingAreaRequestDTO;
import com.appdev.smartpark.entity.ParkingArea;
import com.appdev.smartpark.service.ParkingAreaService;

@RestController
@RequestMapping("/api/parking-areas")
@CrossOrigin(origins = "*")
public class ParkingAreaController {
    
    @Autowired
    private ParkingAreaService parkingAreaService;
    
    @Autowired
    private DTOMapper dtoMapper;
    
    // Create parking area
    @PostMapping
    public ResponseEntity<?> createParkingArea(@RequestBody ParkingAreaRequestDTO requestDTO) {
        try {
            ParkingArea parkingArea = dtoMapper.toParkingAreaEntity(requestDTO);
            ParkingArea savedArea = parkingAreaService.createParkingArea(parkingArea);
            ParkingAreaDTO responseDTO = dtoMapper.toParkingAreaDTO(savedArea);
            return ResponseEntity.status(HttpStatus.CREATED).body(responseDTO);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error creating parking area: " + e.getMessage()));
        }
    }
    
    // Get all parking areas
    @GetMapping
    public ResponseEntity<List<ParkingAreaDTO>> getAllParkingAreas() {
        List<ParkingArea> areas = parkingAreaService.getAllParkingAreas();
        List<ParkingAreaDTO> areaDTOs = areas.stream()
                .map(dtoMapper::toParkingAreaDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(areaDTOs);
    }
    
    // Get parking area by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getParkingAreaById(@PathVariable Integer id) {
        Optional<ParkingArea> area = parkingAreaService.getParkingAreaById(id);
        if (area.isPresent()) {
            ParkingAreaDTO areaDTO = dtoMapper.toParkingAreaDTO(area.get());
            return ResponseEntity.ok(areaDTO);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Parking area not found"));
        }
    }
    
    // Update parking area
    @PutMapping("/{id}")
    public ResponseEntity<?> updateParkingArea(@PathVariable Integer id, @RequestBody ParkingAreaRequestDTO requestDTO) {
        try {
            ParkingArea areaDetails = dtoMapper.toParkingAreaEntity(requestDTO);
            ParkingArea updatedArea = parkingAreaService.updateParkingArea(id, areaDetails);
            ParkingAreaDTO responseDTO = dtoMapper.toParkingAreaDTO(updatedArea);
            return ResponseEntity.ok(responseDTO);
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
