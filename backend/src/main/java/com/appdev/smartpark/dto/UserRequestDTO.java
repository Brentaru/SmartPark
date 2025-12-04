package com.appdev.smartpark.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for User entity - Request DTO
 * Includes password for registration/login
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserRequestDTO {
    private String userID;
    private String studentId;
    private String fname;
    private String lname;
    private String email;
    private String password;
    private String role;
    private String contact;
    private String plateNumber;
    private String vehicleType;
    private String vehicleColor;
}
