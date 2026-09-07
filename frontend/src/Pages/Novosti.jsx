import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import rasm1 from '../assets/images/rasm1.png';
import rasm2 from '../assets/images/rasm2.png';
import rasm3 from '../assets/images/rasm3.png';
import sergey from '../assets/images/sergey.png';
import '../styles/Bronirovanie.css';

const newsItems = [
  { id: 1, img: rasm1, author: 'Сергей', title: 'Премиальное кулинарное искусство', desc: 'Используйте гибкие структуры, чтобы предоставить надежный обзор для обзоров высокого уровня. Итеративные подходы к данным корпоративной.' },
  { id: 2, img: rasm2, author: 'Сергей', title: 'Уютная атмосфера и живая музыка', desc: 'Используйте гибкие структуры, чтобы предоставить надежный обзор для обзоров высокого уровня. Итеративные подходы к данным корпоративной.' },
  { id: 3, img: rasm3, author: 'Сергей', title: 'Новое сезонное меню от Шефа', desc: 'Используйте гибкие структуры, чтобы предоставить надежный обзор для обзоров высокого уровня. Итеративные подходы к данным корпоративной.' },
  { id: 4, img: rasm1, author: 'Сергей', title: 'Винная карта и дегустационные вечера', desc: 'Используйте гибкие структуры, чтобы предоставить надежный обзор для обзоров высокого уровня. Итеративные подходы к данным корпоративной.' },
  { id: 5, img: rasm2, author: 'Сергей', title: 'Банкеты и корпоративные мероприятия', desc: 'Используйте гибкие структуры, чтобы предоставить надежный обзор для обзоров высокого уровня. Итеративные подходы к данным корпоративной.' },
  { id: 6, img: rasm3, author: 'Сергей', title: 'Свежие ингредиенты каждый день', desc: 'Используйте гибкие структуры, чтобы предоставить надежный обзор для обзоров высокого уровня. Итеративные подходы к данным корпоративной.' },
];

export default function Novosti() {
  return (
    <div className="bron-page-wrapper">
      <Header />

      <div className="bron-content-container">
        <div className="bron-glass-card">
          
          {/* Breadcrumbs */}
          <div className="bron-breadcrumb">
            <Link to="/home">Главная</Link>
            <span>›</span>
            <span>Новости/Галерея</span>
          </div>

          <h1 className="bron-main-title">Новости и Галерея ресторана</h1>

          <p style={{ textAlign: 'center', color: '#555', maxWidth: '600px', margin: '-20px auto 40px auto', fontSize: '16px' }}>
            Следите за последними новостями нашего ресторана, обновлениями авторского меню и яркими событиями.
          </p>

          {/* Grid of news cards */}
          <div className="bron-news-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
            {newsItems.map((item) => (
              <div key={item.id} className="bron-news-card">
                <div className="bron-news-img-wrapper">
                  <img src={item.img} alt={item.title} className="bron-news-img" />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: '700', margin: '0 0 10px 0', color: '#000' }}>
                  {item.title}
                </h3>
                <p className="bron-news-desc">{item.desc}</p>
                <div className="bron-news-author">
                  <img src={sergey} alt={item.author} />
                  <span>{item.author}</span>
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
