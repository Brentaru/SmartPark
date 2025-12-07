package com.appdev.smartpark.entity;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.Column;

@Entity
@Table(name = "users")
public class User {
    @Id
    private String userID; // Now stores the actual student/staff/guard ID
    
    // studentId is deprecated - userID now serves this purpose
    @Column(name = "student_id")
    private String studentId;
    private String fname;
    private String lname;
    private String email;
    private String password;
    private String role;
    private String contact;
    
    // Vehicle registration fields
    @Column(name = "plate_number")
    private String plateNumber;
    
    @Column(name = "vehicle_type")
    private String vehicleType;
    
    @Column(name = "vehicle_color")
    private String vehicleColor;
    
    @OneToMany(mappedBy = "user")
    @JsonIgnoreProperties({"user", "parkingRecords"})
    private List<Vehicle> vehicles;

    // Constructors
    public User() {}

    public User(String studentId, String fname, String lname, String email, String password, String role, String contact) {
        this.studentId = studentId;
        this.fname = fname;
        this.lname = lname;
        this.email = email;
        this.password = password;
        this.role = role;
        this.contact = contact;
    }

    public User(String studentId, String fname, String lname, String email, String password, String role, String contact, String plateNumber, String vehicleType, String vehicleColor) {
        this.studentId = studentId;
        this.fname = fname;
        this.lname = lname;
        this.email = email;
        this.password = password;
        this.role = role;
        this.contact = contact;
        this.plateNumber = plateNumber;
        this.vehicleType = vehicleType;
        this.vehicleColor = vehicleColor;
    }

    // Getters and Setters
    public String getUserID() {
        return userID;
    }

    public void setUserID(String userID) {
        this.userID = userID;
    }

    public String getStudentId() {
        return studentId;
    }

    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }

    public String getFname() {
        return fname;
    }

    public void setFname(String fname) {
        this.fname = fname;
    }

    public String getLname() {
        return lname;
    }

    public void setLname(String lname) {
        this.lname = lname;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getContact() {
        return contact;
    }

    public void setContact(String contact) {
        this.contact = contact;
    }

    public List<Vehicle> getVehicles() {
        return vehicles;
    }

    public void setVehicles(List<Vehicle> vehicles) {
        this.vehicles = vehicles;
    }

    public String getPlateNumber() {
        return plateNumber;
    }

    public void setPlateNumber(String plateNumber) {
        this.plateNumber = plateNumber;
    }

    public String getVehicleType() {
        return vehicleType;
    }

    public void setVehicleType(String vehicleType) {
        this.vehicleType = vehicleType;
    }

    public String getVehicleColor() {
        return vehicleColor;
    }

    public void setVehicleColor(String vehicleColor) {
        this.vehicleColor = vehicleColor;
    }
}