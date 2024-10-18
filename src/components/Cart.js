import React from 'react';

function Cart({ cart, removeFromCart }) {
  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  return (
    <div className="container">
      <h1>Your Cart</h1>
      {cart.length > 0 ? (
        <div>
          <ul>
            {cart.map((item) => (
              <li key={item.id}>
                {item.name} - ${item.price.toFixed(5)} x {item.quantity}
                <button onClick={() => removeFromCart(item.id)} style={{ marginLeft: '10px', color: 'red' }}>Remove</button>
              </li>
            ))}
          </ul>
          <h3>Total: ${getTotalPrice()}</h3>
        </div>
      ) : (
        <p>Your cart is empty.</p>
      )}
    </div>
  );
}

export default Cart;
