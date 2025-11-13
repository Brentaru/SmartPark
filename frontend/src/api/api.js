import axios from 'axios';

// Base API URL - adjust this based on your backend port
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

// Request interceptor - add auth token if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle common errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Unauthorized - redirect to login or refresh token
          console.error('Unauthorized access');
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          window.location.href = '/login';
          break;
        case 403:
          console.error('Forbidden access');
          break;
        case 404:
          console.error('Resource not found');
          break;
        case 500:
          console.error('Server error');
          break;
        default:
          console.error('API Error:', data?.message || error.message);
      }
    } else if (error.request) {
      // Request made but no response
      console.error('No response from server');
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// ============================================
// CENTRAL API FUNCTIONS
// ============================================

/**
 * Generic GET request
 * @param {string} endpoint - API endpoint
 * @param {object} params - Query parameters
 * @returns {Promise} Response data
 */
export const get = async (endpoint, params = {}) => {
  try {
    const response = await apiClient.get(endpoint, { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Generic POST request
 * @param {string} endpoint - API endpoint
 * @param {object} data - Request body
 * @returns {Promise} Response data
 */
export const post = async (endpoint, data = {}) => {
  try {
    const response = await apiClient.post(endpoint, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Generic PUT request
 * @param {string} endpoint - API endpoint
 * @param {object} data - Request body
 * @returns {Promise} Response data
 */
export const put = async (endpoint, data = {}) => {
  try {
    const response = await apiClient.put(endpoint, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Generic PATCH request
 * @param {string} endpoint - API endpoint
 * @param {object} data - Request body
 * @returns {Promise} Response data
 */
export const patch = async (endpoint, data = {}) => {
  try {
    const response = await apiClient.patch(endpoint, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Generic DELETE request
 * @param {string} endpoint - API endpoint
 * @returns {Promise} Response data
 */
export const remove = async (endpoint) => {
  try {
    const response = await apiClient.delete(endpoint);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ============================================
// USER API
// ============================================
export const userAPI = {
  register: (userData) => post('/users/register', userData),
  login: (credentials) => post('/users/login', credentials),
  getAllUsers: () => get('/users'),
  getUserById: (id) => get(`/users/${id}`),
  updateUser: (id, userData) => put(`/users/${id}`, userData),
  deleteUser: (id) => remove(`/users/${id}`),
};

// ============================================
// PARKING SLOT API
// ============================================
export const parkingSlotAPI = {
  createParkingSlot: (slotData) => post('/parking-slots', slotData),
  getAllParkingSlots: () => get('/parking-slots'),
  getParkingSlotById: (id) => get(`/parking-slots/${id}`),
  getSlotsByStatus: (status) => get(`/parking-slots/status/${status}`),
  getAvailableSlots: () => get('/parking-slots/available'),
  getSlotsByArea: (areaId) => get(`/parking-slots/area/${areaId}`),
  updateParkingSlot: (id, slotData) => put(`/parking-slots/${id}`, slotData),
  updateSlotStatus: (id, status) => patch(`/parking-slots/${id}/status`, { status }),
  deleteParkingSlot: (id) => remove(`/parking-slots/${id}`),
};

// ============================================
// PARKING AREA API
// ============================================
export const parkingAreaAPI = {
  createParkingArea: (areaData) => post('/parking-areas', areaData),
  getAllParkingAreas: () => get('/parking-areas'),
  getParkingAreaById: (id) => get(`/parking-areas/${id}`),
  updateParkingArea: (id, areaData) => put(`/parking-areas/${id}`, areaData),
  deleteParkingArea: (id) => remove(`/parking-areas/${id}`),
};

// ============================================
// PARKING RECORD API
// ============================================
export const parkingRecordAPI = {
  createParkingRecord: (recordData) => post('/parking-records', recordData),
  getAllParkingRecords: () => get('/parking-records'),
  getParkingRecordById: (id) => get(`/parking-records/${id}`),
  getRecordsByUser: (userId) => get(`/parking-records/user/${userId}`),
  getRecordsByVehicle: (vehicleId) => get(`/parking-records/vehicle/${vehicleId}`),
  getActiveRecords: () => get('/parking-records/active'),
  updateParkingRecord: (id, recordData) => put(`/parking-records/${id}`, recordData),
  endParkingSession: (id) => patch(`/parking-records/${id}/end`),
  deleteParkingRecord: (id) => remove(`/parking-records/${id}`),
};

// ============================================
// VEHICLE API
// ============================================
export const vehicleAPI = {
  createVehicle: (vehicleData) => post('/vehicles', vehicleData),
  getAllVehicles: () => get('/vehicles'),
  getVehicleById: (id) => get(`/vehicles/${id}`),
  getVehiclesByUser: (userId) => get(`/vehicles/user/${userId}`),
  getVehicleByPlate: (licensePlate) => get(`/vehicles/plate/${licensePlate}`),
  updateVehicle: (id, vehicleData) => put(`/vehicles/${id}`, vehicleData),
  deleteVehicle: (id) => remove(`/vehicles/${id}`),
};

// ============================================
// GUARD API
// ============================================
export const guardAPI = {
  createGuard: (guardData) => post('/guards', guardData),
  getAllGuards: () => get('/guards'),
  getGuardById: (id) => get(`/guards/${id}`),
  getGuardsByArea: (areaId) => get(`/guards/area/${areaId}`),
  updateGuard: (id, guardData) => put(`/guards/${id}`, guardData),
  deleteGuard: (id) => remove(`/guards/${id}`),
};

// Export central functions and axios instance
export { apiClient };
export default {
  get,
  post,
  put,
  patch,
  remove,
  apiClient,
  userAPI,
  parkingSlotAPI,
  parkingAreaAPI,
  parkingRecordAPI,
  vehicleAPI,
  guardAPI,
};
