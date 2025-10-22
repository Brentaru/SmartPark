package com.appdev.smartpark.service;

import java.time.LocalDateTime;
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
    
    // Create
    public ParkingRecord createParkingRecord(ParkingRecord parkingRecord) {
        if (parkingRecord.getEntryTime() == null) {
            parkingRecord.setEntryTime(LocalDateTime.now());
        }
        return parkingRecordRepository.save(parkingRecord);
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
    
    // Get by Slot
    public List<ParkingRecord> getParkingRecordsBySlot(Integer slotID) {
        return parkingRecordRepository.findByParkingSlotSlotID(slotID);
    }
    
    // Get Active Records (no exit time)
    public List<ParkingRecord> getActiveRecords() {
        return parkingRecordRepository.findByExitTimeIsNull();
    }
    
    // Update
    public ParkingRecord updateParkingRecord(Integer id, ParkingRecord recordDetails) {
        ParkingRecord record = parkingRecordRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Parking Record not found with id: " + id));
        
        record.setVehicle(recordDetails.getVehicle());
        record.setParkingSlot(recordDetails.getParkingSlot());
        record.setGuard(recordDetails.getGuard());
        record.setEntryTime(recordDetails.getEntryTime());
        record.setExitTime(recordDetails.getExitTime());
        record.setVerifiedBy(recordDetails.getVerifiedBy());
        
        return parkingRecordRepository.save(record);
    }
    
    // Update Exit Time
    public ParkingRecord updateExitTime(Integer id) {
        ParkingRecord record = parkingRecordRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Parking Record not found with id: " + id));
        
        record.setExitTime(LocalDateTime.now());
        return parkingRecordRepository.save(record);
    }
    
    // Delete
    public void deleteParkingRecord(Integer id) {
        parkingRecordRepository.deleteById(id);
    }
}
