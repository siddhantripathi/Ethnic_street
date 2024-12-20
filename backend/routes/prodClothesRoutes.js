// backend/routes/prodClothesRoutes.js
const express = require('express');
const Product = require('../models/productClothes');
const auth = require('../middleware/authMiddleware'); // Import auth middleware
const User = require('../models/User'); // Import User model
const router = express.Router();

// Route to add a new product - now requires authentication
router.post('/add-product', auth, async (req, res) => {
  try {
    console.log('Received product data:', req.body);

    const { name, description, price, size, color, imageUrl, stock } = req.body;

    // Get user information
    const user = await User.findById(req.user);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Validate required fields
    if (!name || !description || !price) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const newProduct = new Product({
      name,
      description,
      price: parseFloat(price),
      size,
      color,
      imageUrl,
      stock: parseInt(stock),
      createdBy: {
        userId: user._id,
        username: user.username,
        email: user.email
      }
    });

    console.log('Creating new product:', newProduct);

    const savedProduct = await newProduct.save();
    console.log('Product saved:', savedProduct);

    res.status(201).json({ 
      message: 'Product added successfully', 
      product: savedProduct 
    });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ 
      message: 'Failed to add product', 
      error: error.message 
    });
  }
});

// Route to get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
});

// Add this new route to get a single product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Error fetching product details' });
  }
});

module.exports = router;
