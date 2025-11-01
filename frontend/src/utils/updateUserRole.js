// Utility to update user role in localStorage
// Run this in browser console: updateUserRole('student')

export const updateCurrentUserRole = (newRole) => {
  const CURRENT_USER_KEY = 'smartpark_current_user';
  const USERS_STORAGE_KEY = 'smartpark_users';
  
  // Get current user
  const currentUserJson = localStorage.getItem(CURRENT_USER_KEY);
  if (!currentUserJson) {
    console.error('No user is currently logged in');
    return false;
  }
  
  const currentUser = JSON.parse(currentUserJson);
  
  // Update current user's role
  currentUser.role = newRole;
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));
  
  // Also update in users array
  const usersJson = localStorage.getItem(USERS_STORAGE_KEY);
  if (usersJson) {
    const users = JSON.parse(usersJson);
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    
    if (userIndex !== -1) {
      users[userIndex].role = newRole;
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    }
  }
  
  console.log(`✅ User role updated to: ${newRole}`);
  console.log('Updated user:', currentUser);
  console.log('Please refresh the page for changes to take effect.');
  
  return true;
};

// Make it available globally for easy console access
if (typeof window !== 'undefined') {
  window.updateUserRole = updateCurrentUserRole;
}

export default updateCurrentUserRole;
