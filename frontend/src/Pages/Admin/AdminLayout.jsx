import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/Admin.css';

const NAV_ITEMS = [
  { path: '/admin',             icon: '📊', label: 'Dashboard',        end: true },
  { path: '/admin/menu',        icon: '🍽️', label: 'Menu boshqaruvi' },
  { path: '/admin/orders',      icon: '📦', label: 'Buyurtmalar' },
  { path: '/admin/reservations',icon: '📅', label: 'Bronlar' },
  { path: '/admin/users',       icon: '👥', label: 'Foydalanuvchilar' },
  { path: '/admin/news',        icon: '📣', label: 'Yangiliklar' },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Role guard
  if (!user || user.role !== 'ADMIN') {
    navigate('/login');
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const closeSidebar = () => setSidebarOpen(false);

  const now = new Date();
  const timeStr = now.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' });
  const dateStr = now.toLocaleDateString('uz-UZ', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <div className="admin-root">
      {/* Mobile hamburger */}
      <button className="admin-hamburger" onClick={() => setSidebarOpen(true)}>
        <span /><span /><span />
      </button>

      {/* Sidebar overlay for mobile */}
      <div
        className={`admin-sidebar-overlay ${sidebarOpen ? 'visible' : ''}`}
        onClick={closeSidebar}
      />

      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-logo">
          <div className="logo-icon">🍕</div>
          <div className="logo-text">
            <span className="logo-title">My Restaurant</span>
            <span className="logo-sub">Admin Panel</span>
          </div>
        </div>

        <nav className="admin-nav">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `admin-nav-link${isActive ? ' active' : ''}`
              }
              onClick={closeSidebar}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}

          <div className="admin-nav-divider" />

          <Link to="/home" className="admin-nav-link" onClick={closeSidebar}>
            <span className="nav-icon">🌐</span>
            Saytga qaytish
          </Link>
        </nav>

        <div className="admin-sidebar-bottom">
          <div className="admin-user-info">
            <div className="admin-user-avatar">
              {(user?.username || 'A')[0].toUpperCase()}
            </div>
            <div>
              <div className="admin-user-name">{user?.username || 'Admin'}</div>
              <div className="admin-user-role">Administrator</div>
            </div>
          </div>
          <button className="admin-logout-btn" onClick={handleLogout}>
            <span>🚪</span> Chiqish
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="admin-main">
        {/* Topbar */}
        <div className="admin-topbar">
          <span className="admin-topbar-title">
            {NAV_ITEMS.find(n => window.location.pathname === n.path || window.location.pathname.startsWith(n.path + '/'))?.label || 'Admin Panel'}
          </span>
          <div className="admin-topbar-right">
            <span className="admin-topbar-time">📅 {dateStr} · {timeStr}</span>
            <Link to="/home" className="admin-home-btn">🌐 Sayt</Link>
          </div>
        </div>

        {/* Page content via nested routes */}
        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
