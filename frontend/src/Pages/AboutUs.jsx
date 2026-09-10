import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useLanguage } from '../context/LanguageContext';
import '../styles/AboutUs.css';

import barg1 from '../assets/images/barg1.png';
import barg2 from '../assets/images/barg2.png';
import barg3 from '../assets/images/barg3.png';
import barg4 from '../assets/images/barg4.png';

import chef1    from '../assets/images/chef1.png';
import chef2    from '../assets/images/chef2.png';
import chef3    from '../assets/images/chef3.png';
import waitress1 from '../assets/images/waitress1.png';

import food1  from '../assets/images/food1.png';
import pizza1 from '../assets/images/pizza1.jpg';

import rasm1  from '../assets/images/rasm1.png';
import rasm2  from '../assets/images/rasm2.png';
import rasm3  from '../assets/images/rasm3.png';
import sergey from '../assets/images/sergey.png';

export default function AboutUs() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const TEAM = [
    { id: 1, name: 'Aleksandr Petro',  role: t.chef,          img: chef1 },
    { id: 2, name: 'Aleksandr Petro',  role: t.assistantChef, img: chef2 },
    { id: 3, name: 'Aleksandr Petro',  role: t.headCook,      img: chef3 },
    { id: 4, name: 'Juliya Villiam',   role: t.waitress,      img: waitress1 },
    { id: 5, name: 'Juliya Villiam',   role: t.waitress,      img: waitress1 },
    { id: 6, name: 'Juliya Villiam',   role: t.waitress,      img: waitress1 },
  ];

  return (
    <div className="about-page-wrapper">
      <Header />

      <div className="about-container">
        <img src={barg1} alt="" className="about-leaf-left"  />
        <img src={barg2} alt="" className="about-leaf-right" />

        {/* ── SECTION 1 — About ── */}
        <div className="about-glass-card">
          <img src={barg3} alt="" style={{ position:'absolute', right:'-30px', top:'80px', width:'110px', opacity:.9, pointerEvents:'none', zIndex:0 }} />
          <img src={barg4} alt="" style={{ position:'absolute', left:'-28px', bottom:'60px', width:'90px', opacity:.85, pointerEvents:'none', zIndex:0 }} />

          <div className="about-breadcrumb">
            <Link to="/home">{t.home}</Link>
            <span>›</span>
            <span>{t.about}</span>
          </div>

          <h1 className="about-page-title">{t.aboutTitle}</h1>

          <div className="about-hero-text">
            <p>{t.aboutText1}</p>
            <p>{t.aboutText2}</p>
          </div>

          {/* Our Food */}
          <div className="about-split-row" style={{ marginTop: '70px' }}>
            <div className="about-split-text">
              <h2 className="about-section-title">{t.ourFood}</h2>
              <p>{t.ourFoodText1}</p>
              <p>{t.ourFoodText2}</p>
              <Link to="/menu" className="about-menu-btn">{t.viewMenu}</Link>
            </div>
            <div className="about-split-img">
              <img src={food1} alt={t.ourFood} />
            </div>
          </div>

          {/* Our Way */}
          <div className="about-split-row reverse" style={{ marginTop: '70px' }}>
            <div className="about-split-img">
              <img src={pizza1} alt={t.ourWay} />
            </div>
            <div className="about-split-text">
              <h2 className="about-section-title">{t.ourWay}</h2>
              <p>{t.ourWayText1}</p>
              <p>{t.ourWayText2}</p>
            </div>
          </div>
        </div>

        {/* ── SECTION 2 — Team ── */}
        <div className="about-glass-card about-team-section">
          <h2 className="about-team-title">{t.ourTeam}</h2>
          <div className="about-team-grid">
            {TEAM.map((member) => (
              <div key={member.id} className="about-team-card">
                <div className="about-team-photo-ring">
                  <img src={member.img} alt={member.name} />
                </div>
                <div className="about-team-name">{member.name}</div>
                <div className="about-team-role">{member.role}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── SECTION 3 — News / Gallery ── */}
        <div className="about-glass-card">
          <h2 className="about-news-title">{t.newsTitle}</h2>
          <div className="about-news-grid">
            {[rasm1, rasm2, rasm3].map((img, i) => (
              <div key={i} className="about-news-card">
                <div className="about-news-img-wrap">
                  <img src={img} alt={`news-${i}`} />
                </div>
                <p className="about-news-text">{t.newsCardText}</p>
                <div className="about-news-author">
                  <img src={sergey} alt="Sergey" />
                  <span>Sergey</span>
                </div>
              </div>
            ))}
          </div>
          <div className="about-news-action">
            <button className="about-view-btn" onClick={() => navigate('/novosti')}>
              {t.viewAll} →
            </button>
          </div>
        </div>

      </div>

      <Footer />
    </div>
  );
}
