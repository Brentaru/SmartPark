// ============================================
// REUSABLE API MODULE FOR SMARTPARK
// Simple and easy to understand for college projects
// ============================================

import { API_BASE_URL } from './config';

// ============================================
// HELPER FUNCTION - Makes API calls easier
// ============================================

/**
 * Generic API request function
 * @param {string} endpoint - API endpoint (e.g., '/users/login')
 * @param {string} method - HTTP method (GET, POST, PUT, DELETE)
 * @param {object} data - Request body (optional)
 * @returns {Promise} Response data
 */
const apiRequest = async (endpoint, method = 'GET', data = null) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const options = {
    method: method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // Add body for POST, PUT, PATCH requests
  if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
    options.body = JSON.stringify(data);
  }

  try {
    console.log(`🌐 API Request: ${method} ${url}`);
    if (data) console.log('📦 Request Body:', data);
    
    const response = await fetch(url, options);
    
    // Validate response before parsing
    if (!response || typeof response !== 'object') {
      console.error('❌ Invalid response object:', response);
      return { success: false, error: 'Invalid response from server' };
    }

    let result;
    try {
      result = await response.json();
    } catch (jsonError) {
      console.error('❌ Failed to parse response as JSON:', jsonError);
      console.error('Response status:', response.status);
      return { success: false, error: 'Invalid JSON response from server' };
    }

    console.log(`📨 API Response Status: ${response.status}`);
    console.log('📦 Response Data:', result);

    if (!response.ok) {
      throw new Error(result.message || `HTTP Error: ${response.status}`);
    }

    return { success: true, data: result };
  } catch (error) {
    console.error('❌ API Error:', error.message);
    console.error('Full Error:', error);
    return { success: false, error: error.message };
  }
};


// ============================================
// USER API - Authentication & User Management
// ============================================
const userAPI = {
  // Register new user
  register: (userData) => apiRequest('/users/register', 'POST', {
    studentId: userData.studentId,
    fname: userData.firstName,
    lname: userData.lastName,
    email: userData.email,
    password: userData.password,
    role: userData.role || 'student',
    contact: userData.contactNumber
  }),

  // Login user
  login: (studentId, password) => apiRequest('/users/login', 'POST', { studentId, password }),

  // Get all users
  getAllUsers: () => apiRequest('/users'),

  // Get user by ID
  getUserById: (id) => apiRequest(`/users/${id}`),

  // Get user by student ID
  getUserByStudentId: (studentId) => apiRequest(`/users/student/${studentId}`),

  // Get user by plate number
  getUserByPlateNumber: (plateNumber) => apiRequest(`/users/plate/${plateNumber}`),

  // Update user
  updateUser: (id, userData) => apiRequest(`/users/${id}`, 'PUT', userData),

  // Update profile (same as updateUser but for clarity)
  updateProfile: (id, userData) => apiRequest(`/users/${id}`, 'PUT', userData),

  // Change password
  changePassword: (id, currentPassword, newPassword) => apiRequest(`/users/${id}/change-password`, 'PUT', {
    currentPassword,
    newPassword
  }),

  // Delete user
  deleteUser: (id) => apiRequest(`/users/${id}`, 'DELETE'),
};

// ============================================
// PARKING SLOT API
// ============================================
const parkingSlotAPI = {
  // Get all parking slots
  getAllSlots: () => apiRequest('/parking-slots'),

  // Get slot by ID
  getSlotById: (id) => apiRequest(`/parking-slots/${id}`),

  // Get slots by area
  getSlotsByArea: (areaId) => apiRequest(`/parking-slots/area/${areaId}`),

  // Get available slots
  getAvailableSlots: () => apiRequest('/parking-slots/available'),

  // Create new slot
  createSlot: (slotData) => apiRequest('/parking-slots', 'POST', slotData),

  // Update slot
  updateSlot: (id, slotData) => apiRequest(`/parking-slots/${id}`, 'PUT', slotData),

  // Delete slot
  deleteSlot: (id) => apiRequest(`/parking-slots/${id}`, 'DELETE'),

  // Reserve a slot (Staff/Guard only)
  reserveSlot: (slotId, userId, reservedFor) => apiRequest(`/parking-slots/${slotId}/reserve`, 'POST', {
    userId,
    reservedFor
  }),

  // Cancel reservation
  cancelReservation: (slotId) => apiRequest(`/parking-slots/${slotId}/cancel-reservation`, 'POST'),

  // Get reserved slots
  getReservedSlots: () => apiRequest('/parking-slots/reserved'),

  // Get slots reserved by user
  getSlotsByReservedBy: (userId) => apiRequest(`/parking-slots/reserved/user/${userId}`),
};

