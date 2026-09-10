import React, { useState } from 'react';

const INIT_MENU = [
  { id: 1,   name: "Tovuq sho'rva",     category: 'Birinchi taomlar', price: 127000, status: 'active' },
  { id: 2,   name: "Qo'ziqorin kremi",  category: 'Birinchi taomlar', price: 152400, status: 'active' },
  { id: 101, name: "Maxsus mol go'shti", category: 'Ikkinchi taomlar', price: 228600, status: 'active' },
  { id: 102, name: 'Losos biftek',      category: 'Ikkinchi taomlar', price: 279400, status: 'active' },
  { id: 201, name: 'Cezar salati',      category: 'Salatlar',         price: 114300, status: 'active' },
  { id: 301, name: 'Limon limonadi',    category: 'Ichimliklar',      price: 63500,  status: 'active' },
  { id: 401, name: 'Margarita Pitsa',   category: 'Fast-Food',        price: 177800, status: 'active' },
  { id: 402, name: 'BBQ Burger',        category: 'Fast-Food',        price: 152400, status: 'active' },
];

const CATEGORIES = ['Hammasi', 'Birinchi taomlar', 'Ikkinchi taomlar', 'Salatlar', 'Ichimliklar', 'Fast-Food'];

const EMPTY_FORM = { name: '', category: 'Birinchi taomlar', price: '', description: '' };

export default function AdminMenu() {
  const [items, setItems] = useState(INIT_MENU);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('Hammasi');
  const [modal, setModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteId, setDeleteId] = useState(null);

  const filtered = items.filter(i => {
    const matchCat = catFilter === 'Hammasi' || i.category === catFilter;
    const matchSearch = i.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const openAdd = () => { setEditItem(null); setForm(EMPTY_FORM); setModal(true); };
  const openEdit = (item) => { setEditItem(item); setForm({ name: item.name, category: item.category, price: item.price, description: '' }); setModal(true); };
  const closeModal = () => { setModal(false); setEditItem(null); };

  const handleSave = () => {
    if (!form.name || !form.price) return;
    if (editItem) {
      setItems(prev => prev.map(i => i.id === editItem.id ? { ...i, ...form, price: Number(form.price) } : i));
    } else {
      setItems(prev => [...prev, { id: Date.now(), ...form, price: Number(form.price), status: 'active' }]);
    }
    closeModal();
  };

  const handleDelete = (id) => {
    setItems(prev => prev.filter(i => i.id !== id));
    setDeleteId(null);
  };

  return (
    <div>
      <div className="admin-glass-card">
        <div className="admin-section-header">
          <span className="admin-section-title">🍽️ Menu boshqaruvi</span>
          <button className="admin-btn admin-btn-primary" onClick={openAdd}>+ Taom qo'shish</button>
        </div>

        <div className="admin-filter-bar">
          <input
            className="admin-search-input"
            placeholder="🔍 Taom nomi bo'yicha qidirish..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select className="admin-filter-select" value={catFilter} onChange={e => setCatFilter(e.target.value)}>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>

        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Nomi</th>
                <th>Kategoriya</th>
                <th>Narxi</th>
                <th>Holat</th>
                <th>Amallar</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={6} style={{ textAlign: 'center', color: '#999', padding: 30 }}>Taomlar topilmadi</td></tr>
              )}
              {filtered.map(item => (
                <tr key={item.id}>
                  <td style={{ color: '#999', fontSize: 13 }}>{item.id}</td>
                  <td style={{ fontWeight: 700 }}>{item.name}</td>
                  <td><span className="admin-badge admin-badge-client">{item.category}</span></td>
                  <td style={{ fontWeight: 700 }}>{item.price.toLocaleString('ru-RU')} so'm</td>
                  <td><span className="admin-badge admin-badge-confirmed">Faol</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => openEdit(item)}>✏️ Tahrir</button>
                      <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => setDeleteId(item.id)}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {modal && (
        <div className="admin-modal-overlay" onClick={closeModal}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <span className="admin-modal-title">{editItem ? '✏️ Taomni tahrirlash' : '+ Yangi taom'}</span>
              <button className="admin-modal-close" onClick={closeModal}>✕</button>
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Taom nomi *</label>
              <input className="admin-form-input" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} placeholder="Masalan: Tovuq sho'rva" />
            </div>
            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-form-label">Kategoriya *</label>
                <select className="admin-form-select" value={form.category} onChange={e => setForm(f => ({...f, category: e.target.value}))}>
                  {CATEGORIES.filter(c => c !== 'Hammasi').map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Narxi (so'm) *</label>
                <input type="number" className="admin-form-input" value={form.price} onChange={e => setForm(f => ({...f, price: e.target.value}))} placeholder="127000" />
              </div>
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Tavsif</label>
              <textarea className="admin-form-textarea" value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} placeholder="Taom haqida qisqacha..." />
            </div>
            <div className="admin-form-footer">
              <button className="admin-btn admin-btn-ghost" onClick={closeModal}>Bekor</button>
              <button className="admin-btn admin-btn-primary" onClick={handleSave}>💾 Saqlash</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteId && (
        <div className="admin-modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="admin-modal" style={{ maxWidth: 380 }} onClick={e => e.stopPropagation()}>
            <div style={{ textAlign: 'center', padding: '10px 0' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🗑️</div>
              <div className="admin-modal-title" style={{ marginBottom: 8 }}>O'chirishni tasdiqlang</div>
              <p style={{ color: '#666', fontSize: 14, marginBottom: 24 }}>Bu taomni o'chirasizmi? Bu amalni qaytarib bo'lmaydi.</p>
              <div className="admin-form-footer" style={{ justifyContent: 'center' }}>
                <button className="admin-btn admin-btn-ghost" onClick={() => setDeleteId(null)}>Bekor</button>
                <button className="admin-btn admin-btn-danger" onClick={() => handleDelete(deleteId)}>Ha, o'chirish</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
