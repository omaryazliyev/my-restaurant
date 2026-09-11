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
import food2 from '../assets/images/food2.png';
import food3 from '../assets/images/food3.png';
import food4 from '../assets/images/food4.png';
import fod from '../assets/images/fod.png';
import pizza1 from '../assets/images/pizza1.jpg';
import magazin from '../assets/images/magazin.png';
import barg4 from '../assets/images/barg4.png';
import rasm1 from '../assets/images/rasm1.png';
import rasm2 from '../assets/images/rasm2.png';
import rasm3 from '../assets/images/rasm3.png';
import sergey from '../assets/images/sergey.png';

const CAT_KEYS = ['Birinchi taomlar', 'Ikkinchi taomlar', 'Salatlar', 'Ichimliklar', 'Fast-Food'];

const CAT_LABELS = {
  ru: ['Первые', 'Вторые', 'Салаты', 'Напитки', 'Фаст-Фуд'],
  uz: ['Birinchi taomlar', 'Ikkinchi taomlar', 'Salatlar', 'Ichimliklar', 'Fast-Food'],
  en: ['Starters', 'Main Courses', 'Salads', 'Drinks', 'Fast Food'],
};

const DEFAULT_DISHES = {
  'Birinchi taomlar': [
    { id: 1, usdPrice: 10.00, numericPrice: 127000, img: food1, name: { ru: 'Куриный суп', uz: "Tovuq sho'rva", en: 'Chicken Soup' }, desc: { ru: 'Острый с чесноком', uz: 'Sarimsoqli achchiq', en: 'Spicy with garlic' } },
    { id: 2, usdPrice: 12.00, numericPrice: 152400, img: food2, name: { ru: 'Грибной крем-суп', uz: "Qo'ziqorin kremi", en: 'Creamy Mushroom Soup' }, desc: { ru: 'Лесные грибы со сливками', uz: "O'rmon qo'ziqorin", en: 'Forest mushrooms with cream' } },
    { id: 3, usdPrice: 9.50, numericPrice: 120650, img: food3, name: { ru: 'Томатный суп', uz: 'Pomidor sho\'rva', en: 'Classic Tomato Soup' }, desc: { ru: 'Запечённые томаты', uz: 'Qovurilgan pomidor', en: 'Roasted tomatoes with basil' } },
    { id: 4, usdPrice: 11.00, numericPrice: 139700, img: food4, name: { ru: 'Говяжий бульон', uz: "Mol go'shtli bulyon", en: 'Traditional Broth' }, desc: { ru: 'Медленно варёный', uz: 'Sekin qaynatilgan', en: 'Slow cooked beef broth' } },
  ],
  'Ikkinchi taomlar': [
    { id: 101, usdPrice: 18.00, numericPrice: 228600, img: food2, name: { ru: 'Говядина-Специал', uz: "Maxsus mol go'shti", en: 'Beef Special' }, desc: { ru: 'Нежная говяжья вырезка', uz: "Yumshoq mol go'shti", en: 'Tender beef tenderloin' } },
    { id: 102, usdPrice: 22.00, numericPrice: 279400, img: fod, name: { ru: 'Стейк из лосося', uz: 'Losos biftek', en: 'Grilled Salmon Steak' }, desc: { ru: 'Норвежский лосось', uz: 'Norvegiya lososi', en: 'Fresh Norwegian salmon' } },
    { id: 103, usdPrice: 14.00, numericPrice: 177800, img: food3, name: { ru: 'Паста Карбонара', uz: 'Pasta Karbonara', en: 'Pasta Carbonara' }, desc: { ru: 'Сливочный соус', uz: 'Kremli sous', en: 'Creamy parmesan sauce' } },
  ],
  'Salatlar': [
    { id: 201, usdPrice: 11.00, numericPrice: 114300, img: rasm1, name: { ru: 'Салат Цезарь', uz: 'Sezar salati', en: 'Caesar Salad' }, desc: { ru: 'Куриная грудка', uz: "Tovuq ko'kragi", en: 'Romaine, grilled chicken' } },
    { id: 202, usdPrice: 9.50, numericPrice: 120650, img: food4, name: { ru: 'Греческий салат', uz: 'Grek salati', en: 'Greek Salad' }, desc: { ru: 'Фета и оливки', uz: 'Feta pishloq va zaytun', en: 'Feta cheese, olives' } },
  ],
  'Ichimliklar': [
    { id: 301, usdPrice: 5.00, numericPrice: 63500, img: rasm2, name: { ru: 'Лимонад Цитрус', uz: 'Limon limonadi', en: 'Fresh Citrus Lemonade' }, desc: { ru: 'Мята и лимон', uz: 'Yalpiz va limon', en: 'Mint, lemon' } },
    { id: 302, usdPrice: 6.50, numericPrice: 82550, img: food2, name: { ru: 'Ягодный Мохито', uz: "Mevali Mohito", en: 'Berry Mojito' }, desc: { ru: 'Лесные ягоды', uz: "O'rmon mevalar", en: 'Wild berries' } },
  ],
  'Fast-Food': [
    { id: 401, usdPrice: 14.00, numericPrice: 177800, img: pizza1, name: { ru: 'Пицца Маргарита', uz: 'Margarita Pitsa', en: 'Pizza Margherita' }, desc: { ru: 'Моцарелла и базилик', uz: 'Motsarella va rayhon', en: 'Mozzarella, basil' } },
    { id: 402, usdPrice: 12.00, numericPrice: 152400, img: food2, name: { ru: 'BBQ Бургер', uz: 'BBQ Burger', en: 'BBQ Bacon Burger' }, desc: { ru: 'Сочная говядина', uz: "Shirali mol go'shti", en: 'Juicy beef patty' } },
  ],
};

