import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import CartDrawer from './CartDrawer';
import tel from '../assets/images/tel.png';
import mail from '../assets/images/mail.png';
import logo from '../assets/images/logo.png';
import heard from '../assets/images/heard.png';
import { menuApi } from '../services/api';
import food1 from '../assets/images/food1.png';
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
  const { lang, setLang, t, priceFormat } = useLanguage();
  const { isDark, toggleTheme } = useTheme();

  const [langOpen, setLangOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [dishesList, setDishesList] = useState([]);

  const langRef = useRef(null);
  const searchRef = useRef(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    fetchDishes();
  }, []);

  const fetchDishes = async () => {
    try {
      const data = await menuApi.getMenuItems().catch(() => []);
      if (Array.isArray(data)) {
        const formatted = data.map((item) => ({
          id: item.id,
          name: typeof item.name === 'object' ? (item.name[lang] || item.name.ru || item.name) : item.name,
          category: item.category?.name || 'Boshqalar',
          usdPrice: Number(item.price) > 100 ? Number(item.price) / 12700 : Number(item.price),
          img: item.image || food1,
        }));
        setDishesList(formatted);
      }
    } catch (err) {
      console.warn('Failed to load menu for search:', err);
    }
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (langRef.current && !langRef.current.contains(e.target)) {
        setLangOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const searchResults = searchQuery.trim()
    ? dishesList.filter((d) => {
        const q = searchQuery.toLowerCase();
        const n = String(d.name || '').toLowerCase();
        const c = String(d.category || '').toLowerCase();
        return n.includes(q) || c.includes(q);
      }).slice(0, 6)
    : [];

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
          <div className={`header-main-inner ${searchOpen ? 'search-active' : ''}`}>
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
              {/* ── Live Search Box ── */}
              <div className="header-search-wrapper" ref={searchRef}>
                <div
                  className={`header-search-box ${searchOpen || searchQuery ? 'open' : ''}`}
                  onClick={() => {
                    if (!searchOpen) {
                      setSearchOpen(true);
                      setTimeout(() => searchInputRef.current?.focus(), 50);
                    }
                  }}
                >
                  <svg className="header-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder={t.searchPlaceholder || 'Taomlarni izlash...'}
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setSearchOpen(true);
                    }}
                    onFocus={() => setSearchOpen(true)}
                    className="header-search-input"
                  />
                  {(searchQuery || searchOpen) && (
                    <span
                      className="header-search-clear"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSearchQuery('');
                        setSearchOpen(false);
                      }}
                      title="Yopish"
                    >
                      ✕
                    </span>
                  )}
                </div>

                {/* Popover Live Search Results */}
                {searchOpen && searchQuery.trim().length > 0 && (
                  <div className="header-search-popover">
                    {searchResults.length === 0 ? (
                      <div className="search-no-results">
                        <span className="no-res-emoji">🔍</span>
                        <p>{t.noSearchResults || 'Afsuski, taom topilmadi'}</p>
                      </div>
                    ) : (
                      <div className="search-results-list">
                        <div className="search-results-header">{t.searchDishes || 'Topilgan taomlar'}:</div>
                        {searchResults.map((dish) => (
                          <div
                            key={dish.id}
                            className="search-result-item"
                            onClick={() => {
                              navigate(`/product/${dish.id}`);
                              setSearchQuery('');
                              setSearchOpen(false);
                            }}
                          >
                            <div className="search-img-box">
                              <img
                                src={dish.img}
                                alt={dish.name}
                                onError={(e) => { e.target.onerror = null; e.target.src = food1; }}
                              />
                            </div>
                            <div className="search-item-info">
                              <div className="search-item-title">{dish.name}</div>
                              <div className="search-item-cat">{dish.category}</div>
                            </div>
                            <div className="search-item-price">{priceFormat(dish.usdPrice)}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* ── Dark / Light Mode Toggle ── */}
              <button
                className={`header-theme-toggle ${isDark ? 'dark' : 'light'}`}
                onClick={toggleTheme}
                title={isDark ? 'Kunduzgi rejim' : 'Tungi rejim'}
                aria-label="Toggle theme"
              >
                <span className="theme-toggle-track">
                  <span className="theme-toggle-thumb">
                    {isDark ? (
                      // Moon icon
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                      </svg>
                    ) : (
                      // Sun icon
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <circle cx="12" cy="12" r="5"/>
                        <line x1="12" y1="1" x2="12" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        <line x1="12" y1="21" x2="12" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        <line x1="1" y1="12" x2="3" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        <line x1="21" y1="12" x2="23" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    )}
                  </span>
                </span>
              </button>

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
          <div className={`header-mobile-drawer ${mobileNavOpen ? 'open' : ''}`}>
            <nav className="mobile-nav-links">
              <NavLink to="/menu"     onClick={() => setMobileNavOpen(false)} className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}>{t.menu}</NavLink>
              <NavLink to="/novosti"  onClick={() => setMobileNavOpen(false)} className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}>{t.news}</NavLink>
              <NavLink to="/booking"  onClick={() => setMobileNavOpen(false)} className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}>{t.booking}</NavLink>
              <NavLink to="/about"    onClick={() => setMobileNavOpen(false)} className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}>{t.about}</NavLink>
              <NavLink to="/contacts" onClick={() => setMobileNavOpen(false)} className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}>{t.contacts}</NavLink>
            </nav>
          </div>
        </div>
      )}

      {/* Cart Drawer Component */}
      <CartDrawer />
    </div>
  );
}
