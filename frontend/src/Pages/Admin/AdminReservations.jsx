import React, { useState, useEffect } from 'react';
import { reservationApi } from '../../services/api';

const INIT_RESERVATIONS = [
  { rawId: 42, id: '#R42', client: 'Aziz N.', phone: '+998901234567', date: '11.09.2026', time: '19:00', guests: 4, table: 'VIP #1', note: '', status: 'CONFIRMED' },
  { rawId: 41, id: '#R41', client: 'Feruza S.', phone: '+998907654321', date: '11.09.2026', time: '20:00', guests: 2, table: '#3', note: 'Tortli stol', status: 'PENDING' },
  { rawId: 40, id: '#R40', client: 'Ulugbek J.', phone: '+998905551122', date: '10.09.2026', time: '18:00', guests: 6, table: '#5', note: '', status: 'CONFIRMED' },
];

const STATUS_LABELS = { PENDING: 'Kutilmoqda', CONFIRMED: 'Tasdiqlangan', CANCELLED: 'Bekor qilindi' };

export default function AdminReservations() {
  const [reservations, setReservations] = useState(INIT_RESERVATIONS);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const data = await reservationApi.getAllReservations();
      if (Array.isArray(data) && data.length > 0) {
        const formatted = data.map(r => ({
          rawId: r.id,
          id: `#R${r.id}`,
          client: r.user ? `${r.user.firstName} ${r.user.lastName}` : r.phone || `Mijoz #${r.userId}`,
          phone: r.phone || r.user?.phone || '—',
          date: r.date ? new Date(r.date).toLocaleDateString('ru-RU') : '—',
          time: r.startTime ? new Date(r.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—',
          guests: r.guests || 2,
          table: r.table ? `Stol #${r.table.number}` : `Stol #${r.tableId}`,
          note: r.note || '',
          status: r.status || 'PENDING'
        }));
        setReservations(formatted);
      }
    } catch (err) {
      console.warn("Backend reservations API ulanmadi, demo ro'yxat ishlatilmoqda:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const filtered = reservations.filter(r => {
    const matchStatus = statusFilter === 'ALL' || r.status === statusFilter;
    const matchSearch = r.client.toLowerCase().includes(search.toLowerCase()) || r.id.includes(search);
    return matchStatus && matchSearch;
  });

  const changeStatus = async (rawId, newStatus) => {
    try {
      await reservationApi.updateReservationStatus(rawId, newStatus);
    } catch (err) {
      console.warn("Backend reservation status update error:", err.message);
    }
    setReservations(prev => prev.map(r => r.rawId === rawId ? { ...r, status: newStatus } : r));
  };

  return (
    <div>
      <div className="admin-glass-card">
        <div className="admin-section-header">
          <span className="admin-section-title">📅 Bronlar boshqaruvi</span>
          <span style={{ fontSize: 13, color: '#666' }}>{filtered.length} ta bron</span>
        </div>

        <div className="admin-filter-bar">
          <input
            className="admin-search-input"
            placeholder="🔍 Mijoz yoki ID bo'yicha..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <div className="admin-select-wrapper" style={{ maxWidth: 200 }}>
            <select className="admin-custom-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="ALL">Barchasi</option>
              <option value="PENDING">Kutilmoqda</option>
              <option value="CONFIRMED">Tasdiqlangan</option>
              <option value="CANCELLED">Bekor qilindi</option>
            </select>
            <span className="admin-select-arrow">▼</span>
          </div>
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
              {loading ? (
                <tr><td colSpan={8} style={{ textAlign: 'center', padding: 30, color: '#888' }}>🔄 Bronlar yuklanmoqda...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={8} style={{ textAlign: 'center', color: '#999', padding: 30 }}>Bronlar topilmadi</td></tr>
              ) : (
                filtered.map(r => (
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
                    <td>
                      <span className={`admin-badge admin-badge-${r.status.toLowerCase()}`}>
                        {STATUS_LABELS[r.status] || r.status}
                      </span>
                    </td>
                    <td>
                      {r.status === 'PENDING' && (
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button className="admin-btn admin-btn-primary admin-btn-sm" onClick={() => changeStatus(r.rawId, 'CONFIRMED')}>✅ Tasdiqlash</button>
                          <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => changeStatus(r.rawId, 'CANCELLED')}>❌</button>
                        </div>
                      )}
                      {r.status === 'CONFIRMED' && (
                        <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => changeStatus(r.rawId, 'CANCELLED')}>❌ Bekor</button>
                      )}
                      {r.status === 'CANCELLED' && (
                        <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => changeStatus(r.rawId, 'PENDING')}>↩ Qayta</button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
