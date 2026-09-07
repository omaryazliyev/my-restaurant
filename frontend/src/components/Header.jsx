import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import CartDrawer from './CartDrawer';
import tel from '../assets/images/tel.png';
import mail from '../assets/images/mail.png';
import rus from '../assets/images/rus.png';
import logo from '../assets/images/logo.png';
import icon from '../assets/images/icon.png';
import heard from '../assets/images/heard.png';

export default function Header({ showNav = true }) {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { totalCount, setIsCartOpen, notification } = useCart();

  const getLinkStyle = ({ isActive }) => ({
    color: isActive ? '#e63946' : 'inherit',
    fontWeight: isActive ? '700' : '500',
    transition: 'color 0.2s ease',
  });

  return (
    <>
      {/* Toast notification */}
      {notification && (
        <div style={{
          position: 'fixed', top: '20px', right: '20px', zIndex: 10000,
          backgroundColor: '#4caf50', color: '#fff', padding: '12px 20px',
          borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
          fontWeight: 'bold', fontSize: '14px', animation: 'fadeIn 0.3s ease',
        }}>
          ✅ {notification}
        </div>
      )}

      <header className="home-header">
        <nav>
          <div className="tel-mail">
            <div className="tel">
              <img src={tel} alt="" />
              <a href="tel:+9989075838333">+998(90)758383833</a>
            </div>
            <div className="mail">
              <img src={mail} alt="" />
              <a href="mailto:info@bmgsoft.com">info@bmgsoft.com</a>
            </div>
          </div>
          <div className="nav-right" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '14px', color: '#333' }}>
              <img src={rus} alt="RU" style={{ width: '18px', height: '14px', borderRadius: '2px' }} />
              <span>Русский ▾</span>
            </div>
            {isAuthenticated ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ color: '#ffb703', fontWeight: 'bold', fontSize: '14px' }}>
                  👤 {user?.username || 'Пользователь'}
                </span>
                <button
                  onClick={logout}
                  style={{
                    backgroundColor: 'transparent', border: '1px solid #ff4d4f',
                    color: '#ff4d4f', borderRadius: '8px', padding: '6px 12px',
                    cursor: 'pointer', fontSize: '13px',
                  }}
                >
                  Выйти
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigate('/')}
                style={{
                  backgroundColor: '#000', color: '#fff', border: 'none',
                  borderRadius: '20px', padding: '8px 16px', fontSize: '13px',
                  fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px'
                }}
              >
                👤 Вход в аккаунт
              </button>
            )}
          </div>
        </nav>
      </header>

      {showNav && (
        <div className="s1-head">
          <Link to="/home"><img src={logo} alt="logo" /></Link>
          <div className="home-nav">
            <NavLink to="/menu" style={getLinkStyle}>Меню</NavLink>
            <NavLink to="/novosti" style={getLinkStyle}>Новости</NavLink>
            <NavLink to="/booking" style={getLinkStyle}>Бронирование</NavLink>
            <NavLink to="/about" style={getLinkStyle}>О нас</NavLink>
            <NavLink to="/contacts" style={getLinkStyle}>Контакты</NavLink>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <img src={heard} alt="Favorites" style={{ cursor: 'pointer', width: '22px', height: '22px' }} title="Избранное" />
            <div
              onClick={() => setIsCartOpen(true)}
              style={{ position: 'relative', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              title="Открыть корзину"
            >
              <img src={icon} alt="Cart" />
              {totalCount > 0 && (
                <span style={{
                  position: 'absolute', top: '-6px', right: '-8px',
                  backgroundColor: '#ffb703', color: '#1e1f25',
                  borderRadius: '50%', padding: '2px 7px',
                  fontSize: '12px', fontWeight: 'bold',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
                }}>
                  {totalCount}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Cart Drawer Component */}
      <CartDrawer />
    </>
  );
}
