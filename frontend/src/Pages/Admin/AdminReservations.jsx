import React, { useState } from 'react';

const INIT_RESERVATIONS = [
  { id: '#R42', client: 'Aziz N.',    phone: '+998901234567', date: '11.09.2026', time: '19:00', guests: 4, table: 'VIP #1', note: '',               status: 'confirmed' },
  { id: '#R41', client: 'Feruza S.', phone: '+998907654321', date: '11.09.2026', time: '20:00', guests: 2, table: '#3',     note: 'Tortli stol',    status: 'pending' },
  { id: '#R40', client: 'Ulugbek J.',phone: '+998905551122', date: '10.09.2026', time: '18:00', guests: 6, table: '#5',     note: '',               status: 'confirmed' },
  { id: '#R39', client: 'Nodira K.', phone: '+998901112233', date: '09.09.2026', time: '19:30', guests: 3, table: 'VIP #2', note: 'Tug\'ilgan kun', status: 'cancelled' },
  { id: '#R38', client: 'Bobur M.',  phone: '+998909988776', date: '09.09.2026', time: '20:30', guests: 2, table: '#2',     note: '',               status: 'confirmed' },
];

const STATUS_LABELS = { pending: 'Kutilmoqda', confirmed: 'Tasdiqlangan', cancelled: 'Bekor qilindi' };

export default function AdminReservations() {
  const [reservations, setReservations] = useState(INIT_RESERVATIONS);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = reservations.filter(r => {
    const matchStatus = statusFilter === 'all' || r.status === statusFilter;
    const matchSearch = r.client.toLowerCase().includes(search.toLowerCase()) || r.id.includes(search);
    return matchStatus && matchSearch;
  });

  const changeStatus = (id, newStatus) => {
    setReservations(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
  };

  return (
    <div>
      <div className="admin-glass-card">
        <div className="admin-section-header">
          <span className="admin-section-title">📅 Bronlar</span>
          <span style={{ fontSize: 14, color: '#666' }}>{filtered.length} ta bron</span>
        </div>

        <div className="admin-filter-bar">
          <input
            className="admin-search-input"
            placeholder="🔍 Mijoz yoki ID bo'yicha..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select className="admin-filter-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="all">Barchasi</option>
            <option value="pending">Kutilmoqda</option>
            <option value="confirmed">Tasdiqlangan</option>
            <option value="cancelled">Bekor qilindi</option>
          </select>
        </div>

        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Mijoz</th>
                <th>Sana / Vaqt</th>
                <th>Mehmonlar</th>
                <th>Stol</th>
                <th>Izoh</th>
                <th>Holat</th>
                <th>Amallar</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={8} style={{ textAlign: 'center', color: '#999', padding: 30 }}>Bronlar topilmadi</td></tr>
              )}
              {filtered.map(r => (
                <tr key={r.id}>
                  <td style={{ fontWeight: 700, color: '#555' }}>{r.id}</td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{r.client}</div>
                    <div style={{ fontSize: 12, color: '#888' }}>{r.phone}</div>
                  </td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    <div style={{ fontWeight: 600 }}>{r.date}</div>
                    <div style={{ fontSize: 12, color: '#888' }}>{r.time}</div>
                  </td>
                  <td style={{ textAlign: 'center' }}>👥 {r.guests}</td>
                  <td style={{ fontWeight: 600 }}>{r.table}</td>
                  <td style={{ fontSize: 13, color: '#666' }}>{r.note || '—'}</td>
                  <td><span className={`admin-badge admin-badge-${r.status}`}>{STATUS_LABELS[r.status]}</span></td>
                  <td>
                    {r.status === 'pending' && (
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="admin-btn admin-btn-primary admin-btn-sm" onClick={() => changeStatus(r.id, 'confirmed')}>✅ Tasdiqlash</button>
                        <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => changeStatus(r.id, 'cancelled')}>❌</button>
                      </div>
                    )}
                    {r.status === 'confirmed' && (
                      <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => changeStatus(r.id, 'cancelled')}>❌ Bekor</button>
                    )}
                    {r.status === 'cancelled' && (
                      <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => changeStatus(r.id, 'pending')}>↩ Qayta</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
