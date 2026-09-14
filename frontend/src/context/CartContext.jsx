import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem('cartItems');
      if (!savedCart) return [];
      const parsed = JSON.parse(savedCart);
      // Normalize: agar numericPrice > 100 bo'lsa, u so'mda saqlangan — USD ga o'giramiz
      return parsed.map(item => ({
        ...item,
        numericPrice: item.numericPrice > 100
          ? item.numericPrice / 12700   // so'm → USD
          : (item.numericPrice || 0),
      }));
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const showToast = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  /**
   * dish.price — USD da kelishi kutiladi (masalan 6.69)
   * Agar > 100 bo'lsa — so'mda deb hisoblab, USD ga aylantiramiz
   */
  const parsePrice = (price) => {
    if (!price && price !== 0) return 0;
    const num = typeof price === 'number' ? price : parseFloat(String(price).replace(/[^0-9.]/g, ''));
    if (isNaN(num)) return 0;
    return num > 100 ? num / 12700 : num;   // so'm → USD
  };

  const addToCart = (dish) => {
    const dishId = dish.id || dish.name;
    // usdPrice -> numericPrice (USD)
    const numericPrice = dish.usdPrice
      ? Number(dish.usdPrice)
      : parsePrice(dish.price || dish.numericPrice || 0);

    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (item) => (item.id || item.name) === dishId
      );
      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + 1,
        };
        return updated;
      }
      return [
        ...prevItems,
        {
          ...dish,
          id: dishId,
          numericPrice,   // USD
          quantity: 1,
        },
      ];
    });

    showToast(`"${dish.name || 'Taom'}" savatchaga qo'shildi!`);
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => (item.id || item.name) !== id));
  };

  const updateQuantity = (id, delta) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if ((item.id || item.name) === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const clearCart = () => setCartItems([]);

  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');

  // Valid promo codes table
  const PROMO_CODES = {
    MEHMOR2026: 10,
    MAZA20: 20,
    CHUQUR15: 15,
    BONUS50: 50,
  };

  const applyPromoCode = (code) => {
    setPromoError('');
    setPromoSuccess('');
    const cleanCode = (code || '').trim().toUpperCase();
    if (!cleanCode) {
      setPromoError('Promokod kiriting!');
      return false;
    }
    if (PROMO_CODES[cleanCode]) {
      const percent = PROMO_CODES[cleanCode];
      setPromoCode(cleanCode);
      setDiscountPercent(percent);
      setPromoSuccess(`🎉 Promokod qabul qilindi! ${percent}% chegirma berildi.`);
      showToast(`Promokod bo'yicha ${percent}% chegirma taqdim etildi!`);
      return true;
    } else {
      setPromoError("Noto'g'ri yoki muddati o'tgan promokod!");
      return false;
    }
  };

  const removePromoCode = () => {
    setPromoCode('');
    setDiscountPercent(0);
    setPromoError('');
    setPromoSuccess('');
  };

  // Hamma narsa USD da — priceFormat to'g'ri ishlaydi
  const totalAmount = cartItems.reduce(
    (sum, item) => sum + (item.numericPrice || 0) * item.quantity,
    0
  );
  const discountAmount = totalAmount * (discountPercent / 100);
  const finalTotalAmount = Math.max(0, totalAmount - discountAmount);

  // Backend uchun so'mda
  const totalAmountSom = Math.round(totalAmount * 12700);
  const finalTotalAmountSom = Math.round(finalTotalAmount * 12700);
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
        totalAmount,         // USD — priceFormat uchun
        discountPercent,
        discountAmount,      // USD
        finalTotalAmount,    // USD (chegirmadan so'ng)
        totalAmountSom,      // so'm — backend uchun
        finalTotalAmountSom, // so'm (chegirmadan so'ng)
        totalCount,
        notification,
        promoCode,
        promoError,
        promoSuccess,
        applyPromoCode,
        removePromoCode,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