// ============================================
// PARKING AREA API
// ============================================
const parkingAreaAPI = {
  // Get all parking areas
  getAllAreas: () => apiRequest('/parking-areas'),

  // Get area by ID
  getAreaById: (id) => apiRequest(`/parking-areas/${id}`),

  // Create new area
  createArea: (areaData) => apiRequest('/parking-areas', 'POST', areaData),

  // Update area
  updateArea: (id, areaData) => apiRequest(`/parking-areas/${id}`, 'PUT', areaData),

  // Delete area
  deleteArea: (id) => apiRequest(`/parking-areas/${id}`, 'DELETE'),
};

// ============================================
// PARKING RECORD API
// ============================================
const parkingRecordAPI = {
  // Get all records
  getAllRecords: () => apiRequest('/parking-records'),

  // Get record by ID
  getRecordById: (id) => apiRequest(`/parking-records/${id}`),

  // Get records by user
  getRecordsByUser: (userId) => apiRequest(`/parking-records/user/${userId}`),

  // Get active records
  getActiveRecords: () => apiRequest('/parking-records/active'),

  // Create new record (park vehicle)
  createRecord: (recordData) => apiRequest('/parking-records', 'POST', recordData),

  // Update record
  updateRecord: (id, recordData) => apiRequest(`/parking-records/${id}`, 'PUT', recordData),

  // End parking session
  endSession: (id) => apiRequest(`/parking-records/${id}/end`, 'PATCH'),

  // Delete record
  deleteRecord: (id) => apiRequest(`/parking-records/${id}`, 'DELETE'),
};

// ============================================
// VEHICLE API
// ============================================
const vehicleAPI = {
  // Get all vehicles
  getAllVehicles: () => apiRequest('/vehicles'),

  // Get vehicle by ID
  getVehicleById: (id) => apiRequest(`/vehicles/${id}`),

  // Get vehicles by user
  getVehiclesByUser: (userId) => apiRequest(`/vehicles/user/${userId}`),

  // Get vehicle by license plate
  getVehicleByPlate: (licensePlate) => apiRequest(`/vehicles/plate/${licensePlate}`),

  // Create new vehicle
  createVehicle: (vehicleData) => apiRequest('/vehicles', 'POST', vehicleData),

  // Update vehicle
  updateVehicle: (id, vehicleData) => apiRequest(`/vehicles/${id}`, 'PUT', vehicleData),

  // Delete vehicle
  deleteVehicle: (id) => apiRequest(`/vehicles/${id}`, 'DELETE'),
};

// ============================================
// GUARD API
// ============================================
const guardAPI = {
  // Get all guards
  getAllGuards: () => apiRequest('/guards'),

  // Get guard by ID
  getGuardById: (id) => apiRequest(`/guards/${id}`),

  // Get guards by area
  getGuardsByArea: (areaId) => apiRequest(`/guards/area/${areaId}`),

  // Create new guard
  createGuard: (guardData) => apiRequest('/guards', 'POST', guardData),

  // Update guard
  updateGuard: (id, guardData) => apiRequest(`/guards/${id}`, 'PUT', guardData),

  // Delete guard
  deleteGuard: (id) => apiRequest(`/guards/${id}`, 'DELETE'),
};

// ============================================
// NOTIFICATION API
// ============================================
const notificationAPI = {
  // Get all notifications for a user
  getUserNotifications: (userId) => apiRequest(`/notifications/user/${userId}`),

  // Get unread notifications for a user
  getUnreadNotifications: (userId) => apiRequest(`/notifications/user/${userId}/unread`),

  // Get unread notification count
  getUnreadCount: (userId) => apiRequest(`/notifications/user/${userId}/unread/count`),

  // Mark notification as read
  markAsRead: (notificationId) => apiRequest(`/notifications/${notificationId}/read`, 'PUT'),

  // Mark all notifications as read
  markAllAsRead: (userId) => apiRequest(`/notifications/user/${userId}/read-all`, 'PUT'),

  // Delete notification
  deleteNotification: (notificationId) => apiRequest(`/notifications/${notificationId}`, 'DELETE'),
};

// ============================================
// EXPORT ALL API MODULES
// ============================================
export {
  userAPI,
  parkingSlotAPI,
  parkingAreaAPI,
  parkingRecordAPI,
  vehicleAPI,
  guardAPI,
  notificationAPI,
};

// Default export with all APIs
export default {
  users: userAPI,
  slots: parkingSlotAPI,
  areas: parkingAreaAPI,
  records: parkingRecordAPI,
  vehicles: vehicleAPI,
  guards: guardAPI,
  notifications: notificationAPI,
};
