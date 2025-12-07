package com.appdev.smartpark.entity;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
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
    @Column(name = "recordid")
    private Integer recordID;
    
    @ManyToOne
    @JoinColumn(name = "vehicleid")
    @JsonIgnoreProperties({"parkingRecords", "user"})
    private Vehicle vehicle;
    
    @ManyToOne
    @JoinColumn(name = "slotid")
    @JsonIgnoreProperties({"parkingRecords", "parkingArea"})
    private ParkingSlot parkingSlot;
    
    @ManyToOne
    @JoinColumn(name = "verified_by_user")
    @JsonIgnoreProperties({"vehicles", "parkingRecords"})
    private User verifiedByUser;
    
    @Column(name = "entry_time")
    private LocalDateTime entryTime;
    
    @Column(name = "exit_time")
    private LocalDateTime exitTime;

    // Constructors
    public ParkingRecord() {}

    public ParkingRecord(Vehicle vehicle, ParkingSlot parkingSlot, User verifiedByUser, LocalDateTime entryTime) {
        this.vehicle = vehicle;
        this.parkingSlot = parkingSlot;
        this.verifiedByUser = verifiedByUser;
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

    public User getVerifiedByUser() {
        return verifiedByUser;
    }

    public void setVerifiedByUser(User verifiedByUser) {
        this.verifiedByUser = verifiedByUser;
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
}
