import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { ordersApi } from '../services/api';
import '../styles/Profile.css';

// Leaf Graphics
import barg1 from '../assets/images/barg1.png';
import barg2 from '../assets/images/barg2.png';

// Map backend status → frontend statusIndex
const STATUS_INDEX = {
  PENDING: 1,
  ACCEPTED: 1,
  PREPARING: 2,
  READY: 3,
  ON_THE_WAY: 3,
  DELIVERING: 3,
  DELIVERED: 4,
  CANCELLED: 4,
};

const STATUS_EMOJI = {
  PENDING: '📝',
  ACCEPTED: '📝',
  PREPARING: '👨‍🍳',
  READY: '✅',
  ON_THE_WAY: '🚴',
  DELIVERING: '🚴',
  DELIVERED: '🎉',
  CANCELLED: '❌',
};

export default function Profile() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { t, lang, priceFormat } = useLanguage();

  const [activeTab, setActiveTab] = useState('active');
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  // Cashback balance: 5% of total spent (calculated from past delivered orders)
  const [cashbackBalance, setCashbackBalance] = useState(0);

  // If not logged in, redirect to login
  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setOrdersLoading(true);
    try {
      const data = await ordersApi.getMyOrders().catch(() => null);
      if (Array.isArray(data) && data.length > 0) {
        const formatted = data.map(o => {
          const statusKey = (o.status || 'PENDING').toUpperCase();
          const totalUsd = Number(o.totalPrice) > 100
            ? Number(o.totalPrice) / 12700
            : Number(o.totalPrice);

          return {
            id: `ORD-${o.id}`,
            rawId: o.id,
            date: o.createdAt
              ? new Date(o.createdAt).toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
              : '—',
            status: statusKey === 'DELIVERED' ? 'delivered' : statusKey === 'PREPARING' ? 'preparing' : statusKey === 'ON_THE_WAY' || statusKey === 'DELIVERING' ? 'on_the_way' : 'pending',
            statusIndex: STATUS_INDEX[statusKey] || 1,
            statusText: t[`orderStatus${statusKey.charAt(0) + statusKey.slice(1).toLowerCase()}`] || statusKey,
            statusEmoji: STATUS_EMOJI[statusKey] || '📝',
            address: o.address || o.deliveryAddress || '—',
            items: Array.isArray(o.items)
              ? o.items.map(it => ({
                  name: { uz: it.name || it.dish?.name, ru: it.name || it.dish?.name, en: it.name || it.dish?.name },
                  qty: it.quantity || it.qty || 1,
                  usdPrice: Number(it.price) > 100 ? Number(it.price) / 12700 : Number(it.price),
                }))
              : [],
            totalUsd,
          };
        });
        setOrders(formatted);

        // Calculate cashback (5% from all delivered orders)
        const totalDelivered = formatted
          .filter(o => o.status === 'delivered')
          .reduce((sum, o) => sum + o.totalUsd, 0);
        setCashbackBalance(Math.round(totalDelivered * 0.05 * 100) / 100);
      } else {
        setOrders([]);
        setCashbackBalance(0);
      }
    } catch (err) {
      console.warn('Orders load error:', err);
      setOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  };

  const activeOrders = orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled');
  const pastOrders = orders.filter(o => o.status === 'delivered' || o.status === 'cancelled');
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
                <h2>{user?.username || user?.firstName || 'Mehmon'}</h2>
                <p>{user?.email || user?.phone || '+998 (90) 000-00-00'}</p>
                <span className="profile-badge">⭐ {t.clientStatus}</span>
              </div>
            </div>

            {/* Cashback Balance Card */}
            <div className="profile-cashback-card">
              <div className="cashback-icon">💰</div>
              <div className="cashback-info">
                <div className="cashback-label">Keshbek balansi</div>
                <div className="cashback-amount">{priceFormat(cashbackBalance)}</div>
                <div className="cashback-hint">Har buyurtmadan 5% qaytariladi</div>
              </div>
            </div>
          </div>

          {/* Order Tabs */}
          <div className="profile-tabs">
            <button
              className={`profile-tab-btn ${activeTab === 'active' ? 'active' : ''}`}
              onClick={() => setActiveTab('active')}
            >
              🕒 {t.activeOrders || 'Faol buyurtmalar'} ({activeOrders.length})
            </button>
            <button
              className={`profile-tab-btn ${activeTab === 'past' ? 'active' : ''}`}
              onClick={() => setActiveTab('past')}
            >
              📦 {t.pastOrders || "O'tgan buyurtmalar"} ({pastOrders.length})
            </button>
          </div>

          {/* Orders List */}
          {ordersLoading ? (
            <div className="orders-empty">
              <div className="orders-loading-spinner"></div>
              <p style={{ color: '#888', marginTop: 16 }}>Buyurtmalar yuklanmoqda...</p>
            </div>
          ) : currentList.length === 0 ? (
            <div className="orders-empty">
              <div className="orders-empty-icon">🍽️</div>
              <p>{activeTab === 'active' ? (t.noActiveOrders || 'Faol buyurtmalar yo\'q') : (t.noPastOrders || "O'tgan buyurtmalar yo'q")}</p>
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

                  {/* Order Progress Timeline */}
                  {order.statusIndex && (
                    <div className="order-timeline-wrapper">
                      <div className="order-timeline">
                        <div className={`timeline-step ${order.statusIndex >= 1 ? 'completed' : ''} ${order.statusIndex === 1 ? 'active' : ''}`}>
                          <div className="step-node">📝</div>
                          <div className="step-label">Qabul qilindi</div>
                        </div>
                        <div className={`timeline-bar ${order.statusIndex >= 2 ? 'filled' : ''}`} />

                        <div className={`timeline-step ${order.statusIndex >= 2 ? 'completed' : ''} ${order.statusIndex === 2 ? 'active' : ''}`}>
                          <div className="step-node">👨‍🍳</div>
                          <div className="step-label">Tayyorlanmoqda</div>
                        </div>
                        <div className={`timeline-bar ${order.statusIndex >= 3 ? 'filled' : ''}`} />

                        <div className={`timeline-step ${order.statusIndex >= 3 ? 'completed' : ''} ${order.statusIndex === 3 ? 'active' : ''}`}>
                          <div className="step-node">🚴</div>
                          <div className="step-label">Kuryer yo'lda</div>
                        </div>
                        <div className={`timeline-bar ${order.statusIndex >= 4 ? 'filled' : ''}`} />

                        <div className={`timeline-step ${order.statusIndex >= 4 ? 'completed' : ''} ${order.statusIndex === 4 ? 'active' : ''}`}>
                          <div className="step-node">🎉</div>
                          <div className="step-label">Yetkazildi</div>
                        </div>
                      </div>
                    </div>
                  )}

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
