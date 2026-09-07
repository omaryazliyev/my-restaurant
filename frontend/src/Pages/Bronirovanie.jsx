import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CustomSelect from '../components/CustomSelect';
import { useAuth } from '../context/AuthContext';
import { reservationApi } from '../services/api';
import '../styles/Bronirovanie.css';

// Image assets
import wineGlassesImg from '../assets/images/wine_glasses.png';
import rasm1 from '../assets/images/rasm1.png';
import rasm2 from '../assets/images/rasm2.png';
import rasm3 from '../assets/images/rasm3.png';
import sergey from '../assets/images/sergey.png';
import barg1 from '../assets/images/barg1.png';
import barg2 from '../assets/images/barg2.png';
import barg7 from '../assets/images/barg7.png';

// Available Table locations mapping to backend table IDs
const TABLE_OPTIONS = [
  { id: 1, name: 'Столик у окна (Зал 1)', capacity: '2-4 чел', type: 'Window' },
  { id: 2, name: 'Основной зал (Центр)', capacity: '4-6 чел', type: 'Main Hall' },
  { id: 3, name: 'VIP кабина (Кабинет)', capacity: '6-10 чел', type: 'VIP Room' },
  { id: 4, name: 'Летняя Терраса', capacity: '2-4 чел', type: 'Terrace' },
];

