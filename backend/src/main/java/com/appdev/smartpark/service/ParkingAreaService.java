package com.appdev.smartpark.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.appdev.smartpark.entity.ParkingArea;
import com.appdev.smartpark.repository.ParkingAreaRepository;

@Service
public class ParkingAreaService {
    
    @Autowired
    private ParkingAreaRepository parkingAreaRepository;
    
    // Create
    public ParkingArea createParkingArea(ParkingArea parkingArea) {
        return parkingAreaRepository.save(parkingArea);
    }
    
    // Read All
    public List<ParkingArea> getAllParkingAreas() {
        return parkingAreaRepository.findAll();
    }
    
    // Read One
    public Optional<ParkingArea> getParkingAreaById(Integer id) {
        return parkingAreaRepository.findById(id);
    }
    
    // Update
    public ParkingArea updateParkingArea(Integer id, ParkingArea areaDetails) {
        ParkingArea area = parkingAreaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Parking Area not found with id: " + id));
        
        area.setName(areaDetails.getName());
        area.setCapacity(areaDetails.getCapacity());
        area.setLocationDescription(areaDetails.getLocationDescription());
        
        return parkingAreaRepository.save(area);
    }
    
    // Delete
    public void deleteParkingArea(Integer id) {
        parkingAreaRepository.deleteById(id);
    }
}
