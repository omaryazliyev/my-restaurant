import React from 'react';

const STATS = [
  { icon: '📦', label: "Bugungi buyurtmalar", value: '24', change: '+12%', trend: 'up', color: 'gold' },
  { icon: '📅', label: "Faol bronlar",        value: '8',  change: '+3%',  trend: 'up', color: 'blue' },
  { icon: '👥', label: "Foydalanuvchilar",    value: '142',change: '+5%',  trend: 'up', color: 'green' },
  { icon: '💰', label: "Oylik daromad",       value: "3.2M so'm", change: '+8%', trend: 'up', color: 'red' },
];

const RECENT_ORDERS = [
  { id: '#1024', client: 'Oybek T.',   items: 'Tovuq sho\'rva × 2, Pitsa × 1', total: '381 000 so\'m', status: 'preparing',  statusLabel: 'Tayyorlanmoqda' },
  { id: '#1023', client: 'Dilnoza K.', items: 'BBQ Burger × 1, Latte × 2',    total: '279 000 so\'m', status: 'delivered',  statusLabel: 'Yetkazildi' },
  { id: '#1022', client: 'Sardor M.',  items: 'Grek salati × 1',              total: '127 000 so\'m', status: 'pending',    statusLabel: 'Kutilmoqda' },
  { id: '#1021', client: 'Malika A.',  items: 'Losos biftek × 1, Choy × 1',   total: '342 000 so\'m', status: 'ready',      statusLabel: 'Tayyor' },
  { id: '#1020', client: 'Jasur R.',   items: 'Minestrone × 2',               total: '266 400 so\'m', status: 'cancelled',  statusLabel: 'Bekor qilindi' },
];

const RECENT_RESERVATIONS = [
  { id: '#R42', client: 'Aziz N.',    date: '11.09.2026', time: '19:00', guests: 4, table: 'VIP #1', status: 'confirmed', statusLabel: 'Tasdiqlangan' },
  { id: '#R41', client: 'Feruza S.',  date: '11.09.2026', time: '20:00', guests: 2, table: '#3',     status: 'pending',   statusLabel: 'Kutilmoqda' },
  { id: '#R40', client: 'Ulugbek J.', date: '10.09.2026', time: '18:00', guests: 6, table: '#5',     status: 'confirmed', statusLabel: 'Tasdiqlangan' },
];

export default function AdminDashboard() {
  return (
    <div>
      {/* Stats */}
      <div className="admin-stats-grid">
        {STATS.map((s) => (
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
                {RECENT_ORDERS.map((o) => (
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
                {RECENT_RESERVATIONS.map((r) => (
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
