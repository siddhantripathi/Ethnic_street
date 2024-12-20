import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function PaymentForm({ amount, cart, shippingAddress }) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);

    if (!stripe || !elements) {
      return;
    }

    try {
      // Create order
      const token = localStorage.getItem('token');
      const orderResponse = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/orders`,
        {
          items: cart,
          shippingAddress,
          totalAmount: amount
        },
        { headers: { 'x-auth-token': token } }
      );

      // Confirm payment
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        orderResponse.data.clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
          }
        }
      );

      if (stripeError) {
        setError(stripeError.message);
      } else if (paymentIntent.status === 'succeeded') {
        // Navigate to success page
        navigate('/order-success', { 
          state: { orderId: orderResponse.data.order._id }
        });
      }
    } catch (error) {
      setError('An error occurred while processing your payment.');
    }
    setProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <CardElement
        options={{
          style: {
            base: {
              fontSize: '16px',
              color: '#ffffff',
              '::placeholder': {
                color: '#aab7c4'
              }
            },
            invalid: {
              color: '#fa755a',
              iconColor: '#fa755a'
            }
          }
        }}
      />
      {error && <div className="error-message">{error}</div>}
      <button 
        type="submit" 
        disabled={!stripe || processing}
        className="payment-button"
      >
        {processing ? 'Processing...' : `Pay $${amount.toFixed(2)}`}
      </button>
    </form>
  );
}

export default PaymentForm;
