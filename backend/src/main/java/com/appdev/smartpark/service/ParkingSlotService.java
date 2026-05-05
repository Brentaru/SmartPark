package com.appdev.smartpark.service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.appdev.smartpark.entity.ParkingSlot;
import com.appdev.smartpark.repository.ParkingSlotRepository;
import com.appdev.smartpark.repository.UserRepository;

@Service
public class ParkingSlotService {
    
    @Autowired
    private ParkingSlotRepository parkingSlotRepository;
    
    @Autowired
    private NotificationService notificationService;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ParkingRecordService parkingRecordService;
    
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
        
        String oldStatus = slot.getStatus();
        
        slot.setLocation(slotDetails.getLocation());
        slot.setStatus(slotDetails.getStatus());
        slot.setSlotType(slotDetails.getSlotType());
        slot.setParkingArea(slotDetails.getParkingArea());
        slot.setReservedBy(slotDetails.getReservedBy());
        slot.setReservedFor(slotDetails.getReservedFor());
        
        ParkingSlot savedSlot = parkingSlotRepository.save(slot);
        
        // Notify admins when guard makes a slot available
        String newStatus = slotDetails.getStatus();
        if ("Available".equals(newStatus) && !"Available".equals(oldStatus)) {
            // Close any active parking records for this slot (set exit time)
            int closedRecords = parkingRecordService.closeActiveRecordsForSlot(id);
            System.out.println("🚗 Closed " + closedRecords + " active parking records when slot " + savedSlot.getLocation() + " was marked Available");
            
            String areaName = savedSlot.getParkingArea() != null ? savedSlot.getParkingArea().getName() : "Unknown Area";
            List<com.appdev.smartpark.entity.User> admins = userRepository.findByRoleIgnoreCase("admin");
            for (com.appdev.smartpark.entity.User admin : admins) {
                notificationService.createNotificationWithSlot(
                    admin.getUserID(),
                    "info",
                    "Slot Made Available",
                    "Slot " + savedSlot.getLocation() + " in " + areaName + " was changed from " + oldStatus + " to Available by guard",
                    savedSlot.getSlotID()
                );
            }
        }
        
