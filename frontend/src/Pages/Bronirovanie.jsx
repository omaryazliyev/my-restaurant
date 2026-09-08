import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CustomSelect from '../components/CustomSelect';
import RestaurantFloorPlan, { FLOOR_TABLES } from '../components/RestaurantFloorPlan';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { reservationApi } from '../services/api';
import '../styles/Bronirovanie.css';

import wineGlassesImg from '../assets/images/wine_glasses.png';
import rasm1 from '../assets/images/rasm1.png';
import rasm2 from '../assets/images/rasm2.png';
import rasm3 from '../assets/images/rasm3.png';
import sergey from '../assets/images/sergey.png';
import barg1 from '../assets/images/barg1.png';
import barg2 from '../assets/images/barg2.png';
import barg7 from '../assets/images/barg7.png';

export default function Bronirovanie() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { t } = useLanguage();

  const [form, setForm] = useState({ phone: '', guests: '', date: '', time: '', tableId: '' });
  const [dateInputType, setDateInputType] = useState('text');
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage(null);
    setErrorMessage(null);

    if (!isAuthenticated) {
      setErrorMessage(t.needLoginToBook);
      return;
    }

    if (!form.phone || !form.date || !form.time || !form.guests || !form.tableId) {
      setErrorMessage(t.fillAllError);
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setStatusMessage(t.bookingSuccess);
      setForm({ phone: '', guests: '', date: '', time: '', tableId: '' });
      setDateInputType('text');
      setLoading(false);
    }, 400);
  };

  // Table options using translation
  const TABLE_OPTIONS = [
    { id: 1,  name: `${t.table} 1 (Center)`, capacity: '2–4' },
    { id: 2,  name: `${t.table} 2 (Center)`, capacity: '2–4' },
    { id: 4,  name: `${t.table} 4 (Center)`, capacity: '2–4' },
    { id: 8,  name: `${t.table} 8 (Center)`, capacity: '2–4' },
    { id: 9,  name: `${t.table} 9 (Center)`, capacity: '2–4' },
    { id: 11, name: `Cabinet (Left)`,          capacity: '4–6' },
  ];

  const selectedTableObj = TABLE_OPTIONS.find((tb) => String(tb.id) === String(form.tableId));

  return (
    <div className="bron-page-wrapper">
      <Header />

      <div className="bron-content-container">
        <img src={barg1} alt="" className="bron-leaf-1" />
        <img src={barg2} alt="" className="bron-leaf-2" />

        <div className="bron-glass-card">

          {/* Breadcrumb */}
          <div className="bron-breadcrumb">
            <Link to="/home">{t.home}</Link>
            <span>›</span>
            <span>{t.booking}</span>
          </div>

          <h1 className="bron-main-title">{t.bookingTitle}</h1>

          {/* Working Hours */}
          <div className="bron-hero-grid">
            <div className="bron-hours-section">
              <h2 className="bron-hours-title">{t.workingHours}</h2>
              <table className="bron-hours-table">
                <tbody>
                  <tr><td>{t.monday}</td>    <td className="hours-time">10:00–23:00</td></tr>
                  <tr><td>{t.tuesday}</td>   <td className="hours-time">10:00–23:00</td></tr>
                  <tr><td>{t.wednesday}</td> <td className="hours-time">10:00–23:00</td></tr>
                  <tr><td>{t.thursday}</td>  <td className="hours-time">10:00–23:00</td></tr>
                  <tr><td>{t.friday}</td>    <td className="hours-time">10:00–23:00</td></tr>
                  <tr><td>{t.sunday}</td>    <td className="hours-time">11:00–22:00</td></tr>
                </tbody>
              </table>
            </div>
            <div className="bron-hero-image-wrapper">
              <img src={wineGlassesImg} alt="Wine Glasses" className="bron-hero-image" />
            </div>
          </div>

          {/* Booking Form */}
          <div className="bron-form-section" id="booking-form-anchor">
            <h2 className="bron-form-title">{t.wantToBook}</h2>

            {statusMessage && (
              <div style={{ backgroundColor: '#d4edda', color: '#155724', padding: '16px 24px', borderRadius: '16px', marginBottom: '30px', fontWeight: '600', textAlign: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                {statusMessage}
              </div>
            )}
            {errorMessage && (
              <div style={{ backgroundColor: '#f8d7da', color: '#721c24', padding: '16px 24px', borderRadius: '16px', marginBottom: '30px', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                <span>⚠️ {errorMessage}</span>
                {!isAuthenticated && (
                  <button
                    type="button"
                    onClick={() => navigate('/login')}
                    style={{
                      backgroundColor: '#721c24', color: '#fff', border: 'none',
                      padding: '8px 16px', borderRadius: '8px', cursor: 'pointer',
                      fontSize: '13px', fontWeight: 'bold',
                    }}
                  >
                    {t.login} →
                  </button>
                )}
              </div>
            )}

            <form onSubmit={handleSubmit} className="bron-booking-form">
              <div className="bron-input-group">
                <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder={t.yourNumber} className="bron-input" required />
              </div>

              <div className="bron-input-group">
                <CustomSelect
                  value={form.guests}
                  onChange={(val) => setForm((p) => ({ ...p, guests: val }))}
                  placeholder={t.howManyGuests}
                  variant="light"
                  options={[
                    { value: '1', label: t.guest1 },
                    { value: '2', label: t.guest2 },
                    { value: '3', label: t.guest3 },
                    { value: '4', label: t.guest4 },
                    { value: '5', label: t.guest5 },
                  ]}
                />
              </div>

              <div className="bron-input-group">
                <input
                  type={dateInputType}
                  onFocus={() => setDateInputType('date')}
                  onBlur={(e) => { if (!e.target.value) setDateInputType('text'); }}
                  name="date" value={form.date} onChange={handleChange}
                  placeholder={t.selectDate} className="bron-input" required
                />
                <svg className="bron-icon-svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
              </div>

              <img src={barg7} alt="" className="bron-leaf-form" />

              <div className="bron-input-group">
                <CustomSelect
                  value={form.time}
                  onChange={(val) => setForm((p) => ({ ...p, time: val }))}
                  placeholder={t.selectTime}
                  variant="light"
                  options={[
                    { value: '10:00', label: '🕙 10:00' },
                    { value: '12:00', label: '🕛 12:00' },
                    { value: '14:00', label: '🕑 14:00' },
                    { value: '16:00', label: '🕓 16:00' },
                    { value: '18:00', label: '🕕 18:00' },
                    { value: '20:00', label: '🕗 20:00' },
                    { value: '22:00', label: '🕙 22:00' },
                  ]}
                />
              </div>

              <div className="bron-input-group">
                <CustomSelect
                  value={form.tableId}
                  onChange={(val) => setForm((p) => ({ ...p, tableId: val }))}
                  placeholder={t.selectTable}
                  variant="light"
                  options={TABLE_OPTIONS.map((tbl) => ({ value: String(tbl.id), label: `🪑 ${tbl.name}` }))}
                />
              </div>

              <div className="bron-form-actions">
                <span className="bron-map-link" onClick={() => setIsMapModalOpen(true)}>
                  {t.chooseOnMap} {selectedTableObj ? `(${selectedTableObj.name})` : ''}
                </span>
                <button type="submit" disabled={loading} className="bron-submit-btn">
                  {loading ? t.sending : t.bookBtn}
                </button>
              </div>
            </form>
          </div>

          {/* Contact Us */}
          <div className="bron-contact-section" id="footer-contacts">
            <h2 className="bron-contact-title">{t.contactUs}</h2>
            <div className="bron-contact-grid">
              <div className="bron-contact-card">
                <div className="bron-contact-icon">✉️</div>
                <h4>{t.writeUs}</h4>
                <p>info@bmgsoft.com</p>
                <p>t.me/bmgsoft.com</p>
              </div>
              <div className="bron-contact-card">
                <div className="bron-contact-icon">📞</div>
                <h4>{t.callUs}</h4>
                <p>+9998908767888</p>
                <p>+9989865332322</p>
              </div>
              <div className="bron-contact-card">
                <div className="bron-contact-icon">📍</div>
                <h4>{t.visitUs}</h4>
                <p>{t.addressText.split('\n')[0]}</p>
                <p>{t.addressText.split('\n')[1]}</p>
              </div>
            </div>
          </div>

          {/* News / Gallery */}
          <div className="bron-news-section">
            <h2 className="bron-news-title">{t.newsTitle}</h2>
            <div className="bron-news-grid">
              {[rasm1, rasm2, rasm3].map((img, i) => (
                <div key={i} className="bron-news-card">
                  <div className="bron-news-img-wrapper">
                    <img src={img} alt="" className="bron-news-img" />
                  </div>
                  <p className="bron-news-desc">{t.newsCardText}</p>
                  <div className="bron-news-author">
                    <img src={sergey} alt="" />
                    <span>Sergey</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="bron-news-action">
              <button className="bron-view-all-btn" onClick={() => navigate('/novosti')}>
                {t.viewAll} ➔
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Table Map Modal */}
      {isMapModalOpen && (
        <div className="table-modal-overlay" onClick={() => setIsMapModalOpen(false)}>
          <div className="table-modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '820px', padding: '30px 30px 24px' }}>
            <div className="table-modal-header">
              <div>
                <h3 style={{ fontSize: '22px', fontWeight: '800', margin: 0 }}>{t.selectSeat}</h3>
                {form.tableId && (() => {
                  const sel = FLOOR_TABLES.find((tb) => String(tb.id) === String(form.tableId));
                  return sel ? (
                    <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#2980b9', fontWeight: '600' }}>
                      {t.selected} {sel.label} ({t.table} {sel.id})
                    </p>
                  ) : null;
                })()}
              </div>
              <button className="table-modal-close" onClick={() => setIsMapModalOpen(false)}>✕</button>
            </div>

            <RestaurantFloorPlan
              selectedTableId={form.tableId}
              onSelect={(tbl) => { setForm((p) => ({ ...p, tableId: String(tbl.id) })); }}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
              <span style={{ fontSize: '13px', color: '#888' }}>{t.clickGreen}</span>
              <button
                style={{ backgroundColor: '#000', color: '#fff', border: 'none', padding: '11px 28px', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', fontSize: '15px' }}
                onClick={() => setIsMapModalOpen(false)}
              >
                {t.done}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
