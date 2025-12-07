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
            user.getVehicleColor()
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
        return new ParkingSlotDTO(
            slot.getSlotID(),
            slot.getLocation(),
            slot.getStatus(),
            slot.getSlotType(),
            slot.getReservedBy(),
            slot.getReservedFor(),
            slot.getParkingArea() != null ? slot.getParkingArea().getAreaID() : null
        );
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
        return new ParkingRecordDTO(
            record.getRecordID(),
            record.getVehicle() != null ? record.getVehicle().getVehicleID() : null,
            record.getVehicle() != null ? record.getVehicle().getPlateNumber() : null,
            record.getParkingSlot() != null ? record.getParkingSlot().getSlotID() : null,
            record.getParkingSlot() != null ? record.getParkingSlot().getLocation() : null,
            record.getVerifiedByUser() != null ? record.getVerifiedByUser().getUserID() : null,
            record.getVerifiedByUser() != null ? record.getVerifiedByUser().getFname() + " " + record.getVerifiedByUser().getLname() : null,
            record.getEntryTime(),
            record.getExitTime()
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
        return record;
    }
}
