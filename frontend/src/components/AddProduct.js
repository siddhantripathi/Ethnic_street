// src/components/AddProduct.js
import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function AddProduct() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    size: 'Small',
    color: '',
    imageUrl: '',
    stock: '',
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct(prevProduct => ({
      ...prevProduct,
      [name]: value
    }));
  };

  React.useEffect(() => {
    if (!user) {
      setErrorMessage('Please sign in to add products');
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      setErrorMessage('Please sign in to add products');
      navigate('/login');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const productData = {
        ...product,
        price: parseFloat(product.price),
        stock: parseInt(product.stock, 10),
      };

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/products/add-product`,
        productData,
        {
          headers: {
            'x-auth-token': token
          }
        }
      );

      setSuccessMessage('Product added successfully!');
      setErrorMessage('');
      setProduct({
        name: '',
        description: '',
        price: '',
        size: 'Small',
        color: '',
        imageUrl: '',
        stock: '',
      });
    } catch (error) {
      console.error('Error adding product:', error);
      setErrorMessage(error.response?.data?.message || 'Failed to add product');
      setSuccessMessage('');
    }
  };

  if (!user) {
    return (
      <div className="container">
        <h1>Add New Product</h1>
        <div style={{ color: 'red' }}>
          Please <a href="/login">sign in</a> to add products
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Add New Product</h1>
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={product.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            name="description"
            value={product.description}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Price:</label>
          <input
            type="number"
            name="price"
            value={product.price}
            onChange={handleInputChange}
            required
            min="0"
            step="0.01"
          />
        </div>
        <div>
          <label>Size:</label>
          <select
            name="size"
            value={product.size}
            onChange={handleInputChange}
          >
            <option value="Small">Small</option>
            <option value="Medium">Medium</option>
            <option value="Large">Large</option>
            <option value="X-Large">X-Large</option>
          </select>
        </div>
        <div>
          <label>Color:</label>
          <input
            type="text"
            name="color"
            value={product.color}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Image URL:</label>
          <input
            type="text"
            name="imageUrl"
            value={product.imageUrl}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Stock:</label>
          <input
            type="number"
            name="stock"
            value={product.stock}
            onChange={handleInputChange}
            required
            min="0"
          />
        </div>
        <button type="submit">Add Product</button>
      </form>
    </div>
  );
}

export default AddProduct;
