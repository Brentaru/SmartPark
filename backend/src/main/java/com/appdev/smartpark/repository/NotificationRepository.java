package com.appdev.smartpark.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.appdev.smartpark.entity.Notification;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Integer> {
    
    List<Notification> findByUserIDOrderByCreatedAtDesc(String userID);
    
    List<Notification> findByUserIDAndIsReadFalseOrderByCreatedAtDesc(String userID);
    
    Long countByUserIDAndIsReadFalse(String userID);
}
