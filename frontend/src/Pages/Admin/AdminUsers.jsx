import React, { useState, useEffect } from 'react';
import { usersApi } from '../../services/api';

const INIT_USERS = [
  { id: 1, username: 'omar', firstName: 'Omar', lastName: 'Yazliyev', role: 'ADMIN', date: '01.01.2026', orders: 0 },
  { id: 2, username: 'oybek_t', firstName: 'Oybek', lastName: 'Toshmatov', role: 'CLIENT', date: '15.03.2026', orders: 8 },
  { id: 3, username: 'dilnoza_k', firstName: 'Dilnoza', lastName: 'Karimova', role: 'CLIENT', date: '20.04.2026', orders: 5 },
  { id: 4, username: 'sardor_m', firstName: 'Sardor', lastName: 'Mirzayev', role: 'CLIENT', date: '02.05.2026', orders: 12 },
];

export default function AdminUsers() {
  const [users, setUsers] = useState(INIT_USERS);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await usersApi.getAllUsers();
      if (Array.isArray(data) && data.length > 0) {
        const formatted = data.map(u => ({
          id: u.id,
          username: u.username,
          firstName: u.firstName || 'Foydalanuvchi',
          lastName: u.lastName || '',
          role: u.role || 'CLIENT',
          date: u.createdAt ? new Date(u.createdAt).toLocaleDateString('ru-RU') : '—',
          orders: 0
        }));
        setUsers(formatted);
      }
    } catch (err) {
      console.warn("Backend users API ulanmadi, demo ro'yxat ko'rsatildi:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const filtered = users.filter(u => {
    const matchRole = roleFilter === 'ALL' || u.role === roleFilter;
    const q = search.toLowerCase();
    const matchSearch = u.username.toLowerCase().includes(q) || u.firstName.toLowerCase().includes(q) || u.lastName.toLowerCase().includes(q);
    return matchRole && matchSearch;
  });

  const toggleRole = (id) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, role: u.role === 'ADMIN' ? 'CLIENT' : 'ADMIN' } : u));
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Bu foydalanuvchini o'chirasizmi?")) return;
    try {
      await usersApi.deleteUser(id);
    } catch (err) {
      console.warn("Backend delete user error:", err.message);
    }
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  return (
    <div>
      <div className="admin-glass-card">
        <div className="admin-section-header">
          <span className="admin-section-title">👥 Foydalanuvchilar boshqaruvi</span>
          <span style={{ fontSize: 13, color: '#666' }}>{filtered.length} ta foydalanuvchi</span>
        </div>

        <div className="admin-filter-bar">
          <input
            className="admin-search-input"
            placeholder="🔍 Ism yoki username bo'yicha..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <div className="admin-select-wrapper" style={{ maxWidth: 200 }}>
            <select className="admin-custom-select" value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
              <option value="ALL">Barchasi</option>
              <option value="ADMIN">Admin</option>
              <option value="CLIENT">Mijoz</option>
            </select>
            <span className="admin-select-arrow">▼</span>
          </div>
        </div>

        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Foydalanuvchi</th>
                <th>Username</th>
                <th>Rol</th>
                <th>Ro'yxatdan o'tish</th>
                <th>Amallar</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: 30, color: '#888' }}>🔄 Foydalanuvchilar yuklanmoqda...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', color: '#999', padding: 30 }}>Foydalanuvchilar topilmadi</td></tr>
              ) : (
                filtered.map(u => (
                  <tr key={u.id}>
                    <td style={{ color: '#999' }}>{u.id}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 36, height: 36, borderRadius: '50%',
                          background: u.role === 'ADMIN' ? 'linear-gradient(135deg, #ffb703, #f5a800)' : 'linear-gradient(135deg, #6b7280, #4b5563)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 14, fontWeight: 800,
                          color: u.role === 'ADMIN' ? '#111' : '#fff', flexShrink: 0
                        }}>
                          {u.firstName[0]}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700 }}>{u.firstName} {u.lastName}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ color: '#555', fontSize: 13 }}>@{u.username}</td>
                    <td>
                      <span className={`admin-badge ${u.role === 'ADMIN' ? 'admin-badge-admin' : 'admin-badge-client'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td style={{ fontSize: 13, color: '#666' }}>{u.date}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        {u.username !== 'omar' && (
                          <>
                            <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => toggleRole(u.id)}>
                              {u.role === 'ADMIN' ? '👤 Client' : '🛡️ Admin'}
                            </button>
                            <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => deleteUser(u.id)}>🗑️</button>
                          </>
                        )}
                        {u.username === 'omar' && <span style={{ fontSize: 12, color: '#999', fontWeight: 600 }}>Asosiy Admin</span>}
                      </div>
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
