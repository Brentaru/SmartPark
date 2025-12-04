package com.appdev.smartpark.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for ParkingArea entity
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ParkingAreaDTO {
    private Integer areaID;
    private String name;
    private Integer capacity;
    private String locationDescription;
}
