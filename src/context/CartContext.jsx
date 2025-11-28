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

  const addToCart = (item, quantity = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(i => i.id === item.id);
      if (existingItem) {
        return prevItems.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i
        );
      } else {
        // **MODIFIED**: Add 'selected: true' property by default to new items
        return [...prevItems, { ...item, quantity, selected: true }];
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

  // **NEW**: Toggles the 'selected' state of a single item
  const toggleItemSelection = (itemId) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, selected: !item.selected } : item
      )
    );
  };

  // **NEW**: Selects or deselects all items in the cart
  const toggleAllItems = (select) => {
    setCartItems(prevItems =>
      prevItems.map(item => ({ ...item, selected: select }))
    );
  };

  // **NEW**: Removes only the selected items from the cart (used after checkout)
  const removeSelectedItems = () => {
    setCartItems(prevItems => prevItems.filter(item => !item.selected));
  };

  const clearCart = () => {
    setCartItems([]);
  };
  
  // **REMOVED**: Total price and total items are no longer calculated globally.
  // They will be calculated in Keranjang.jsx based on selected items.

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart, // Kept for potential 'Clear All' functionality
    // **NEWLY EXPORTED FUNCTIONS**
    toggleItemSelection,
    toggleAllItems,
    removeSelectedItems,
    // We no longer export totalItems and totalPrice from here
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
