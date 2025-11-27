import React from 'react';
import { Link } from 'react-router-dom';
import './ProductList.css';

const ProductList = ({
  products, // This list is now pre-filtered by Beranda.jsx
  selectedCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
  allProductsForCategories // New prop to generate all category buttons
}) => {

  // Generate categories from the complete product list to prevent buttons from disappearing
  const categories = ['All', ...new Set(allProductsForCategories.map(p => p.category))];

  return (
    <section className="product-section">
      <h2 className="product-section-title">Produk Kami</h2>

      {/* Container for search and filter controls */}
      <div className="product-controls">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Cari produk..."
            value={searchQuery}
            onChange={onSearchChange}
            className="search-input"
          />
        </div>
        <div className="category-filters">
          {categories.map(category => (
            <button
              key={category}
              className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => onCategoryChange(category)}
            > 
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="product-grid">
        {products.length > 0 ? (
          products.map(product => (
            <Link to={`/product/${product.id}`} key={product.id} className="product-card-link">
              <div className="product-card">
                <div className="product-image-container">
                  <img src={product.image} alt={product.name} className="product-image" />
                </div>
                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-price">Rp{product.price.toLocaleString('id-ID')}</p>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p className="no-products-found">Tidak ada produk yang cocok dengan kriteria Anda.</p>
        )}
      </div>
    </section>
  );
};

export default ProductList;
