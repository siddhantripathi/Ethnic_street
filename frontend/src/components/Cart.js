// src/components/Cart.js
import React from 'react';

function Cart({ cart, removeFromCart, updateQuantity }) {
  // Calculate total price of items in the cart
  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  return (
    <div className="container">
      <h1>Your Shopping Cart</h1>
      {cart.length > 0 ? (
        <div>
          <h3>Cart Items</h3>
          <ul>
            {cart.map((item) => (
              <li key={item._id}>
                <div className="cart-item">
                  <h3>{item.name}</h3>
                  <p>Price: ${item.price.toFixed(2)}</p>
                  <div>
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span> Quantity: {item.quantity} </span>
                    <button onClick={() => updateQuantity(item._id, item.quantity + 1)}>+</button>
                  </div>
                  <button onClick={() => removeFromCart(item._id)}>Remove</button>
                </div>
              </li>
            ))}
          </ul>
          <h3>Total: ${getTotalPrice()}</h3>
          <button onClick={() => alert('Proceed to Checkout!')}>Proceed to Checkout</button>
        </div>
      ) : (
        <p>Your cart is empty.</p>
      )}
    </div>
  );
}

export default Cart;
