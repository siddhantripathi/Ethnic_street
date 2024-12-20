import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navigation({ cartItemCount }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/products">Products</Link>
      <Link to="/cart">Cart ({cartItemCount})</Link>
      
      {!user ? (
        <>
          <Link to="/register">Register</Link>
          <Link to="/login">Login</Link>
        </>
      ) : (
        <>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/add-product">Add Product</Link>
          <button 
            onClick={logout}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              padding: '0.5rem 1rem',
              fontSize: '1rem'
            }}
          >
            Logout
          </button>
          <Link 
            to="/profile"
            style={{
              color: 'white',
              textDecoration: 'none',
              padding: '0.5rem 1rem',
              marginLeft: '1rem',
              background: '#444',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Welcome, {user.username}
          </Link>
        </>
      )}
    </nav>
  );
}

export default Navigation;