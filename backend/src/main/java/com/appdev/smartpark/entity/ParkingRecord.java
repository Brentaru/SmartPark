package com.appdev.smartpark.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "parking_record")
public class ParkingRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer recordID;
    
    @ManyToOne
    @JoinColumn(name = "vehicleID")
    private Vehicle vehicle;
    
    @ManyToOne
    @JoinColumn(name = "slotID")
    private ParkingSlot parkingSlot;
    
    @ManyToOne
    @JoinColumn(name = "guardID")
    private Guard guard;
    
    private LocalDateTime entryTime;
    private LocalDateTime exitTime;
    private Integer verifiedBy;

    // Constructors
    public ParkingRecord() {}

    public ParkingRecord(Vehicle vehicle, ParkingSlot parkingSlot, Guard guard, LocalDateTime entryTime) {
        this.vehicle = vehicle;
        this.parkingSlot = parkingSlot;
        this.guard = guard;
        this.entryTime = entryTime;
    }

    // Getters and Setters
    public Integer getRecordID() {
        return recordID;
    }

    public void setRecordID(Integer recordID) {
        this.recordID = recordID;
    }

    public Vehicle getVehicle() {
        return vehicle;
    }

    public void setVehicle(Vehicle vehicle) {
        this.vehicle = vehicle;
    }

    public ParkingSlot getParkingSlot() {
        return parkingSlot;
    }

    public void setParkingSlot(ParkingSlot parkingSlot) {
        this.parkingSlot = parkingSlot;
    }

    public Guard getGuard() {
        return guard;
    }

    public void setGuard(Guard guard) {
        this.guard = guard;
    }

    public LocalDateTime getEntryTime() {
        return entryTime;
    }

    public void setEntryTime(LocalDateTime entryTime) {
        this.entryTime = entryTime;
    }

    public LocalDateTime getExitTime() {
        return exitTime;
    }

    public void setExitTime(LocalDateTime exitTime) {
        this.exitTime = exitTime;
    }

    public Integer getVerifiedBy() {
        return verifiedBy;
    }

    public void setVerifiedBy(Integer verifiedBy) {
        this.verifiedBy = verifiedBy;
    }
}
