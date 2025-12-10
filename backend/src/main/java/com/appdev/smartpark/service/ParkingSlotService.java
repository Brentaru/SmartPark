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
        slot.setReservedBy(slotDetails.getReservedBy());
        slot.setReservedFor(slotDetails.getReservedFor());
        
        return parkingSlotRepository.save(slot);
    }
    
    // Update Status Only
    public ParkingSlot updateSlotStatus(Integer id, String status) {
        ParkingSlot slot = parkingSlotRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Parking Slot not found with id: " + id));
        
        slot.setStatus(status);
        return parkingSlotRepository.save(slot);
    }

    // Accept a reservation - Mark as Occupied and clear reservation fields
    public ParkingSlot acceptReservation(Integer id) {
        ParkingSlot slot = parkingSlotRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Parking Slot not found with id: " + id));
        
        if (!"Reserved".equals(slot.getStatus())) {
            throw new RuntimeException("Slot is not in Reserved status");
        }
        
        slot.setStatus("Occupied");
        slot.setReservedBy(null);
        slot.setReservedFor(null);
        
        return parkingSlotRepository.save(slot);
    }
    
    // Decline a reservation - Clear reservation fields and mark as Available
    public ParkingSlot declineReservation(Integer id) {
        ParkingSlot slot = parkingSlotRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Parking Slot not found with id: " + id));
        
        if (!"Reserved".equals(slot.getStatus())) {
            throw new RuntimeException("Slot is not in Reserved status");
        }
        
        slot.setStatus("Available");
        slot.setReservedBy(null);
        slot.setReservedFor(null);
        
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
    
    // Reserve a slot (Staff/Guard only)
    public ParkingSlot reserveSlot(Integer slotId, String userId, String reservedFor) {
        ParkingSlot slot = parkingSlotRepository.findById(slotId)
                .orElseThrow(() -> new RuntimeException("Parking Slot not found with id: " + slotId));
        
        if (!"Available".equals(slot.getStatus())) {
            throw new RuntimeException("Slot is not available for reservation");
        }
        
        slot.setStatus("Reserved");
        slot.setReservedBy(userId);
        slot.setReservedFor(reservedFor);
        
        return parkingSlotRepository.save(slot);
    }
    
    // Cancel reservation
    public ParkingSlot cancelReservation(Integer slotId) {
        ParkingSlot slot = parkingSlotRepository.findById(slotId)
                .orElseThrow(() -> new RuntimeException("Parking Slot not found with id: " + slotId));
        
        if (!"Reserved".equals(slot.getStatus())) {
            throw new RuntimeException("Slot is not reserved");
        }
        
        slot.setStatus("Available");
        slot.setReservedBy(null);
        slot.setReservedFor(null);
        
        return parkingSlotRepository.save(slot);
    }
    
    // Get reserved slots
    public List<ParkingSlot> getReservedSlots() {
        return parkingSlotRepository.findByStatus("Reserved");
    }
    
    // Get slots reserved by a specific user (only those still in Reserved status)
    public List<ParkingSlot> getSlotsByReservedBy(String userId) {
        return parkingSlotRepository.findByReservedByAndStatus(userId, "Reserved");
    }
}