const NEWS_IMAGES = [rasm1, rasm2, rasm3];

export default function Menu() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { t, lang, priceFormat } = useLanguage();

  const [activeKey, setActiveKey] = useState('Birinchi taomlar');
  const [apiDishes, setApiDishes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    setLoading(true);
    try {
      let formatted = [];
      const data = await menuApi.getMenuItems().catch(() => null);
      if (Array.isArray(data) && data.length > 0) {
        formatted = data.map(item => {
          const catName = item.category?.name || 'Birinchi taomlar';
          return {
            id: item.id,
            usdPrice: Number(item.price) > 100 ? Number(item.price) / 12700 : Number(item.price),
            numericPrice: Number(item.price),
            img: item.image || food1,
            category: catName,
            name: { ru: item.name, uz: item.name, en: item.name },
            desc: { ru: item.description || '', uz: item.description || '', en: item.description || '' }
          };
        });
      }

      // Check localStorage for admin added dishes
      const cached = localStorage.getItem('custom_menu_items');
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          parsed.forEach(cItem => {
            if (!formatted.some(f => f.id === cItem.id || f.name.uz === cItem.name)) {
              formatted.push({
                id: cItem.id,
                usdPrice: Number(cItem.price) > 100 ? Number(cItem.price) / 12700 : Number(cItem.price),
                numericPrice: Number(cItem.price),
                img: cItem.image || food1,
                category: cItem.category || 'Birinchi taomlar',
                name: { ru: cItem.name, uz: cItem.name, en: cItem.name },
                desc: { ru: cItem.description || '', uz: cItem.description || '', en: cItem.description || '' }
              });
            }
          });
        } catch (e) {
          console.warn("Cached menu read error:", e);
        }
      }

      setApiDishes(formatted);
    } catch (err) {
      console.warn("Backend menu fetch warning:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const catLabels = CAT_LABELS[lang] || CAT_LABELS['uz'];

  // Combine default dishes with API / cached dishes
  const getDishesForCategory = (catName) => {
    const defaults = DEFAULT_DISHES[catName] || [];
    const fromApi = apiDishes.filter(d => {
      const c = (d.category || '').toLowerCase();
      const target = catName.toLowerCase();
      return (
        c === target ||
        c.includes(target) ||
        target.includes(c) ||
        (target.includes('birinchi') && (c.includes('birinchi') || c.includes('первы') || c.includes('starter'))) ||
        (target.includes('ikkinchi') && (c.includes('ikkinchi') || c.includes('втор') || c.includes('main'))) ||
        (target.includes('salat') && (c.includes('salat') || c.includes('салат'))) ||
        (target.includes('ichimlik') && (c.includes('ichimlik') || c.includes('напит') || c.includes('drink'))) ||
        (target.includes('fast') && (c.includes('fast') || c.includes('фаст')))
      );
    });

    // Merge API/custom dishes first, then default dishes if not already in list
    const combined = [...fromApi];
    defaults.forEach(def => {
      if (!combined.some(c => c.id === def.id || (c.name.uz && c.name.uz === def.name.uz))) {
        combined.push(def);
      }
    });
    return combined;
  };

  const currentItems = getDishesForCategory(activeKey);

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

            {/* Category tabs */}
            <div className="menyu1">
              <div className="menyu">
                {CAT_KEYS.map((key, i) => (
                  <a
                    key={key}
                    href="#"
                    className={activeKey === key ? 'pervi' : ''}
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveKey(key);
                    }}
                  >
                    {catLabels[i]}
                  </a>
                ))}
              </div>
            </div>

            {/* Cards grid */}
            <div className="menu-cards">
              {loading ? (
                <div style={{ textAlign: 'center', width: '100%', padding: '40px', color: '#888' }}>
                  🔄 Taomlar yuklanmoqda...
                </div>
              ) : currentItems.length === 0 ? (
                <div style={{ textAlign: 'center', width: '100%', padding: '40px', color: '#888' }}>
                  Ushbu kategoriyada taomlar mavjud emas
                </div>
              ) : (
                currentItems.map((item) => {
                  const title = typeof item.name === 'object' ? (item.name[lang] || item.name.uz || item.name.en) : item.name;
                  const description = typeof item.desc === 'object' ? (item.desc[lang] || item.desc.uz || item.desc.en) : item.desc;
                  const displayPrice = priceFormat(item.usdPrice || (item.numericPrice ? item.numericPrice / 12700 : 0));

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
                          alt={title}
                          onError={(e) => { e.target.src = food1; }}
                        />
                      </div>
                      <div className="menu-card-main">
                        <h3>{title}</h3>
                      </div>
                      <p>{description || 'Xushbo\'y ziravorlar bilan tayyorlangan taom'}</p>
                      <div className="menu-card-footer">
                        <span className="price">{displayPrice}</span>
                        <div
                          className="magazin"
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart({
                              ...item,
                              name: title,
                              price: item.usdPrice || 10,
                              numericPrice: item.numericPrice
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
