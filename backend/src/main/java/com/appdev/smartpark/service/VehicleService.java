package com.appdev.smartpark.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.appdev.smartpark.entity.Vehicle;
import com.appdev.smartpark.repository.VehicleRepository;

@Service
public class VehicleService {
    
    @Autowired
    private VehicleRepository vehicleRepository;
    
    // Create
    public Vehicle createVehicle(Vehicle vehicle) {
        return vehicleRepository.save(vehicle);
    }
    
    // Read All
    public List<Vehicle> getAllVehicles() {
        return vehicleRepository.findAll();
    }
    
    // Read One
    public Optional<Vehicle> getVehicleById(Integer id) {
        return vehicleRepository.findById(id);
    }
    
    // Get by Plate Number
    public Optional<Vehicle> getVehicleByPlateNumber(String plateNumber) {
        return vehicleRepository.findByPlateNumber(plateNumber);
    }
    
    // Get by User
    public List<Vehicle> getVehiclesByUser(Integer userID) {
        return vehicleRepository.findByUserUserID(userID);
    }
    
    // Update
    public Vehicle updateVehicle(Integer id, Vehicle vehicleDetails) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vehicle not found with id: " + id));
        
        vehicle.setPlateNumber(vehicleDetails.getPlateNumber());
        vehicle.setType(vehicleDetails.getType());
        vehicle.setColor(vehicleDetails.getColor());
        vehicle.setUser(vehicleDetails.getUser());
        
        return vehicleRepository.save(vehicle);
    }
    
    // Delete
    public void deleteVehicle(Integer id) {
        vehicleRepository.deleteById(id);
    }
}
