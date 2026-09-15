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
            <span style={{ fontSize: '24px' }}>🛒</span>
            <h2 className="cart-drawer-title">{t.cart}</h2>
            <span className="cart-drawer-badge">{totalCount}</span>
          </div>
          <button className="cart-drawer-close-btn" onClick={() => setIsCartOpen(false)}>
            ✕
          </button>
        </div>

        {errorMsg && (
          <div style={{
            backgroundColor: 'rgba(255, 77, 79, 0.1)', color: '#ff4d4f',
            border: '1px solid rgba(255, 77, 79, 0.3)', borderRadius: '12px',
            padding: '12px 14px', marginBottom: '16px', fontSize: '14px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: '8px',
          }}>
            <span>{errorMsg}</span>
            {!isAuthenticated && (
              <button
                type="button"
                onClick={() => { setIsCartOpen(false); navigate('/login'); }}
                style={{
                  backgroundColor: '#ff4d4f', color: '#fff', border: 'none',
                  padding: '6px 14px', borderRadius: '8px', cursor: 'pointer',
                  fontSize: '12px', fontWeight: 'bold',
                }}
              >
                {t.login} →
              </button>
            )}
          </div>
        )}

        {cartItems.length === 0 ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px', opacity: 0.9 }}>🍽️</div>
            <h3 className="cart-drawer-empty-text" style={{ fontSize: '18px', fontWeight: '700', margin: '0 0 8px 0' }}>{t.cartEmpty}</h3>
            <button
              onClick={() => { setIsCartOpen(false); navigate('/menu'); }}
              style={{
                marginTop: '16px', padding: '10px 22px', borderRadius: '25px',
                backgroundColor: '#ffb703', color: '#111', fontWeight: '700',
                border: 'none', cursor: 'pointer', fontSize: '14px',
                boxShadow: '0 4px 15px rgba(255, 183, 3, 0.3)',
              }}
            >
              {t.viewMenuBtn || t.viewMenu || "Menuga o'tish"} →
            </button>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div style={{ flex: 1, overflowY: 'auto', marginBottom: '20px', paddingRight: '4px' }}>
              {cartItems.map((item, idx) => (
                <div key={idx} className="cart-drawer-item">
                  {item.img && <img src={item.img} alt={item.name} style={{ width: '60px', height: '60px', borderRadius: '12px', objectFit: 'cover' }} />}
                  <div style={{ flex: 1, minWidth: 0 }}>
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
                    onClick={() => removeFromCart(item.id || item.name)}
                    style={{ background: 'none', border: 'none', color: '#ff4d4f', fontSize: '18px', cursor: 'pointer', padding: '4px', opacity: 0.8 }}
                    title="O'chirish"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>

            {/* Footer / Checkout */}
            <div style={{ borderTop: '1px solid rgba(0, 0, 0, 0.08)', paddingTop: '16px', marginTop: 'auto' }} className="cart-drawer-footer-divider">
              {/* Promo Code Input Box */}
              <div className="cart-drawer-promo-box">
                <div className="cart-drawer-promo-label">
                  <span>🏷️ Promokod</span>
                  <span className="cart-drawer-promo-sub">Masalan: MEHMOR2026</span>
                </div>

                {promoCode ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(16, 185, 129, 0.15)', padding: '8px 12px', borderRadius: '10px', border: '1px solid #10b981' }}>
                    <span style={{ color: '#10b981', fontWeight: '700', fontSize: '13px' }}>✅ {promoCode} ({discountPercent}% chegirma)</span>
                    <button onClick={removePromoCode} style={{ border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>✕</button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: '8px' }}>
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

                {promoError && <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '6px', fontWeight: '600' }}>⚠️ {promoError}</div>}
                {promoSuccess && <div style={{ color: '#10b981', fontSize: '12px', marginTop: '6px', fontWeight: '600' }}>{promoSuccess}</div>}
              </div>

              {/* Total & Discount Row */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
                {discountAmount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#10b981', fontSize: '14px', fontWeight: '700' }}>
                    <span>Chegirma ({discountPercent}%):</span>
                    <span>-{priceFormat(discountAmount)}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
