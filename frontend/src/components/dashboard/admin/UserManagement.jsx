import React, { useState, useEffect } from 'react';
import { userAPI } from '../../../api/api';
import '../../../styles/dashboard/admin/UserManagement.css';
import { Box, TextField, Select, MenuItem, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Modal, FormControl, InputLabel } from '@mui/material';
import { Search, Edit, Delete, Visibility, Add } from '@mui/icons-material';

const UserManagement = ({ onUpdate }) => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, filterRole]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const result = await userAPI.getAllUsers();
      if (result.success) {
        setUsers(result.data);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.userID?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by role
    if (filterRole !== 'all') {
      filtered = filtered.filter(user => 
        (user.role?.toLowerCase() || 'pending') === filterRole.toLowerCase()
      );
    }

    setFilteredUsers(filtered);
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const user = users.find(u => u.userID === userId);
      if (!user) return;

      const updateData = {
        studentId: user.userID,
        fname: user.fullName?.split(' ')[0] || user.fname || '',
        lname: user.fullName?.split(' ').slice(1).join(' ') || user.lname || '',
        email: user.email,
        password: 'UNCHANGED',
        role: newRole,
        contact: user.contact || ''
      };

      const result = await userAPI.updateUser(userId, updateData);
      
      if (result.success) {
        alert(`User role updated to ${newRole} successfully!`);
        loadUsers();
        if (onUpdate) onUpdate();
      } else {
        alert('Failed to update user role: ' + result.error);
      }
    } catch (error) {
      console.error('Error updating user role:', error);
      alert('Error updating user role');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      const result = await userAPI.deleteUser(userId);
      if (result.success) {
        alert('User deleted successfully!');
        loadUsers();
        if (onUpdate) onUpdate();
      } else {
        alert('Failed to delete user: ' + result.error);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Error deleting user');
    }
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setEditMode(true);
    setShowModal(true);
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setEditMode(false);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
    setEditMode(false);
  };

  const getRoleBadgeClass = (role) => {
    const roleMap = {
      'Student': 'role-badge-student',
      'Staff': 'role-badge-staff',
      'Guard': 'role-badge-guard',
      'Admin': 'role-badge-admin'
    };
    return roleMap[role] || 'role-badge-pending';
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading users...</p>
      </div>
    );
  }

  return (
    <div className="user-management">
      {/* Header with Search and Filters */}
      <div className="management-header">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search by name, email, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label>Filter by Role:</label>
          <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
            <option value="all">All Users</option>
            <option value="pending">Pending</option>
            <option value="student">Students</option>
            <option value="staff">Staff</option>
            <option value="guard">Guards</option>
            <option value="admin">Admins</option>
          </select>
        </div>

        <div className="user-count">
          <strong>{filteredUsers.length}</strong> users
        </div>
      </div>

      {/* Users Table */}
      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Contact</th>
              <th>Current Role</th>
              <th>Assign Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="7" className="no-data">
                  No users found
                </td>
              </tr>
            ) : (
              filteredUsers.map(user => (
                <tr key={user.userID}>
                  <td className="user-id">{user.userID}</td>
                  <td className="user-name">
                    <strong>{user.fullName || `${user.fname} ${user.lname}`}</strong>
                  </td>
                  <td className="user-email">{user.email}</td>
                  <td className="user-contact">{user.contact || 'N/A'}</td>
                  <td>
                    <span className={`role-badge ${getRoleBadgeClass(user.role)}`}>
                      {user.role || 'Pending'}
                    </span>
                  </td>
                  <td>
                    <select
                      className="role-select"
                      value={user.role || 'pending'}
                      onChange={(e) => handleRoleChange(user.userID, e.target.value)}
                    >
                      <option value="pending">Pending</option>
                      <option value="Student">Student</option>
                      <option value="Staff">Staff</option>
                      <option value="Guard">Guard</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </td>
                  <td className="actions">
                    <button
                      className="btn-view"
                      onClick={() => handleViewUser(user)}
                      title="View Details"
                    >
                      👁️
                    </button>
                    <button
                      className="btn-edit"
                      onClick={() => handleEditUser(user)}
                      title="Edit User"
                    >
                      ✏️
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDeleteUser(user.userID)}
                      title="Delete User"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* User Detail Modal */}
      {showModal && selectedUser && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editMode ? 'Edit User' : 'User Details'}</h2>
              <button className="close-btn" onClick={closeModal}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="detail-row">
                <label>User ID:</label>
                <span>{selectedUser.userID}</span>
              </div>
              <div className="detail-row">
                <label>Name:</label>
                <span>{selectedUser.fullName || `${selectedUser.fname} ${selectedUser.lname}`}</span>
              </div>
              <div className="detail-row">
                <label>Email:</label>
                <span>{selectedUser.email}</span>
              </div>
              <div className="detail-row">
                <label>Contact:</label>
                <span>{selectedUser.contact || 'N/A'}</span>
              </div>
              <div className="detail-row">
                <label>Role:</label>
                <span className={`role-badge ${getRoleBadgeClass(selectedUser.role)}`}>
                  {selectedUser.role || 'Pending'}
                </span>
              </div>
              {selectedUser.plateNumber && (
                <>
                  <div className="detail-row">
                    <label>Plate Number:</label>
                    <span>{selectedUser.plateNumber}</span>
                  </div>
                  <div className="detail-row">
                    <label>Vehicle Type:</label>
                    <span>{selectedUser.vehicleType || 'N/A'}</span>
                  </div>
                  <div className="detail-row">
                    <label>Vehicle Color:</label>
                    <span>{selectedUser.vehicleColor || 'N/A'}</span>
                  </div>
                </>
              )}
            </div>

            <div className="modal-footer">
              <button className="btn-secondary" onClick={closeModal}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