        return savedSlot;
    }
    
    // Update Status Only
    public ParkingSlot updateSlotStatus(Integer id, String status) {
        ParkingSlot slot = parkingSlotRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Parking Slot not found with id: " + id));
        
        String oldStatus = slot.getStatus();
        slot.setStatus(status);
        ParkingSlot savedSlot = parkingSlotRepository.save(slot);
        
        // When a slot is marked as Available, close any active parking records
        if ("Available".equals(status) && !"Available".equals(oldStatus)) {
            // Close any active parking records for this slot (set exit time)
            int closedRecords = parkingRecordService.closeActiveRecordsForSlot(id);
            System.out.println("🚗 Closed " + closedRecords + " active parking records when slot " + savedSlot.getLocation() + " was marked Available");
            
            String areaName = savedSlot.getParkingArea() != null ? savedSlot.getParkingArea().getName() : "Unknown Area";
            List<com.appdev.smartpark.entity.User> admins = userRepository.findByRoleIgnoreCase("admin");
            for (com.appdev.smartpark.entity.User admin : admins) {
                notificationService.createNotificationWithSlot(
                    admin.getUserID(),
                    "info",
                    "Slot Made Available",
                    "Slot " + savedSlot.getLocation() + " in " + areaName + " was changed from " + oldStatus + " to Available",
                    savedSlot.getSlotID()
                );
            }
        }
        
        return savedSlot;
    }

    // Accept a reservation - Mark as Occupied and clear reservation fields
    public ParkingSlot acceptReservation(Integer id) {
        ParkingSlot slot = parkingSlotRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Parking Slot not found with id: " + id));
        
        if (!"Reserved".equals(slot.getStatus())) {
            throw new RuntimeException("Slot is not in Reserved status");
        }
        
        String reservedByUserId = slot.getReservedBy();
        String areaName = slot.getParkingArea() != null ? slot.getParkingArea().getName() : "Unknown Area";
        LocalDateTime now = LocalDateTime.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM dd, yyyy 'at' hh:mm a");
        String formattedDateTime = now.format(formatter);
        
        slot.setStatus("Occupied");
        slot.setReservedBy(null);
        slot.setReservedFor(null);
        slot.setReservedAt(null); // Clear reservation timestamp
        
        ParkingSlot savedSlot = parkingSlotRepository.save(slot);
        
        // Notify the staff user who made the reservation
        if (reservedByUserId != null) {
            notificationService.createNotificationWithSlot(
                reservedByUserId,
                "success",
                "Reservation Accepted",
                "Parking Slot " + areaName + " " + savedSlot.getLocation() + " is occupied by you (" + formattedDateTime + ")",
                savedSlot.getSlotID()
            );
        }
        
        // Notify all admins about the accepted reservation
        List<com.appdev.smartpark.entity.User> admins = userRepository.findByRoleIgnoreCase("admin");
        for (com.appdev.smartpark.entity.User admin : admins) {
            notificationService.createNotificationWithSlot(
                admin.getUserID(),
                "info",
                "Reservation Accepted by Guard",
                "Guard accepted reservation for slot " + savedSlot.getLocation() + " in " + areaName + " (" + formattedDateTime + ")",
                savedSlot.getSlotID()
            );
        }
        
        return savedSlot;
    }
    
    // Decline a reservation - Clear reservation fields and mark as Available
    public ParkingSlot declineReservation(Integer id) {
        ParkingSlot slot = parkingSlotRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Parking Slot not found with id: " + id));
        
        if (!"Reserved".equals(slot.getStatus())) {
            throw new RuntimeException("Slot is not in Reserved status");
        }
        
        // Save the user who made the reservation before clearing
        String reservedByUserId = slot.getReservedBy();
        String areaName = slot.getParkingArea() != null ? slot.getParkingArea().getName() : "Unknown Area";
        String slotLocation = slot.getLocation();
        
        slot.setStatus("Available");
        slot.setReservedBy(null);
        slot.setReservedFor(null);
        slot.setReservedAt(null); // Clear reservation timestamp
        
        ParkingSlot savedSlot = parkingSlotRepository.save(slot);
        
        // Notify the staff user who made the reservation that it was declined
        if (reservedByUserId != null) {
            notificationService.createNotificationWithSlot(
                reservedByUserId,
                "warning",
                "Reservation Declined",
                "Your reservation for slot " + slotLocation + " in " + areaName + " has been declined by the guard.",
                savedSlot.getSlotID()
            );
        }
        
        return savedSlot;
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
        slot.setReservedAt(java.time.LocalDateTime.now()); // Set reservation timestamp
        
        ParkingSlot savedSlot = parkingSlotRepository.save(slot);
        
        // Notify all guards about new reservation (case-insensitive role search)
        List<com.appdev.smartpark.entity.User> guards = userRepository.findByRoleIgnoreCase("guard");
        String areaName = savedSlot.getParkingArea() != null ? savedSlot.getParkingArea().getName() : "Unknown Area";
        
        System.out.println("🔔 Creating notifications for " + guards.size() + " guards about reservation of slot " + savedSlot.getLocation());
        
        for (com.appdev.smartpark.entity.User guard : guards) {
            System.out.println("📧 Sending notification to guard: " + guard.getUserID());
            notificationService.createNotificationWithSlot(
                guard.getUserID(),
                "info",
                "New Reservation",
                "New reservation for slot " + savedSlot.getLocation() + " in " + areaName + " by " + reservedFor,
                savedSlot.getSlotID()
            );
        }
        
        return savedSlot;
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
        slot.setReservedAt(null); // Clear reservation timestamp
        
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
