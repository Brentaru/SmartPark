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
    role: 'unassigned',
    createdAt: new Date().toISOString(),
  },
  {
    id: '21-0002-456',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@university.edu',
    contactNumber: '09187654321',
    password: 'Password123',
    role: 'unassigned',
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
      role: userData.role || 'unassigned',
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

export default mockDataService;
