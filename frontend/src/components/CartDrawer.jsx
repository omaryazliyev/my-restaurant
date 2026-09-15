import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import '../styles/CartDrawer.css';

export default function CartDrawer() {
  const navigate = useNavigate();
  const {
    cartItems, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart,
    totalAmount, discountAmount, discountPercent, finalTotalAmount, totalCount,
    promoCode, promoError, promoSuccess, applyPromoCode, removePromoCode
  } = useCart();
  const { isAuthenticated } = useAuth();
  const { t, priceFormat } = useLanguage();

  const [errorMsg, setErrorMsg] = useState('');
  const [promoInput, setPromoInput] = useState('');

  useEffect(() => {
    if (isCartOpen) {
      document.documentElement.classList.add('cart-open');
    } else {
      document.documentElement.classList.remove('cart-open');
    }
    return () => {
      document.documentElement.classList.remove('cart-open');
    };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    setErrorMsg('');
    if (!isAuthenticated) {
      setErrorMsg(t.needLoginToOrder);
      return;
    }
    if (cartItems.length === 0) {
      setErrorMsg(t.cartEmpty2);
      return;
    }
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <div className="cart-drawer-backdrop" onClick={() => setIsCartOpen(false)}>
      <div className="cart-drawer-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="cart-drawer-header">
          <div className="cart-drawer-title-wrap">
            <span className="cart-drawer-icon">🛒</span>
            <h2 className="cart-drawer-title">{t.cart}</h2>
            <span className="cart-drawer-badge">{totalCount}</span>
          </div>
          <button className="cart-drawer-close-btn" onClick={() => setIsCartOpen(false)}>
            ✕
          </button>
        </div>

        {errorMsg && (
          <div className="cart-drawer-error">
            <span>{errorMsg}</span>
            {!isAuthenticated && (
              <button
                type="button"
                className="cart-drawer-login-btn"
                onClick={() => { setIsCartOpen(false); navigate('/login'); }}
              >
                {t.login} →
              </button>
            )}
          </div>
        )}

        {cartItems.length === 0 ? (
          <div className="cart-drawer-empty">
            <div className="cart-drawer-empty-icon">🍽️</div>
            <h3 className="cart-drawer-empty-text">{t.cartEmpty}</h3>
            <button
              className="cart-drawer-empty-btn"
              onClick={() => { setIsCartOpen(false); navigate('/menu'); }}
            >
              {t.viewMenuBtn || t.viewMenu || "Menuga o'tish"} →
            </button>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="cart-drawer-items-list">
              {cartItems.map((item, idx) => (
                <div key={idx} className="cart-drawer-item">
                  {item.img && <img src={item.img} alt={item.name} className="cart-drawer-item-img" />}
                  <div className="cart-drawer-item-info">
                    <h4 className="cart-drawer-item-title">{item.name}</h4>
                    <span className="cart-drawer-item-price">
                      {priceFormat((item.numericPrice || 0) * (item.quantity || 1))}
                    </span>
                  </div>
                  {/* Quantity Controls */}
                  <div className="cart-drawer-qty-wrap">
                    <button className="cart-drawer-qty-btn" onClick={() => updateQuantity(item.id || item.name, -1)}>-</button>
                    <span className="cart-drawer-qty-val">{item.quantity}</span>
                    <button className="cart-drawer-qty-btn" onClick={() => updateQuantity(item.id || item.name, 1)}>+</button>
                  </div>
                  <button
                    className="cart-drawer-delete-btn"
                    onClick={() => removeFromCart(item.id || item.name)}
                    title="O'chirish"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>

            {/* Footer / Checkout */}
            <div className="cart-drawer-footer">
              {/* Promo Code Input Box */}
              <div className="cart-drawer-promo-box">
                <div className="cart-drawer-promo-label">
                  <span>🏷️ Promokod</span>
                  <span className="cart-drawer-promo-sub">Masalan: MEHMOR2026</span>
                </div>

                {promoCode ? (
                  <div className="cart-drawer-promo-applied">
                    <span className="cart-drawer-promo-applied-text">✅ {promoCode} ({discountPercent}% chegirma)</span>
                    <button className="cart-drawer-promo-remove-btn" onClick={removePromoCode}>✕</button>
                  </div>
                ) : (
                  <div className="cart-drawer-promo-form">
                    <input
                      type="text"
                      className="cart-drawer-promo-input"
                      placeholder="MEHMOR2026"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                    />
                    <button
                      className="cart-drawer-promo-btn"
                      onClick={() => applyPromoCode(promoInput)}
                    >
                      Qo'llash
                    </button>
                  </div>
                )}

                {promoError && <div className="cart-drawer-promo-error">⚠️ {promoError}</div>}
                {promoSuccess && <div className="cart-drawer-promo-success">{promoSuccess}</div>}
              </div>

              {/* Total & Discount Row */}
              <div className="cart-drawer-totals-wrap">
                {discountAmount > 0 && (
                  <div className="cart-drawer-discount-row">
                    <span>Chegirma ({discountPercent}%):</span>
                    <span>-{priceFormat(discountAmount)}</span>
                  </div>
                )}
                <div className="cart-drawer-total-row">
                  <span className="cart-drawer-total-label">{t.total}</span>
                  <span className="cart-drawer-total-amount">{priceFormat(finalTotalAmount)}</span>
                </div>
              </div>

              <button
                className="cart-drawer-checkout-btn"
                onClick={handleCheckout}
              >
                {t.checkout}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
