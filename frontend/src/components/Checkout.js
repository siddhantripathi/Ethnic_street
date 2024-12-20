import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import OrderSummary from './OrderSummary';
import PaymentForm from './PaymentForm';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

function Checkout({ cart }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchAddresses();
  }, [user, navigate]);

  const fetchAddresses = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/users/addresses`,
        { headers: { 'x-auth-token': token } }
      );
      setAddresses(response.data);
      setLoading(false);
    } catch (error) {
      setError('Error fetching addresses');
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="checkout-container">
      <h1>Checkout</h1>
      
      <div className="checkout-grid">
        <div className="shipping-section">
          <h2>Shipping Address</h2>
          {addresses.length === 0 ? (
            <p>No addresses found. Please add an address in your profile.</p>
          ) : (
            <div className="address-list">
              {addresses.map((address) => (
                <div 
                  key={address._id}
                  className={`address-card ${selectedAddress?._id === address._id ? 'selected' : ''}`}
                  onClick={() => setSelectedAddress(address)}
                >
                  <p>{address.street}</p>
                  <p>{address.city}, {address.state} {address.zipCode}</p>
                  <p>{address.country}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <OrderSummary cart={cart} total={calculateTotal()} />

        {selectedAddress && (
          <div className="payment-section">
            <h2>Payment</h2>
            <Elements stripe={stripePromise}>
              <PaymentForm
                amount={calculateTotal()}
                cart={cart}
                shippingAddress={selectedAddress}
              />
            </Elements>
          </div>
        )}
      </div>
    </div>
  );
}

export default Checkout;
