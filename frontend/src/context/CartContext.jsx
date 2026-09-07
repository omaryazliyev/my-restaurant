import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cartItems');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const showToast = (message) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const parsePrice = (priceStr) => {
    if (typeof priceStr === 'number') return priceStr;
    if (!priceStr) return 0;
    const num = parseFloat(priceStr.toString().replace(/[^0-9.]/g, ''));
    return isNaN(num) ? 0 : num;
  };

  const addToCart = (dish) => {
    const dishId = dish.id || dish.name;
    const numericPrice = parsePrice(dish.price);

    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => (item.id || item.name) === dishId);
      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex].quantity += 1;
        return updated;
      }
      return [
        ...prevItems,
        {
          ...dish,
          id: dishId,
          numericPrice,
          quantity: 1,
        },
      ];
    });

    showToast(`"${dish.name || 'Блюдо'}" добавлено в корзину!`);
  };

  const removeFromCart = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => (item.id || item.name) !== id));
  };

  const updateQuantity = (id, delta) => {
    setCartItems((prevItems) => {
      return prevItems
        .map((item) => {
          if ((item.id || item.name) === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const totalAmount = cartItems.reduce((sum, item) => sum + item.numericPrice * item.quantity, 0);
  const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalAmount,
        totalCount,
        notification,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
