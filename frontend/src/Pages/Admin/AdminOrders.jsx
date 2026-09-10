import React, { useState } from 'react';

const INIT_ORDERS = [
  { id: '#1024', client: 'Oybek T.',   phone: '+998901234567', items: "Tovuq sho'rva × 2, Pitsa × 1", total: 381000, status: 'preparing',  date: '10.09.2026 20:15' },
  { id: '#1023', client: 'Dilnoza K.', phone: '+998901112233', items: 'BBQ Burger × 1, Latte × 2',   total: 279000, status: 'delivered',  date: '10.09.2026 19:40' },
  { id: '#1022', client: 'Sardor M.',  phone: '+998907654321', items: 'Grek salati × 1',              total: 127000, status: 'pending',    date: '10.09.2026 19:10' },
  { id: '#1021', client: 'Malika A.',  phone: '+998909988776', items: 'Losos biftek × 1, Choy × 1',  total: 342000, status: 'ready',      date: '10.09.2026 18:55' },
  { id: '#1020', client: 'Jasur R.',   phone: '+998901234000', items: 'Minestrone × 2',              total: 266400, status: 'cancelled',  date: '10.09.2026 18:20' },
  { id: '#1019', client: 'Nargiza U.', phone: '+998905551122', items: 'BBQ Burger × 2, Limonadi × 1',total: 368500, status: 'delivered',  date: '10.09.2026 17:45' },
];

const STATUS_OPTIONS = [
  { value: 'all',        label: 'Barchasi' },
  { value: 'pending',    label: 'Kutilmoqda' },
  { value: 'preparing',  label: 'Tayyorlanmoqda' },
  { value: 'ready',      label: 'Tayyor' },
  { value: 'delivered',  label: 'Yetkazildi' },
  { value: 'cancelled',  label: 'Bekor qilindi' },
];

const STATUS_LABELS = {
  pending:   'Kutilmoqda',
  preparing: 'Tayyorlanmoqda',
  ready:     'Tayyor',
  delivered: 'Yetkazildi',
  cancelled: 'Bekor qilindi',
};

export default function AdminOrders() {
  const [orders, setOrders] = useState(INIT_ORDERS);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [detailOrder, setDetailOrder] = useState(null);

  const filtered = orders.filter(o => {
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    const matchSearch = o.client.toLowerCase().includes(search.toLowerCase()) || o.id.includes(search);
    return matchStatus && matchSearch;
  });

  const changeStatus = (id, newStatus) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
    if (detailOrder?.id === id) setDetailOrder(prev => ({ ...prev, status: newStatus }));
  };

  return (
    <div>
      <div className="admin-glass-card">
        <div className="admin-section-header">
          <span className="admin-section-title">📦 Buyurtmalar</span>
          <span style={{ fontSize: 14, color: '#666' }}>{filtered.length} ta buyurtma</span>
        </div>

        <div className="admin-filter-bar">
          <input
            className="admin-search-input"
            placeholder="🔍 Mijoz yoki ID bo'yicha..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select className="admin-filter-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            {STATUS_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>

        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Mijoz</th>
                <th>Taomlar</th>
                <th>Summa</th>
                <th>Sana</th>
                <th>Holat</th>
                <th>Amallar</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={7} style={{ textAlign: 'center', color: '#999', padding: 30 }}>Buyurtmalar topilmadi</td></tr>
              )}
              {filtered.map(o => (
                <tr key={o.id}>
                  <td style={{ fontWeight: 700, color: '#555' }}>{o.id}</td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{o.client}</div>
                    <div style={{ fontSize: 12, color: '#888' }}>{o.phone}</div>
                  </td>
                  <td style={{ fontSize: 13, maxWidth: 180 }}>{o.items}</td>
                  <td style={{ fontWeight: 700, whiteSpace: 'nowrap' }}>{o.total.toLocaleString('ru-RU')} so'm</td>
                  <td style={{ fontSize: 13, color: '#666', whiteSpace: 'nowrap' }}>{o.date}</td>
                  <td><span className={`admin-badge admin-badge-${o.status}`}>{STATUS_LABELS[o.status]}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => setDetailOrder(o)}>👁️</button>
                      <select
                        className="admin-filter-select"
                        style={{ padding: '4px 8px', fontSize: 12, borderRadius: 8 }}
                        value={o.status}
                        onChange={e => changeStatus(o.id, e.target.value)}
                      >
                        {STATUS_OPTIONS.filter(s => s.value !== 'all').map(s => (
                          <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {detailOrder && (
        <div className="admin-modal-overlay" onClick={() => setDetailOrder(null)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <span className="admin-modal-title">📦 Buyurtma {detailOrder.id}</span>
              <button className="admin-modal-close" onClick={() => setDetailOrder(null)}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#666', fontSize: 14 }}>Mijoz</span>
                <span style={{ fontWeight: 700 }}>{detailOrder.client}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#666', fontSize: 14 }}>Telefon</span>
                <span>{detailOrder.phone}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#666', fontSize: 14 }}>Taomlar</span>
                <span style={{ maxWidth: 260, textAlign: 'right', fontSize: 14 }}>{detailOrder.items}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#666', fontSize: 14 }}>Jami</span>
                <span style={{ fontWeight: 800, fontSize: 18, color: '#d97706' }}>{detailOrder.total.toLocaleString('ru-RU')} so'm</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#666', fontSize: 14 }}>Sana</span>
                <span>{detailOrder.date}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#666', fontSize: 14 }}>Holat</span>
                <span className={`admin-badge admin-badge-${detailOrder.status}`}>{STATUS_LABELS[detailOrder.status]}</span>
              </div>
              <div style={{ borderTop: '1px solid rgba(0,0,0,0.07)', paddingTop: 14 }}>
                <div style={{ color: '#666', fontSize: 13, marginBottom: 10 }}>Holatni o'zgartirish:</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {STATUS_OPTIONS.filter(s => s.value !== 'all').map(s => (
                    <button
                      key={s.value}
                      className={`admin-btn admin-btn-sm ${detailOrder.status === s.value ? 'admin-btn-primary' : 'admin-btn-ghost'}`}
                      onClick={() => changeStatus(detailOrder.id, s.value)}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
