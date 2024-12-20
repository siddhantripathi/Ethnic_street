import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    username: '',
    email: '',
  });
  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    isDefault: false
  });
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchProfile();
    fetchAddresses();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/profile`, {
        headers: { 'x-auth-token': token }
      });
      setProfile(response.data);
    } catch (error) {
      setError('Failed to fetch profile');
    }
  };

  const fetchAddresses = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/addresses`, {
        headers: { 'x-auth-token': token }
      });
      setAddresses(response.data);
    } catch (error) {
      setError('Failed to fetch addresses');
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/users/profile`,
        {
          username: profile.username,
          email: profile.email
        },
        {
          headers: { 'x-auth-token': token }
        }
      );
      setSuccess('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      setError('Failed to update profile');
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/users/address`,
        newAddress,
        {
          headers: { 'x-auth-token': token }
        }
      );
      setNewAddress({
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        isDefault: false
      });
      setSuccess('Address added successfully');
      fetchAddresses(); // Refresh addresses list
    } catch (error) {
      setError('Failed to add address');
    }
  };

  const handleSetDefaultAddress = async (addressId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/users/address/${addressId}/default`,
        {},
        {
          headers: { 'x-auth-token': token }
        }
      );
      fetchAddresses(); // Refresh addresses list
      setSuccess('Default address updated');
    } catch (error) {
      setError('Failed to update default address');
    }
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/users/address/${addressId}`,
        {
          headers: { 'x-auth-token': token }
        }
      );
      fetchAddresses(); // Refresh addresses list
      setSuccess('Address deleted successfully');
    } catch (error) {
      setError('Failed to delete address');
    }
  };

  return (
    <div className="profile-container">
      <h1>My Profile</h1>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {/* Profile Section */}
      <div className="profile-section">
        <h2>Personal Information</h2>
        {isEditing ? (
          <form onSubmit={handleUpdateProfile}>
            <div className="form-group">
              <label>Username:</label>
              <input
                type="text"
                value={profile.username}
                onChange={(e) => setProfile({...profile, username: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({...profile, email: e.target.value})}
              />
            </div>
            <div className="button-group">
              <button type="submit">Save Changes</button>
              <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
            </div>
          </form>
        ) : (
          <div>
            <p><strong>Username:</strong> {profile.username}</p>
            <p><strong>Email:</strong> {profile.email}</p>
            <button onClick={() => setIsEditing(true)}>Edit Profile</button>
          </div>
        )}
      </div>

      {/* Addresses Section */}
      <div className="addresses-section">
        <h2>My Addresses</h2>
        <div className="addresses-list">
          {addresses.map((address) => (
            <div key={address._id} className="address-card">
              <div className="address-info">
                <p>{address.street}</p>
                <p>{address.city}, {address.state} {address.zipCode}</p>
                <p>{address.country}</p>
                {address.isDefault && <span className="default-badge">Default Address</span>}
              </div>
              <div className="address-actions">
                {!address.isDefault && (
                  <button 
                    onClick={() => handleSetDefaultAddress(address._id)}
                    className="set-default-btn"
                  >
                    Set as Default
                  </button>
                )}
                <button 
                  onClick={() => handleDeleteAddress(address._id)}
                  className="delete-btn"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        <h3>Add New Address</h3>
        <form onSubmit={handleAddAddress} className="add-address-form">
          <div className="form-group">
            <input
              type="text"
              placeholder="Street"
              value={newAddress.street}
              onChange={(e) => setNewAddress({...newAddress, street: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              placeholder="City"
              value={newAddress.city}
              onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              placeholder="State"
              value={newAddress.state}
              onChange={(e) => setNewAddress({...newAddress, state: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              placeholder="ZIP Code"
              value={newAddress.zipCode}
              onChange={(e) => setNewAddress({...newAddress, zipCode: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              placeholder="Country"
              value={newAddress.country}
              onChange={(e) => setNewAddress({...newAddress, country: e.target.value})}
              required
            />
          </div>
          <div className="form-group checkbox">
            <label>
              <input
                type="checkbox"
                checked={newAddress.isDefault}
                onChange={(e) => setNewAddress({...newAddress, isDefault: e.target.checked})}
              />
              Set as default address
            </label>
          </div>
          <button type="submit">Add Address</button>
        </form>
      </div>
    </div>
  );
}

export default Profile;
