import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import StarRating from './StarRating';
import { Link } from 'react-router-dom';

function Reviews({ productId }) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 0, comment: '' });
  const [averageRating, setAverageRating] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userHasReviewed, setUserHasReviewed] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/reviews/${productId}`);
      setReviews(response.data.reviews);
      setAverageRating(response.data.averageRating);
      if (user) {
        setUserHasReviewed(response.data.reviews.some(review => review.userId === user._id));
      }
    } catch (error) {
      setError('Failed to fetch reviews');
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      setError('Please login to submit a review');
      return;
    }
    if (newReview.rating === 0) {
      setError('Please select a rating');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/reviews`,
        {
          productId,
          rating: newReview.rating,
          comment: newReview.comment
        },
        {
          headers: { 'x-auth-token': token }
        }
      );
      setSuccess('Review submitted successfully');
      setNewReview({ rating: 0, comment: '' });
      fetchReviews();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to submit review');
    }
  };

  return (
    <div className="reviews-section">
      <h2>Customer Reviews</h2>
      <div className="average-rating">
        <StarRating rating={averageRating} readonly />
        <span>({reviews.length} reviews)</span>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {!user ? (
        <div className="login-prompt">
          <p>Please <Link to="/login">sign in</Link> to leave a review</p>
        </div>
      ) : !userHasReviewed ? (
        <div className="write-review">
          <h3>Write a Review</h3>
          <form onSubmit={handleSubmitReview}>
            <div className="rating-input">
              <label>Your Rating:</label>
              <StarRating
                rating={newReview.rating}
                onRatingChange={(rating) => setNewReview({ ...newReview, rating })}
              />
            </div>
            <div className="comment-input">
              <label>Your Review:</label>
              <textarea
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                required
                rows="4"
                placeholder="Write your review here..."
              />
            </div>
            <button type="submit">Submit Review</button>
          </form>
        </div>
      ) : (
        <p>You have already reviewed this product</p>
      )}

      <div className="reviews-list">
        {reviews.map((review) => (
          <div key={review._id} className="review-card">
            <div className="review-header">
              <StarRating rating={review.rating} readonly />
              <span className="review-date">
                {new Date(review.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p className="review-author">By {review.userId.username}</p>
            <p className="review-comment">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Reviews;
