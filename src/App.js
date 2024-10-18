import './App.css'; // Importing the dark theme CSS

import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './components/Home';
import Products from './components/Products';
import Cart from './components/Cart';
import Checkout from './components/Checkout';

function App() {
  const [cart, setCart] = useState([]); // State to manage cart

  // Function to add products to the cart
  const addToCart = (product) => {
    setCart((prevCart) => {
      const productExists = prevCart.find((item) => item.id === product.id);
      if (productExists) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  return (
    <Router>
      <div>
        {/* Navigation Bar */}
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/products">Products</Link></li>
            <li><Link to="/cart">Cart ({cart.length})</Link></li>
            <li><Link to="/checkout">Checkout</Link></li>
          </ul>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products addToCart={addToCart} />} />
          <Route path="/cart" element={<Cart cart={cart} />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
