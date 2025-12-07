package com.appdev.smartpark.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

/**
 * DTO for creating/updating ParkingRecord
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ParkingRecordRequestDTO {
    private Integer vehicleID;
    private Integer slotID;
    private String verifiedByUserId;
    private LocalDateTime entryTime;
    private LocalDateTime exitTime;
}
