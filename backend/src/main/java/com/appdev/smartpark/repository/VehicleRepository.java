package com.appdev.smartpark.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.appdev.smartpark.entity.Vehicle;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Integer> {
    Optional<Vehicle> findFirstByPlateNumberOrderByVehicleIDDesc(String plateNumber);
    List<Vehicle> findByPlateNumber(String plateNumber);
    List<Vehicle> findByUserUserID(String userID);
}
