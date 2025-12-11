package com.appdev.smartpark.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.appdev.smartpark.entity.Notification;
import com.appdev.smartpark.service.NotificationService;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "http://localhost:3000")
public class NotificationController {
    
    @Autowired
    private NotificationService notificationService;
    
    @GetMapping("/user/{userID}")
    public ResponseEntity<List<Notification>> getUserNotifications(@PathVariable String userID) {
        List<Notification> notifications = notificationService.getUserNotifications(userID);
        return ResponseEntity.ok(notifications);
    }
    
    @GetMapping("/user/{userID}/unread")
    public ResponseEntity<List<Notification>> getUnreadNotifications(@PathVariable String userID) {
        List<Notification> notifications = notificationService.getUnreadNotifications(userID);
        return ResponseEntity.ok(notifications);
    }
    
    @GetMapping("/user/{userID}/unread/count")
    public ResponseEntity<Map<String, Long>> getUnreadCount(@PathVariable String userID) {
        Long count = notificationService.getUnreadCount(userID);
        Map<String, Long> response = new HashMap<>();
        response.put("count", count);
        return ResponseEntity.ok(response);
    }
    
    @PutMapping("/{notificationID}/read")
    public ResponseEntity<Notification> markAsRead(@PathVariable Integer notificationID) {
        Notification notification = notificationService.markAsRead(notificationID);
        if (notification != null) {
            return ResponseEntity.ok(notification);
        }
        return ResponseEntity.notFound().build();
    }
    
    @PutMapping("/user/{userID}/read-all")
    public ResponseEntity<Map<String, String>> markAllAsRead(@PathVariable String userID) {
        notificationService.markAllAsRead(userID);
        Map<String, String> response = new HashMap<>();
        response.put("message", "All notifications marked as read");
        return ResponseEntity.ok(response);
    }
    
    @DeleteMapping("/{notificationID}")
    public ResponseEntity<Map<String, String>> deleteNotification(@PathVariable Integer notificationID) {
        notificationService.deleteNotification(notificationID);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Notification deleted");
        return ResponseEntity.ok(response);
    }
}
