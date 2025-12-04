package com.appdev.smartpark.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for Guard entity
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GuardDTO {
    private Integer guardID;
    private String fname;
    private String lname;
    private String contact;
    private String shiftSchedule;
    private String verifiedByUserID; // User ID reference instead of full user object
}
