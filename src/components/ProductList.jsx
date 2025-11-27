import React, { useState } from 'react';
import './ProductList.css';

// Dummy data for products. In a real app, this would come from an API.
const featuredProducts = [
  {
    id: 1,
    name: 'Tas Ransel Foldsack No. 1',
    price: 'Rp 1.650.000',
    image: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg',
    category: 'Pria'
  },
  {
    id: 2,
    name: 'Kaos Casual Pria Premium',
    price: 'Rp 340.000',
    image: 'https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg',
    category: 'Pria'
  },
    {
    id: 5,
    name: "Blazer Wanita Micropoly",
    price: "Rp 2.550.000",
    image: "https://fakestoreapi.com/img/51Y5NI-I5jL._AC_UX679_.jpg",
    category: "Wanita"
  },
  {
    id: 6,
    name: "Hard Drive Portabel SanDisk SSD",
    price: "Rp 1.000.000",
    image: "https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_.jpg",
    category: "Elektronik"
  },
  {
    id: 3,
    name: 'Jaket Katun Pria',
    price: 'Rp 850.000',
    image: 'https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg',
    category: 'Pria'
  },
  {
    id: 4,
    name: 'Gelang Naga Emas & Perak',
    price: 'Rp 10.500.000',
    image: 'https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_.jpg',
    category: 'Aksesoris'
  },
  {
    id: 7,
    name: "Kalung Perak Opna",
    price: "Rp 150.000",
    image: "https://fakestoreapi.com/img/51UDEzMJVpL._AC_UL640_QL65_ML3_.jpg",
    category: "Aksesoris"
  },
  {
    id: 8,
    name: "Jaket Hujan Wanita",
    price: "Rp 600.000",
    image: "https://fakestoreapi.com/img/71HblAHs5xL._AC_UY879_-2.jpg",
    category: "Wanita"
  }
];


// Dummy data for categories
const categories = ['Semua', 'Pria', 'Wanita', 'Aksesoris', 'Elektronik'];

function ProductList() {
  // Use state to manage the active category
  const [activeCategory, setActiveCategory] = useState('Semua');

  // Filter products based on the active category
  const filteredProducts = activeCategory === 'Semua'
    ? featuredProducts
    : featuredProducts.filter(product => product.category === activeCategory);


  return (
    <section className="product-section">
      <h2 className="product-section-title">Produk Unggulan</h2>

      <div className="category-filters">
        {categories.map(category => (
          <button
            key={category}
            className={`category-btn ${activeCategory === category ? 'active' : ''}`}
            onClick={() => setActiveCategory(category)} // Set the active category on click
          >
            {category}
          </button>
        ))}
      </div>

      <div className="product-grid">
        {/* Map over the new filtered list of products */}
        {filteredProducts.map(product => (
          <div key={product.id} className="product-card">
            <div className="product-image-container">
              <img src={product.image} alt={product.name} className="product-image" />
            </div>
            <div className="product-info">
              <h3 className="product-name">{product.name}</h3>
              <p className="product-price">{product.price}</p>
              <button className="add-to-cart-btn">Tambah ke Keranjang</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ProductList;
