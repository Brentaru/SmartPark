import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSidebar } from '../context/SidebarContext';
import Sidebar from '../components/Sidebar';
import AuthTopbar from '../components/AuthTopbar';
import { vehicleAPI } from '../api/api';
import '../styles/MyVehicle.css';

const MyVehicle = () => {
  const { currentUser } = useAuth();
  const { isExpanded } = useSidebar();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);

  const [formData, setFormData] = useState({
    plateNumber: '',
    type: 'Car',
    color: ''
  });

  useEffect(() => {
    loadVehicles();
  }, [currentUser]);

  const loadVehicles = async () => {
    try {
      setLoading(true);
      const result = await vehicleAPI.getVehiclesByUser(currentUser.id);
      if (result.success) {
        setVehicles(result.data || []);
      } else {
        setError('Failed to load vehicles');
      }
    } catch (err) {
      console.error('Error loading vehicles:', err);
      setError('An error occurred while loading vehicles');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.plateNumber.trim() || !formData.color.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      const vehicleData = {
        plateNumber: formData.plateNumber.toUpperCase().trim(),
        type: formData.type,
        color: formData.color.trim(),
        userID: currentUser.id
      };

      let result;
      if (editingVehicle) {
        result = await vehicleAPI.updateVehicle(editingVehicle.vehicleID, vehicleData);
      } else {
        result = await vehicleAPI.createVehicle(vehicleData);
      }

      if (result.success) {
        await loadVehicles();
        resetForm();
      } else {
        setError(result.message || 'Failed to save vehicle');
      }
    } catch (err) {
      console.error('Error saving vehicle:', err);
      setError('An error occurred while saving vehicle');
    }
  };

  const handleEdit = (vehicle) => {
    setEditingVehicle(vehicle);
    setFormData({
      plateNumber: vehicle.plateNumber,
      type: vehicle.type,
      color: vehicle.color
    });
    setShowAddForm(true);
  };

  const handleDelete = async (vehicleID) => {
    if (!window.confirm('Are you sure you want to delete this vehicle?')) {
      return;
    }

    try {
      const result = await vehicleAPI.deleteVehicle(vehicleID);
      if (result.success) {
        await loadVehicles();
      } else {
        setError('Failed to delete vehicle');
      }
    } catch (err) {
      console.error('Error deleting vehicle:', err);
      setError('An error occurred while deleting vehicle');
    }
  };

  const resetForm = () => {
    setFormData({ plateNumber: '', type: 'Car', color: '' });
    setShowAddForm(false);
    setEditingVehicle(null);
    setError('');
  };

  return (
    <div className="my-vehicle-page">
      <AuthTopbar pageTitle="My Vehicle" />
      
      <div className="dashboard-layout">
        <Sidebar />
        
        <main className={`dashboard-main ${isExpanded ? '' : 'sidebar-collapsed'}`}>
          <div className="my-vehicle-container">
            <div className="page-header">
              <div>
                <h1 className="page-title">My Vehicles</h1>
                <p className="page-subtitle">Manage your registered vehicles</p>
              </div>
              <button 
                className="add-vehicle-btn" 
                onClick={() => setShowAddForm(!showAddForm)}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                {showAddForm ? 'Cancel' : 'Add Vehicle'}
              </button>
            </div>

            {error && (
              <div className="alert alert-error">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {error}
              </div>
            )}

            {showAddForm && (
              <div className="vehicle-form-card">
                <h3 className="form-card-title">
                  {editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}
                </h3>
                <form onSubmit={handleSubmit} className="vehicle-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="plateNumber">
                        Plate Number <span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        id="plateNumber"
                        name="plateNumber"
                        value={formData.plateNumber}
                        onChange={handleChange}
                        placeholder="e.g., ABC-1234"
                        className="form-input"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="type">
                        Vehicle Type <span className="required">*</span>
                      </label>
                      <select
                        id="type"
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className="form-input"
                        required
                      >
                        <option value="Car">Car</option>
                        <option value="Motorcycle">Motorcycle</option>
                        <option value="SUV">SUV</option>
                        <option value="Van">Van</option>
                        <option value="Truck">Truck</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="color">
                        Vehicle Color <span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        id="color"
                        name="color"
                        value={formData.color}
                        onChange={handleChange}
                        placeholder="e.g., Black, White, Red"
                        className="form-input"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-actions">
                    <button type="button" className="btn-secondary" onClick={resetForm}>
                      Cancel
                    </button>
                    <button type="submit" className="btn-primary">
                      {editingVehicle ? 'Update Vehicle' : 'Add Vehicle'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {loading ? (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Loading vehicles...</p>
              </div>
            ) : vehicles.length === 0 ? (
              <div className="empty-state">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H5.24a2 2 0 0 0-1.8 1.1l-.8 1.63A6 6 0 0 0 2 12.42V16h2"/>
                  <circle cx="6.5" cy="16.5" r="2.5"/>
                  <circle cx="16.5" cy="16.5" r="2.5"/>
                </svg>
                <h3>No Vehicles Registered</h3>
                <p>Add your first vehicle to get started</p>
                <button className="btn-primary" onClick={() => setShowAddForm(true)}>
                  Add Vehicle
                </button>
              </div>
            ) : (
              <div className="vehicles-grid">
                {vehicles.map((vehicle) => (
                  <div key={vehicle.vehicleID} className="vehicle-card">
                    <div className="vehicle-icon">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H5.24a2 2 0 0 0-1.8 1.1l-.8 1.63A6 6 0 0 0 2 12.42V16h2"/>
                        <circle cx="6.5" cy="16.5" r="2.5"/>
                        <circle cx="16.5" cy="16.5" r="2.5"/>
                      </svg>
                    </div>
                    <div className="vehicle-info">
                      <h3 className="vehicle-plate">{vehicle.plateNumber}</h3>
                      <div className="vehicle-details">
                        <span className="vehicle-type">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="11" width="18" height="11" rx="2"/>
                          </svg>
                          {vehicle.type}
                        </span>
                        <span className="vehicle-color">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"/>
                          </svg>
                          {vehicle.color}
                        </span>
                      </div>
                    </div>
                    <div className="vehicle-actions">
                      <button 
                        className="action-btn edit-btn" 
                        onClick={() => handleEdit(vehicle)}
                        title="Edit"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                      </button>
                      <button 
                        className="action-btn delete-btn" 
                        onClick={() => handleDelete(vehicle.vehicleID)}
                        title="Delete"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6"/>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                          <line x1="10" y1="11" x2="10" y2="17"/>
                          <line x1="14" y1="11" x2="14" y2="17"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MyVehicle;
