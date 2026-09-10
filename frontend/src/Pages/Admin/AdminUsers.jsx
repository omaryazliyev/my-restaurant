import React, { useState } from 'react';

const INIT_USERS = [
  { id: 1,  username: 'admin',      firstName: 'Admin',    lastName: '',         role: 'ADMIN',  date: '01.01.2026', orders: 0 },
  { id: 2,  username: 'oybek_t',    firstName: 'Oybek',    lastName: 'Toshmatov', role: 'CLIENT', date: '15.03.2026', orders: 8 },
  { id: 3,  username: 'dilnoza_k',  firstName: 'Dilnoza',  lastName: 'Karimova',  role: 'CLIENT', date: '20.04.2026', orders: 5 },
  { id: 4,  username: 'sardor_m',   firstName: 'Sardor',   lastName: 'Mirzayev',  role: 'CLIENT', date: '02.05.2026', orders: 12 },
  { id: 5,  username: 'malika_a',   firstName: 'Malika',   lastName: 'Abdullayeva',role: 'CLIENT', date: '10.06.2026', orders: 3 },
  { id: 6,  username: 'jasur_r',    firstName: 'Jasur',    lastName: 'Rahimov',   role: 'CLIENT', date: '25.07.2026', orders: 7 },
  { id: 7,  username: 'nargiza_u',  firstName: 'Nargiza',  lastName: 'Umarova',   role: 'CLIENT', date: '14.08.2026', orders: 2 },
];

export default function AdminUsers() {
  const [users, setUsers] = useState(INIT_USERS);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const filtered = users.filter(u => {
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    const q = search.toLowerCase();
    const matchSearch = u.username.toLowerCase().includes(q) || u.firstName.toLowerCase().includes(q) || u.lastName.toLowerCase().includes(q);
    return matchRole && matchSearch;
  });

  const toggleRole = (id) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, role: u.role === 'ADMIN' ? 'CLIENT' : 'ADMIN' } : u));
  };

  const deleteUser = (id) => {
    if (!window.confirm("Bu foydalanuvchini o'chirasizmi?")) return;
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  return (
    <div>
      <div className="admin-glass-card">
        <div className="admin-section-header">
          <span className="admin-section-title">👥 Foydalanuvchilar</span>
          <span style={{ fontSize: 14, color: '#666' }}>{filtered.length} ta foydalanuvchi</span>
        </div>

        <div className="admin-filter-bar">
          <input
            className="admin-search-input"
            placeholder="🔍 Ism yoki username bo'yicha..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select className="admin-filter-select" value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
            <option value="all">Barchasi</option>
            <option value="ADMIN">Admin</option>
            <option value="CLIENT">Mijoz</option>
          </select>
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
                <th>Buyurtmalar</th>
                <th>Amallar</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={7} style={{ textAlign: 'center', color: '#999', padding: 30 }}>Foydalanuvchilar topilmadi</td></tr>
              )}
              {filtered.map(u => (
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
                  <td><span className={`admin-badge ${u.role === 'ADMIN' ? 'admin-badge-admin' : 'admin-badge-client'}`}>{u.role}</span></td>
                  <td style={{ fontSize: 13, color: '#666' }}>{u.date}</td>
                  <td style={{ textAlign: 'center', fontWeight: 700 }}>{u.orders}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {u.id !== 1 && (
                        <>
                          <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => toggleRole(u.id)}>
                            {u.role === 'ADMIN' ? '👤 Client' : '🛡️ Admin'}
                          </button>
                          <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => deleteUser(u.id)}>🗑️</button>
                        </>
                      )}
                      {u.id === 1 && <span style={{ fontSize: 12, color: '#999' }}>Asosiy admin</span>}
                    </div>
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
