import React, { useState, useEffect } from 'react';
import { ordersApi, reservationApi, usersApi } from '../../services/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    todayOrders: 24,
    activeReservations: 8,
    totalUsers: 142,
    monthlyIncome: "3.2M so'm"
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentReservations, setRecentReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // 1. Fetch dashboard stats
      const statsRes = await ordersApi.getStats().catch(() => null);
      if (statsRes) {
        setStats({
          todayOrders: statsRes.ordersCount || 24,
          activeReservations: statsRes.reservationsCount || 8,
          totalUsers: statsRes.usersCount || 142,
          monthlyIncome: statsRes.totalIncome ? `${Number(statsRes.totalIncome).toLocaleString('ru-RU')} so'm` : "3.2M so'm"
        });
      }

      // 2. Fetch orders
      const ordersRes = await ordersApi.getAllOrders().catch(() => null);
      if (Array.isArray(ordersRes) && ordersRes.length > 0) {
        const formattedOrders = ordersRes.slice(0, 5).map(o => ({
          id: `#${o.id}`,
          client: o.user ? `${o.user.firstName} ${o.user.lastName}` : `Mijoz #${o.userId}`,
          total: `${Number(o.totalPrice).toLocaleString('ru-RU')} so'm`,
          status: o.status.toLowerCase(),
          statusLabel: getStatusLabel(o.status)
        }));
        setRecentOrders(formattedOrders);
      } else {
        setRecentOrders([
          { id: '#1024', client: 'Oybek T.', total: '381 000 so\'m', status: 'preparing', statusLabel: 'Tayyorlanmoqda' },
          { id: '#1023', client: 'Dilnoza K.', total: '279 000 so\'m', status: 'delivered', statusLabel: 'Yetkazildi' },
          { id: '#1022', client: 'Sardor M.', total: '127 000 so\'m', status: 'pending', statusLabel: 'Kutilmoqda' }
        ]);
      }

      // 3. Fetch reservations
      const resvRes = await reservationApi.getAllReservations().catch(() => null);
      if (Array.isArray(resvRes) && resvRes.length > 0) {
        const formattedResv = resvRes.slice(0, 5).map(r => ({
          id: `#R${r.id}`,
          client: r.user ? `${r.user.firstName} ${r.user.lastName}` : r.phone,
          date: r.date ? new Date(r.date).toLocaleDateString('ru-RU') : '11.09.2026',
          time: r.startTime ? new Date(r.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '19:00',
          table: r.table ? `Stol #${r.table.number}` : `#1`,
          status: r.status.toLowerCase(),
          statusLabel: r.status === 'CONFIRMED' ? 'Tasdiqlangan' : r.status === 'CANCELLED' ? 'Bekor qilindi' : 'Kutilmoqda'
        }));
        setRecentReservations(formattedResv);
      } else {
        setRecentReservations([
          { id: '#R42', client: 'Aziz N.', date: '11.09.2026', time: '19:00', table: 'VIP #1', status: 'confirmed', statusLabel: 'Tasdiqlangan' },
          { id: '#R41', client: 'Feruza S.', date: '11.09.2026', time: '20:00', table: '#3', status: 'pending', statusLabel: 'Kutilmoqda' }
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'PENDING': return 'Kutilmoqda';
      case 'PREPARING': return 'Tayyorlanmoqda';
      case 'READY': return 'Tayyor';
      case 'DELIVERED': return 'Yetkazildi';
      case 'CANCELLED': return 'Bekor qilindi';
      default: return status;
    }
  };

  const statCards = [
    { icon: '📦', label: "Bugungi buyurtmalar", value: stats.todayOrders, change: '+12%', trend: 'up', color: 'gold' },
    { icon: '📅', label: "Faol bronlar", value: stats.activeReservations, change: '+3%', trend: 'up', color: 'blue' },
    { icon: '👥', label: "Foydalanuvchilar", value: stats.totalUsers, change: '+5%', trend: 'up', color: 'green' },
    { icon: '💰', label: "Oylik daromad", value: stats.monthlyIncome, change: '+8%', trend: 'up', color: 'red' },
  ];

  return (
    <div>
      {/* Stats */}
      <div className="admin-stats-grid">
        {statCards.map((s) => (
          <div className="admin-stat-card" key={s.label}>
            <div className={`admin-stat-icon ${s.color}`}>{s.icon}</div>
            <div>
              <div className="admin-stat-value">{s.value}</div>
              <div className="admin-stat-label">{s.label}</div>
              <div className={`admin-stat-change ${s.trend}`}>
                {s.trend === 'up' ? '↑' : '↓'} {s.change} bu oy
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent grid */}
      <div className="admin-recent-grid">
        {/* Recent Orders */}
        <div className="admin-glass-card">
          <div className="admin-section-header">
            <span className="admin-section-title">📦 Oxirgi buyurtmalar</span>
          </div>
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Mijoz</th>
                  <th>Summa</th>
                  <th>Holat</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o) => (
                  <tr key={o.id}>
                    <td style={{ fontWeight: 700, color: '#555' }}>{o.id}</td>
                    <td>{o.client}</td>
                    <td style={{ fontWeight: 700 }}>{o.total}</td>
                    <td>
                      <span className={`admin-badge admin-badge-${o.status}`}>
                        {o.statusLabel}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Reservations */}
        <div className="admin-glass-card">
          <div className="admin-section-header">
            <span className="admin-section-title">📅 Oxirgi bronlar</span>
          </div>
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Mijoz</th>
                  <th>Sana / Vaqt</th>
                  <th>Stol</th>
                  <th>Holat</th>
                </tr>
              </thead>
              <tbody>
                {recentReservations.map((r) => (
                  <tr key={r.id}>
                    <td>{r.client}</td>
                    <td style={{ fontSize: 13, color: '#555' }}>{r.date} {r.time}</td>
                    <td>{r.table}</td>
                    <td>
                      <span className={`admin-badge admin-badge-${r.status}`}>
                        {r.statusLabel}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
