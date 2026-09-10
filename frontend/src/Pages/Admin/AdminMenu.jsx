import React, { useState, useEffect } from 'react';
import { menuApi } from '../../services/api';
import food1 from '../../assets/images/food1.png';
import food2 from '../../assets/images/food2.png';
import food3 from '../../assets/images/food3.png';
import food4 from '../../assets/images/food4.png';
import rasm1 from '../../assets/images/rasm1.png';
import rasm2 from '../../assets/images/rasm2.png';

const INIT_MENU = [
  { id: 1, name: "Tovuq sho'rva", category: 'Birinchi taomlar', price: 127000, image: food1, description: "Xushbo'y ziravorlar va yangi tovuq go'shtidan tayyorlangan mazali sho'rva", status: 'active' },
  { id: 2, name: "Qo'ziqorin kremi", category: 'Birinchi taomlar', price: 152400, image: food2, description: "Qaymoqli qo'ziqorin kremi pishirig'i", status: 'active' },
  { id: 101, name: "Maxsus mol go'shti", category: 'Ikkinchi taomlar', price: 228600, image: food3, description: "Tandirda pishirilgan yumshoq mol go'shti va sabzavotlar", status: 'active' },
  { id: 102, name: 'Losos biftek', category: 'Ikkinchi taomlar', price: 279400, image: food4, description: "Grilda tayyorlangan yangi losos baliq bifteki", status: 'active' },
  { id: 201, name: 'Cezar salati', category: 'Salatlar', price: 114300, image: rasm1, description: "Tovuq va maxsus sous bilan tayyorlangan klassik Cezar salati", status: 'active' },
  { id: 301, name: 'Limon limonadi', category: 'Ichimliklar', price: 63500, image: rasm2, description: "Yangi siqilgan limon va yalpizli muzday limonad", status: 'active' },
];

const CATEGORIES = ['Hammasi', 'Birinchi taomlar', 'Ikkinchi taomlar', 'Salatlar', 'Ichimliklar', 'Fast-Food'];

const EMPTY_FORM = {
  name: '',
  category: 'Birinchi taomlar',
  price: '',
  description: '',
  image: '',
  status: 'active'
};

