package com.appdev.smartpark.service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.appdev.smartpark.entity.ParkingRecord;
import com.appdev.smartpark.repository.ParkingRecordRepository;

@Service
public class ParkingRecordService {
    
    @Autowired
    private ParkingRecordRepository parkingRecordRepository;
    
    @Autowired
    private NotificationService notificationService;
    
    // Create
    public ParkingRecord createParkingRecord(ParkingRecord parkingRecord) {
        return createParkingRecord(parkingRecord, false);
    }
    
    // Create with option to skip notification (for reservation acceptance flow)
    public ParkingRecord createParkingRecord(ParkingRecord parkingRecord, boolean skipNotification) {
        if (parkingRecord.getEntryTime() == null) {
            parkingRecord.setEntryTime(LocalDateTime.now());
        }
        ParkingRecord savedRecord = parkingRecordRepository.save(parkingRecord);
        
        // Notify student about vehicle entry (skip if this is from reservation acceptance)
        if (!skipNotification && savedRecord.getVehicle() != null && savedRecord.getVehicle().getUser() != null) {
            String studentId = savedRecord.getVehicle().getUser().getUserID();
            String areaName = savedRecord.getParkingSlot().getParkingArea() != null ? 
                            savedRecord.getParkingSlot().getParkingArea().getName() : "Unknown Area";
            LocalDateTime entryTime = savedRecord.getEntryTime();
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM dd, yyyy 'at' hh:mm a");
            String formattedDateTime = entryTime.format(formatter);
            
            notificationService.createNotificationWithSlot(
                studentId,
                "info",
                "Vehicle Entry",
                "Parking Slot " + areaName + " " + savedRecord.getParkingSlot().getLocation() + 
                " is occupied by you (" + formattedDateTime + ")",
                savedRecord.getParkingSlot().getSlotID()
            );
        }
        
        return savedRecord;
    }
    
    // Read All
    public List<ParkingRecord> getAllParkingRecords() {
        return parkingRecordRepository.findAll();
    }
    
    // Read One
    public Optional<ParkingRecord> getParkingRecordById(Integer id) {
        return parkingRecordRepository.findById(id);
    }
    
    // Get by Vehicle
    public List<ParkingRecord> getParkingRecordsByVehicle(Integer vehicleID) {
        return parkingRecordRepository.findByVehicleVehicleID(vehicleID);
    }
    
    // Get by User (through Vehicle)
    public List<ParkingRecord> getParkingRecordsByUser(String userID) {
        return parkingRecordRepository.findByVehicleUserUserID(userID);
    }
    
    // Get by Slot
    public List<ParkingRecord> getParkingRecordsBySlot(Integer slotID) {
        return parkingRecordRepository.findByParkingSlotSlotID(slotID);
    }
    
    // Get Active Records (no exit time)
    public List<ParkingRecord> getActiveRecords() {
        return parkingRecordRepository.findByExitTimeIsNull();
    }
    
    // Get Active Record by User (no exit time - user is currently parked)
    public List<ParkingRecord> getActiveRecordsByUser(String userID) {
        return parkingRecordRepository.findByVehicleUserUserIDAndExitTimeIsNull(userID);
    }
    
    // Get the single most recent active record for a user
    public ParkingRecord getMostRecentActiveRecordByUser(String userID) {
        List<ParkingRecord> records = parkingRecordRepository.findMostRecentActiveByUser(
            userID, 
            org.springframework.data.domain.PageRequest.of(0, 1)
        );
        return records.isEmpty() ? null : records.get(0);
    }
    
    // Get active record by plate number (checks both registered vehicles and guest vehicles)
    public ParkingRecord getActiveRecordByPlateNumber(String plateNumber) {
        // First check for registered vehicles
        List<ParkingRecord> registeredRecords = parkingRecordRepository.findActiveByVehiclePlateNumber(plateNumber);
        if (!registeredRecords.isEmpty()) {
            return registeredRecords.get(0);
        }
        
        // Then check for guest vehicles
        List<ParkingRecord> guestRecords = parkingRecordRepository.findActiveByGuestPlateNumber(plateNumber);
        if (!guestRecords.isEmpty()) {
            return guestRecords.get(0);
        }
        
        return null;
    }
    
    // Update
    public ParkingRecord updateParkingRecord(Integer id, ParkingRecord recordDetails) {
        ParkingRecord record = parkingRecordRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Parking Record not found with id: " + id));
        
        record.setVehicle(recordDetails.getVehicle());
        record.setParkingSlot(recordDetails.getParkingSlot());
        record.setVerifiedByUser(recordDetails.getVerifiedByUser());
        record.setEntryTime(recordDetails.getEntryTime());
        record.setExitTime(recordDetails.getExitTime());
        
        return parkingRecordRepository.save(record);
    }
    
    // Update Exit Time
    public ParkingRecord updateExitTime(Integer id) {
        ParkingRecord record = parkingRecordRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Parking Record not found with id: " + id));
        
        record.setExitTime(LocalDateTime.now());
        return parkingRecordRepository.save(record);
    }
    
    // Close all active parking records for a specific slot (set exit time to now)
    public int closeActiveRecordsForSlot(Integer slotID) {
        List<ParkingRecord> activeRecords = parkingRecordRepository.findByParkingSlotSlotIDAndExitTimeIsNull(slotID);
        int closedCount = 0;
        LocalDateTime exitTime = LocalDateTime.now();
        
        for (ParkingRecord record : activeRecords) {
            record.setExitTime(exitTime);
            parkingRecordRepository.save(record);
            closedCount++;
            System.out.println("✅ Closed parking record ID: " + record.getRecordID() + " for slot: " + slotID);
        }
        
        return closedCount;
    }
    
    // Delete
    public void deleteParkingRecord(Integer id) {
        parkingRecordRepository.deleteById(id);
    }
}
