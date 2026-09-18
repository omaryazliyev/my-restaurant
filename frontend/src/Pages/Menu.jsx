import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Menu.css';
import '../styles/Home.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { menuApi } from '../services/api';

import food1 from '../assets/images/food1.png';
import barg4 from '../assets/images/barg4.png';
import rasm1 from '../assets/images/rasm1.png';
import rasm2 from '../assets/images/rasm2.png';
import rasm3 from '../assets/images/rasm3.png';
import sergey from '../assets/images/sergey.png';
import magazin from '../assets/images/magazin.png';

export default function Menu() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { t, lang, priceFormat } = useLanguage();

  const [categories, setCategories] = useState([]);
  const [activeKey, setActiveKey] = useState('');
  const [allDishes, setAllDishes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Smooth Category Slider State & Refs
  const tabRefs = useRef({});
  const [sliderPos, setSliderPos] = useState({ left: 0, width: 0, top: 0, height: 0 });

  // Smart Filters & Sorting States
  const [tagFilter, setTagFilter] = useState('all');
  const [sortBy, setSortBy] = useState('default');

  const NEWS_IMAGES = [rasm1, rasm2, rasm3];

  useEffect(() => {
    fetchAll();
  }, []);

  useEffect(() => {
    const updatePillPosition = () => {
      const activeEl = tabRefs.current[activeKey];
      if (activeEl) {
        setSliderPos({
          left: activeEl.offsetLeft,
          width: activeEl.offsetWidth,
          top: activeEl.offsetTop,
          height: activeEl.offsetHeight,
        });
      }
    };

    updatePillPosition();
    const timer = setTimeout(updatePillPosition, 50);
    window.addEventListener('resize', updatePillPosition);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updatePillPosition);
    };
  }, [activeKey, categories, lang]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const data = await menuApi.getMenuItems().catch(() => []);
      if (!Array.isArray(data) || data.length === 0) {
        setLoading(false);
        return;
      }

      // Kategoriyalarni backenddan ajratib olamiz
      const catSet = new Map();
      data.forEach(item => {
        const catName = item.category?.name || 'Boshqalar';
        const catId = item.category?.id || catName;
        if (!catSet.has(catId)) catSet.set(catId, catName);
      });
      const cats = Array.from(catSet.values());
      setCategories(['all', ...cats]);
      setActiveKey('all');

      // Barcha taomlarni formatlash
      const formatted = data.map((item, idx) => {
        const usdPrice = Number(item.price) > 100
          ? Number(item.price) / 12700
          : Number(item.price);

        // Simulated diet badges & calories based on index/id for richness
        const isHalal = idx % 2 === 0;
        const isSpicy = idx % 3 === 0;
        const isVeg = idx % 5 === 0;
        const kcal = 220 + (idx * 35) % 350;

        return {
          id: item.id,
          usdPrice,
          img: item.image || food1,
          category: item.category?.name || 'Boshqalar',
          name: item.name,
          desc: item.description || '',
          isHalal,
          isSpicy,
          isVeg,
          kcal,
        };
      });

      setAllDishes(formatted);
    } catch (err) {
      console.warn('Menu fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter & Sort computation
  let currentItems = allDishes.filter(d => {
    if (activeKey !== 'all') {
      const c = (d.category || '').toLowerCase();
      const a = (activeKey || '').toLowerCase();
      if (!(c === a || c.includes(a) || a.includes(c))) return false;
    }

    if (tagFilter === 'halal' && !d.isHalal) return false;
    if (tagFilter === 'spicy' && !d.isSpicy) return false;
    if (tagFilter === 'vegetarian' && !d.isVeg) return false;

    return true;
  });

  if (sortBy === 'price_low') {
    currentItems = [...currentItems].sort((a, b) => a.usdPrice - b.usdPrice);
  } else if (sortBy === 'price_high') {
    currentItems = [...currentItems].sort((a, b) => b.usdPrice - a.usdPrice);
  } else if (sortBy === 'popular') {
    currentItems = [...currentItems].sort((a, b) => a.id - b.id);
  }

  return (
    <div className="menu-body">
      <Header showNav={true} />
      <div className="menu-container">
        <main>
          <section className="s1-menu">
            <div className="page-breadcrumb" style={{ marginTop: '20px' }}>
              <Link className="glavni" to="/home">{t.home} &gt;</Link>
              <a className="menu-link" href="#">{t.menu}</a>
            </div>

            <h1>{t.menu}</h1>

            {/* Category tabs — faqat backenddan kelgan kategoriyalar */}
            <div className="menyu1">
              <div className="menyu">
                <div
                  className="menyu-slider-pill"
                  style={{
                    left: `${sliderPos.left}px`,
                    width: `${sliderPos.width}px`,
                    top: `${sliderPos.top}px`,
                    height: `${sliderPos.height}px`,
                    opacity: sliderPos.width ? 1 : 0
                  }}
                />
                {categories.map((cat) => (
                  <a
                    key={cat}
                    ref={el => (tabRefs.current[cat] = el)}
                    href="#"
                    className={activeKey === cat ? 'pervi' : ''}
                    onClick={(e) => { e.preventDefault(); setActiveKey(cat); }}
                  >
                    {cat === 'all' ? (t.allFilter || 'Barchasi') : cat}
                  </a>
                ))}
              </div>
            </div>

            {/* Smart Sort Bar */}
            <div className="menu-filter-sort-bar" style={{ justifyContent: 'flex-end' }}>
              <div className="menu-sort-box">
                <span className="sort-label">⚡ {t.sortBy || 'Saralash'}:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="menu-sort-select"
                >
                  <option value="default">{t.sortDefault || "O'z holicha"}</option>
                  <option value="price_low">{t.sortPriceLow || 'Avval arzonroq'}</option>
                  <option value="price_high">{t.sortPriceHigh || 'Avval qimmatroq'}</option>
                  <option value="popular">{t.sortPopular || "Mashhurlik bo'yicha"}</option>
                </select>
              </div>
            </div>

            {/* Cards grid */}
            <div className="menu-cards">
              {loading ? (
                <div style={{ textAlign: 'center', width: '100%', padding: '60px', color: '#888' }}>
                  🔄 Taomlar yuklanmoqda...
                </div>
              ) : currentItems.length === 0 ? (
                <div style={{ textAlign: 'center', width: '100%', padding: '60px', color: '#888' }}>
                  Ushbu kategoriyada taomlar mavjud emas
                </div>
              ) : (
                currentItems.map((item) => {
                  const displayPrice = priceFormat(item.usdPrice);
                  return (
                    <div
                      className="card1"
                      key={item.id}
                      onClick={() => navigate(`/product/${item.id}`)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="big">
                        <img
                          src={item.img}
                          alt={item.name}
                          onError={(e) => { e.target.src = food1; }}
                        />
                      </div>

                      <div className="menu-card-main">
                        <h3>{item.name}</h3>
                      </div>
                      <p>{item.desc || "Xushbo'y ziravorlar bilan tayyorlangan taom"}</p>
                      <div className="menu-card-footer">
                        <span className="price">{displayPrice}</span>
                        <div
                          className="magazin"
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart({
                              id: item.id,
                              name: item.name,
                              img: item.img,
                              price: item.usdPrice,
                              usdPrice: item.usdPrice,
                            });
                          }}
                          style={{ cursor: 'pointer' }}
                          title={t.addToCart}
                        >
                          <img src={magazin} alt="Cart" />
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <img className="barg4-menu" src={barg4} alt="" />
          </section>

          {/* News section */}
          <section className="s5">
            <h2>{t.newsTitle}</h2>
            <div className="galareya">
              {NEWS_IMAGES.map((img, i) => (
                <div className="gala" key={i}>
                  <div className="gala-img"><img src={img} alt="" /></div>
                  <p>{t.newsCardText}</p>
                  <div className="gala-author">
                    <img src={sergey} alt="" />
                    <h5>Sergey</h5>
                  </div>
                </div>
              ))}
            </div>
            <div className="pros">
              <button onClick={() => navigate('/novosti')}>{t.viewAll}</button>
            </div>
          </section>
        </main>
      </div>

      <Footer />
    </div>
  );
}
