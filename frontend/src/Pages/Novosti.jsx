import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useLanguage } from '../context/LanguageContext';
import rasm1 from '../assets/images/rasm1.png';
import rasm2 from '../assets/images/rasm2.png';
import rasm3 from '../assets/images/rasm3.png';
import sergey from '../assets/images/sergey.png';
import '../styles/Bronirovanie.css';

// News titles per language
const NEWS_TITLES = {
  ru: [
    'Премиальное кулинарное искусство',
    'Уютная атмосфера и живая музыка',
    'Новое сезонное меню от Шефа',
    'Винная карта и дегустационные вечера',
    'Банкеты и корпоративные мероприятия',
    'Свежие ингредиенты каждый день',
  ],
  uz: [
    'Premium oshpazlik san\'ati',
    'Qulay muhit va jonli musiqa',
    'Oshpazdan yangi mavsumiy menyu',
    'Vino kartasi va tatib ko\'rish kechalari',
    'Ziyofatlar va korporativ tadbirlar',
    'Har kuni yangi ingredientlar',
  ],
  en: [
    'Premium Culinary Art',
    'Cozy Atmosphere & Live Music',
    'New Seasonal Menu from the Chef',
    'Wine List & Tasting Evenings',
    'Banquets & Corporate Events',
    'Fresh Ingredients Every Day',
  ],
};

const NEWS_IMAGES = [rasm1, rasm2, rasm3, rasm1, rasm2, rasm3];

export default function Novosti() {
  const { t, lang } = useLanguage();
  const titles = NEWS_TITLES[lang] || NEWS_TITLES['ru'];

  return (
    <div className="bron-page-wrapper">
      <Header />

      <div className="bron-content-container">
        <div className="bron-glass-card">

          {/* Breadcrumbs */}
          <div className="bron-breadcrumb">
            <Link to="/home">{t.home}</Link>
            <span>›</span>
            <span>{t.newsTitle}</span>
          </div>

          <h1 className="bron-main-title">{t.newsTitle}</h1>

          <p style={{ textAlign: 'center', color: '#555', maxWidth: '600px', margin: '-20px auto 40px auto', fontSize: '16px' }}>
            {t.newsSubtitle}
          </p>

          {/* Grid of news cards */}
          <div className="bron-news-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
            {titles.map((title, i) => (
              <div key={i} className="bron-news-card">
                <div className="bron-news-img-wrapper">
                  <img src={NEWS_IMAGES[i]} alt={title} className="bron-news-img" />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: '700', margin: '0 0 10px 0', color: '#000' }}>
                  {title}
                </h3>
                <p className="bron-news-desc">{t.newsCardText}</p>
                <div className="bron-news-author">
                  <img src={sergey} alt="Sergey" />
                  <span>Sergey</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}
