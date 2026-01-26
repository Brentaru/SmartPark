package com.appdev.smartpark.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.appdev.smartpark.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByEmail(String email);
    Optional<User> findByStudentId(String studentId);
    Optional<User> findByPlateNumber(String plateNumber);
    boolean existsByEmail(String email);
    List<User> findByRole(String role);
    
    // Case-insensitive role search
    @Query("SELECT u FROM User u WHERE LOWER(u.role) = LOWER(:role)")
    List<User> findByRoleIgnoreCase(@Param("role") String role);
}