export default function Bronirovanie() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  // Form State initialized matching Figma placeholders
  const [form, setForm] = useState({
    phone: '',
    guests: '',
    date: '',
    time: '',
    tableId: '',
  });

  const [dateInputType, setDateInputType] = useState('text');
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectTableFromMap = (tableId) => {
    setForm((prev) => ({ ...prev, tableId: String(tableId) }));
    setIsMapModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage(null);
    setErrorMessage(null);

    if (!isAuthenticated) {
      setErrorMessage('Для бронирования столика необходимо войти в аккаунт!');
      return;
    }

    if (!form.phone || !form.date || !form.time || !form.guests || !form.tableId) {
      setErrorMessage('Пожалуйста, заполните все поля формы!');
      return;
    }

    setLoading(true);

    try {
      const startTimeISO = new Date(`${form.date}T${form.time}:00`).toISOString();

      await reservationApi.createReservation({
        phone: form.phone,
        guests: parseInt(form.guests, 10),
        tableId: parseInt(form.tableId, 10),
        date: form.date,
        startTime: startTimeISO,
      });

      setStatusMessage('🎉 Ваш столик успешно забронирован! Наш администратор свяжется с вами.');
      setForm({
        phone: '',
        guests: '',
        date: '',
        time: '',
        tableId: '',
      });
      setDateInputType('text');
    } catch (err) {
      setErrorMessage(err.message || 'Ошибка при бронировании стола');
    } finally {
      setLoading(false);
    }
  };

  const selectedTableObj = TABLE_OPTIONS.find((t) => String(t.id) === String(form.tableId));

  return (
    <div className="bron-page-wrapper">
      <Header />

      <div className="bron-content-container">
        {/* Decorative Leaf Graphics */}
        <img src={barg1} alt="" className="bron-leaf-1" />
        <img src={barg2} alt="" className="bron-leaf-2" />

        {/* Main Glassmorphism Container */}
        <div className="bron-glass-card">

          {/* Breadcrumb */}
          <div className="bron-breadcrumb">
            <Link to="/home">Главная</Link>
            <span>›</span>
            <span>Бронирование</span>
          </div>

          {/* Main Page Title */}
          <h1 className="bron-main-title">Бронирование</h1>

          {/* Hero Section: Working Hours & Wine Glasses Image */}
          <div className="bron-hero-grid">
            <div className="bron-hours-section">
              <h2 className="bron-hours-title">Часы работы</h2>
              <table className="bron-hours-table">
                <tbody>
                  <tr>
                    <td>Понедельник</td>
                    <td className="hours-time">10:00–23:00</td>
                  </tr>
                  <tr>
                    <td>Вторник</td>
                    <td className="hours-time">10:00–23:00</td>
                  </tr>
                  <tr>
                    <td>Среда</td>
                    <td className="hours-time">10:00–23:00</td>
                  </tr>
                  <tr>
                    <td>Четверг</td>
                    <td className="hours-time">10:00–23:00</td>
                  </tr>
                  <tr>
                    <td>Пятница</td>
                    <td className="hours-time">10:00–23:00</td>
                  </tr>
                  <tr>
                    <td>Воскресенье</td>
                    <td className="hours-time">11:00–22:00</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bron-hero-image-wrapper">
              <img src={wineGlassesImg} alt="Wine Glasses" className="bron-hero-image" />
            </div>
          </div>

          {/* Section: Booking Form (Exact Figma Image 2 replica) */}
          <div className="bron-form-section" id="booking-form-anchor">
            <h2 className="bron-form-title">Хотите забронировать стол?</h2>

            {/* Alert Messages */}
            {statusMessage && (
              <div style={{
                backgroundColor: '#d4edda', color: '#155724', padding: '16px 24px',
                borderRadius: '16px', marginBottom: '30px', fontWeight: '600', textAlign: 'center',
                boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
              }}>
                {statusMessage}
              </div>
            )}

            {errorMessage && (
              <div style={{
                backgroundColor: '#f8d7da', color: '#721c24', padding: '16px 24px',
                borderRadius: '16px', marginBottom: '30px', fontWeight: '600', textAlign: 'center',
                boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
              }}>
                ⚠️ {errorMessage}
                {!isAuthenticated && (
                  <button
                    onClick={() => navigate('/')}
                    style={{
                      marginLeft: '15px', backgroundColor: '#721c24', color: '#fff',
                      border: 'none', padding: '6px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px'
                    }}
                  >
                    Войти
                  </button>
                )}
              </div>
            )}

            {/* Form inputs stacked strictly vertical */}
            <form onSubmit={handleSubmit} className="bron-booking-form">
              
              {/* 1. Ваш номер */}
              <div className="bron-input-group">
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Ваш номер"
                  className="bron-input"
                  required
                />
              </div>

              {/* 2. На сколько человек? */}
              <div className="bron-input-group">
                <CustomSelect
                  value={form.guests}
                  onChange={(val) => setForm((p) => ({ ...p, guests: val }))}
                  placeholder="На сколько человек?"
                  variant="light"
                  options={[
                    { value: '1', label: '1 человек' },
                    { value: '2', label: '2 человека' },
                    { value: '3', label: '3 человека' },
                    { value: '4', label: '4 человека' },
                    { value: '5', label: '5+ человек' },
                  ]}
                />
              </div>

              {/* 3. Выберите дату */}
              <div className="bron-input-group">
                <input
                  type={dateInputType}
                  onFocus={() => setDateInputType('date')}
                  onBlur={(e) => { if (!e.target.value) setDateInputType('text'); }}
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  placeholder="Выберите дату"
                  className="bron-input"
                  required
                />
                <svg className="bron-icon-svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
              </div>

              {/* Floating leaf image on top right of form */}
              <img src={barg7} alt="" className="bron-leaf-form" />

              {/* 4. Выберите время */}
              <div className="bron-input-group">
                <CustomSelect
                  value={form.time}
                  onChange={(val) => setForm((p) => ({ ...p, time: val }))}
                  placeholder="Выберите время"
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

              {/* 5. Выберите место */}
              <div className="bron-input-group">
                <CustomSelect
                  value={form.tableId}
                  onChange={(val) => setForm((p) => ({ ...p, tableId: val }))}
                  placeholder="Выберите место"
                  variant="light"
                  options={TABLE_OPTIONS.map((tbl) => ({
                    value: String(tbl.id),
                    label: `🪑 ${tbl.name}`,
                  }))}
                />
              </div>

              {/* Form Action Row: Link on left, Button on right */}
              <div className="bron-form-actions">
                <span
                  className="bron-map-link"
                  onClick={() => setIsMapModalOpen(true)}
                >
                  Выбрать места на карте {selectedTableObj ? `(${selectedTableObj.name})` : ''}
                </span>

                <button
                  type="submit"
                  disabled={loading}
                  className="bron-submit-btn"
                >
                  {loading ? 'Отправка...' : 'Забронировать'}
                </button>
              </div>

            </form>
          </div>

          {/* Section: Contact Us */}
          <div className="bron-contact-section" id="footer-contacts">
            <h2 className="bron-contact-title">Связаться с нами</h2>
            <div className="bron-contact-grid">
              
              <div className="bron-contact-card">
                <div className="bron-contact-icon">✉️</div>
                <h4>Напишите нам</h4>
                <p>info@bmgsoft.com</p>
                <p>t.me/bmgsoft.com</p>
              </div>

              <div className="bron-contact-card">
                <div className="bron-contact-icon">📞</div>
                <h4>Позвоните нам</h4>
                <p>+9998908767888</p>
                <p>+9989865332322</p>
              </div>

              <div className="bron-contact-card">
                <div className="bron-contact-icon">📍</div>
                <h4>Посетите нас</h4>
                <p>Узбекистан, Ташкент</p>
                <p>Улица, 24</p>
              </div>

            </div>
          </div>

          {/* Section: News / Gallery */}
          <div className="bron-news-section">
            <h2 className="bron-news-title">Новости/Галерея</h2>
            <div className="bron-news-grid">

              <div className="bron-news-card">
                <div className="bron-news-img-wrapper">
                  <img src={rasm1} alt="News 1" className="bron-news-img" />
                </div>
                <p className="bron-news-desc">
                  Используйте гибкие структуры, чтобы предоставить надежный обзор для обзоров высокого уровня. Итеративные подходы к данным корпоративной.
                </p>
                <div className="bron-news-author">
                  <img src={sergey} alt="Сергей" />
                  <span>Сергей</span>
                </div>
              </div>

              <div className="bron-news-card">
                <div className="bron-news-img-wrapper">
                  <img src={rasm2} alt="News 2" className="bron-news-img" />
                </div>
                <p className="bron-news-desc">
                  Используйте гибкие структуры, чтобы предоставить надежный обзор для обзоров высокого уровня. Итеративные подходы к данным корпоративной.
                </p>
                <div className="bron-news-author">
                  <img src={sergey} alt="Сергей" />
                  <span>Сергей</span>
                </div>
              </div>

              <div className="bron-news-card">
                <div className="bron-news-img-wrapper">
                  <img src={rasm3} alt="News 3" className="bron-news-img" />
                </div>
                <p className="bron-news-desc">
                  Используйте гибкие структуры, чтобы предоставить надежный обзор для обзоров высокого уровня. Итеративные подходы к данным корпоративной.
                </p>
                <div className="bron-news-author">
                  <img src={sergey} alt="Сергей" />
                  <span>Сергей</span>
                </div>
              </div>

            </div>

            <div className="bron-news-action">
              <button
                className="bron-view-all-btn"
                onClick={() => navigate('/novosti')}
              >
                Посмотреть все ➔
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Table Map Interactive Modal */}
      {isMapModalOpen && (
        <div className="table-modal-overlay" onClick={() => setIsMapModalOpen(false)}>
          <div className="table-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="table-modal-header">
              <h3>Интерактивная карта залов</h3>
              <button
                className="table-modal-close"
                onClick={() => setIsMapModalOpen(false)}
              >
                ✕
              </button>
            </div>
            <p style={{ color: '#666', fontSize: '14px', marginBottom: '20px' }}>
              Выберите понравившуюся зону и столик на виртуальной схеме ресторана:
            </p>
            <div className="table-grid">
              {TABLE_OPTIONS.map((tbl) => (
                <div
                  key={tbl.id}
                  className={`table-item ${String(form.tableId) === String(tbl.id) ? 'selected' : ''}`}
                  onClick={() => handleSelectTableFromMap(tbl.id)}
                >
                  <div className="table-item-title">🪑 {tbl.name}</div>
                  <div className="table-item-desc">Вместимость: {tbl.capacity}</div>
                  <span className="table-item-badge">
                    {String(form.tableId) === String(tbl.id) ? '✓ Выбрано' : 'Выбрать стол'}
                  </span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                style={{
                  backgroundColor: '#000', color: '#fff', border: 'none',
                  padding: '10px 24px', borderRadius: '10px', fontWeight: '600', cursor: 'pointer'
                }}
                onClick={() => setIsMapModalOpen(false)}
              >
                Готово
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