export default function AdminMenu() {
  const [items, setItems] = useState(INIT_MENU);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('Hammasi');
  const [modal, setModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [imageMode, setImageMode] = useState('file'); // 'file' or 'url'

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Load menu items from backend API
  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    setLoading(true);
    try {
      const data = await menuApi.getMenuItems();
      if (Array.isArray(data) && data.length > 0) {
        const formatted = data.map(item => ({
          id: item.id,
          name: item.name,
          category: item.category?.name || 'Birinchi taomlar',
          price: Number(item.price),
          image: item.image || food1,
          description: item.description || '',
          status: 'active'
        }));
        setItems(formatted);
      }
    } catch (err) {
      console.warn("Backend ulanmadi, demo menyu ishlatilmoqda:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const filtered = items.filter(i => {
    const matchCat = catFilter === 'Hammasi' || i.category === catFilter;
    const matchSearch = i.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const openAdd = () => {
    setEditItem(null);
    setForm(EMPTY_FORM);
    setImageMode('file');
    setModal(true);
  };

  const openEdit = (item) => {
    setEditItem(item);
    setForm({
      name: item.name,
      category: item.category,
      price: item.price,
      description: item.description || '',
      image: item.image || '',
      status: item.status || 'active'
    });
    setImageMode(item.image?.startsWith('data:') || item.image?.startsWith('blob:') ? 'file' : 'url');
    setModal(true);
  };

  const closeModal = () => {
    setModal(false);
    setEditItem(null);
  };

  // Handle local image file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast("Rasm hajmi 5MB dan kichik bo'lishi kerak!", "error");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm(f => ({ ...f, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      showToast("Taom nomini kiriting!", "error");
      return;
    }
    if (!form.price || Number(form.price) <= 0) {
      showToast("To'g'ri narx kiriting!", "error");
      return;
    }

    const itemPayload = {
      name: form.name,
      category: form.category,
      price: Number(form.price),
      description: form.description,
      image: form.image || food1,
      status: form.status
    };

    if (editItem) {
      // Update item
      try {
        await menuApi.updateMenuItem(editItem.id, {
          name: form.name,
          description: form.description,
          price: Number(form.price),
          image: form.image || food1,
          categoryName: form.category
        });
      } catch (err) {
        console.warn("Backend update error:", err.message);
      }
      setItems(prev => {
        const updated = prev.map(i => i.id === editItem.id ? { ...i, ...itemPayload } : i);
        localStorage.setItem('custom_menu_items', JSON.stringify(updated));
        return updated;
      });
      showToast("Taom muvaffaqiyatli yangilandi!");
    } else {
      // Create new item
      let createdId = Date.now();
      try {
        const res = await menuApi.createMenuItem({
          name: form.name,
          description: form.description,
          price: Number(form.price),
          image: form.image || food1,
          categoryName: form.category
        });
        if (res && res.id) createdId = res.id;
      } catch (err) {
        console.warn("Backend create error:", err.message);
      }
      setItems(prev => {
        const updated = [{ id: createdId, ...itemPayload }, ...prev];
        localStorage.setItem('custom_menu_items', JSON.stringify(updated));
        return updated;
      });
      showToast("Yangi taom qo'shildi!");
    }
    closeModal();
  };

  const handleDelete = async (id) => {
    try {
      await menuApi.deleteMenuItem(id);
    } catch (err) {
      console.warn("Backend delete error:", err.message);
    }
    setItems(prev => prev.filter(i => i.id !== id));
    setDeleteId(null);
    showToast("Taom menyudan o'chirildi", "error");
  };

  return (
    <div className="admin-menu-page">
      {/* Toast Alert */}
      {toast && (
        <div className={`admin-toast admin-toast-${toast.type}`}>
          {toast.type === 'success' ? '✅ ' : '⚠️ '}
          {toast.msg}
        </div>
      )}

      <div className="admin-glass-card">
        <div className="admin-section-header">
          <div>
            <span className="admin-section-title">🍽️ Menu boshqaruvi</span>
            <span style={{ marginLeft: 12, fontSize: 13, color: '#888' }}>
              (Jami: {items.length} taom)
            </span>
          </div>
          <button className="admin-btn admin-btn-primary" onClick={openAdd}>
            + Yangi taom qo'shish
          </button>
        </div>

        {/* Filter & Search bar with Custom Styled Select */}
        <div className="admin-filter-bar">
          <input
            className="admin-search-input"
            placeholder="🔍 Taom nomi bo'yicha qidirish..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />

          <div className="admin-select-wrapper">
            <select
              className="admin-custom-select"
              value={catFilter}
              onChange={e => setCatFilter(e.target.value)}
            >
              {CATEGORIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <span className="admin-select-arrow">▼</span>
          </div>
        </div>

        {/* Menu Table */}
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Rasm</th>
                <th>Taom Nomi</th>
                <th>Kategoriya</th>
                <th>Narxi</th>
                <th>Tavsif</th>
                <th>Holat</th>
                <th>Amallar</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: 40, color: '#888' }}>
                    🔄 Menyular yuklanmoqda...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', color: '#999', padding: 35 }}>
                    Taomlar topilmadi
                  </td>
                </tr>
              ) : (
                filtered.map(item => (
                  <tr key={item.id}>
                    <td style={{ color: '#999', fontSize: 13 }}>{item.id}</td>
                    <td>
                      <div className="admin-food-thumb-wrap">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="admin-food-img"
                          onError={(e) => { e.target.src = food1; }}
                        />
                      </div>
                    </td>
                    <td style={{ fontWeight: 700, fontSize: 15 }}>{item.name}</td>
                    <td>
                      <span className="admin-badge admin-badge-client">
                        {item.category}
                      </span>
                    </td>
                    <td style={{ fontWeight: 700, color: '#d97706' }}>
                      {item.price.toLocaleString('ru-RU')} so'm
                    </td>
                    <td style={{ fontSize: 13, color: '#666', maxWidth: 180, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.description || '—'}
                    </td>
                    <td>
                      <span className={`admin-badge ${item.status === 'active' ? 'admin-badge-confirmed' : 'admin-badge-cancelled'}`}>
                        {item.status === 'active' ? '● Faol' : '○ Nofaol'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => openEdit(item)}>
                          ✏️ Tahrir
                        </button>
                        <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => setDeleteId(item.id)}>
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Food Modal */}
      {modal && (
        <div className="admin-modal-overlay" onClick={closeModal}>
          <div className="admin-modal" style={{ maxWidth: 560 }} onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <span className="admin-modal-title">
                {editItem ? '✏️ Taomni tahrirlash' : '🍽️ Yangi taom qo\'shish'}
              </span>
              <button className="admin-modal-close" onClick={closeModal}>✕</button>
            </div>

            {/* Form Fields */}
            <div className="admin-form-group">
              <label className="admin-form-label">Taom nomi *</label>
              <input
                className="admin-form-input"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Masalan: Tovuq sho'rva"
              />
            </div>

            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-form-label">Kategoriya *</label>
                <div className="admin-select-wrapper">
                  <select
                    className="admin-custom-select"
                    value={form.category}
                    onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                  >
                    {CATEGORIES.filter(c => c !== 'Hammasi').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <span className="admin-select-arrow">▼</span>
                </div>
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Narxi (so'm) *</label>
                <input
                  type="number"
                  className="admin-form-input"
                  value={form.price}
                  onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                  placeholder="127000"
                />
              </div>
            </div>

            {/* Image Upload / URL Selector Section */}
            <div className="admin-form-group">
              <label className="admin-form-label">🖼️ Taom rasmi</label>
              
              <div className="admin-img-tabs">
                <button
                  type="button"
                  className={`admin-img-tab ${imageMode === 'file' ? 'active' : ''}`}
                  onClick={() => setImageMode('file')}
                >
                  📁 Kompyuterdan tanlash
                </button>
                <button
                  type="button"
                  className={`admin-img-tab ${imageMode === 'url' ? 'active' : ''}`}
                  onClick={() => setImageMode('url')}
                >
                  🔗 Rasm havolasi (URL)
                </button>
              </div>

              {imageMode === 'file' ? (
                <div className="admin-file-dropzone">
                  <input
                    type="file"
                    accept="image/*"
                    id="food-image-input"
                    className="admin-file-input"
                    onChange={handleFileChange}
                  />
                  <label htmlFor="food-image-input" className="admin-file-label">
                    <span>📷 Rasm yuklash uchun bosing</span>
                    <small>PNG, JPG, WEBP (max 5MB)</small>
                  </label>
                </div>
              ) : (
                <input
                  className="admin-form-input"
                  value={form.image}
                  onChange={e => setForm(f => ({ ...f, image: e.target.value }))}
                  placeholder="https://example.com/food.jpg yoki /assets/images/food1.png"
                />
              )}

              {/* Image Preview Window */}
              {form.image && (
                <div className="admin-img-preview-card">
                  <span className="preview-tag">Ko'rinishi:</span>
                  <img
                    src={form.image}
                    alt="Preview"
                    className="admin-img-preview"
                    onError={(e) => { e.target.src = food1; }}
                  />
                  <button
                    type="button"
                    className="admin-img-remove-btn"
                    onClick={() => setForm(f => ({ ...f, image: '' }))}
                    title="Rasmni olib tashlash"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Tavsif</label>
              <textarea
                className="admin-form-textarea"
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Taom haqida qisqacha ma'lumot, porsiyasi, masaliqlari..."
              />
            </div>

            <div className="admin-form-footer">
              <button className="admin-btn admin-btn-ghost" onClick={closeModal}>
                Bekor qilish
              </button>
              <button className="admin-btn admin-btn-primary" onClick={handleSave}>
                💾 Saqlash
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="admin-modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="admin-modal" style={{ maxWidth: 400 }} onClick={e => e.stopPropagation()}>
            <div style={{ textAlign: 'center', padding: '12px 0' }}>
              <div style={{ fontSize: 50, marginBottom: 12 }}>🗑️</div>
              <div className="admin-modal-title" style={{ marginBottom: 8 }}>
                O'chirishni tasdiqlang
              </div>
              <p style={{ color: '#666', fontSize: 14, marginBottom: 24, lineHeight: 1.5 }}>
                Bu taomni menyudan o'chirishni xohlaysizmi? Bu amalni qaytarib bo'lmaydi.
              </p>
              <div className="admin-form-footer" style={{ justifyContent: 'center' }}>
                <button className="admin-btn admin-btn-ghost" onClick={() => setDeleteId(null)}>
                  Bekor qilish
                </button>
                <button className="admin-btn admin-btn-danger" onClick={() => handleDelete(deleteId)}>
                  Ha, o'chirish
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
