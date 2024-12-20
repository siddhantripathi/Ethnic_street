const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Address = require('../models/Address');
const auth = require('../middleware/authMiddleware');

// Add this new route to get user details with addresses
router.get('/address/:addressId/user', auth, async (req, res) => {
  try {
    // First find the address
    const address = await Address.findById(req.params.addressId);
    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }

    // Then find the user using userId from the address
    const user = await User.findById(address.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return both user and address details
    res.json({
      user: {
        username: user.username,
        email: user.email,
        _id: user._id
      },
      address: address
    });
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user profile with addresses
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user).select('-password');
    const addresses = await Address.find({ userId: req.user });
    
    res.json({
      ...user.toObject(),
      addresses
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add new address
router.post('/address', auth, async (req, res) => {
  try {
    const newAddress = new Address({
      userId: req.user,
      ...req.body
    });
    
    await newAddress.save();
    res.status(201).json(newAddress);
  } catch (error) {
    console.error('Error adding address:', error);
    res.status(500).json({ message: 'Failed to add address' });
  }
});

// Get all addresses for a user
router.get('/addresses', auth, async (req, res) => {
  try {
    const addresses = await Address.find({ userId: req.user });
    res.json(addresses);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch addresses' });
  }
});

// Delete an address
router.delete('/address/:id', auth, async (req, res) => {
  try {
    const address = await Address.findOneAndDelete({
      _id: req.params.id,
      userId: req.user
    });
    
    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }
    
    res.json({ message: 'Address deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete address' });
  }
});

// Update an address
router.put('/address/:id', auth, async (req, res) => {
  try {
    const address = await Address.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user
      },
      req.body,
      { new: true }
    );
    
    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }
    
    res.json(address);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update address' });
  }
});

module.exports = router;
