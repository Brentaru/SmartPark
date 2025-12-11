package com.appdev.smartpark.config;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.appdev.smartpark.entity.ParkingArea;
import com.appdev.smartpark.entity.ParkingRecord;
import com.appdev.smartpark.entity.ParkingSlot;
import com.appdev.smartpark.entity.User;
import com.appdev.smartpark.entity.Vehicle;
import com.appdev.smartpark.repository.ParkingAreaRepository;
import com.appdev.smartpark.repository.ParkingRecordRepository;
import com.appdev.smartpark.repository.ParkingSlotRepository;
import com.appdev.smartpark.repository.UserRepository;
import com.appdev.smartpark.repository.VehicleRepository;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private ParkingAreaRepository parkingAreaRepository;

    @Autowired
    private ParkingSlotRepository parkingSlotRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private VehicleRepository vehicleRepository;
    
    @Autowired
    private ParkingRecordRepository parkingRecordRepository;
    
    @Autowired
    private com.appdev.smartpark.service.NotificationService notificationService;

    @Override
    public void run(String... args) throws Exception {
        // Initialize parking areas if they don't exist
        if (parkingAreaRepository.count() == 0) {
            ParkingArea ngeArea = new ParkingArea();
            ngeArea.setName("NGE Parking Area");
            ngeArea.setCapacity(20);
            ngeArea.setLocationDescription("Main parking area at NGE");
            parkingAreaRepository.save(ngeArea);
        }

        // Get or create the NGE Parking Area
        ParkingArea ngeArea = parkingAreaRepository.findAll().get(0);

        // Initialize parking slots if they don't exist or if count is less than 20
        List<ParkingSlot> existingSlots = parkingSlotRepository.findAll();
        
        if (existingSlots.size() < 20) {
            System.out.println("🚀 Initializing parking slots... Current count: " + existingSlots.size());
            
            // Create 20 parking slots: A-01 to A-12 and B-01 to B-08
            String[] slotLocations = {
                "A-01", "A-02", "A-03", "A-04", "A-05", "A-06", 
                "A-07", "A-08", "A-09", "A-10", "A-11", "A-12",
                "B-01", "B-02", "B-03", "B-04", "B-05", "B-06", "B-07", "B-08"
            };

            for (String location : slotLocations) {
                // Check if slot already exists
                boolean slotExists = existingSlots.stream()
                    .anyMatch(s -> s.getLocation() != null && s.getLocation().equals(location));
                
                if (!slotExists) {
                    ParkingSlot slot = new ParkingSlot();
                    slot.setLocation(location);
                    slot.setStatus("Available");
                    slot.setSlotType("Standard");
                    slot.setParkingArea(ngeArea);
                    
                    parkingSlotRepository.save(slot);
                    System.out.println("✅ Created slot: " + location);
                }
            }
            
            System.out.println("✅ Parking slots initialization completed!");
        } else {
            System.out.println("✅ Parking slots already exist. Total: " + existingSlots.size());
        }
        
        // Initialize sample parking records for testing
        System.out.println("🔍 Checking parking records in database...");
        long recordCount = parkingRecordRepository.count();
        System.out.println("   Current record count: " + recordCount);
        
        // Don't delete old records on startup - this causes database timeouts
        // Records can be manually cleared if needed through a utility endpoint
        if (recordCount > 0) {
            System.out.println("✅ Parking records already exist. Total: " + recordCount);
        }
        
        // Now create fresh sample parking records
        System.out.println("🚀 Creating fresh sample parking records for testing...");
        
        try {
            // Try to find existing users
            Optional<User> guardOpt = userRepository.findById("25-001-001");
            Optional<User> staffOpt = userRepository.findById("25-0001-0001");
            Optional<User> studentOpt = userRepository.findById("25-0001-001");
            
            // Try to find existing vehicles
            Optional<Vehicle> staffVehicle = vehicleRepository.findFirstByPlateNumberOrderByVehicleIDDesc("ST-2025-001");
            Optional<Vehicle> studentVehicle = vehicleRepository.findFirstByPlateNumberOrderByVehicleIDDesc("ST-2025-101");
            
            // Get available slots from the database
            List<ParkingSlot> availableSlots = parkingSlotRepository.findAll();
            
            if (availableSlots.size() < 3) {
                System.out.println("⚠️ Not enough parking slots available for sample data (need at least 3)");
                System.out.println("   Available slots: " + availableSlots.size());
            } else {
                int recordsCreated = 0;
                
                if (guardOpt.isPresent() && staffVehicle.isPresent()) {
                    // Create sample parking record for staff vehicle - completed session
                    ParkingRecord record1 = new ParkingRecord();
                    record1.setVehicle(staffVehicle.get());
                    record1.setParkingSlot(availableSlots.get(0)); // First available slot
                    record1.setVerifiedByUser(guardOpt.get());
                    record1.setEntryTime(LocalDateTime.now().minusHours(2));
                    record1.setExitTime(LocalDateTime.now().minusHours(1));
                    parkingRecordRepository.save(record1);
                    recordsCreated++;
                    System.out.println("✅ Created completed session: Staff vehicle at slot " + availableSlots.get(0).getLocation() + 
                            " (Entry: " + record1.getEntryTime() + ", Exit: " + record1.getExitTime() + ")");
                } else {
                    System.out.println("⚠️ Cannot create staff vehicle record - Guard or StaffVehicle not found");
                    System.out.println("   Guard exists: " + guardOpt.isPresent() + ", StaffVehicle exists: " + staffVehicle.isPresent());
                }
                
                if (guardOpt.isPresent() && studentVehicle.isPresent()) {
                    // Create active parking record for student vehicle - still parked
                    ParkingRecord record2 = new ParkingRecord();
                    record2.setVehicle(studentVehicle.get());
                    record2.setParkingSlot(availableSlots.get(1)); // Second available slot
                    record2.setVerifiedByUser(guardOpt.get());
                    record2.setEntryTime(LocalDateTime.now().minusMinutes(30));
                    record2.setExitTime(null); // Still parked
                    parkingRecordRepository.save(record2);
                    recordsCreated++;
                    System.out.println("✅ Created active session: Student vehicle at slot " + availableSlots.get(1).getLocation() + 
                            " (Entry: " + record2.getEntryTime() + ", still parked)");
                } else {
                    System.out.println("⚠️ Cannot create student vehicle record - Guard or StudentVehicle not found");
                    System.out.println("   Guard exists: " + guardOpt.isPresent() + ", StudentVehicle exists: " + studentVehicle.isPresent());
                }
                
                if (guardOpt.isPresent() && staffVehicle.isPresent()) {
                    // Create older parking record - historical
                    ParkingRecord record3 = new ParkingRecord();
                    record3.setVehicle(staffVehicle.get());
                    record3.setParkingSlot(availableSlots.get(2)); // Third available slot
                    record3.setVerifiedByUser(guardOpt.get());
                    record3.setEntryTime(LocalDateTime.now().minusDays(1).minusHours(3));
                    record3.setExitTime(LocalDateTime.now().minusDays(1).minusHours(2));
                    parkingRecordRepository.save(record3);
                    recordsCreated++;
                    System.out.println("✅ Created historical session: Staff vehicle at slot " + availableSlots.get(2).getLocation() + 
                            " (Entry: " + record3.getEntryTime() + ", Exit: " + record3.getExitTime() + ")");
                }
                
                System.out.println("✅ Sample parking records initialization completed! Created " + recordsCreated + " records");
            }
        } catch (Exception e) {
            System.out.println("⚠️ Could not initialize sample parking records: " + e.getMessage());
            e.printStackTrace();
            System.out.println("   Make sure users and vehicles exist first");
        }
        
    }
}
