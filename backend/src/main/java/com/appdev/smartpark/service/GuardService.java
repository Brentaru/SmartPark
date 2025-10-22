package com.appdev.smartpark.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.appdev.smartpark.entity.Guard;
import com.appdev.smartpark.repository.GuardRepository;

@Service
public class GuardService {
    
    @Autowired
    private GuardRepository guardRepository;
    
    // Create
    public Guard createGuard(Guard guard) {
        return guardRepository.save(guard);
    }
    
    // Read All
    public List<Guard> getAllGuards() {
        return guardRepository.findAll();
    }
    
    // Read One
    public Optional<Guard> getGuardById(Integer id) {
        return guardRepository.findById(id);
    }
    
    // Update
    public Guard updateGuard(Integer id, Guard guardDetails) {
        Guard guard = guardRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Guard not found with id: " + id));
        
        guard.setFname(guardDetails.getFname());
        guard.setLname(guardDetails.getLname());
        guard.setContact(guardDetails.getContact());
        guard.setShiftSchedule(guardDetails.getShiftSchedule());
        guard.setVerifiedBy(guardDetails.getVerifiedBy());
        
        return guardRepository.save(guard);
    }
    
    // Delete
    public void deleteGuard(Integer id) {
        guardRepository.deleteById(id);
    }
}
