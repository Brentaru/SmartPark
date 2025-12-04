package com.appdev.smartpark.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for creating/updating Vehicle
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VehicleRequestDTO {
    private String plateNumber;
    private String type;
    private String color;
    private String userID;
}
