import React from 'react';

<<<<<<< HEAD
function Checkout({ cart }) {
  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  return (
    <div className="container">
      <h1>Checkout</h1>
      {cart.length > 0 ? (
        <div>
          <h3>Order Summary</h3>
          <ul>
            {cart.map((item) => (
              <li key={item.id}>
                {item.name} - ${item.price.toFixed(2)} x {item.quantity}
              </li>
            ))}
          </ul>
          <h3>Total: ${getTotalPrice()}</h3>
          <button onClick={() => alert('Order placed successfully!')}>Place Order</button>
        </div>
      ) : (
        <p>Your cart is empty.</p>
      )}
=======
function Checkout() {
  return (
    <div className="container">
      <h1>Checkout</h1>
      <p>Enter your shipping and payment details to complete your purchase.</p>
>>>>>>> 88059e8256ee21812793bf1b4ba58a5099a4631c
    </div>
  );
}

export default Checkout;
