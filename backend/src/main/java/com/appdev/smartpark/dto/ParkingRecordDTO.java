package com.appdev.smartpark.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

/**
 * DTO for ParkingRecord entity
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ParkingRecordDTO {
    private Integer recordID;
    private Integer vehicleID;
    private String plateNumber; // For convenience
    private Integer slotID;
    private String slotLocation; // For convenience
    private String verifiedByUserId;
    private String verifiedByUserName; // For convenience
    private LocalDateTime entryTime;
    private LocalDateTime exitTime;
}
