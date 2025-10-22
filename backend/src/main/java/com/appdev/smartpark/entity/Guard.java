package com.appdev.smartpark.entity;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "guard")
public class Guard {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer guardID;
    
    private String fname;
    private String lname;
    private String contact;
    private String shiftSchedule;
    
    @ManyToOne
    @JoinColumn(name = "userID")
    private User verifiedBy;
    
    @OneToMany(mappedBy = "guard")
    private List<ParkingRecord> parkingRecords;

    // Constructors
    public Guard() {}

    public Guard(String fname, String lname, String contact, String shiftSchedule, User verifiedBy) {
        this.fname = fname;
        this.lname = lname;
        this.contact = contact;
        this.shiftSchedule = shiftSchedule;
        this.verifiedBy = verifiedBy;
    }

    // Getters and Setters
    public Integer getGuardID() {
        return guardID;
    }

    public void setGuardID(Integer guardID) {
        this.guardID = guardID;
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

    public String getContact() {
        return contact;
    }

    public void setContact(String contact) {
        this.contact = contact;
    }

    public String getShiftSchedule() {
        return shiftSchedule;
    }

    public void setShiftSchedule(String shiftSchedule) {
        this.shiftSchedule = shiftSchedule;
    }

    public User getVerifiedBy() {
        return verifiedBy;
    }

    public void setVerifiedBy(User verifiedBy) {
        this.verifiedBy = verifiedBy;
    }

    public List<ParkingRecord> getParkingRecords() {
        return parkingRecords;
    }

    public void setParkingRecords(List<ParkingRecord> parkingRecords) {
        this.parkingRecords = parkingRecords;
    }
}
