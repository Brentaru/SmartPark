package com.appdev.smartpark.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for Vehicle entity
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VehicleDTO {
    private Integer vehicleID;
    private String plateNumber;
    private String type;
    private String color;
    private String userID; // User's ID reference instead of full user object
}
