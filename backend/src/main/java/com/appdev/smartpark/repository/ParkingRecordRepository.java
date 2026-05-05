package com.appdev.smartpark.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.appdev.smartpark.entity.ParkingRecord;

@Repository
public interface ParkingRecordRepository extends JpaRepository<ParkingRecord, Integer> {
    List<ParkingRecord> findByVehicleVehicleID(Integer vehicleID);
    List<ParkingRecord> findByVehicleUserUserID(String userID); // Changed to String
    List<ParkingRecord> findByParkingSlotSlotID(Integer slotID);
    List<ParkingRecord> findByExitTimeIsNull();
    List<ParkingRecord> findByVehicleUserUserIDAndExitTimeIsNull(String userID); // Active records by user
    
    // Get active records by slot (records where exitTime is NULL for a specific slot)
    List<ParkingRecord> findByParkingSlotSlotIDAndExitTimeIsNull(Integer slotID);
    
    // Get the most recent active record for a user (sorted by entry time desc, limit 1)
    @org.springframework.data.jpa.repository.Query("SELECT pr FROM ParkingRecord pr WHERE pr.vehicle.user.userID = :userID AND pr.exitTime IS NULL ORDER BY pr.entryTime DESC")
    List<ParkingRecord> findMostRecentActiveByUser(@org.springframework.data.repository.query.Param("userID") String userID, org.springframework.data.domain.Pageable pageable);
    
    // Get active record by vehicle plate number (registered vehicle)
    @org.springframework.data.jpa.repository.Query("SELECT pr FROM ParkingRecord pr WHERE pr.vehicle.plateNumber = :plateNumber AND pr.exitTime IS NULL ORDER BY pr.entryTime DESC")
    List<ParkingRecord> findActiveByVehiclePlateNumber(@org.springframework.data.repository.query.Param("plateNumber") String plateNumber);
    
    // Get active record by guest plate number
    @org.springframework.data.jpa.repository.Query("SELECT pr FROM ParkingRecord pr WHERE pr.guestPlateNumber = :plateNumber AND pr.exitTime IS NULL ORDER BY pr.entryTime DESC")
    List<ParkingRecord> findActiveByGuestPlateNumber(@org.springframework.data.repository.query.Param("plateNumber") String plateNumber);
}
