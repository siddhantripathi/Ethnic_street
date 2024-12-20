import React, { useState } from 'react';

function SearchFilter({ onSearch, onFilter, onSort }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [selectedSize, setSelectedSize] = useState('');
  const [sortOrder, setSortOrder] = useState('');

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    const newPriceRange = { ...priceRange, [name]: value };
    setPriceRange(newPriceRange);
    onFilter({ ...newPriceRange, size: selectedSize });
  };

  const handleSizeChange = (e) => {
    const value = e.target.value;
    setSelectedSize(value);
    onFilter({ ...priceRange, size: value });
  };

  const handleSort = (e) => {
    const value = e.target.value;
    setSortOrder(value);
    onSort(value);
  };

  return (
    <div className="search-filter">
      <div className="search-box">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      <div className="filter-section">
        <div className="price-filter">
          <h4>Price Range</h4>
          <div className="price-inputs">
            <input
              type="number"
              name="min"
              placeholder="Min"
              value={priceRange.min}
              onChange={handlePriceChange}
            />
            <span>to</span>
            <input
              type="number"
              name="max"
              placeholder="Max"
              value={priceRange.max}
              onChange={handlePriceChange}
            />
          </div>
        </div>

        <div className="size-filter">
          <h4>Size</h4>
          <select value={selectedSize} onChange={handleSizeChange}>
            <option value="">All Sizes</option>
            <option value="Small">Small</option>
            <option value="Medium">Medium</option>
            <option value="Large">Large</option>
            <option value="X-Large">X-Large</option>
          </select>
        </div>

        <div className="sort-section">
          <h4>Sort By</h4>
          <select value={sortOrder} onChange={handleSort}>
            <option value="">Default</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="name_asc">Name: A to Z</option>
            <option value="name_desc">Name: Z to A</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default SearchFilter;
