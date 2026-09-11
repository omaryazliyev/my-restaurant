import React, { useState, useEffect } from 'react';
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

  const NEWS_IMAGES = [rasm1, rasm2, rasm3];

  useEffect(() => {
    fetchAll();
  }, []);

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
      setCategories(cats);
      setActiveKey(cats[0] || '');

      // Barcha taomlarni formatlash
      const formatted = data.map(item => {
        const usdPrice = Number(item.price) > 100
          ? Number(item.price) / 12700
          : Number(item.price);
        return {
          id: item.id,
          usdPrice,
          img: item.image || food1,
          category: item.category?.name || 'Boshqalar',
          name: item.name,
          desc: item.description || '',
        };
      });

      setAllDishes(formatted);
    } catch (err) {
      console.warn('Menu fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const currentItems = allDishes.filter(d => {
    const c = (d.category || '').toLowerCase();
    const a = (activeKey || '').toLowerCase();
    return c === a || c.includes(a) || a.includes(c);
  });

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
                {categories.map((cat) => (
                  <a
                    key={cat}
                    href="#"
                    className={activeKey === cat ? 'pervi' : ''}
                    onClick={(e) => { e.preventDefault(); setActiveKey(cat); }}
                  >
                    {cat}
                  </a>
                ))}
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
