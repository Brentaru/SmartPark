// Temporary mock data (acts like backend storage)
// This simulates a database until backend is implemented

// Mock Users Database (stored in localStorage)
const USERS_STORAGE_KEY = 'smartpark_users';
const CURRENT_USER_KEY = 'smartpark_current_user';

// Initialize with some sample users
const initialUsers = [
  {
    id: '21-0001-123',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@university.edu',
    contactNumber: '09123456789',
    password: 'Password123', // In real app, this would be hashed
    role: 'student', // Changed from 'unassigned' to 'student'
    createdAt: new Date().toISOString(),
  },
  {
    id: '21-0002-456',
    firstName: 'Jane',  
    lastName: 'Smith',
    email: 'jane.smith@university.edu',
    contactNumber: '09187654321',
    password: 'Password123',
    role: 'student', // Changed from 'unassigned' to 'student'
    createdAt: new Date().toISOString(),
  },
  {
    id: '99-9999-999',
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@university.edu',
    contactNumber: '09111111111',
    password: 'Admin123',
    role: 'admin',
    createdAt: new Date().toISOString(),
  },
];

// Initialize localStorage if empty
const initializeMockData = () => {
  if (!localStorage.getItem(USERS_STORAGE_KEY)) {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(initialUsers));
  }
};

// User Management Functions
export const mockDataService = {
  // Initialize data
  init: () => {
    initializeMockData();
  },

  // Get all users
  getAllUsers: () => {
    const users = localStorage.getItem(USERS_STORAGE_KEY);
    return users ? JSON.parse(users) : [];
  },

  // Find user by ID
  findUserById: (id) => {
    const users = mockDataService.getAllUsers();
    return users.find(user => user.id === id);
  },

  // Find user by email
  findUserByEmail: (email) => {
    const users = mockDataService.getAllUsers();
    return users.find(user => user.email.toLowerCase() === email.toLowerCase());
  },

  // Register new user
  registerUser: (userData) => {
    const users = mockDataService.getAllUsers();
    
    // Check if user already exists
    const existingUser = users.find(
      user => user.email.toLowerCase() === userData.email.toLowerCase() || user.id === userData.id
    );
    
    if (existingUser) {
      throw new Error('User with this email or ID already exists');
    }

    const newUser = {
      id: userData.id || `USER-${Date.now()}`,
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      contactNumber: userData.contactNumber,
      password: userData.password, // In real app, hash this
      role: userData.role || 'student', // Default to 'student' instead of 'unassigned'
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    
    return { ...newUser, password: undefined }; // Don't return password
  },

  // Login user
  loginUser: (id, password) => {
    const users = mockDataService.getAllUsers();
    const user = users.find(u => u.id === id);

    if (!user) {
      throw new Error('Invalid ID or password');
    }

    if (user.password !== password) {
      throw new Error('Invalid ID or password');
    }

    // Store current user
    const userSession = { ...user, password: undefined };
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userSession));
    
    return userSession;
  },

  // Logout user
  logoutUser: () => {
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  // Get current logged-in user
  getCurrentUser: () => {
    const user = localStorage.getItem(CURRENT_USER_KEY);
    return user ? JSON.parse(user) : null;
  },

  // Update user
  updateUser: (userId, updates) => {
    const users = mockDataService.getAllUsers();
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
      throw new Error('User not found');
    }

    users[userIndex] = { ...users[userIndex], ...updates };
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));

    // Update current user if it's the same user
    const currentUser = mockDataService.getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify({ ...users[userIndex], password: undefined }));
    }

    return { ...users[userIndex], password: undefined };
  },

  // Delete user
  deleteUser: (userId) => {
    const users = mockDataService.getAllUsers();
    const filteredUsers = users.filter(u => u.id !== userId);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(filteredUsers));

    // Logout if current user is deleted
    const currentUser = mockDataService.getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      mockDataService.logoutUser();
    }
  },

  // Clear all data (for testing)
  clearAllData: () => {
    localStorage.removeItem(USERS_STORAGE_KEY);
    localStorage.removeItem(CURRENT_USER_KEY);
    initializeMockData();
  },
};

// Initialize on load
mockDataService.init();

