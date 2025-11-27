import React from 'react';
import { Link } from 'react-router-dom';
import './ProductList.css';

const ProductList = ({
  products,
  selectedCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
  allProductsForCategories
}) => {

  const categories = ['All', ...new Set(allProductsForCategories.map(p => p.category))];

  return (
    <section className="product-section">
      <h2 className="product-section-title">Produk Kami</h2>

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
          products.map(product => {
            // --- PRICE BUG FIX ---
            // Display the price of the first variant as the default price.
            // This ensures a price is always visible on the product card.
            // It also checks if variants exist to prevent errors.
            const displayPrice = product.variants && product.variants.length > 0
              ? product.variants[0].price
              : 0; // Fallback price if no variants

            return (
              <Link to={`/product/${product.id}`} key={product.id} className="product-card-link">
                <div className="product-card">
                  <div className="product-image-container">
                    <img src={product.image} alt={product.name} className="product-image" />
                  </div>
                  <div className="product-info">
                    <h3 className="product-name">{product.name}</h3>
                    {/* Use the corrected displayPrice variable */}
                    <p className="product-price">Rp{displayPrice.toLocaleString('id-ID')}</p>
                  </div>
                </div>
              </Link>
            );
          })
        ) : (
          <p className="no-products-found">Tidak ada produk yang cocok dengan kriteria Anda.</p>
        )}
      </div>
    </section>
  );
};

export default ProductList;
