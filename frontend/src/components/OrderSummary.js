import React from 'react';

function OrderSummary({ cart, total }) {
  return (
    <div className="order-summary">
      <h2>Order Summary</h2>
      <div className="cart-items">
        {cart.map((item) => (
          <div key={item._id} className="summary-item">
            <div className="item-info">
              <img src={item.imageUrl} alt={item.name} />
              <div>
                <h3>{item.name}</h3>
                <p>Size: {item.size}</p>
                <p>Quantity: {item.quantity}</p>
              </div>
            </div>
            <p className="item-price">${(item.price * item.quantity).toFixed(2)}</p>
          </div>
        ))}
      </div>
      <div className="summary-total">
        <div className="subtotal">
          <span>Subtotal:</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <div className="shipping">
          <span>Shipping:</span>
          <span>Free</span>
        </div>
        <div className="total">
          <span>Total:</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}

export default OrderSummary;
