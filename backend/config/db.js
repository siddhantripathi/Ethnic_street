const mongoose = require('mongoose');

const uri = "mongodb+srv://wearethnic378:U6fCos38GCC45e9f@cluster0.1txzx.mongodb.net/UserDb?retryWrites=true&w=majority&appName=Cluster0";
const connectDB = async () => {
  try {
    // Connect to MongoDB using the MONGO_URI from the environment variables
    await mongoose.connect(uri); // Remove deprecated options
    console.log('MongoDB connected');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1); // Exit process with failure if connection fails
  }
};

module.exports = connectDB;
