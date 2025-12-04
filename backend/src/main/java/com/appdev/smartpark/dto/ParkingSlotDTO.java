package com.appdev.smartpark.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for ParkingSlot entity
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ParkingSlotDTO {
    private Integer slotID;
    private String location;
    private String status;
    private String slotType;
    private String reservedBy;
    private String reservedFor;
    private Integer areaID; // ParkingArea ID reference
}
