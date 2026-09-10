import React, { useState, useEffect } from 'react';
import { ordersApi } from '../../services/api';

const INIT_ORDERS = [
  { rawId: 1024, id: '#1024', client: 'Oybek T.', phone: '+998901234567', items: "Tovuq sho'rva × 2, Pitsa × 1", total: 381000, status: 'PREPARING', date: '10.09.2026 20:15' },
  { rawId: 1023, id: '#1023', client: 'Dilnoza K.', phone: '+998901112233', items: 'BBQ Burger × 1, Latte × 2', total: 279000, status: 'DELIVERED', date: '10.09.2026 19:40' },
  { rawId: 1022, id: '#1022', client: 'Sardor M.', phone: '+998907654321', items: 'Grek salati × 1', total: 127000, status: 'PENDING', date: '10.09.2026 19:10' },
  { rawId: 1021, id: '#1021', client: 'Malika A.', phone: '+998909988776', items: 'Losos biftek × 1, Choy × 1', total: 342000, status: 'READY', date: '10.09.2026 18:55' },
  { rawId: 1020, id: '#1020', client: 'Jasur R.', phone: '+998901234000', items: 'Minestrone × 2', total: 266400, status: 'CANCELLED', date: '10.09.2026 18:20' }
];

const STATUS_OPTIONS = [
  { value: 'ALL', label: 'Barchasi' },
  { value: 'PENDING', label: 'Kutilmoqda' },
  { value: 'PREPARING', label: 'Tayyorlanmoqda' },
  { value: 'READY', label: 'Tayyor' },
  { value: 'DELIVERED', label: 'Yetkazildi' },
  { value: 'CANCELLED', label: 'Bekor qilindi' },
];

const STATUS_LABELS = {
  PENDING: 'Kutilmoqda',
  PREPARING: 'Tayyorlanmoqda',
  READY: 'Tayyor',
  DELIVERED: 'Yetkazildi',
  CANCELLED: 'Bekor qilindi',
};

export default function AdminOrders() {
  const [orders, setOrders] = useState(INIT_ORDERS);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [detailOrder, setDetailOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await ordersApi.getAllOrders();
      if (Array.isArray(data) && data.length > 0) {
        const formatted = data.map(o => ({
          rawId: o.id,
          id: `#${o.id}`,
          client: o.user ? `${o.user.firstName} ${o.user.lastName}` : `Mijoz #${o.userId}`,
          phone: o.user?.phone || '—',
          items: o.items ? o.items.map(i => `${i.menuItem?.name || 'Taom'} × ${i.quantity}`).join(', ') : "Buyurtma berilgan taomlar",
          total: Number(o.totalPrice || 0),
          status: o.status || 'PENDING',
          date: o.createdAt ? new Date(o.createdAt).toLocaleString('ru-RU', { dateStyle: 'short', timeStyle: 'short' }) : '—'
        }));
        setOrders(formatted);
      }
    } catch (err) {
      console.warn("Backend orders API ulanmadi, demo ro'yxat ko'rsatilmoqda:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const filtered = orders.filter(o => {
    const matchStatus = statusFilter === 'ALL' || o.status === statusFilter;
    const matchSearch = o.client.toLowerCase().includes(search.toLowerCase()) || o.id.includes(search);
    return matchStatus && matchSearch;
  });

  const changeStatus = async (rawId, newStatus) => {
    try {
      await ordersApi.updateOrderStatus(rawId, newStatus);
    } catch (err) {
      console.warn("Backend status upgrade error:", err.message);
    }
    setOrders(prev => prev.map(o => o.rawId === rawId ? { ...o, status: newStatus } : o));
    if (detailOrder?.rawId === rawId) setDetailOrder(prev => ({ ...prev, status: newStatus }));
  };

  return (
    <div>
      <div className="admin-glass-card">
        <div className="admin-section-header">
          <span className="admin-section-title">📦 Buyurtmalar boshqaruvi</span>
          <span style={{ fontSize: 13, color: '#666' }}>{filtered.length} ta buyurtma</span>
        </div>

        <div className="admin-filter-bar">
          <input
            className="admin-search-input"
            placeholder="🔍 Mijoz yoki ID bo'yicha..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <div className="admin-select-wrapper" style={{ maxWidth: 200 }}>
            <select
              className="admin-custom-select"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
            >
              {STATUS_OPTIONS.map(s => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
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
                <th>Taomlar</th>
                <th>Summa</th>
                <th>Sana</th>
                <th>Holat</th>
                <th>Amallar</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: 30, color: '#888' }}>🔄 Buyurtmalar yuklanmoqda...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', color: '#999', padding: 30 }}>Buyurtmalar topilmadi</td></tr>
              ) : (
                filtered.map(o => (
                  <tr key={o.id}>
                    <td style={{ fontWeight: 700, color: '#555' }}>{o.id}</td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{o.client}</div>
                      <div style={{ fontSize: 12, color: '#888' }}>{o.phone}</div>
                    </td>
                    <td style={{ fontSize: 13, maxWidth: 200 }}>{o.items}</td>
                    <td style={{ fontWeight: 700, whiteSpace: 'nowrap', color: '#d97706' }}>
                      {o.total.toLocaleString('ru-RU')} so'm
                    </td>
                    <td style={{ fontSize: 13, color: '#666', whiteSpace: 'nowrap' }}>{o.date}</td>
                    <td>
                      <span className={`admin-badge admin-badge-${o.status.toLowerCase()}`}>
                        {STATUS_LABELS[o.status] || o.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                        <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => setDetailOrder(o)}>👁️</button>
                        <div className="admin-select-wrapper" style={{ width: 140 }}>
                          <select
                            className="admin-custom-select"
                            style={{ padding: '6px 24px 6px 10px', fontSize: 12, borderRadius: 10 }}
                            value={o.status}
                            onChange={e => changeStatus(o.rawId, e.target.value)}
                          >
                            {STATUS_OPTIONS.filter(s => s.value !== 'ALL').map(s => (
                              <option key={s.value} value={s.value}>{s.label}</option>
                            ))}
                          </select>
                          <span className="admin-select-arrow" style={{ right: 8, fontSize: 8 }}>▼</span>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
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
                <span className={`admin-badge admin-badge-${detailOrder.status.toLowerCase()}`}>
                  {STATUS_LABELS[detailOrder.status] || detailOrder.status}
                </span>
              </div>
              <div style={{ borderTop: '1px solid rgba(0,0,0,0.07)', paddingTop: 14 }}>
                <div style={{ color: '#666', fontSize: 13, marginBottom: 10 }}>Holatni o'zgartirish:</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {STATUS_OPTIONS.filter(s => s.value !== 'ALL').map(s => (
                    <button
                      key={s.value}
                      className={`admin-btn admin-btn-sm ${detailOrder.status === s.value ? 'admin-btn-primary' : 'admin-btn-ghost'}`}
                      onClick={() => changeStatus(detailOrder.rawId, s.value)}
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
