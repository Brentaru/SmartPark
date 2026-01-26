package com.appdev.smartpark.dto;

import com.appdev.smartpark.entity.*;
import org.springframework.stereotype.Component;

/**
 * Mapper class to convert between Entity and DTO objects
 */
@Component
public class DTOMapper {

    // User mappings
    public UserDTO toUserDTO(User user) {
        if (user == null) return null;
        return new UserDTO(
            user.getUserID(),
            user.getStudentId(),
            user.getFname(),
            user.getLname(),
            user.getEmail(),
            user.getRole(),
            user.getContact(),
            user.getPlateNumber(),
            user.getVehicleType(),
            user.getVehicleColor(),
            user.getProfilePictureUrl()
        );
    }

    public User toUserEntity(UserRequestDTO dto) {
        if (dto == null) return null;
        User user = new User();
        user.setUserID(dto.getUserID());
        user.setStudentId(dto.getStudentId());
        user.setFname(dto.getFname());
        user.setLname(dto.getLname());
        user.setEmail(dto.getEmail());
        user.setPassword(dto.getPassword());
        user.setRole(dto.getRole());
        user.setContact(dto.getContact());
        user.setPlateNumber(dto.getPlateNumber());
        user.setVehicleType(dto.getVehicleType());
        user.setVehicleColor(dto.getVehicleColor());
        user.setProfilePictureUrl(dto.getProfilePictureUrl());
        return user;
    }

    // Vehicle mappings
    public VehicleDTO toVehicleDTO(Vehicle vehicle) {
        if (vehicle == null) return null;
        return new VehicleDTO(
            vehicle.getVehicleID(),
            vehicle.getPlateNumber(),
            vehicle.getType(),
            vehicle.getColor(),
            vehicle.getUser() != null ? vehicle.getUser().getUserID() : null
        );
    }

    public Vehicle toVehicleEntity(VehicleRequestDTO dto, User user) {
        if (dto == null) return null;
        Vehicle vehicle = new Vehicle();
        vehicle.setPlateNumber(dto.getPlateNumber());
        vehicle.setType(dto.getType());
        vehicle.setColor(dto.getColor());
        vehicle.setUser(user);
        return vehicle;
    }

    // ParkingSlot mappings
    public ParkingSlotDTO toParkingSlotDTO(ParkingSlot slot) {
        if (slot == null) return null;
        ParkingSlotDTO dto = new ParkingSlotDTO();
        dto.setSlotID(slot.getSlotID());
        dto.setLocation(slot.getLocation());
        dto.setStatus(slot.getStatus());
        dto.setSlotType(slot.getSlotType());
        dto.setReservedBy(slot.getReservedBy());
        dto.setReservedFor(slot.getReservedFor());
        dto.setAreaID(slot.getParkingArea() != null ? slot.getParkingArea().getAreaID() : null);
        // Additional fields will be set by the controller when needed
        return dto;
    }

    public ParkingSlot toParkingSlotEntity(ParkingSlotRequestDTO dto, ParkingArea area) {
        if (dto == null) return null;
        ParkingSlot slot = new ParkingSlot();
        slot.setLocation(dto.getLocation());
        slot.setStatus(dto.getStatus());
        slot.setSlotType(dto.getSlotType());
        slot.setReservedBy(dto.getReservedBy());
        slot.setReservedFor(dto.getReservedFor());
        slot.setParkingArea(area);
        return slot;
    }

    // ParkingArea mappings
    public ParkingAreaDTO toParkingAreaDTO(ParkingArea area) {
        if (area == null) return null;
        return new ParkingAreaDTO(
            area.getAreaID(),
            area.getName(),
            area.getCapacity(),
            area.getLocationDescription()
        );
    }

    public ParkingArea toParkingAreaEntity(ParkingAreaRequestDTO dto) {
        if (dto == null) return null;
        ParkingArea area = new ParkingArea();
        area.setName(dto.getName());
        area.setCapacity(dto.getCapacity());
        area.setLocationDescription(dto.getLocationDescription());
        return area;
    }

    // ParkingRecord mappings
    public ParkingRecordDTO toParkingRecordDTO(ParkingRecord record) {
        if (record == null) return null;
        
        String slotLocation = null;
        Integer slotID = null;
        String plateNumber = null;
        Integer vehicleID = null;
        String verifiedByUserName = null;
        String verifiedByUserId = null;
        
        // Safely extract parking slot info
        if (record.getParkingSlot() != null) {
            slotID = record.getParkingSlot().getSlotID();
            slotLocation = record.getParkingSlot().getLocation();
            if (slotLocation == null) {
                System.out.println("⚠️ Slot " + slotID + " has null location");
            }
        } else {
            System.out.println("⚠️ Record " + record.getRecordID() + " has null parkingSlot");
        }
        
        // Safely extract vehicle info
        if (record.getVehicle() != null) {
            vehicleID = record.getVehicle().getVehicleID();
            plateNumber = record.getVehicle().getPlateNumber();
        }
        
        // Safely extract verified by user info
        if (record.getVerifiedByUser() != null) {
            verifiedByUserId = record.getVerifiedByUser().getUserID();
            String fname = record.getVerifiedByUser().getFname() != null ? record.getVerifiedByUser().getFname() : "";
            String lname = record.getVerifiedByUser().getLname() != null ? record.getVerifiedByUser().getLname() : "";
            verifiedByUserName = (fname + " " + lname).trim();
        }
        
        // For guest vehicles, use guestPlateNumber if no vehicle
        Boolean isGuest = record.getIsGuest() != null ? record.getIsGuest() : false;
        String guestPlateNumber = record.getGuestPlateNumber();
        
        // If guest and no vehicle plate, use guest plate number
        if (isGuest && plateNumber == null && guestPlateNumber != null) {
            plateNumber = guestPlateNumber;
        }
        
        return new ParkingRecordDTO(
            record.getRecordID(),
            vehicleID,
            plateNumber,
            slotID,
            slotLocation,
            verifiedByUserId,
            verifiedByUserName,
            record.getEntryTime(),
            record.getExitTime(),
            isGuest,
            guestPlateNumber
        );
    }

    public ParkingRecord toParkingRecordEntity(ParkingRecordRequestDTO dto, Vehicle vehicle, ParkingSlot slot, User verifiedByUser) {
        if (dto == null) return null;
        ParkingRecord record = new ParkingRecord();
        record.setVehicle(vehicle);
        record.setParkingSlot(slot);
        record.setVerifiedByUser(verifiedByUser);
        record.setEntryTime(dto.getEntryTime());
        record.setExitTime(dto.getExitTime());
        record.setIsGuest(false); // Default to not guest when created from DTO
        return record;
    }
}
