import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/AboutUs.css';

// Images
import barg1 from '../assets/images/barg1.png';
import barg2 from '../assets/images/barg2.png';
import barg3 from '../assets/images/barg3.png';
import barg4 from '../assets/images/barg4.png';

// Team photos
import chef1   from '../assets/images/chef1.png';
import chef2   from '../assets/images/chef2.png';
import chef3   from '../assets/images/chef3.png';
import waitress1 from '../assets/images/waitress1.png';

// Food images
import food1 from '../assets/images/food1.png';
import food2 from '../assets/images/food2.png';
import food3 from '../assets/images/food3.png';
import pizza1 from '../assets/images/pizza1.png';

// News gallery
import rasm1 from '../assets/images/rasm1.png';
import rasm2 from '../assets/images/rasm2.png';
import rasm3 from '../assets/images/rasm3.png';
import sergey from '../assets/images/sergey.png';

// ── Team members data ──────────────────────────────────────────
const TEAM = [
  { id: 1, name: 'Александр Петро', role: 'главный повар',      img: chef1 },
  { id: 2, name: 'Александр Петро', role: 'помощник повара',    img: chef2 },
  { id: 3, name: 'Александр Петро', role: 'шеф кулинар',       img: chef3 },
  { id: 4, name: 'Жулия Виллиам',   role: 'официантка',        img: waitress1 },
  { id: 5, name: 'Жулия Виллиам',   role: 'официантка',        img: waitress1 },
  { id: 6, name: 'Жулия Виллиам',   role: 'официантка',        img: waitress1 },
];

// ── News / Gallery data ────────────────────────────────────────
const NEWS = [
  {
    id: 1,
    img: rasm1,
    text: 'Используйте гибкие структуры, чтобы предоставить надежный обзор для обзоров высокого уровня. Итеративные подходы к данным корпоративной.',
  },
  {
    id: 2,
    img: rasm2,
    text: 'Используйте гибкие структуры, чтобы предоставить надежный обзор для обзоров высокого уровня. Итеративные подходы к данным корпоративной.',
  },
  {
    id: 3,
    img: rasm3,
    text: 'Используйте гибкие структуры, чтобы предоставить надежный обзор для обзоров высокого уровня. Итеративные подходы к данным корпоративной.',
  },
];

