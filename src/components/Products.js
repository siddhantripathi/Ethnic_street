import React from 'react';
import Product from './Product';

// Dummy product data
const productsData = [
  { id: 1, name: 'Saree', price: 49.99, image: '/images/saree.jpg' },
  { id: 2, name: 'Kurta', price: 29.99, image: '/images/kurta.jpg' },
  { id: 3, name: 'Sherwani', price: 99.99, image: '/images/sherwani.jpg' }
];

function Products({ addToCart }) {
  return (
    <div className="container">
      <h1>Products</h1>
      <div className="products-list">
        {productsData.map((product) => (
          <Product key={product.id} product={product} addToCart={addToCart} />
        ))}
      </div>
    </div>
  );
}

export default Products;
