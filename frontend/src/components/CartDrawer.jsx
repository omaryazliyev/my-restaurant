import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ordersApi } from '../services/api';
import CustomSelect from './CustomSelect';

export default function CartDrawer() {
  const { cartItems, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, clearCart, totalAmount, totalCount } = useCart();
  const { isAuthenticated } = useAuth();

  const [deliveryMethod, setDeliveryMethod] = useState('DOOR_DELIVERY');
  const [paymentMethod, setPaymentMethod] = useState('ONLINE_CARD');
  const [address, setAddress] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isCartOpen) return null;

  const handleCheckout = async () => {
    setErrorMsg('');
    if (cartItems.length === 0) {
      setErrorMsg('Ваша корзина пуста!');
      return;
    }
    if (!isAuthenticated) {
      setErrorMsg('Пожалуйста, войдите в аккаунт для оформления заказа!');
      return;
    }
    if (deliveryMethod === 'ADDRESS' && !address.trim()) {
      setErrorMsg('Пожалуйста, укажите адрес доставки!');
      return;
    }

    setSubmitting(true);
    try {
      const orderPayload = {
        deliveryMethod,
        paymentMethod,
        address: address.trim() || undefined,
        items: cartItems.map((item) => ({
          menuItemId: item.id && typeof item.id === 'number' ? item.id : 1, // Fallback ID if mock
          quantity: item.quantity,
        })),
      };

      const res = await ordersApi.createOrder(orderPayload);
      setOrderSuccess(res.id ? `Заказ #${res.id} успешно создан!` : 'Ваш заказ успешно оформлен!');
      clearCart();
    } catch (err) {
      setErrorMsg(err.message || 'Ошибка при оформлении заказа');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      display: 'flex', justifyContent: 'flex-end',
      backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
      transition: 'all 0.3s ease-in-out',
    }}>
      <div style={{
        width: '100%', maxWidth: '440px', height: '100%',
        backgroundColor: '#1e1f25', color: '#ffffff',
        display: 'flex', flexDirection: 'column',
        boxShadow: '-10px 0 30px rgba(0,0,0,0.5)',
        padding: '24px', overflowY: 'auto',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #2e303b', paddingBottom: '16px', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#ffb703', margin: 0 }}>
            🛒 Ваша Корзина ({totalCount})
          </h2>
          <button
            onClick={() => setIsCartOpen(false)}
            style={{ background: 'none', border: 'none', color: '#a0a5b5', fontSize: '24px', cursor: 'pointer' }}
          >
            ✕
          </button>
        </div>

        {orderSuccess ? (
          <div style={{ textAlign: 'center', padding: '40px 10px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎉</div>
            <h3 style={{ color: '#4caf50', marginBottom: '12px' }}>{orderSuccess}</h3>
            <p style={{ color: '#a0a5b5', fontSize: '14px', marginBottom: '24px' }}>
              Спасибо за заказ! Наш оператор свяжется с вами в ближайшее время.
            </p>
            <button
              onClick={() => { setOrderSuccess(null); setIsCartOpen(false); }}
              style={{
                width: '100%', padding: '12px', borderRadius: '10px',
                backgroundColor: '#ffb703', color: '#1e1f25', fontWeight: 'bold',
                border: 'none', cursor: 'pointer', fontSize: '15px',
              }}
            >
              Отлично
            </button>
          </div>
        ) : (
          <>
            {errorMsg && (
              <div style={{ backgroundColor: 'rgba(255, 77, 79, 0.15)', color: '#ff4d4f', border: '1px solid #ff4d4f', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px', fontSize: '14px' }}>
                {errorMsg}
              </div>
            )}

            {cartItems.length === 0 ? (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#a0a5b5' }}>
                <div style={{ fontSize: '56px', marginBottom: '16px' }}>🍽️</div>
                <p style={{ fontSize: '16px' }}>Ваша корзина пуста</p>
              </div>
            ) : (
              <>
                {/* Cart Items List */}
                <div style={{ flex: 1, overflowY: 'auto', marginBottom: '20px', paddingRight: '4px' }}>
                  {cartItems.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '12px',
                        backgroundColor: '#272932', padding: '12px', borderRadius: '12px',
                        marginBottom: '12px',
                      }}
                    >
                      {item.img && <img src={item.img} alt={item.name} style={{ width: '54px', height: '54px', borderRadius: '8px', objectFit: 'cover' }} />}
                      <div style={{ flex: 1 }}>
                        <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', color: '#ffffff' }}>{item.name}</h4>
                        <span style={{ color: '#ffb703', fontWeight: 'bold', fontSize: '14px' }}>
                          ${(item.numericPrice * item.quantity).toFixed(2)}
                        </span>
                      </div>
                      {/* Quantity Controls */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#1e1f25', borderRadius: '8px', padding: '4px 8px' }}>
                        <button
                          onClick={() => updateQuantity(item.id || item.name, -1)}
                          style={{ background: 'none', border: 'none', color: '#ffb703', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}
                        >
                          -
                        </button>
                        <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id || item.name, 1)}
                          style={{ background: 'none', border: 'none', color: '#ffb703', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id || item.name)}
                        style={{ background: 'none', border: 'none', color: '#ff4d4f', fontSize: '18px', cursor: 'pointer', marginLeft: '4px' }}
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
                </div>

                {/* Options & Checkout */}
                <div style={{ borderTop: '1px solid #2e303b', paddingTop: '16px' }}>
                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ fontSize: '13px', color: '#a0a5b5', display: 'block', marginBottom: '8px', fontWeight: '600' }}>Способ доставки:</label>
                    <CustomSelect
                      value={deliveryMethod}
                      onChange={setDeliveryMethod}
                      variant="dark"
                      options={[
                        { value: 'DOOR_DELIVERY', label: '🚚 Доставка курьером' },
                        { value: 'PICKUP',        label: '🏃 Самовывоз' },
                        { value: 'ADDRESS',       label: '📍 По точному адресу' },
                      ]}
                    />
                  </div>

                  {deliveryMethod === 'ADDRESS' && (
                    <div style={{ marginBottom: '12px' }}>
                      <input
                        type="text"
                        placeholder="Укажите ваш адрес"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        style={{ width: '100%', padding: '10px', borderRadius: '8px', backgroundColor: '#272932', color: '#fff', border: '1px solid #3b3e4d' }}
                      />
                    </div>
                  )}

                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ fontSize: '13px', color: '#a0a5b5', display: 'block', marginBottom: '8px', fontWeight: '600' }}>Способ оплаты:</label>
                    <CustomSelect
                      value={paymentMethod}
                      onChange={setPaymentMethod}
                      variant="dark"
                      options={[
                        { value: 'ONLINE_CARD',       label: '💳 Карта (Online)' },
                        { value: 'CASH_ON_DELIVERY',  label: '💵 Наличными при получении' },
                      ]}
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <span style={{ fontSize: '16px', color: '#a0a5b5' }}>Итого:</span>
                    <span style={{ fontSize: '22px', fontWeight: '800', color: '#ffb703' }}>${totalAmount.toFixed(2)}</span>
                  </div>

                  <button
                    onClick={handleCheckout}
                    disabled={submitting}
                    style={{
                      width: '100%', padding: '14px', borderRadius: '12px',
                      backgroundColor: '#ffb703', color: '#1e1f25', fontWeight: '800',
                      border: 'none', cursor: 'pointer', fontSize: '16px',
                      boxShadow: '0 4px 15px rgba(255, 183, 3, 0.3)',
                    }}
                  >
                    {submitting ? 'Оформление...' : 'Оформить заказ'}
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