export default function AboutUs() {
  const navigate = useNavigate();

  return (
    <div className="about-page-wrapper">
      <Header />

      <div className="about-container">
        {/* ── Decorative Leaves ────────────────────────────────── */}
        <img src={barg1} alt="" className="about-leaf-left"  />
        <img src={barg2} alt="" className="about-leaf-right" />

        {/* ═══════════════════════════════════════════════════════ */}
        {/* SECTION 1 — О нас (About Us)                           */}
        {/* ═══════════════════════════════════════════════════════ */}
        <div className="about-glass-card">
          <img src={barg3} alt="" style={{ position:'absolute', right:'-30px', top:'80px', width:'110px', opacity:.9, pointerEvents:'none', zIndex:0 }} />
          <img src={barg4} alt="" style={{ position:'absolute', left:'-28px', bottom:'60px', width:'90px', opacity:.85, pointerEvents:'none', zIndex:0 }} />

          {/* Breadcrumb */}
          <div className="about-breadcrumb">
            <Link to="/home">Главная</Link>
            <span>›</span>
            <span>О нас</span>
          </div>

          {/* Page title */}
          <h1 className="about-page-title">О нас</h1>

          {/* Intro text */}
          <div className="about-hero-text">
            <p>
              С 1995 года наша миссия в ресторане — питать и вдохновлять каждого члена команды, гостя и
              сообщество, которому мы служим. Спустя все эти годы эти основные ценности остаются в основе
              всего, что мы делаем. От нашего меню до наших услуг и способов ведения бизнеса — наш свежий,
              неожиданный и человечный взгляд отличает нас. Мы называем это Необыкновенной Добротой. И это
              во всем, что мы делаем.
            </p>
            <p>
              Имея более 450 ресторанов в 26 штатах и более 8000 членов команды, мы два года подряд были
              названы Forbes одним из лучших работодателей Америки в области разнообразия. Денверский
              деловой журнал признал нас одним из лучших мест для работы. Мы считаем, что эти успехи
              основаны на нашей уникальной и заботливой культуре, благодаря которой каждый, кто входит в
              наши двери, чувствует себя желанным гостем и оцененным по достоинству.
            </p>
          </div>

          {/* ─── Наша еда ─────────────────────────────────────── */}
          <div className="about-split-row" style={{ marginTop: '70px' }}>
            <div className="about-split-text">
              <h2 className="about-section-title">Наша еда</h2>
              <p>
                Наша страсть — создавать исключительные впечатления от еды по отличной цене. От
                традиционных и современных блюд до наших собственных кулинарных творений, таких как
                фаршированные тортеллони премиум-класса, наши свежеприготовленные рецепты отличаются
                индивидуальностью, креативностью и ярким вкусом кухонь всего мира.
              </p>
              <p>
                От «Пенне Роза» до японской лапши, салата «Мед» и всемирно известных макарон с сыром
                «Висконсин» — мы используем только самые лучшие и полезные ингредиенты. Каждое блюдо
                готовится свежим и делается на заказ. Наше богатое меню наполнено яркими, яркими и
                приятными вкусами.
              </p>
              <Link to="/menu" className="about-menu-btn">
                Посмотреть меню →
              </Link>
            </div>
            <div className="about-split-img">
              <img src={food1} alt="Наша еда" />
            </div>
          </div>

          {/* ─── Наш путь ─────────────────────────────────────── */}
          <div className="about-split-row reverse" style={{ marginTop: '70px' }}>
            <div className="about-split-img">
              <img src={pizza1} alt="Наш путь" />
            </div>
            <div className="about-split-text">
              <h2 className="about-section-title">Наш путь</h2>
              <p>
                С самого начала мы взяли на себя обязательство предлагать свежие продукты, свежие
                ингредиенты и новый взгляд на заботу о наших гостях, членах нашей команды и наших
                сообществах. Мы искренне верим, что нет ничего, что могло бы объединить людей или сделать
                мир лучше, чем тарелка лапши.
              </p>
              <p>
                Продолжая расти, мы реализуем ключевые инициативы во всей нашей компании, чтобы поддержать
                светлое будущее. В нашем отчете о влиянии рассматриваются некоторые из этих областей, такие
                как создание меню, наполненного свежими и захватывающими новыми вкусами; активация лучших в
                отрасли льгот для людей; и некоторые способы лучше заботиться о наших сообществах — и о
                нашей планете — которую мы называем домом.
              </p>
            </div>
          </div>

        </div>{/* end about-glass-card */}

        {/* ═══════════════════════════════════════════════════════ */}
        {/* SECTION 2 — Наша команда                               */}
        {/* ═══════════════════════════════════════════════════════ */}
        <div className="about-glass-card about-team-section">
          <h2 className="about-team-title">Наша команда</h2>
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

        {/* ═══════════════════════════════════════════════════════ */}
        {/* SECTION 3 — Новости / Галерея                          */}
        {/* ═══════════════════════════════════════════════════════ */}
        <div className="about-glass-card">
          <h2 className="about-news-title">Новости/Галерея</h2>
          <div className="about-news-grid">
            {NEWS.map((item) => (
              <div key={item.id} className="about-news-card">
                <div className="about-news-img-wrap">
                  <img src={item.img} alt={`news-${item.id}`} />
                </div>
                <p className="about-news-text">{item.text}</p>
                <div className="about-news-author">
                  <img src={sergey} alt="Сергей" />
                  <span>Сергей</span>
                </div>
              </div>
            ))}
          </div>
          <div className="about-news-action">
            <button className="about-view-btn" onClick={() => navigate('/novosti')}>
              Посмотреть все →
            </button>
          </div>
        </div>

      </div>

      <Footer />
    </div>
  );
}
