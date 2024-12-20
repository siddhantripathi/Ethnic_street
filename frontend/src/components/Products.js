// src/components/Products.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import SearchFilter from './SearchFilter';

function Products({ addToCart }) {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/products`);
      setProducts(response.data);
      setFilteredProducts(response.data);
      setLoading(false);
    } catch (error) {
      setError('Error fetching products');
      setLoading(false);
    }
  };

  const handleSearch = (searchTerm) => {
    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  const handleFilter = ({ min, max, size }) => {
    let filtered = [...products];

    if (min) {
      filtered = filtered.filter(product => product.price >= parseFloat(min));
    }
    if (max) {
      filtered = filtered.filter(product => product.price <= parseFloat(max));
    }
    if (size) {
      filtered = filtered.filter(product => product.size === size);
    }

    setFilteredProducts(filtered);
  };

  const handleSort = (sortOrder) => {
    let sorted = [...filteredProducts];

    switch (sortOrder) {
      case 'price_asc':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'name_asc':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name_desc':
        sorted.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        sorted = [...products];
    }

    setFilteredProducts(sorted);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="products-page">
      <SearchFilter 
        onSearch={handleSearch}
        onFilter={handleFilter}
        onSort={handleSort}
      />
      
      <div className="products-list">
        {filteredProducts.length === 0 ? (
          <div className="no-results">No products found</div>
        ) : (
          filteredProducts.map((product) => (
            <div key={product._id} className="product-card">
              <Link to={`/product/${product._id}`}>
                <img src={product.imageUrl} alt={product.name} />
                <h2>{product.name}</h2>
                <p className="price">${product.price.toFixed(2)}</p>
                <p className="size">Size: {product.size}</p>
              </Link>
              <button 
                onClick={() => addToCart(product)}
                className="add-to-cart-btn"
              >
                Add to Cart
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Products;
