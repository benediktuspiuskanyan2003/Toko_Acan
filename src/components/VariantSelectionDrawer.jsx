import React, { useState, useMemo, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import './VariantSelectionDrawer.css';

const VariantSelectionDrawer = ({ product, isOpen, onClose }) => {
    const { addToCart } = useCart();
    const [quantities, setQuantities] = useState({});

    const safeVariants = useMemo(() => {
        if (product && Array.isArray(product.variants)) {
            return product.variants;
        }
        return [];
    }, [product]);

    useEffect(() => {
        const initialQuantities = {};
        safeVariants.forEach(variant => {
            initialQuantities[variant.name] = 0;
        });
        setQuantities(initialQuantities);
    }, [safeVariants]);

    const { totalItems, totalPrice } = useMemo(() => {
        let items = 0;
        let price = 0;
        safeVariants.forEach(variant => {
            const quantity = quantities[variant.name] || 0;
            if (quantity > 0) {
                items += quantity;
                price += (variant.price || 0) * quantity;
            }
        });
        return { totalItems: items, totalPrice: price };
    }, [quantities, safeVariants]);

    if (!isOpen || !product) {
        return null;
    }

    // *** THE CRITICAL FIX IS HERE ***
    // This logic is now copied from ProductDetail.jsx to handle wholesale quantities correctly.
    const handleQuantityChange = (variantName, amount) => {
        const variant = safeVariants.find(v => v.name === variantName);
        if (!variant) return;

        setQuantities(prev => {
            const currentQuantity = prev[variantName] || 0;
            let newQuantity = currentQuantity + amount;

            // If adding and it's the first time for a wholesale item, jump to min quantity
            if (amount > 0 && currentQuantity === 0 && variant.min_quantity > 1) {
                newQuantity = variant.min_quantity;
            } else {
                newQuantity = Math.max(0, newQuantity);
            }

            // If removing a wholesale item, jump back to 0
            if (amount < 0 && currentQuantity === variant.min_quantity && variant.min_quantity > 1) {
                newQuantity = 0;
            }

            return { ...prev, [variantName]: newQuantity };
        });
    };

    const handleAddToCart = () => {
        safeVariants.forEach(variant => {
            const quantity = quantities[variant.name];
            if (quantity > 0) {
                const cartItem = {
                    id: `${product.id}-${variant.name}`,
                    name: `${product.name} (${variant.name})`,
                    price: variant.price,
                    image: product.image,
                    productId: product.id,
                    variantName: variant.name,
                    variantId: variant.id,
                    minQuantity: variant.min_quantity
                };
                addToCart(cartItem, quantity);
            }
        });
        onClose();
    };

    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
    };

    return (
        <div className="drawer-overlay" onClick={onClose}>
            <div className="drawer-content" onClick={e => e.stopPropagation()}>
                <div className="drawer-header">
                    <img src={product.image} alt={product.name} className="drawer-product-image" />
                    <div className="drawer-product-info">
                        <h3 className="drawer-product-name">{product.name}</h3>
                        <p className="drawer-product-desc">Pilih varian dan jumlah yang diinginkan.</p>
                    </div>
                    <button className="drawer-close-btn" onClick={onClose}>&times;</button>
                </div>

                <div className="drawer-body">
                    {safeVariants.map(variant => {
                        const currentQty = quantities[variant.name] || 0;
                        return (
                            <div key={variant.name} className="variant-row">
                                <div className="variant-details">
                                    <span className="variant-name">{variant.name || 'Varian'}</span>
                                    <span className="variant-price">{formatRupiah(variant.price || 0)}</span>
                                </div>
                                <div className="quantity-controls">
                                    <button onClick={() => handleQuantityChange(variant.name, -1)} disabled={currentQty === 0}>−</button>
                                    <span>{currentQty}</span>
                                    <button onClick={() => handleQuantityChange(variant.name, 1)}>+</button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="drawer-footer">
                    <div className="footer-summary">
                        <span>Total Harga:</span>
                        <span className="footer-total-price">{formatRupiah(totalPrice)}</span>
                    </div>
                    <button className="footer-add-to-cart-btn" onClick={handleAddToCart} disabled={totalItems === 0}>
                        {totalItems > 0 ? `Tambah ${totalItems} item ke Keranjang` : 'Pilih Item'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VariantSelectionDrawer;
