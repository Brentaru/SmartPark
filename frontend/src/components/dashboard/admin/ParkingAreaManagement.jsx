import React, { useState, useEffect } from 'react';
import { parkingAreaAPI, parkingSlotAPI } from '../../../api/api';
import '../../../styles/dashboard/admin/ParkingAreaManagement.css';
import { Box, TextField, Button, Grid, Card, CardContent, Typography, IconButton, Modal } from '@mui/material';
import { Edit, Delete, Add, LocationOn } from '@mui/icons-material';
import ParkingMap from '../../dashboard/ParkingMap';

const ParkingAreaManagement = ({ onUpdate }) => {
  const [areas, setAreas] = useState([]);
  const [slots, setSlots] = useState([]);
  const [allSlots, setAllSlots] = useState([]); // Raw slot data
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showSlotModal, setShowSlotModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editSlotMode, setEditSlotMode] = useState(false);
  const [selectedTab, setSelectedTab] = useState('areas'); // 'areas' or 'slots'
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterArea, setFilterArea] = useState('all');
  const [formData, setFormData] = useState({
    areaName: '',
    location: '',
    capacity: '',
    description: ''
  });
  const [slotFormData, setSlotFormData] = useState({
    location: '',
    status: 'Available',
    slotType: 'Standard',
    areaID: ''
  });
  const [selectedArea, setSelectedArea] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);

  useEffect(() => {
    loadAreas();
    loadSlots();
  }, []);

  const loadAreas = async () => {
    try {
      setLoading(true);
      const result = await parkingAreaAPI.getAllAreas();
      if (result.success) {
        setAreas(result.data);
      }
    } catch (error) {
      console.error('Error loading areas:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSlots = async () => {
    try {
      const result = await parkingSlotAPI.getAllSlots();
      console.log('Slots API result:', result);
      if (result.success) {
        setAllSlots(result.data); // Store raw data
        // Transform slot data to match ParkingMap component format
        const transformedSlots = result.data.map(slot => ({
          id: slot.slotID,
          location: slot.slotNumber,
          status: slot.status === 'Available' ? 'free' : 
                  slot.status === 'Occupied' ? 'occupied' : 
                  slot.status === 'Reserved' ? 'reserved' : 'free'
        }));
        console.log('Transformed slots:', transformedSlots);
        setSlots(transformedSlots);
      }
    } catch (error) {
      console.error('Error loading slots:', error);
    }
  };

  const handleOpenModal = (area = null) => {
    if (area) {
      setEditMode(true);
      setSelectedArea(area);
      setFormData({
        areaName: area.areaName || '',
        location: area.location || '',
        capacity: area.capacity || '',
        description: area.description || ''
      });
    } else {
      setEditMode(false);
      setSelectedArea(null);
      setFormData({
        areaName: '',
        location: '',
        capacity: '',
        description: ''
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedArea(null);
    setEditMode(false);
    setFormData({
      areaName: '',
      location: '',
      capacity: '',
      description: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const result = editMode
        ? await parkingAreaAPI.updateArea(selectedArea.areaID, formData)
        : await parkingAreaAPI.createArea(formData);

      if (result.success) {
        alert(`Parking area ${editMode ? 'updated' : 'created'} successfully!`);
        handleCloseModal();
        loadAreas();
        loadSlots();
        if (onUpdate) onUpdate();
      } else {
        alert('Failed to save parking area: ' + result.error);
      }
    } catch (error) {
      console.error('Error saving parking area:', error);
      alert('Error saving parking area');
    }
  };

  const handleDelete = async (areaId) => {
    if (!window.confirm('Are you sure you want to delete this parking area?')) return;

    try {
      const result = await parkingAreaAPI.deleteArea(areaId);
      if (result.success) {
        alert('Parking area deleted successfully!');
        loadAreas();
        loadSlots();
        if (onUpdate) onUpdate();
      } else {
        alert('Failed to delete parking area: ' + result.error);
      }
    } catch (error) {
      console.error('Error deleting parking area:', error);
      alert('Error deleting parking area');
    }
  };

  // Slot management handlers
  const handleOpenSlotModal = (slot = null) => {
    if (slot) {
      setEditSlotMode(true);
      setSelectedSlot(slot);
      setSlotFormData({
        location: slot.location || '',
        status: slot.status || 'Available',
        slotType: slot.slotType || 'Standard',
        areaID: slot.parkingAreaID || ''
      });
    } else {
      setEditSlotMode(false);
      setSelectedSlot(null);
      setSlotFormData({
        location: '',
        status: 'Available',
        slotType: 'Standard',
        areaID: ''
      });
    }
    setShowSlotModal(true);
  };

  const handleCloseSlotModal = () => {
    setShowSlotModal(false);
    setSelectedSlot(null);
    setEditSlotMode(false);
  };

  const handleSlotSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const result = editSlotMode
        ? await parkingSlotAPI.updateSlot(selectedSlot.slotID, slotFormData)
        : await parkingSlotAPI.createSlot(slotFormData);

      if (result.success) {
        alert(`Parking slot ${editSlotMode ? 'updated' : 'created'} successfully!`);
        handleCloseSlotModal();
        loadSlots();
        if (onUpdate) onUpdate();
      } else {
        alert('Failed to save parking slot: ' + result.error);
      }
    } catch (error) {
      console.error('Error saving parking slot:', error);
      alert('Error saving parking slot');
    }
  };

  const handleDeleteSlot = async (slotId) => {
    if (!window.confirm('Are you sure you want to delete this parking slot?')) return;

    try {
      const result = await parkingSlotAPI.deleteSlot(slotId);
      if (result.success) {
        alert('Parking slot deleted successfully!');
        loadSlots();
        if (onUpdate) onUpdate();
      } else {
        alert('Failed to delete parking slot: ' + result.error);
      }
    } catch (error) {
      console.error('Error deleting parking slot:', error);
      alert('Error deleting parking slot');
    }
  };

  const getStatusBadgeClass = (status) => {
    const map = {
      'Available': 'status-available',
      'Occupied': 'status-occupied',
      'Reserved': 'status-reserved',
      'Maintenance': 'status-maintenance'
    };
    return map[status] || 'status-available';
  };

  const filteredSlots = allSlots.filter(slot => {
    const statusMatch = filterStatus === 'all' || slot.status === filterStatus;
    const areaMatch = filterArea === 'all' || slot.parkingAreaID === parseInt(filterArea);
    return statusMatch && areaMatch;
  });

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading parking areas...</p>
      </div>
    );
  }

  return (
    <div className="parking-area-management">
      <div className="management-header">
        <h2>Parking Areas & Slots Management</h2>
        <div className="tab-switcher">
          <button 
            className={`tab-btn ${selectedTab === 'areas' ? 'active' : ''}`}
            onClick={() => setSelectedTab('areas')}
          >
            📍 Areas
          </button>
          <button 
            className={`tab-btn ${selectedTab === 'slots' ? 'active' : ''}`}
            onClick={() => setSelectedTab('slots')}
          >
            🚗 Slots
          </button>
        </div>
      </div>

      {selectedTab === 'areas' ? (
        <>
          <div className="section-header">
            <button className="btn-primary" onClick={() => handleOpenModal()}>
              + Add New Area
            </button>
          </div>

          {/* Parking Map Visualization */}
          <div style={{ marginBottom: '2rem' }}>
            {console.log('Rendering ParkingMap with slots:', slots)}
            <ParkingMap 
              slots={slots} 
              guardMode={true}
              onSlotClick={(slot) => console.log('Admin clicked slot:', slot)}
            />
          </div>

          <div className="areas-grid">
            {areas.length === 0 ? (
              <div className="no-data">
                No parking areas found. Create one to get started.
              </div>
            ) : (
              areas.map(area => (
                <div key={area.areaID} className="area-card">
                  <div className="area-header">
                    <h3>{area.areaName}</h3>
                    <div className="area-actions">
                      <button
                        className="btn-icon btn-edit"
                        onClick={() => handleOpenModal(area)}
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        className="btn-icon btn-delete"
                        onClick={() => handleDelete(area.areaID)}
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                  <div className="area-body">
                    <div className="area-detail">
                      <span className="detail-icon">📍</span>
                      <span>{area.location}</span>
                    </div>
                    <div className="area-detail">
                      <span className="detail-icon">🚗</span>
                      <span>Capacity: {area.capacity} slots</span>
                    </div>
                    {area.description && (
                      <div className="area-description">
                        <p>{area.description}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      ) : (
        <>
          <div className="section-header">
            <div className="header-actions">
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="all">All Status</option>
                <option value="Available">Available</option>
                <option value="Occupied">Occupied</option>
                <option value="Reserved">Reserved</option>
                <option value="Maintenance">Maintenance</option>
              </select>

              <select value={filterArea} onChange={(e) => setFilterArea(e.target.value)}>
                <option value="all">All Areas</option>
                {areas.map(area => (
                  <option key={area.areaID} value={area.areaID}>
                    {area.areaName}
                  </option>
                ))}
              </select>

              <button className="btn-primary" onClick={() => handleOpenSlotModal()}>
                + Add New Slot
              </button>
            </div>
          </div>

          <div className="slots-table-container">
            <table className="slots-table">
              <thead>
                <tr>
                  <th>Slot ID</th>
                  <th>Location</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Area</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSlots.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="no-data">No parking slots found</td>
                  </tr>
                ) : (
                  filteredSlots.map(slot => (
                    <tr key={slot.slotID}>
                      <td className="slot-id">#{slot.slotID}</td>
                      <td>{slot.location}</td>
                      <td>{slot.slotType}</td>
                      <td>
                        <span className={`status-badge ${getStatusBadgeClass(slot.status)}`}>
                          {slot.status}
                        </span>
                      </td>
                      <td>
                        {areas.find(a => a.areaID === slot.parkingAreaID)?.areaName || 'N/A'}
                      </td>
                      <td className="actions">
                        <button
                          className="btn-icon btn-edit"
                          onClick={() => handleOpenSlotModal(slot)}
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button
                          className="btn-icon btn-delete"
                          onClick={() => handleDeleteSlot(slot.slotID)}
                          title="Delete"
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
        </>
      )}

      {/* Area Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editMode ? 'Edit Parking Area' : 'New Parking Area'}</h2>
              <button className="close-btn" onClick={handleCloseModal}>×</button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Area Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.areaName}
                    onChange={(e) => setFormData({ ...formData, areaName: e.target.value })}
                    placeholder="e.g., Building A Parking"
                  />
                </div>

                <div className="form-group">
                  <label>Location *</label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g., Near Main Entrance"
                  />
                </div>

                <div className="form-group">
                  <label>Capacity *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    placeholder="Number of slots"
                  />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Optional description..."
                    rows="3"
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={handleCloseModal}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editMode ? 'Update' : 'Create'} Area
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Slot Modal */}
      {showSlotModal && (
        <div className="modal-overlay" onClick={handleCloseSlotModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editSlotMode ? 'Edit Parking Slot' : 'New Parking Slot'}</h2>
              <button className="close-btn" onClick={handleCloseSlotModal}>×</button>
            </div>
            
            <form onSubmit={handleSlotSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Location *</label>
                  <input
                    type="text"
                    required
                    value={slotFormData.location}
                    onChange={(e) => setSlotFormData({ ...slotFormData, location: e.target.value })}
                    placeholder="e.g., A-01, B-15"
                  />
                </div>

                <div className="form-group">
                  <label>Slot Type *</label>
                  <select
                    required
                    value={slotFormData.slotType}
                    onChange={(e) => setSlotFormData({ ...slotFormData, slotType: e.target.value })}
                  >
                    <option value="Standard">Standard</option>
                    <option value="Compact">Compact</option>
                    <option value="Large">Large</option>
                    <option value="Handicap">Handicap</option>
                    <option value="Electric">Electric Vehicle</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Status *</label>
                  <select
                    required
                    value={slotFormData.status}
                    onChange={(e) => setSlotFormData({ ...slotFormData, status: e.target.value })}
                  >
                    <option value="Available">Available</option>
                    <option value="Occupied">Occupied</option>
                    <option value="Reserved">Reserved</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Parking Area *</label>
                  <select
                    required
                    value={slotFormData.areaID}
                    onChange={(e) => setSlotFormData({ ...slotFormData, areaID: e.target.value })}
                  >
                    <option value="">Select an area</option>
                    {areas.map(area => (
                      <option key={area.areaID} value={area.areaID}>
                        {area.areaName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={handleCloseSlotModal}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editSlotMode ? 'Update' : 'Create'} Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParkingAreaManagement;
