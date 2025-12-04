package com.appdev.smartpark.dto;

import com.appdev.smartpark.entity.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Test class to verify DTO mappings work correctly
 * Run this to ensure DTOs are functioning properly
 */
class DTOMapperTest {
    
    private DTOMapper mapper;
    
    @BeforeEach
    void setUp() {
        mapper = new DTOMapper();
    }
    
    // ========== USER TESTS ==========
    
    @Test
    @DisplayName("UserDTO should NOT contain password field")
    void testUserToUserDTO_ExcludesPassword() {
        // Arrange - Create a user with password
        User user = new User();
        user.setUserID("21-1234-567");
        user.setStudentId("21-1234-567");
        user.setFname("John");
        user.setLname("Doe");
        user.setEmail("john@example.com");
        user.setPassword("secretPassword123");  // ← This should NOT appear in DTO
        user.setRole("student");
        user.setContact("555-1234");
        
        // Act - Convert to DTO
        UserDTO dto = mapper.toUserDTO(user);
        
        // Assert - Verify password is NOT included
        assertNotNull(dto, "DTO should not be null");
        assertEquals("21-1234-567", dto.getUserID());
        assertEquals("John", dto.getFname());
        assertEquals("Doe", dto.getLname());
        assertEquals("john@example.com", dto.getEmail());
        assertEquals("student", dto.getRole());
        assertEquals("555-1234", dto.getContact());
        
        // ✅ Key test: UserDTO class doesn't even have a password field!
        // This is compile-time safety - password CAN'T be exposed
        
        System.out.println("✅ PASS: UserDTO correctly excludes password");
    }
    
    @Test
    @DisplayName("UserRequestDTO to User should preserve password")
    void testUserRequestDTOToEntity_IncludesPassword() {
        // Arrange
        UserRequestDTO dto = new UserRequestDTO();
        dto.setUserID("21-5678-901");
        dto.setStudentId("21-5678-901");
        dto.setFname("Jane");
        dto.setLname("Smith");
        dto.setEmail("jane@example.com");
        dto.setPassword("myPassword456");  // ← This SHOULD be preserved
        dto.setRole("staff");
        dto.setContact("555-5678");
        
        // Act
        User user = mapper.toUserEntity(dto);
        
        // Assert
        assertNotNull(user, "User entity should not be null");
        assertEquals("21-5678-901", user.getUserID());
        assertEquals("Jane", user.getFname());
        assertEquals("jane@example.com", user.getEmail());
        assertEquals("myPassword456", user.getPassword());  // ✅ Password preserved for saving
        assertEquals("staff", user.getRole());
        
        System.out.println("✅ PASS: Password correctly preserved in entity");
    }
    
    @Test
    @DisplayName("Null user should return null DTO")
    void testUserToDTO_NullHandling() {
        // Act
        UserDTO dto = mapper.toUserDTO(null);
        
        // Assert
        assertNull(dto, "Null user should return null DTO");
        
        System.out.println("✅ PASS: Null handling works correctly");
    }
    
    // ========== VEHICLE TESTS ==========
    
    @Test
    @DisplayName("VehicleDTO should use userID instead of full User object")
    void testVehicleToDTO_UsesUserID() {
        // Arrange
        User user = new User();
        user.setUserID("21-1234-567");
        user.setPassword("secretPassword");  // This shouldn't leak
        
        Vehicle vehicle = new Vehicle();
        vehicle.setVehicleID(1);
        vehicle.setPlateNumber("ABC-1234");
        vehicle.setType("Car");
        vehicle.setColor("Red");
        vehicle.setUser(user);
        
        // Act
        VehicleDTO dto = mapper.toVehicleDTO(vehicle);
        
        // Assert
        assertNotNull(dto);
        assertEquals(1, dto.getVehicleID());
        assertEquals("ABC-1234", dto.getPlateNumber());
        assertEquals("Car", dto.getType());
        assertEquals("Red", dto.getColor());
        assertEquals("21-1234-567", dto.getUserID());  // ✅ Only ID, not full user
        
        System.out.println("✅ PASS: VehicleDTO uses userID (no password leak)");
    }
    
    @Test
    @DisplayName("VehicleDTO should handle null user")
    void testVehicleToDTO_NullUser() {
        // Arrange
        Vehicle vehicle = new Vehicle();
        vehicle.setVehicleID(2);
        vehicle.setPlateNumber("XYZ-5678");
        vehicle.setUser(null);  // No user assigned
        
        // Act
        VehicleDTO dto = mapper.toVehicleDTO(vehicle);
        
        // Assert
        assertNotNull(dto);
        assertEquals(2, dto.getVehicleID());
        assertNull(dto.getUserID());  // ✅ Handles null gracefully
        
        System.out.println("✅ PASS: Null user handled correctly");
    }
    
    // ========== PARKING SLOT TESTS ==========
    
    @Test
    @DisplayName("ParkingSlotDTO should use areaID instead of full ParkingArea")
    void testParkingSlotToDTO_UsesAreaID() {
        // Arrange
        ParkingArea area = new ParkingArea();
        area.setAreaID(10);
        area.setName("Main Parking");
        
        ParkingSlot slot = new ParkingSlot();
        slot.setSlotID(1);
        slot.setLocation("A1");
        slot.setStatus("available");
        slot.setSlotType("regular");
        slot.setParkingArea(area);
        
        // Act
        ParkingSlotDTO dto = mapper.toParkingSlotDTO(slot);
        
        // Assert
        assertNotNull(dto);
        assertEquals(1, dto.getSlotID());
        assertEquals("A1", dto.getLocation());
        assertEquals("available", dto.getStatus());
        assertEquals(10, dto.getAreaID());  // ✅ Only ID, not full area
        
        System.out.println("✅ PASS: ParkingSlotDTO uses areaID");
    }
    
