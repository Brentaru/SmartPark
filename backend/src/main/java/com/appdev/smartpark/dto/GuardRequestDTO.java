package com.appdev.smartpark.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for creating/updating Guard
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GuardRequestDTO {
    private String fname;
    private String lname;
    private String contact;
    private String shiftSchedule;
    private String verifiedByUserID;
}
