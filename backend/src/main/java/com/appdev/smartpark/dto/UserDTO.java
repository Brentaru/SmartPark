package com.appdev.smartpark.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for User entity - Response DTO
 * Excludes password for security reasons
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private String userID;
    private String studentId;
    private String fname;
    private String lname;
    private String email;
    private String role;
    private String contact;
    private String plateNumber;
    private String vehicleType;
    private String vehicleColor;
}
