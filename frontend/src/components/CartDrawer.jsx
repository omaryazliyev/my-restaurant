import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export default function CartDrawer() {
  const navigate = useNavigate();
  const { cartItems, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, totalAmount, totalCount } = useCart();
  const { isAuthenticated } = useAuth();
  const { t, priceFormat } = useLanguage();

  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
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
    <div
      onClick={() => setIsCartOpen(false)}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        display: 'flex', justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.45)',
        backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
        transition: 'all 0.3s ease-in-out',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: '440px', height: '100%',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
          color: '#111111', display: 'flex', flexDirection: 'column',
          boxShadow: '-15px 0 45px rgba(0, 0, 0, 0.18)',
          borderLeft: '1px solid rgba(255, 255, 255, 0.8)',
          padding: '24px', boxSizing: 'border-box',
          position: 'relative',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          borderBottom: '1px solid rgba(0, 0, 0, 0.08)', paddingBottom: '18px', marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '24px' }}>🛒</span>
            <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#111111', margin: 0, letterSpacing: '-0.3px' }}>
              {t.cart}
            </h2>
            <span style={{
              backgroundColor: '#ffb703', color: '#111111', fontWeight: '800',
              fontSize: '13px', padding: '3px 10px', borderRadius: '20px', marginLeft: '4px'
            }}>
              {totalCount}
            </span>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            style={{
              width: '36px', height: '36px', borderRadius: '50%',
              backgroundColor: 'rgba(0, 0, 0, 0.05)', border: 'none',
              color: '#555', fontSize: '18px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.1)'; e.currentTarget.style.color = '#111'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.05)'; e.currentTarget.style.color = '#555'; }}
          >
            ✕
          </button>
        </div>

        {errorMsg && (
          <div style={{
            backgroundColor: 'rgba(255, 77, 79, 0.1)', color: '#d9363e',
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
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#777', padding: '20px' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px', opacity: 0.9 }}>🍽️</div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#333', margin: '0 0 8px 0' }}>{t.cartEmpty}</h3>
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
                <div
                  key={idx}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '14px',
                    backgroundColor: '#ffffff', padding: '14px', borderRadius: '16px',
                    marginBottom: '14px', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.04)',
                    border: '1px solid rgba(0, 0, 0, 0.05)',
                  }}
                >
                  {item.img && <img src={item.img} alt={item.name} style={{ width: '60px', height: '60px', borderRadius: '12px', objectFit: 'cover' }} />}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4 style={{ margin: '0 0 6px 0', fontSize: '15px', fontWeight: '700', color: '#111111', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</h4>
                    <span style={{ color: '#d97706', fontWeight: '800', fontSize: '15px' }}>
                      {priceFormat(item.numericPrice * item.quantity)}
                    </span>
                  </div>
                  {/* Quantity Controls */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#f4f5f8', borderRadius: '30px', padding: '4px 8px' }}>
                    <button
                      onClick={() => updateQuantity(item.id || item.name, -1)}
                      style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#ffffff', border: '1px solid rgba(0, 0, 0, 0.1)', color: '#111', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >-</button>
                    <span style={{ fontSize: '14px', fontWeight: '800', color: '#111', minWidth: '18px', textAlign: 'center' }}>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id || item.name, 1)}
                      style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#ffffff', border: '1px solid rgba(0, 0, 0, 0.1)', color: '#111', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >+</button>
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
            <div style={{ borderTop: '1px solid rgba(0, 0, 0, 0.08)', paddingTop: '20px', marginTop: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <span style={{ fontSize: '16px', fontWeight: '600', color: '#666' }}>{t.total}</span>
                <span style={{ fontSize: '24px', fontWeight: '800', color: '#111111' }}>{priceFormat(totalAmount)}</span>
              </div>

              <button
                onClick={handleCheckout}
                style={{
                  width: '100%', padding: '16px', borderRadius: '16px',
                  backgroundColor: '#ffb703', color: '#111111', fontWeight: '800',
                  border: 'none', cursor: 'pointer', fontSize: '16px',
                  boxShadow: '0 8px 25px rgba(255, 183, 3, 0.35)',
                  transition: 'transform 0.15s ease, boxShadow 0.15s ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 30px rgba(255, 183, 3, 0.45)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 25px rgba(255, 183, 3, 0.35)'; }}
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

