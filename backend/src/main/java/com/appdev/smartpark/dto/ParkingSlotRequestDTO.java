package com.appdev.smartpark.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for creating/updating ParkingSlot
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ParkingSlotRequestDTO {
    private String location;
    private String status;
    private String slotType;
    private String reservedBy;
    private String reservedFor;
    private Integer areaID;
}
