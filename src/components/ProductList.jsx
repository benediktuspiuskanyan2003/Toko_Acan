import React from 'react';
import { Link } from 'react-router-dom';
import './ProductList.css'; 

// URL gambar default jika produk tidak memiliki gambar
// ✅ PASTIKAN URL INI DAPAT DIAKSES PUBLIK
const defaultGambarBrg = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT72mDXRHlQx3W2KY7jWIMcSUZQ0abupxQFaA&s';

const ProductList = ({ products }) => { 
    
    // Fungsi untuk memformat harga ke format Rupiah
    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency', 
            currency: 'IDR', 
            minimumFractionDigits: 0,
        }).format(number).replace('Rp', 'Rp ');
    };

    return (
        <section className="product-section">
            <div className="product-grid">
                {products && products.length > 0 && products.map(product => {
                    
                    const displayPrice = product.price;

                    return (
                        <Link to={`/product/${product.id}`} key={product.id} className="product-card-link">
                            <div className="product-card">
                                <div className="product-image-container">
                                    <img 
                                        // ✅ LOGIKA SUDAH BENAR: 
                                        // Gunakan product.image, JIKA KOSONG (null, undefined, atau ""), 
                                        // MAKA gunakan defaultGambarBrg.
                                        src={product.image || defaultGambarBrg } 
                                        // alt={product.name} 
                                        className="product-image" 
                                    />
                                </div>
                                <div className="product-info">
                                    <h3 className="product-name">{product.name}</h3>
                                    <p className="product-price">{formatRupiah(displayPrice)}</p>
                                </div>
                            </div>
                        </Link>
                    );
                })}

                {(!products || products.length === 0) && (
                    <p className="no-products-found">Tidak ada produk yang cocok dengan kriteria Anda.</p>
                )}
            </div>
        </section>
    );
};

export default ProductList;