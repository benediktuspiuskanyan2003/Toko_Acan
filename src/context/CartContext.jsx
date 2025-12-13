import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const localData = localStorage.getItem('cartItems');
      return localData ? JSON.parse(localData) : [];
    } catch (error) {
      console.error("Could not parse cart data from localStorage", error);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  // --- MODIFIED addToCart FUNCTION ---
  const addToCart = (product, variant, quantity = 1) => {
    setCartItems(prevItems => {
      // Create a unique ID for the cart item based on product and variant
      const uniqueItemId = `${product.id}-${variant.name.replace(/\s+/g, '-')}`;
      const existingItem = prevItems.find(i => i.id === uniqueItemId);

      if (existingItem) {
        // If item already exists, just update its quantity
        return prevItems.map(i =>
          i.id === uniqueItemId ? { ...i, quantity: i.quantity + quantity } : i
        );
      } else {
        // If it's a new item, add it to the cart with a flattened structure
        const newItem = {
          id: uniqueItemId,
          productId: product.id,
          variantId: variant.name, // Using name as a simple ID for now
          name: product.name,
          variantName: variant.name,
          price: variant.price,
          image: product.image,
          min_quantity: variant.min_quantity,
          isi: variant.isi,
          quantity: quantity,
          selected: true // Default to selected
        };
        return [...prevItems, newItem];
      }
    });
  };

  const removeFromCart = (itemId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId, newQuantity) => {
    setCartItems(prevItems => {
      if (newQuantity <= 0) {
        return prevItems.filter(item => item.id !== itemId);
      } else {
        return prevItems.map(item =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        );
      }
    });
  };

  const toggleItemSelection = (itemId) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const toggleAllItems = (select) => {
    setCartItems(prevItems =>
      prevItems.map(item => ({ ...item, selected: select }))
    );
  };

  const removeSelectedItems = () => {
    setCartItems(prevItems => prevItems.filter(item => !item.selected));
  };

  const clearCart = () => {
    setCartItems([]);
  };
  
  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    toggleItemSelection,
    toggleAllItems,
    removeSelectedItems,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
