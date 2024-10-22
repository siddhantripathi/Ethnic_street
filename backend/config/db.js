const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Connect to MongoDB using the MONGO_URI from the environment variables
    await mongoose.connect(process.env.MONGO_URI); // Remove deprecated options
    console.log('MongoDB connected');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1); // Exit process with failure if connection fails
  }
};

module.exports = connectDB;
