const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer'); // Import Nodemailer
const User = require('../models/User');
const router = express.Router();

// Setup Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail', // Use Gmail service
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS, // Your app password
  },
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
      text: `Hello ${username},\n\nThank you for registering at Ethnic Street!\n\nBest regards,\nEthnic Street Team`,
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

module.exports = router;
