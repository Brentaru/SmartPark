package com.appdev.smartpark.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.appdev.smartpark.entity.ParkingSlot;
import com.appdev.smartpark.repository.ParkingSlotRepository;

@Service
public class ParkingSlotService {
    
    @Autowired
    private ParkingSlotRepository parkingSlotRepository;
    
    // Create
    public ParkingSlot createParkingSlot(ParkingSlot parkingSlot) {
        return parkingSlotRepository.save(parkingSlot);
    }
    
    // Read All
    public List<ParkingSlot> getAllParkingSlots() {
        return parkingSlotRepository.findAll();
    }
    
    // Read One
    public Optional<ParkingSlot> getParkingSlotById(Integer id) {
        return parkingSlotRepository.findById(id);
    }
    
    // Get by Status
    public List<ParkingSlot> getParkingSlotsByStatus(String status) {
        return parkingSlotRepository.findByStatus(status);
    }
    
    // Get by Area
    public List<ParkingSlot> getParkingSlotsByArea(Integer areaID) {
        return parkingSlotRepository.findByParkingAreaAreaID(areaID);
    }
    
    // Update
    public ParkingSlot updateParkingSlot(Integer id, ParkingSlot slotDetails) {
        ParkingSlot slot = parkingSlotRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Parking Slot not found with id: " + id));
        
        slot.setLocation(slotDetails.getLocation());
        slot.setStatus(slotDetails.getStatus());
        slot.setSlotType(slotDetails.getSlotType());
        slot.setParkingArea(slotDetails.getParkingArea());
        
        return parkingSlotRepository.save(slot);
    }
    
    // Update Status Only
    public ParkingSlot updateSlotStatus(Integer id, String status) {
        ParkingSlot slot = parkingSlotRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Parking Slot not found with id: " + id));
        
        slot.setStatus(status);
        return parkingSlotRepository.save(slot);
    }
    
    // Delete
    public void deleteParkingSlot(Integer id) {
        parkingSlotRepository.deleteById(id);
    }
    
    // Get available slots
    public List<ParkingSlot> getAvailableSlots() {
        return parkingSlotRepository.findByStatus("Available");
    }
}
