// backend/routes/authRoutes.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer'); // Import Nodemailer
const User = require('../models/User');
const auth = require('../middleware/authMiddleware'); // Add this line
const router = express.Router();

// Setup Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail', // Use Gmail service
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS, // Your app password
  },
});

// Login route with explicit database/collection reference
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Debug log
    console.log('Login attempt for email:', email);

    // Check if user exists in the 'users' collection
    const user = await User.findOne({ email }).collection('users');
    if (!user) {
      console.log('User not found:', email);
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Invalid password for user:', email);
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Create token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Debug log
    console.log('Login successful for user:', email);

    // Send response
    res.status(200).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Test route to verify user collection
router.get('/users/test', async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Register route
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    // Create and save the new user
    user = new User({ username, email, password });
    await user.save();

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Send confirmation email to the email used for registration
    const mailOptions = {
      from: process.env.EMAIL_USER, // Sender address (your email)
      to: email, // Send to the registered email
      subject: 'Registration Confirmation',
      text: `Hello ${username},\n\nWelcome to Ethnic Street!\n\nBest regards,\nEthnic Street Team`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ message: 'Email sending failed' });
      } else {
        console.log('Confirmation email sent:', info.response);
      }
    });

    // Respond with the token and success message
    res.status(201).json({ token, message: 'Registration successful, confirmation email sent' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});
router.post('/products/add-product', async (req, res) => {
  console.log('Received request to add a product'); // Add this log
  console.log('Request body:', req.body); // Log the request body
  const { name, description, price, size, color, imageUrl, stock } = req.body;
  try {
    const newProduct = new Product({
      name,
      description,
      price,
      size,
      color,
      imageUrl,
      stock,
    });
    await newProduct.save();
    res.status(201).json({ message: 'Product added successfully', product: newProduct });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ message: 'Failed to add product' });
  }
});

// Route to get all products
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
});

router.get('/verify', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
