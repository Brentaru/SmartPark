package com.appdev.smartpark.entity;

import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "parking_slot")
public class ParkingSlot {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer slotID;
    
    private String location;
    private String status;
    private String slotType;
    
    @ManyToOne
    @JoinColumn(name = "areaID")
    private ParkingArea parkingArea;
    
    @OneToMany(mappedBy = "parkingSlot")
    private List<ParkingRecord> parkingRecords;

    // Constructors
    public ParkingSlot() {}

    public ParkingSlot(String location, String status, String slotType, ParkingArea parkingArea) {
        this.location = location;
        this.status = status;
        this.slotType = slotType;
        this.parkingArea = parkingArea;
    }

    // Getters and Setters
    public Integer getSlotID() {
        return slotID;
    }

    public void setSlotID(Integer slotID) {
        this.slotID = slotID;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getSlotType() {
        return slotType;
    }

    public void setSlotType(String slotType) {
        this.slotType = slotType;
    }

    public ParkingArea getParkingArea() {
        return parkingArea;
    }

    public void setParkingArea(ParkingArea parkingArea) {
        this.parkingArea = parkingArea;
    }

    public List<ParkingRecord> getParkingRecords() {
        return parkingRecords;
    }

    public void setParkingRecords(List<ParkingRecord> parkingRecords) {
        this.parkingRecords = parkingRecords;
    }
}
