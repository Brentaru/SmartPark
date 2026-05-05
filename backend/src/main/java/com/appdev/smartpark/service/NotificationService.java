package com.appdev.smartpark.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.appdev.smartpark.entity.Notification;
import com.appdev.smartpark.repository.NotificationRepository;

@Service
public class NotificationService {
    
    @Autowired
    private NotificationRepository notificationRepository;
    
    @Transactional
    public Notification createNotification(String userID, String type, String title, String message) {
        Notification notification = new Notification(userID, type, title, message);
        return notificationRepository.save(notification);
    }
    
    @Transactional
    public Notification createNotificationWithSlot(String userID, String type, String title, String message, Integer slotId) {
        Notification notification = new Notification(userID, type, title, message);
        if (slotId != null) {
            notification.setRelatedSlotId(slotId);
        }
        return notificationRepository.save(notification);
    }
    
    @Transactional
    public Notification createNotificationWithRecord(String userID, String type, String title, String message, Integer recordId) {
        Notification notification = new Notification(userID, type, title, message);
        if (recordId != null) {
            notification.setRelatedRecordId(recordId);
        }
        return notificationRepository.save(notification);
    }
    
    public List<Notification> getUserNotifications(String userID) {
        return notificationRepository.findByUserIDOrderByCreatedAtDesc(userID);
    }
    
    public List<Notification> getUnreadNotifications(String userID) {
        return notificationRepository.findByUserIDAndIsReadFalseOrderByCreatedAtDesc(userID);
    }
    
    public Long getUnreadCount(String userID) {
        return notificationRepository.countByUserIDAndIsReadFalse(userID);
    }
    
    @Transactional
    public Notification markAsRead(Integer notificationID) {
        Optional<Notification> notificationOpt = notificationRepository.findById(notificationID);
        if (notificationOpt.isPresent()) {
            Notification notification = notificationOpt.get();
            notification.setIsRead(true);
            return notificationRepository.save(notification);
        }
        return null;
    }
    
    @Transactional
    public void markAllAsRead(String userID) {
        List<Notification> unreadNotifications = getUnreadNotifications(userID);
        for (Notification notification : unreadNotifications) {
            notification.setIsRead(true);
            notificationRepository.save(notification);
        }
    }
    
    @Transactional
    public void deleteNotification(Integer notificationID) {
        notificationRepository.deleteById(notificationID);
    }
}
