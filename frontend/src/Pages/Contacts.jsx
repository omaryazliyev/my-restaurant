import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/Contacts.css';

// Leaf Images
import barg1 from '../assets/images/barg1.png';
import barg2 from '../assets/images/barg2.png';
import barg3 from '../assets/images/barg3.png';
import barg4 from '../assets/images/barg4.png';

export default function Contacts() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      alert('Пожалуйста, заполните имя и E-mail!');
      return;
    }
    setSubmitted(true);
    setFormData({ name: '', email: '', phone: '', message: '' });
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="contacts-page-wrapper">
      <Header />

      <div className="contacts-container">
        {/* ── Decorative Leaves ────────────────────────────────── */}
        <img src={barg1} alt="" className="contacts-leaf-left" />
        <img src={barg2} alt="" className="contacts-leaf-right" />

        <div className="contacts-glass-card">
          <img
            src={barg3}
            alt=""
            style={{
              position: 'absolute', right: '-25px', top: '70px',
              width: '110px', opacity: 0.85, pointerEvents: 'none', zIndex: 0
            }}
          />
          <img
            src={barg4}
            alt=""
            style={{
              position: 'absolute', left: '-25px', bottom: '50px',
              width: '90px', opacity: 0.8, pointerEvents: 'none', zIndex: 0
            }}
          />

          {/* Breadcrumb */}
          <div className="contacts-breadcrumb">
            <Link to="/home">Главная</Link>
            <span>›</span>
            <span>Контакты</span>
          </div>

          {/* Page Title */}
          <h1 className="contacts-page-title">Контакты</h1>

          {/* 3 Info Cards Grid */}
          <div className="contacts-info-grid">
            {/* Card 1 — Mail */}
            <div className="contacts-info-card">
              <div className="contacts-info-icon-wrap">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                  <line x1="12" y1="11" x2="12" y2="17" />
                  <polyline points="9,14 12,17 15,14" />
                </svg>
              </div>
              <div className="contacts-info-card-title">Напишите нам</div>
              <div className="contacts-info-text">
                <div><a href="mailto:info@bmgsoft.com">info@bmgsoft.com</a></div>
                <div><a href="https://t.me/bmgsoft.com" target="_blank" rel="noreferrer">t.me/bmgsoft.com</a></div>
              </div>
            </div>

            {/* Card 2 — Phone */}
            <div className="contacts-info-card">
              <div className="contacts-info-icon-wrap">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  <polyline points="15,3 21,3 21,9" />
                  <line x1="14" y1="10" x2="21" y2="3" />
                </svg>
              </div>
              <div className="contacts-info-card-title">Позвоните нам</div>
              <div className="contacts-info-text">
                <div><a href="tel:+9998908767888">+9998908767888</a></div>
                <div><a href="tel:+9989865332322">+9989865332322</a></div>
              </div>
            </div>

            {/* Card 3 — Location */}
            <div className="contacts-info-card">
              <div className="contacts-info-icon-wrap">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <div className="contacts-info-card-title">Посетите нас</div>
              <div className="contacts-info-text">
                <div>Узбекистан, Ташкент</div>
                <div>Улица, 24</div>
              </div>
            </div>
          </div>

          {/* Form Title */}
          <h2 className="contacts-form-title">Написать нам</h2>

          {submitted && (
            <div className="contacts-toast">
              ✓ Ваше сообщение успешно отправлено! Мы свяжемся с вами в ближайшее время.
            </div>
          )}

          {/* Form */}
          <form className="contacts-form" onSubmit={handleSubmit}>
            <div className="contacts-input-group">
              <input
                type="text"
                name="name"
                placeholder="Ваше имя"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="contacts-input-group">
              <input
                type="email"
                name="email"
                placeholder="Ваш E-mail"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="contacts-input-group">
              <input
                type="tel"
                name="phone"
                placeholder="Ваш номер телефона"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            <div className="contacts-input-group">
              <textarea
                name="message"
                placeholder="Ваше сообщение"
                rows="4"
                value={formData.message}
                onChange={handleChange}
              />
            </div>

            <div className="contacts-btn-wrap">
              <button type="submit" className="contacts-submit-btn">
                Отправить
              </button>
            </div>
          </form>

        </div>
      </div>

      <Footer />
    </div>
  );
}
