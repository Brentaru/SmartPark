package com.appdev.smartpark.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for creating/updating ParkingArea
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ParkingAreaRequestDTO {
    private String name;
    private Integer capacity;
    private String locationDescription;
}