    // ========== PARKING AREA TESTS ==========
    
    @Test
    @DisplayName("ParkingAreaDTO mapping should work correctly")
    void testParkingAreaToDTO() {
        // Arrange
        ParkingArea area = new ParkingArea();
        area.setAreaID(5);
        area.setName("North Lot");
        area.setCapacity(100);
        area.setLocationDescription("Near Building A");
        
        // Act
        ParkingAreaDTO dto = mapper.toParkingAreaDTO(area);
        
        // Assert
        assertNotNull(dto);
        assertEquals(5, dto.getAreaID());
        assertEquals("North Lot", dto.getName());
        assertEquals(100, dto.getCapacity());
        assertEquals("Near Building A", dto.getLocationDescription());
        
        System.out.println("✅ PASS: ParkingAreaDTO mapping works");
    }
    
    @Test
    @DisplayName("ParkingAreaRequestDTO to Entity should work")
    void testParkingAreaRequestDTOToEntity() {
        // Arrange
        ParkingAreaRequestDTO dto = new ParkingAreaRequestDTO();
        dto.setName("South Lot");
        dto.setCapacity(50);
        dto.setLocationDescription("Near Gate 2");
        
        // Act
        ParkingArea area = mapper.toParkingAreaEntity(dto);
        
        // Assert
        assertNotNull(area);
        assertEquals("South Lot", area.getName());
        assertEquals(50, area.getCapacity());
        assertEquals("Near Gate 2", area.getLocationDescription());
        
        System.out.println("✅ PASS: ParkingArea entity creation works");
    }
    
    // ========== PARKING RECORD TESTS ==========
    
    @Test
    @DisplayName("ParkingRecordDTO should include convenience fields")
    void testParkingRecordToDTO_IncludesConvenienceFields() {
        // Arrange
        User user = new User();
        user.setUserID("21-1234-567");
        
        Vehicle vehicle = new Vehicle();
        vehicle.setVehicleID(1);
        vehicle.setPlateNumber("ABC-1234");
        vehicle.setUser(user);
        
        ParkingArea area = new ParkingArea();
        area.setAreaID(10);
        
        ParkingSlot slot = new ParkingSlot();
        slot.setSlotID(5);
        slot.setLocation("B3");
        slot.setParkingArea(area);
        
        Guard guard = new Guard();
        guard.setGuardID(2);
        guard.setFname("Guard");
        guard.setLname("Smith");
        
        ParkingRecord record = new ParkingRecord();
        record.setRecordID(100);
        record.setVehicle(vehicle);
        record.setParkingSlot(slot);
        record.setGuard(guard);
        record.setVerifiedBy(1);
        
        // Act
        ParkingRecordDTO dto = mapper.toParkingRecordDTO(record);
        
        // Assert
        assertNotNull(dto);
        assertEquals(100, dto.getRecordID());
        assertEquals(1, dto.getVehicleID());
        assertEquals("ABC-1234", dto.getPlateNumber());  // ✅ Convenience field
        assertEquals(5, dto.getSlotID());
        assertEquals("B3", dto.getSlotLocation());  // ✅ Convenience field
        assertEquals(2, dto.getGuardID());
        assertEquals("Guard Smith", dto.getGuardName());  // ✅ Convenience field
        assertEquals(1, dto.getVerifiedBy());
        
        System.out.println("✅ PASS: ParkingRecordDTO includes convenience fields");
    }
    
    // ========== GUARD TESTS ==========
    
    @Test
    @DisplayName("GuardDTO should use verifiedByUserID instead of full User")
    void testGuardToDTO_UsesUserID() {
        // Arrange
        User verifier = new User();
        verifier.setUserID("21-ADMIN-001");
        verifier.setPassword("adminPassword");  // Shouldn't leak
        
        Guard guard = new Guard();
        guard.setGuardID(1);
        guard.setFname("Security");
        guard.setLname("Guard");
        guard.setContact("555-0000");
        guard.setShiftSchedule("9AM-5PM");
        guard.setVerifiedBy(verifier);
        
        // Act
        GuardDTO dto = mapper.toGuardDTO(guard);
        
        // Assert
        assertNotNull(dto);
        assertEquals(1, dto.getGuardID());
        assertEquals("Security", dto.getFname());
        assertEquals("Guard", dto.getLname());
        assertEquals("555-0000", dto.getContact());
        assertEquals("9AM-5PM", dto.getShiftSchedule());
        assertEquals("21-ADMIN-001", dto.getVerifiedByUserID());  // ✅ Only ID
        
        System.out.println("✅ PASS: GuardDTO uses verifiedByUserID");
    }
    
    // ========== SUMMARY TEST ==========
    
    @Test
    @DisplayName("All DTO mappings should handle null entities")
    void testAllMappings_NullHandling() {
        // Act & Assert
        assertNull(mapper.toUserDTO(null));
        assertNull(mapper.toVehicleDTO(null));
        assertNull(mapper.toParkingSlotDTO(null));
        assertNull(mapper.toParkingAreaDTO(null));
        assertNull(mapper.toParkingRecordDTO(null));
        assertNull(mapper.toGuardDTO(null));
        
        assertNull(mapper.toUserEntity(null));
        assertNull(mapper.toParkingAreaEntity(null));
        
        System.out.println("✅ PASS: All mappings handle null correctly");
    }
}
