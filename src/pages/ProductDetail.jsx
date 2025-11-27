import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { allProducts } from '../data/products'; // Import the centralized product data
import './ProductDetail.css'; // We will create this CSS file next

function ProductDetail() {
  // 1. Get the product ID from the URL
  const { id } = useParams();

  // 2. Find the correct product from the data array
  // Note: useParams returns a string, so we convert it to a number for comparison
  const product = allProducts.find(p => p.id === Number(id));

  // Handle case where product is not found
  if (!product) {
    return (
      <div className="product-not-found">
        <h2>Produk tidak ditemukan!</h2>
        <p>Maaf, kami tidak dapat menemukan produk yang Anda cari.</p>
        <Link to="/">Kembali ke Beranda</Link>
      </div>
    );
  }

  return (
    <div className="product-detail-page">
      <div className="product-detail-container">
        <div className="product-detail-image-container">
          <img src={product.image} alt={product.name} className="product-detail-image" />
        </div>
        <div className="product-detail-info">
          <h1 className="product-detail-name">{product.name}</h1>
          <p className="product-detail-price">Rp{product.price.toLocaleString('id-ID')}</p>
          <p className="product-detail-category">Kategori: {product.category}</p>
          <p className="product-detail-description">{product.description}</p>
          <button className="add-to-cart-btn">Tambah ke Keranjang</button>
          <Link to="/" className="back-link">‹ Kembali ke semua produk</Link>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
