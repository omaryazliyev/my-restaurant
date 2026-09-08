import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import '../styles/Profile.css';

// Leaf Graphics
import barg1 from '../assets/images/barg1.png';
import barg2 from '../assets/images/barg2.png';

export default function Profile() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { t, lang, priceFormat } = useLanguage();

  const [activeTab, setActiveTab] = useState('active'); // 'active' | 'past'

  // If not logged in, redirect to login
  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  // Active Orders Data
  const activeOrders = [
    {
      id: 'ORD-8942',
      date: '08.09.2026, 10:30',
      status: 'preparing', // preparing | on_the_way | delivered
      statusText: t.orderStatusPreparing,
      statusEmoji: '🟡',
      address: lang === 'uz' ? 'Toshkent sh., Amir Temur ko\'chasi, 24-uy' : lang === 'en' ? 'Tashkent, Amir Temur St., 24' : 'г. Ташкент, ул. Амира Темура, д. 24',
      items: [
        { name: { uz: 'Dubl burger', ru: 'Дабл бургер', en: 'Double Burger' }, qty: 2, usdPrice: 8.00 },
        { name: { uz: 'Kartoshka fri', ru: 'Картофель фри', en: 'French Fries' }, qty: 1, usdPrice: 6.00 },
        { name: { uz: 'Mevali Mohito', ru: 'Ягодный Мохито', en: 'Berry Mojito' }, qty: 2, usdPrice: 13.00 },
      ],
      totalUsd: 27.00,
    },
    {
      id: 'ORD-8910',
      date: '08.09.2026, 09:15',
      status: 'on_the_way',
      statusText: t.orderStatusOnTheWay,
      statusEmoji: '🔵',
      address: lang === 'uz' ? 'Toshkent sh., Buyuk Ipak Yo\'li, 12-uy' : lang === 'en' ? 'Tashkent, Buyuk Ipak Yoli, 12' : 'г. Ташкент, ул. Буюк Ипак Йули, д. 12',
      items: [
        { name: { uz: 'Tovuq sho\'rva', ru: 'Куриный суп', en: 'Chicken Soup' }, qty: 2, usdPrice: 20.00 },
        { name: { uz: 'Sezar salati', ru: 'Салат Цезарь', en: 'Caesar Salad' }, qty: 1, usdPrice: 11.00 },
      ],
      totalUsd: 31.00,
    },
  ];

  // Past / Completed Orders Data
  const pastOrders = [
    {
      id: 'ORD-7621',
      date: '05.09.2026, 19:40',
      status: 'delivered',
      statusText: t.orderStatusDelivered,
      statusEmoji: '🟢',
      address: lang === 'uz' ? 'Toshkent sh., Yunusobod 4-mavze, 18-uy' : lang === 'en' ? 'Tashkent, Yunusabad 4, 18' : 'г. Ташкент, Юнусабад 4, д. 18',
      items: [
        { name: { uz: 'Margarita Pitsa', ru: 'Пицца Маргарита', en: 'Pizza Margherita' }, qty: 1, usdPrice: 14.00 },
        { name: { uz: 'Pasta Karbonara', ru: 'Паста Карбонара', en: 'Pasta Carbonara' }, qty: 2, usdPrice: 28.00 },
      ],
      totalUsd: 42.00,
    },
    {
      id: 'ORD-6540',
      date: '28.08.2026, 14:20',
      status: 'delivered',
      statusText: t.orderStatusDelivered,
      statusEmoji: '🟢',
      address: lang === 'uz' ? 'Toshkent sh., Chilonzor 7-mavze, 5-uy' : lang === 'en' ? 'Tashkent, Chilanzar 7, 5' : 'г. Ташкент, Чиланзар 7, д. 5',
      items: [
        { name: { uz: 'Ribay biftek', ru: 'Стейк Рибай', en: 'Ribeye Steak' }, qty: 1, usdPrice: 26.00 },
        { name: { uz: 'Losos biftek', ru: 'Стейк из лосося', en: 'Salmon Steak' }, qty: 1, usdPrice: 22.00 },
      ],
      totalUsd: 48.00,
    },
  ];

  const currentList = activeTab === 'active' ? activeOrders : pastOrders;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="profile-page-wrapper">
      <Header />

      <div className="profile-container">
        <img src={barg1} alt="" className="profile-leaf-left" style={{ position: 'absolute', left: '-50px', top: '40px', width: '100px', opacity: 0.85, pointerEvents: 'none', zIndex: 0 }} />
        <img src={barg2} alt="" className="profile-leaf-right" style={{ position: 'absolute', right: '-50px', bottom: '60px', width: '100px', opacity: 0.85, pointerEvents: 'none', zIndex: 0 }} />

        <div className="profile-glass-card">
          {/* Breadcrumb */}
          <div className="profile-breadcrumb">
            <Link to="/">{t.home}</Link>
            <span>›</span>
            <span>{t.profile}</span>
          </div>

          {/* User Profile Card */}
          <div className="profile-user-card">
            <div className="profile-user-left">
              <div className="profile-avatar">👤</div>
              <div className="profile-info">
                <h2>{user?.username || 'Oybek'}</h2>
                <p>{t.phoneNumber}: +998 (90) 758-38-33</p>
                <span className="profile-badge">⭐ {t.clientStatus}</span>
              </div>
            </div>
          </div>

          {/* Order Tabs */}
          <div className="profile-tabs">
            <button
              className={`profile-tab-btn ${activeTab === 'active' ? 'active' : ''}`}
              onClick={() => setActiveTab('active')}
            >
              🕒 {t.activeOrders} ({activeOrders.length})
            </button>
            <button
              className={`profile-tab-btn ${activeTab === 'past' ? 'active' : ''}`}
              onClick={() => setActiveTab('past')}
            >
              📦 {t.pastOrders} ({pastOrders.length})
            </button>
          </div>

          {/* Orders List */}
          {currentList.length === 0 ? (
            <div className="orders-empty">
              <div className="orders-empty-icon">🍽️</div>
              <p>{activeTab === 'active' ? t.noActiveOrders : t.noPastOrders}</p>
            </div>
          ) : (
            <div className="orders-list">
              {currentList.map((order) => (
                <div key={order.id} className="order-card">
                  <div className="order-header">
                    <div>
                      <span className="order-id">#{order.id}</span>
                      <div className="order-date">📅 {order.date}</div>
                    </div>
                    <div className={`order-status ${order.status}`}>
                      <span>{order.statusEmoji}</span>
                      <span>{order.statusText}</span>
                    </div>
                  </div>

                  <div className="order-items-list">
                    {order.items.map((it, idx) => (
                      <div key={idx} className="order-item-row">
                        <span className="order-item-name">
                          {it.name[lang] || it.name.en} × {it.qty}
                        </span>
                        <span className="order-item-price">
                          {priceFormat(it.usdPrice)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="order-footer">
                    <div className="order-address">
                      📍 {order.address}
                    </div>
                    <div className="order-total-block">
                      <span className="order-total-label">{t.total}</span>
                      <span className="order-total-amount">{priceFormat(order.totalUsd)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Logout Section at the Bottom */}
          <div className="profile-logout-wrap">
            <button onClick={handleLogout} className="profile-logout-btn">
              🚪 {t.logout}
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
