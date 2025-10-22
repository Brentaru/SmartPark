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
@Table(name = "vehicle")
public class Vehicle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer vehicleID;
    
    private String plateNumber;
    private String type;
    private String color;
    
    @ManyToOne
    @JoinColumn(name = "userID")
    private User user;
    
    @OneToMany(mappedBy = "vehicle")
    private List<ParkingRecord> parkingRecords;

    // Constructors
    public Vehicle() {}

    public Vehicle(String plateNumber, String type, String color, User user) {
        this.plateNumber = plateNumber;
        this.type = type;
        this.color = color;
        this.user = user;
    }

    // Getters and Setters
    public Integer getVehicleID() {
        return vehicleID;
    }

    public void setVehicleID(Integer vehicleID) {
        this.vehicleID = vehicleID;
    }

    public String getPlateNumber() {
        return plateNumber;
    }

    public void setPlateNumber(String plateNumber) {
        this.plateNumber = plateNumber;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public List<ParkingRecord> getParkingRecords() {
        return parkingRecords;
    }

    public void setParkingRecords(List<ParkingRecord> parkingRecords) {
        this.parkingRecords = parkingRecords;
    }
}