// Mock Parking History Data
export const mockParkingHistory = [
  {
    id: 1,
    date: '2025-11-15',
    slot: 'A-12',
    area: 'NGE Parking Area',
    timeIn: '08:30 AM',
    timeOut: '05:45 PM',
    duration: '9h 15m',
    status: 'Completed',
    vehicle: 'ABC-1234'
  },
  {
    id: 2,
    date: '2025-11-14',
    slot: 'B-05',
    area: 'NGE Parking Area',
    timeIn: '09:15 AM',
    timeOut: '04:30 PM',
    duration: '7h 15m',
    status: 'Completed',
    vehicle: 'ABC-1234'
  },
  {
    id: 3,
    date: '2025-11-13',
    slot: 'A-12',
    area: 'NGE Parking Area',
    timeIn: '08:00 AM',
    timeOut: '06:00 PM',
    duration: '10h 0m',
    status: 'Completed',
    vehicle: 'ABC-1234'
  },
  {
    id: 4,
    date: '2025-11-12',
    slot: 'A-04',
    area: 'NGE Parking Area',
    timeIn: '10:00 AM',
    timeOut: '03:45 PM',
    duration: '5h 45m',
    status: 'Completed',
    vehicle: 'ABC-1234'
  },
  {
    id: 5,
    date: '2025-11-11',
    slot: 'A-12',
    area: 'NGE Parking Area',
    timeIn: '07:45 AM',
    timeOut: '04:15 PM',
    duration: '8h 30m',
    status: 'Completed',
    vehicle: 'ABC-1234'
  },
  {
    id: 6,
    date: '2025-11-08',
    slot: 'B-03',
    area: 'NGE Parking Area',
    timeIn: '09:30 AM',
    timeOut: '05:00 PM',
    duration: '7h 30m',
    status: 'Completed',
    vehicle: 'ABC-1234'
  },
  {
    id: 7,
    date: '2025-11-07',
    slot: 'A-08',
    area: 'NGE Parking Area',
    timeIn: '08:15 AM',
    timeOut: null,
    duration: null,
    status: 'Expired',
    vehicle: 'ABC-1234'
  },
  {
    id: 8,
    date: '2025-11-06',
    slot: 'B-02',
    area: 'NGE Parking Area',
    timeIn: '10:30 AM',
    timeOut: '02:15 PM',
    duration: '3h 45m',
    status: 'Completed',
    vehicle: 'ABC-1234'
  }
];

// Mock Dashboard Data
export const mockDashboardData = {
  currentReservation: {
    slot: 'A-12',
    date: 'November 3, 2025',
    timeStart: '8:00 AM',
    timeEnd: '6:00 PM',
    location: 'NGE Parking Area'
  },
  
  parkingAreas: [
    'NGE Parking Area'
  ],
  
  notifications: [
    { 
      id: 1,
      type: 'warning', 
      message: 'Your reservation will expire in 15 minutes. Please renew or vacate the slot.',
      time: '5 minutes ago'
    },
    { 
      id: 2,
      type: 'info', 
      message: 'Parking Lot C will be closed for maintenance tomorrow (Nov 3) from 8 AM to 12 PM.',
      time: '2 hours ago'
    },
    { 
      id: 3,
      type: 'success', 
      message: 'Your parking fee payment of $15.00 has been processed successfully.',
      time: '1 day ago'
    },
    { 
      id: 4,
      type: 'info', 
      message: 'New parking rates will be effective from November 15, 2025. Check your email for details.',
      time: '2 days ago'
    },
  ],
  
  stats: {
    totalVisits: 24
  },
  
  recentActivity: [
    { date: '2025-11-02', timeIn: '08:30 AM', timeOut: '05:45 PM', slot: 'A-12', duration: 555, status: 'Completed' },
    { date: '2025-11-01', timeIn: '09:15 AM', timeOut: '04:30 PM', slot: 'B-05', duration: 435, status: 'Completed' },
    { date: '2025-10-31', timeIn: '08:00 AM', timeOut: '06:00 PM', slot: 'A-12', duration: 600, status: 'Completed' },
    { date: '2025-10-30', timeIn: '10:00 AM', timeOut: '03:45 PM', slot: 'C-18', duration: 345, status: 'Completed' },
    { date: '2025-10-29', timeIn: '07:45 AM', timeOut: '04:15 PM', slot: 'A-12', duration: 510, status: 'Completed' },
    { date: '2025-10-28', timeIn: '09:30 AM', timeOut: '05:00 PM', slot: 'B-03', duration: 450, status: 'Completed' },
    { date: '2025-10-27', timeIn: '08:15 AM', timeOut: null, slot: 'A-08', duration: null, status: 'Expired' },
  ],
  
  parkingSlots: [
    { id: 'A-01', status: 'free' },
    { id: 'A-02', status: 'occupied' },
    { id: 'A-03', status: 'free' },
    { id: 'A-04', status: 'reserved' },
    { id: 'A-05', status: 'occupied' },
    { id: 'A-06', status: 'free' },
    { id: 'A-07', status: 'free' },
    { id: 'A-08', status: 'occupied' },
    { id: 'A-09', status: 'free' },
    { id: 'A-10', status: 'occupied' },
    { id: 'A-11', status: 'reserved' },
    { id: 'A-12', status: 'reserved' },
    { id: 'B-01', status: 'free' },
    { id: 'B-02', status: 'free' },
    { id: 'B-03', status: 'occupied' },
    { id: 'B-04', status: 'free' },
    { id: 'B-05', status: 'occupied' },
    { id: 'B-06', status: 'free' },
    { id: 'B-07', status: 'free' },
    { id: 'B-08', status: 'occupied' },
    { id: 'C-01', status: 'free' },
    { id: 'C-02', status: 'occupied' },
    { id: 'C-03', status: 'free' },
    { id: 'C-04', status: 'free' },
  ]
};

export default mockDataService;
