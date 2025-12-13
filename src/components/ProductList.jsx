import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './ProductList.css';
import VariantSelectionDrawer from './VariantSelectionDrawer';
import ProductSkeleton from './ProductSkeleton'; 
import { useCart } from '../context/CartContext';

const defaultGambarBrg = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT72mDXRHlQx3W2KY7jWIMcSUZQ0abupxQFaA&s';

// 1. Accept new props: onLoadMore and hasMore
const ProductList = ({ products, isLoading, onLoadMore, hasMore }) => {
    const { addToCart } = useCart();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(number);
    };

    const handleOpenDrawer = (product) => {
        setSelectedProduct(product);
        setIsDrawerOpen(true);
    };

    const handleCloseDrawer = () => {
        setIsDrawerOpen(false);
        setSelectedProduct(null);
    };
    
    const handleAddToCartClick = (product) => {
        const variants = product.variants || [];
        if (variants.length === 1) {
            const singleVariant = variants[0];
            const quantityToAdd = singleVariant.min_quantity || 1;
            addToCart(product, singleVariant, quantityToAdd);
            alert(`${product.name} (${singleVariant.name}) berhasil ditambahkan ke keranjang!`);
        } else {
            handleOpenDrawer(product);
        }
    };

    const renderVariantDetails = (variant) => {
        let details = [];
        if (variant.min_quantity > 1) {
            details.push(`min ${variant.min_quantity}`);
        }
        if (variant.isi > 1) {
            details.push(`isi ${variant.isi}`);
        }
        return details.length > 0 ? `(${details.join(', ')})` : '';
    };

    const renderContent = () => {
        // While loading, show skeletons. Note: initial load is handled this way.
        if (isLoading && products.length === 0) {
            return Array.from({ length: 10 }).map((_, index) => (
                <ProductSkeleton key={index} />
            ));
        }

        if (!products || products.length === 0) {
            return (
                <div className="no-products-found">
                    <p>Produk tidak ditemukan. Coba gunakan kata kunci atau kategori yang lain.</p>
                </div>
            );
        }

        return products.map(product => {
            const displayVariants = Array.isArray(product.variants) && product.variants.length > 0 ? product.variants : [];
            return (
                <div key={product.id} className="product-card">
                    <Link to={`/product/${product.id}`} className="product-clickable-area">
                        <div className="product-image-container">
                            <img src={product.image || defaultGambarBrg} alt={product.name} className="product-image" />
                        </div>
                        <div className="product-info">
                            <h3 className="product-name">{product.name}</h3>
                            <div className="variant-details-list">
                                {displayVariants.map(variant => (
                                    <p key={variant.name} className="variant-detail-item">
                                        <span className="variant-price-part">{formatRupiah(variant.price)}</span>
                                        <span className="variant-name-part"> / {variant.name} {renderVariantDetails(variant)}</span>
                                    </p>
                                ))}
                            </div>
                        </div>
                    </Link>
                    <div className="product-actions">
                        <button onClick={() => handleAddToCartClick(product)} className="add-to-cart-btn">
                            + Keranjang
                        </button>
                    </div>
                </div>
            );
        });
    };

    return (
        <section className="product-section">
            <div className="product-grid">
                {renderContent()} 
            </div>

            {/* 2. Add the Load More button container */}
            <div className="load-more-container">
                {hasMore && (
                    <button onClick={onLoadMore} className="load-more-button">
                        Muat Lebih Banyak
                    </button>
                )}
            </div>

            <VariantSelectionDrawer
                product={selectedProduct}
                isOpen={isDrawerOpen}
                onClose={handleCloseDrawer}
            />
        </section>
    );
};

export default ProductList;
