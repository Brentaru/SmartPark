/**
 * QUICK FIX: Update Your Current User Role to 'student'
 * 
 * Copy and paste this entire code into your browser console (F12)
 * and press Enter to run it.
 */

(function updateToStudentRole() {
  const CURRENT_USER_KEY = 'smartpark_current_user';
  const USERS_STORAGE_KEY = 'smartpark_users';
  
  console.log('🔧 SmartPark - Updating user role to student...');
  
  // Get current user
  const currentUserJson = localStorage.getItem(CURRENT_USER_KEY);
  if (!currentUserJson) {
    console.error('❌ No user is currently logged in');
    return;
  }
  
  const currentUser = JSON.parse(currentUserJson);
  console.log('👤 Current user:', currentUser);
  
  // Update current user's role
  currentUser.role = 'student';
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));
  
  // Also update in users array
  const usersJson = localStorage.getItem(USERS_STORAGE_KEY);
  if (usersJson) {
    const users = JSON.parse(usersJson);
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    
    if (userIndex !== -1) {
      users[userIndex].role = 'student';
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
      console.log('✅ User role updated in users database');
    }
  }
  
  console.log('✅ User role updated to: student');
  console.log('📝 Updated user:', currentUser);
  console.log('🔄 Please refresh the page (F5) for changes to take effect.');
  
  // Ask if user wants to refresh now
  if (confirm('User role updated to student! Refresh the page now?')) {
    window.location.reload();
  }
})();
