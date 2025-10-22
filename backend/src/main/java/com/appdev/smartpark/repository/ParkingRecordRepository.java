package com.appdev.smartpark.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.appdev.smartpark.entity.ParkingRecord;

@Repository
public interface ParkingRecordRepository extends JpaRepository<ParkingRecord, Integer> {
    List<ParkingRecord> findByVehicleVehicleID(Integer vehicleID);
    List<ParkingRecord> findByParkingSlotSlotID(Integer slotID);
    List<ParkingRecord> findByExitTimeIsNull();
}
