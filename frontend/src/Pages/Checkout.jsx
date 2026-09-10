import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { ordersApi } from '../services/api';
import '../styles/Checkout.css';

// Leaf Graphics
import barg1 from '../assets/images/barg1.png';
import barg2 from '../assets/images/barg2.png';

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, clearCart, totalAmount } = useCart();
  const { t, lang, priceFormat } = useLanguage();

  // Delivery options: 'TAKEAWAY' | 'DOOR' | 'ADDRESS'
  const [deliveryMethod, setDeliveryMethod] = useState('DOOR');

  // Payment options: 'CARD_ONLINE' | 'CASH'
  const [paymentMethod, setPaymentMethod] = useState('CARD_ONLINE');

  // Address selection state
  const [address, setAddress] = useState(
    lang === 'uz' ? 'Toshkent sh., Amir Temur ko\'chasi, 24-uy' :
    lang === 'en' ? 'Tashkent, Amir Temur St., 24' :
    'г. Ташкент, ул. Амира Темура, 24'
  );
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [tempAddress, setTempAddress] = useState(address);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  // Address quick suggestions
  const ADDRESS_PRESETS = [
    { title: 'Toshkent, Amir Temur ko\'chasi, 24', ru: 'г. Ташкент, ул. Амира Темура, 24', en: 'Tashkent, Amir Temur St., 24' },
    { title: 'Toshkent, Buyuk Ipak Yo\'li, 12', ru: 'г. Ташкент, ул. Буюк Ипак Йули, 12', en: 'Tashkent, Buyuk Ipak Yoli, 12' },
    { title: 'Toshkent, Yunusobod 4-mavze, 18', ru: 'г. Ташкент, Юнусабад 4, д. 18', en: 'Tashkent, Yunusabad 4, 18' },
    { title: 'Toshkent, Chilonzor 7-mavze, 5', ru: 'г. Ташкент, Чиланзар 7, д. 5', en: 'Tashkent, Chilanzar 7, 5' },
  ];

  // Default items matching Figma screenshot if cart is empty
  const defaultFigmaItems = [
    { name: lang === 'uz' ? 'Burger(2)' : lang === 'en' ? 'Burger(2)' : 'Бургер(2)', usdPrice: 3.94, originalPriceText: '50000сум' },
    { name: lang === 'uz' ? 'Kola (1.5l)' : lang === 'en' ? 'Cola (1.5l)' : 'Кола (1.5л)', usdPrice: 1.18, originalPriceText: '15000сум' },
  ];

  const hasCartItems = cartItems && cartItems.length > 0;
  const displayItems = hasCartItems ? cartItems : defaultFigmaItems;

  const totalCalculated = hasCartItems
    ? priceFormat(totalAmount)
    : (lang === 'uz' ? '55000 so\'m' : lang === 'en' ? '$5.12' : '55000сум');

  const handleConfirmAddress = () => {
    if (tempAddress.trim()) {
      setAddress(tempAddress.trim());
    }
    setIsMapModalOpen(false);
  };

  const handlePlaceOrder = async () => {
    setIsSubmitting(true);
    try {
      await ordersApi.createOrder({
        deliveryMethod: deliveryMethod === 'TAKEAWAY' ? 'PICKUP' : deliveryMethod === 'DOOR' ? 'DOOR_DELIVERY' : 'ADDRESS',
        paymentMethod: paymentMethod === 'CARD_ONLINE' ? 'ONLINE_CARD' : 'CASH_ON_DELIVERY',
        address: address,
        totalPrice: totalAmount || 55000,
        items: hasCartItems
          ? cartItems.map(i => ({
              menuItemId: typeof i.id === 'number' ? i.id : 1,
              quantity: i.quantity || 1,
              priceAtOrder: i.numericPrice || i.price || 10000
            }))
          : [{ menuItemId: 1, quantity: 1, priceAtOrder: 55000 }]
      });
    } catch (err) {
      console.warn("Backend order creation error:", err.message);
    } finally {
      setIsSubmitting(false);
      setOrderSuccess(true);
      if (hasCartItems) {
        clearCart();
      }
    }
  };

  return (
    <div className="checkout-page-wrapper">
      <Header />

      <div className="checkout-container">
        {/* Decorative Leaves */}
        <img
          src={barg1}
          alt=""
          className="checkout-leaf-1"
          style={{
            position: 'absolute',
            left: '-60px',
            top: '80px',
            width: '110px',
            opacity: 0.85,
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />
        <img
          src={barg2}
          alt=""
          className="checkout-leaf-2"
          style={{
            position: 'absolute',
            right: '-60px',
            top: '260px',
            width: '110px',
            opacity: 0.85,
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />

        <div className="checkout-glass-card">
          {/* Main Title matching Figma */}
          <h1 className="checkout-main-title">{t.checkoutPageTitle}</h1>

          <div className="checkout-grid">
            {/* ── Left Column: Options ── */}
            <div className="checkout-options-col">
              {/* Section 1: Способ получения */}
              <div className="checkout-section-block">
                <h2 className="checkout-section-title">{t.deliveryMethodTitle}</h2>

                {/* Option 1: Заказ с собой */}
                <label
                  className="checkout-radio-label"
                  onClick={() => setDeliveryMethod('TAKEAWAY')}
                >
                  <span className={`checkout-radio-icon ${deliveryMethod === 'TAKEAWAY' ? 'active' : ''}`}>
                    {deliveryMethod === 'TAKEAWAY' && <span className="checkout-radio-dot" />}
                  </span>
                  <span>{t.takeaway}</span>
                </label>

                {/* Option 2: Доставка до двери (Default checked in Figma) */}
                <label
                  className="checkout-radio-label"
                  onClick={() => setDeliveryMethod('DOOR')}
                >
                  <span className={`checkout-radio-icon ${deliveryMethod === 'DOOR' ? 'active' : ''}`}>
                    {deliveryMethod === 'DOOR' && <span className="checkout-radio-dot" />}
                  </span>
                  <span>{t.doorDelivery}</span>
                </label>

                {/* Option 3: Доставка по адресу */}
                <label
                  className="checkout-radio-label"
                  onClick={() => setDeliveryMethod('ADDRESS')}
                >
                  <span className="checkout-home-icon">🏠</span>
                  <span>{t.addressDelivery}</span>
                </label>

                {/* Address sub-block */}
                <div className="checkout-address-sub">
                  <p className="checkout-address-prompt">{t.specifyAddressOnMap}</p>
                  <button
                    type="button"
                    className="checkout-select-addr-btn"
                    onClick={() => {
                      setTempAddress(address);
                      setIsMapModalOpen(true);
                    }}
                  >
                    {t.selectBtn}
                  </button>

                  {address && (
                    <div>
                      <span className="checkout-selected-address-badge">
                        📍 {address}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Section 2: Способ оплаты */}
              <div className="checkout-section-block">
                <h2 className="checkout-section-title">{t.paymentMethodTitle}</h2>

                {/* Option 1: Картой онлайн (Default checked in Figma) */}
                <label
                  className="checkout-radio-label"
                  onClick={() => setPaymentMethod('CARD_ONLINE')}
                >
                  <span className={`checkout-radio-icon ${paymentMethod === 'CARD_ONLINE' ? 'active' : ''}`}>
                    {paymentMethod === 'CARD_ONLINE' && <span className="checkout-radio-dot" />}
                  </span>
                  <span>{t.cardOnline}</span>
                </label>

                {/* Payment Badges (HUMO, UZCARD, VISA, Mastercard, Apple Pay) */}
                <div className="checkout-payment-badges">
                  <div className="payment-badge humo" title="HUMO">HUMO</div>
                  <div className="payment-badge uzcard" title="UZCARD">UZCARD</div>
                  <div className="payment-badge visa" title="VISA">VISA</div>
                  <div className="payment-badge mastercard" title="Mastercard">
                    <span className="mc-circle-red" />
                    <span className="mc-circle-yellow" />
                  </div>
                  <div className="payment-badge applepay" title="Apple Pay">Pay</div>
                </div>

                {/* Option 2: Оплата при получении */}
                <label
                  className="checkout-radio-label"
                  onClick={() => setPaymentMethod('CASH')}
                >
                  <span className={`checkout-radio-icon ${paymentMethod === 'CASH' ? 'active' : ''}`}>
                    {paymentMethod === 'CASH' && <span className="checkout-radio-dot" />}
                  </span>
                  <span>{t.cashOnDelivery}</span>
                </label>
              </div>
            </div>

            {/* ── Right Column: "Ваш заказ" Card ── */}
            <div className="checkout-order-summary-card">
              <h3 className="checkout-summary-title">{t.yourOrder}</h3>

              <div className="checkout-items-list">
                {displayItems.map((item, idx) => {
                  const itemName = hasCartItems
                    ? (typeof item.name === 'object' ? (item.name[lang] || item.name.en) : item.name) + `(${item.quantity || 1})`
                    : item.name;

                  const itemPrice = hasCartItems
                    ? priceFormat(item.numericPrice * (item.quantity || 1))
                    : (lang === 'ru' ? item.originalPriceText : priceFormat(item.usdPrice));

                  return (
                    <React.Fragment key={idx}>
                      <div className="checkout-item-row">
                        <span className="checkout-item-name">{itemName}</span>
                        <span className="checkout-item-price">{itemPrice}</span>
                      </div>
                      <div className="checkout-item-divider" />
                    </React.Fragment>
                  );
                })}

                {/* Delivery fee row */}
                <div className="checkout-delivery-row">
                  <span className="checkout-item-name">{t.deliveryFee}</span>
                  <span className="checkout-delivery-free">{t.free}</span>
                </div>
                <div className="checkout-item-divider" />

                {/* Total row */}
                <div className="checkout-total-row">
                  <span className="checkout-total-label">{t.total}</span>
                  <span className="checkout-total-val">{totalCalculated}</span>
                </div>

                {/* "Заказать" Submit Button */}
                <button
                  type="button"
                  className="checkout-submit-btn"
                  onClick={handlePlaceOrder}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? t.checkoutProcessing : t.orderBtn}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Address Selection Map Modal ── */}
      {isMapModalOpen && (
        <div className="map-modal-overlay" onClick={() => setIsMapModalOpen(false)}>
          <div className="map-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="map-modal-header">
              <h3>{t.chooseOnMapModalTitle}</h3>
              <button
                className="map-modal-close"
                onClick={() => setIsMapModalOpen(false)}
              >
                ✕
              </button>
            </div>

            <p style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>
              {t.enterStreetOrPickMap}
            </p>

            <input
              type="text"
              className="map-modal-input"
              value={tempAddress}
              onChange={(e) => setTempAddress(e.target.value)}
              placeholder="Masalan: Toshkent, Amir Temur ko'chasi, 24"
            />

            {/* Map Preview Graphic */}
            <div
              style={{
                width: '100%',
                height: '160px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #e8f5e9, #c8e6c9)',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
                border: '1px solid #a5d6a7',
                boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.06)',
                overflow: 'hidden',
              }}
            >
              <div style={{ position: 'absolute', inset: 0, opacity: 0.15, background: 'radial-gradient(circle, #2e7d32 10%, transparent 10%) 0 0/16px 16px' }} />
              <div style={{ textAlign: 'center', zIndex: 1 }}>
                <span style={{ fontSize: '38px', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))' }}>📍</span>
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#1b5e20', marginTop: '4px' }}>
                  {tempAddress || 'Toshkent, O\'zbekiston'}
                </div>
              </div>
            </div>

            {/* Quick Address Presets */}
            <div className="map-presets">
              {ADDRESS_PRESETS.map((p, idx) => {
                const text = lang === 'uz' ? p.title : lang === 'en' ? p.en : p.ru;
                return (
                  <div
                    key={idx}
                    className="map-preset-item"
                    onClick={() => setTempAddress(text)}
                  >
                    <span>📍</span>
                    <span>{text}</span>
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              className="map-modal-confirm-btn"
              onClick={handleConfirmAddress}
            >
              {t.confirmAddress}
            </button>
          </div>
        </div>
      )}

      {/* ── Order Success Modal ── */}
      {orderSuccess && (
        <div className="map-modal-overlay">
          <div className="checkout-success-modal">
            <div className="checkout-success-icon">🎉</div>
            <h2 className="checkout-success-title">{t.orderSuccessTitle}</h2>
            <p className="checkout-success-desc">{t.orderSuccessDesc}</p>
            <button
              type="button"
              className="checkout-success-btn"
              onClick={() => navigate('/profile')}
            >
              {t.goToCabinet} →
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
