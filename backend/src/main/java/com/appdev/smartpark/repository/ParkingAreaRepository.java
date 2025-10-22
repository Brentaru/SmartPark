package com.appdev.smartpark.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.appdev.smartpark.entity.ParkingArea;

@Repository
public interface ParkingAreaRepository extends JpaRepository<ParkingArea, Integer> {
}
