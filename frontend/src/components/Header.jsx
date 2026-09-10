import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import CartDrawer from './CartDrawer';
import tel from '../assets/images/tel.png';
import mail from '../assets/images/mail.png';
import logo from '../assets/images/logo.png';
import heard from '../assets/images/heard.png';
import FlagIcon from './FlagIcon';
import '../styles/Header.css';

const LANGUAGES = [
  { code: 'uz', label: "O'zbekcha" },
  { code: 'ru', label: 'Русский' },
  { code: 'en', label: 'English' },
];

export default function Header({ showNav = true }) {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { totalCount, setIsCartOpen, notification } = useCart();
  const { lang, setLang, t } = useLanguage();

  const [langOpen, setLangOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const langRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (langRef.current && !langRef.current.contains(e.target)) {
        setLangOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLang = LANGUAGES.find((l) => l.code === lang) || LANGUAGES[1];

  return (
    <div className="site-header">
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

      {/* TOP INFO BAR */}
      <div className="header-top-bar">
        <div className="header-top-inner">
          <div className="header-contact-info">
            <div className="header-contact-item">
              <img src={tel} alt="" />
              <a href="tel:+998907583833">+998(90)7583833</a>
            </div>
            <div className="header-contact-item">
              <img src={mail} alt="" />
              <a href="mailto:info@bmgsoft.com">info@bmgsoft.com</a>
            </div>
          </div>

          <div className="header-user-controls">
            {/* ── Language Selector ── */}
            <div className="header-lang-picker" ref={langRef} onClick={() => setLangOpen((v) => !v)}>
              <span className="lang-flag">
                <FlagIcon code={currentLang.code} width={20} height={14} />
              </span>
              <span className="lang-label">{currentLang.label}</span>
              <span className="lang-arrow">{langOpen ? '▴' : '▾'}</span>

              {langOpen && (
                <div className="lang-dropdown">
                  {LANGUAGES.map((l) => (
                    <div
                      key={l.code}
                      className={`lang-option ${l.code === lang ? 'lang-option--active' : ''}`}
                      onClick={(e) => { e.stopPropagation(); setLang(l.code); setLangOpen(false); }}
                    >
                      <span className="lang-flag">
                        <FlagIcon code={l.code} width={20} height={14} />
                      </span>
                      <span className="lang-label">{l.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ── User / Auth ── */}
            {isAuthenticated ? (
              <div
                onClick={() => navigate('/profile')}
                className="header-profile-btn"
                title={user?.username ? `${user.username} (${t.profile})` : t.profile}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
            ) : (
              <button onClick={() => navigate('/login')} className="header-login-btn">
                👤 {t.login}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* MAIN NAV BAR */}
      {showNav && (
        <div className="header-main-nav">
          <div className="header-main-inner">
            <Link to="/home" className="header-logo-link">
              <img src={logo} alt="logo" className="header-logo" />
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="header-nav-links desktop-nav">
              <NavLink to="/menu"     className={({ isActive }) => `header-nav-link ${isActive ? 'active' : ''}`}>{t.menu}</NavLink>
              <NavLink to="/novosti"  className={({ isActive }) => `header-nav-link ${isActive ? 'active' : ''}`}>{t.news}</NavLink>
              <NavLink to="/booking"  className={({ isActive }) => `header-nav-link ${isActive ? 'active' : ''}`}>{t.booking}</NavLink>
              <NavLink to="/about"    className={({ isActive }) => `header-nav-link ${isActive ? 'active' : ''}`}>{t.about}</NavLink>
              <NavLink to="/contacts" className={({ isActive }) => `header-nav-link ${isActive ? 'active' : ''}`}>{t.contacts}</NavLink>
            </nav>

            <div className="header-actions">
              <div
                onClick={() => setIsCartOpen(true)}
                className="header-cart-icon-wrapper"
                title={t.cart}
              >
                <svg
                  className="header-cart-icon-svg"
                  width="26"
                  height="26"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
                {totalCount > 0 && (
                  <span className="header-cart-badge">
                    {totalCount}
                  </span>
                )}
              </div>

              {/* Mobile Hamburger Button */}
              <button
                className="header-mobile-toggle"
                onClick={() => setMobileNavOpen((v) => !v)}
                aria-label="Toggle Navigation"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  {mobileNavOpen ? (
                    <>
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </>
                  ) : (
                    <>
                      <line x1="3" y1="6" x2="21" y2="6" />
                      <line x1="3" y1="12" x2="21" y2="12" />
                      <line x1="3" y1="18" x2="21" y2="18" />
                    </>
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Overlay Menu Drawer */}
          {mobileNavOpen && (
            <div className="header-mobile-drawer">
              <nav className="mobile-nav-links">
                <NavLink to="/menu"     onClick={() => setMobileNavOpen(false)} className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}>{t.menu}</NavLink>
                <NavLink to="/novosti"  onClick={() => setMobileNavOpen(false)} className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}>{t.news}</NavLink>
                <NavLink to="/booking"  onClick={() => setMobileNavOpen(false)} className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}>{t.booking}</NavLink>
                <NavLink to="/about"    onClick={() => setMobileNavOpen(false)} className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}>{t.about}</NavLink>
                <NavLink to="/contacts" onClick={() => setMobileNavOpen(false)} className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}>{t.contacts}</NavLink>
              </nav>
            </div>
          )}
        </div>
      )}

      {/* Cart Drawer Component */}
      <CartDrawer />
    </div>
  );
}
