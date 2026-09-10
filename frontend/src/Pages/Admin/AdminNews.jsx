import React, { useState } from 'react';

const INIT_NEWS = [
  { id: 1, title: "Yangi Yoz menyusi taqdim etildi!", category: "Yangilik", date: "05.09.2026", status: "published" },
  { id: 2, title: "Hafta oxiri: 20% chegirma barcha taomlar!", category: "Aksiya", date: "03.09.2026", status: "published" },
  { id: 3, title: "Restoranimiz 2 yilligini nishonladi 🎉",   category: "Tadbir",  date: "01.09.2026", status: "published" },
  { id: 4, title: "Kuz fasli taomlari: Yangi recepty",        category: "Yangilik", date: "28.08.2026", status: "draft" },
  { id: 5, title: "VIP zal endi bron qilish mumkin",          category: "Xabar",   date: "25.08.2026", status: "published" },
];

const EMPTY_FORM = { title: '', category: 'Yangilik', content: '', status: 'draft' };

export default function AdminNews() {
  const [news, setNews] = useState(INIT_NEWS);
  const [modal, setModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [search, setSearch] = useState('');

  const filtered = news.filter(n => n.title.toLowerCase().includes(search.toLowerCase()));

  const openAdd = () => { setEditItem(null); setForm(EMPTY_FORM); setModal(true); };
  const openEdit = (item) => { setEditItem(item); setForm({ title: item.title, category: item.category, content: '', status: item.status }); setModal(true); };
  const closeModal = () => { setModal(false); setEditItem(null); };

  const handleSave = () => {
    if (!form.title) return;
    const today = new Date().toLocaleDateString('ru-RU').split('.').join('.');
    if (editItem) {
      setNews(prev => prev.map(n => n.id === editItem.id ? { ...n, ...form } : n));
    } else {
      setNews(prev => [{ id: Date.now(), ...form, date: today }, ...prev]);
    }
    closeModal();
  };

  const toggleStatus = (id) => {
    setNews(prev => prev.map(n => n.id === id ? { ...n, status: n.status === 'published' ? 'draft' : 'published' } : n));
  };

  const deleteNews = (id) => {
    setNews(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div>
      <div className="admin-glass-card">
        <div className="admin-section-header">
          <span className="admin-section-title">📣 Yangiliklar</span>
          <button className="admin-btn admin-btn-primary" onClick={openAdd}>+ Yangilik qo'shish</button>
        </div>

        <div className="admin-filter-bar">
          <input
            className="admin-search-input"
            placeholder="🔍 Sarlavha bo'yicha qidirish..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Sarlavha</th>
                <th>Kategoriya</th>
                <th>Sana</th>
                <th>Holat</th>
                <th>Amallar</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={6} style={{ textAlign: 'center', color: '#999', padding: 30 }}>Yangiliklar topilmadi</td></tr>
              )}
              {filtered.map(n => (
                <tr key={n.id}>
                  <td style={{ color: '#999', fontSize: 13 }}>{n.id}</td>
                  <td style={{ fontWeight: 600, maxWidth: 280 }}>{n.title}</td>
                  <td><span className="admin-badge admin-badge-client">{n.category}</span></td>
                  <td style={{ fontSize: 13, color: '#666' }}>{n.date}</td>
                  <td>
                    <span className={`admin-badge ${n.status === 'published' ? 'admin-badge-confirmed' : 'admin-badge-pending'}`}>
                      {n.status === 'published' ? '✅ Chop etilgan' : '📝 Qoralama'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => openEdit(n)}>✏️</button>
                      <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => toggleStatus(n.id)}>
                        {n.status === 'published' ? '📝' : '✅'}
                      </button>
                      <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => deleteNews(n.id)}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <div className="admin-modal-overlay" onClick={closeModal}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <span className="admin-modal-title">{editItem ? '✏️ Tahrirlash' : '+ Yangi yangilik'}</span>
              <button className="admin-modal-close" onClick={closeModal}>✕</button>
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Sarlavha *</label>
              <input className="admin-form-input" value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))} placeholder="Yangilik sarlavhasi..." />
            </div>
            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-form-label">Kategoriya</label>
                <select className="admin-form-select" value={form.category} onChange={e => setForm(f => ({...f, category: e.target.value}))}>
                  <option>Yangilik</option>
                  <option>Aksiya</option>
                  <option>Tadbir</option>
                  <option>Xabar</option>
                </select>
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Holat</label>
                <select className="admin-form-select" value={form.status} onChange={e => setForm(f => ({...f, status: e.target.value}))}>
                  <option value="draft">Qoralama</option>
                  <option value="published">Chop etish</option>
                </select>
              </div>
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Mazmun</label>
              <textarea className="admin-form-textarea" value={form.content} onChange={e => setForm(f => ({...f, content: e.target.value}))} placeholder="Yangilik matni..." />
            </div>
            <div className="admin-form-footer">
              <button className="admin-btn admin-btn-ghost" onClick={closeModal}>Bekor</button>
              <button className="admin-btn admin-btn-primary" onClick={handleSave}>💾 Saqlash</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
