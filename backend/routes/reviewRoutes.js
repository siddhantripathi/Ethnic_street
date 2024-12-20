const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const auth = require('../middleware/authMiddleware');

// Get reviews for a product
router.get('/:productId', async (req, res) => {
  try {
    const reviews = await Review.find({ productId: req.params.productId })
      .populate('userId', 'username')
      .sort({ createdAt: -1 });

    const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;

    res.json({
      reviews,
      averageRating: isNaN(averageRating) ? 0 : averageRating
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reviews' });
  }
});

// Add a new review
router.post('/', auth, async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;

    // Check if user has already reviewed this product
    const existingReview = await Review.findOne({
      userId: req.user,
      productId
    });

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this product' });
    }

    const review = new Review({
      userId: req.user,
      productId,
      rating,
      comment
    });

    await review.save();
    
    const populatedReview = await Review.findById(review._id).populate('userId', 'username');
    res.status(201).json(populatedReview);
  } catch (error) {
    res.status(500).json({ message: 'Error creating review' });
  }
});

module.exports = router;
