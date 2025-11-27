import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Beranda.css';
import fotoTokoAcan from '../assets/fototokoacan.jpg';
import ProductList from '../components/ProductList.jsx';
// Import the centralized dummy data
import { dummyProducts } from '../data/dummyProducts.js';

function Beranda() {
  // Use the imported dummy data array
  const allProducts = dummyProducts; 

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredProducts = allProducts
    .filter(product => 
      selectedCategory === 'All' || product.category === selectedCategory
    )
    .filter(product => 
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div className="home-page">
      <div 
        className="hero-section" 
        style={{ backgroundImage: `url(${fotoTokoAcan})` }}
      >
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">Toko Acan</h1>
          <p className="hero-subtitle">Temukan semua kebutuhan Anda dengan penawaran terbaik.</p>
          <Link to="/keranjang" className="hero-cta-button">
            Belanja Sekarang
          </Link>
        </div>
      </div>
      
      <ProductList 
        products={filteredProducts} 
        selectedCategory={selectedCategory} 
        onCategoryChange={handleCategoryChange}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        allProductsForCategories={allProducts}
      />
    </div>
  );
}

export default Beranda;
