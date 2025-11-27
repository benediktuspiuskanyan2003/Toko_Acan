import React, { createContext, useContext, useState, useEffect } from 'react';

// 1. Create the context
const CartContext = createContext();

// 2. Create a custom hook for easy consumption
export const useCart = () => {
  return useContext(CartContext);
};

// 3. Create the Provider component
export const CartProvider = ({ children }) => {
  // --- STATE ---
  // Initialize cart state from localStorage to persist data across sessions
  const [cartItems, setCartItems] = useState(() => {
    try {
      const localData = localStorage.getItem('cartItems');
      return localData ? JSON.parse(localData) : [];
    } catch (error) {
      console.error("Could not parse cart data from localStorage", error);
      return [];
    }
  });

  // --- EFFECTS ---
  // Effect to save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  // --- CART LOGIC FUNCTIONS ---

  /**
   * Adds an item to the cart. If the item already exists, it increases the quantity.
   * @param {object} item - The product item to add.
   * @param {number} quantity - The number of items to add.
   */
  const addToCart = (item, quantity = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(i => i.id === item.id);

      if (existingItem) {
        // If item exists, update its quantity
        return prevItems.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i
        );
      } else {
        // If item is new, add it to the cart with the specified quantity
        return [...prevItems, { ...item, quantity }];
      }
    });
  };

  /**
   * Removes an item completely from the cart.
   * @param {string} itemId - The unique ID of the item to remove.
   */
  const removeFromCart = (itemId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  /**
   * Updates the quantity of a specific item in the cart.
   * If quantity is 0 or less, it removes the item.
   * @param {string} itemId - The ID of the item to update.
   * @param {number} newQuantity - The new quantity for the item.
   */
  const updateQuantity = (itemId, newQuantity) => {
    setCartItems(prevItems => {
      if (newQuantity <= 0) {
        // Remove the item if quantity is zero or less
        return prevItems.filter(item => item.id !== itemId);
      } else {
        return prevItems.map(item =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        );
      }
    });
  };

  /**
   * Clears all items from the cart.
   */
  const clearCart = () => {
    setCartItems([]);
  };

  // --- DERIVED STATE ---
  // Calculate total price of all items in the cart
  const totalPrice = cartItems.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);

  // Calculate the total number of individual items in the cart
  const totalItems = cartItems.reduce((total, item) => {
    return total + item.quantity;
  }, 0);

  // --- PROVIDER VALUE ---
  // The value that will be available to all consuming components
  const value = {
    cartItems,
    totalItems,
    totalPrice,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
