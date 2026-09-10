import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Menu.css';
import '../styles/Home.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { menuApi } from '../services/api';

import food1  from '../assets/images/food1.png';
import food2  from '../assets/images/food2.png';
import food3  from '../assets/images/food3.png';
import food4  from '../assets/images/food4.png';
import fod    from '../assets/images/fod.png';
import pizza1 from '../assets/images/pizza1.jpg';
import magazin from '../assets/images/magazin.png';
import barg4  from '../assets/images/barg4.png';
import rasm1  from '../assets/images/rasm1.png';
import rasm2  from '../assets/images/rasm2.png';
import rasm3  from '../assets/images/rasm3.png';
import sergey from '../assets/images/sergey.png';

// ──────────────────────────────────────────────────────────────
// Kategoriya nomlari har tilda (ichki kalit doim 'ru' versiyasi)
// ──────────────────────────────────────────────────────────────
const CAT_KEYS = ['Первые', 'Вторые', 'Салаты', 'Напитки', 'Фаст-Фуд'];

const CAT_LABELS = {
  ru: ['Первые', 'Вторые', 'Салаты', 'Напитки', 'Фаст-Фуд'],
  uz: ['Birinchi taomlar', 'Ikkinchi taomlar', 'Salatlar', 'Ichimliklar', 'Fast-Food'],
  en: ['Starters', 'Main Courses', 'Salads', 'Drinks', 'Fast Food'],
};

// ──────────────────────────────────────────────────────────────
// Taom ma'lumotlari — har tilda alohida nom va tavsif
// ──────────────────────────────────────────────────────────────
const DISHES = {
  'Первые': [
    {
      id: 1,
      usdPrice: 10.00, img: food1,
      name: { ru: 'Куриный суп',         uz: "Tovuq sho'rva",         en: 'Chicken Soup' },
      desc: { ru: 'Острый с чесноком',   uz: 'Sarimsoqli achchiq',    en: 'Spicy with garlic' },
    },
    {
      id: 2,
      usdPrice: 12.00, img: food2,
      name: { ru: 'Грибной крем-суп',    uz: "Qo'ziqorin kremi",      en: 'Creamy Mushroom Soup' },
      desc: { ru: 'Лесные грибы со сливками', uz: "O'rmon qo'ziqorin",  en: 'Forest mushrooms with cream' },
    },
    {
      id: 3,
      usdPrice: 9.50, img: food3,
      name: { ru: 'Томатный суп',        uz: 'Pomidor sho\'rva',       en: 'Classic Tomato Soup' },
      desc: { ru: 'Запечённые томаты',   uz: 'Qovurilgan pomidor',     en: 'Roasted tomatoes with basil' },
    },
    {
      id: 4,
      usdPrice: 11.00, img: food4,
      name: { ru: 'Говяжий бульон',      uz: "Mol go'shtli bulyon",   en: 'Traditional Broth' },
      desc: { ru: 'Медленно варёный',    uz: 'Sekin qaynatilgan',      en: 'Slow cooked beef broth' },
    },
    {
      id: 5,
      usdPrice: 13.00, img: food1,
      name: { ru: 'Острый суп с лапшой', uz: 'Achchiq lagmon sho\'rva', en: 'Spicy Noodle Soup' },
      desc: { ru: 'Домашняя лапша',      uz: 'Uy qo\'li lagmon',       en: 'Handmade noodles with chicken' },
    },
    {
      id: 6,
      usdPrice: 15.00, img: food2,
      name: { ru: 'Морской чаудер',      uz: 'Dengiz mahsulotlari',   en: 'Seafood Chowder' },
      desc: { ru: 'Сливочный суп с лососем', uz: "Krema sho'rva",      en: 'Rich creamy soup with salmon' },
    },
    {
      id: 7,
      usdPrice: 8.50, img: food3,
      name: { ru: 'Чечевичный суп',      uz: 'Yasmiq sho\'rva',        en: 'Lentil Soup' },
      desc: { ru: 'Пряная чечевица',     uz: 'Ziravorli yasmiq',       en: 'Hearty spiced lentils' },
    },
    {
      id: 8,
      usdPrice: 10.50, img: food4,
      name: { ru: 'Минестроне',          uz: 'Minestrone',             en: 'Minestrone Classic' },
      desc: { ru: 'Итальянский суп',     uz: 'Italiya sabzavotlari',   en: 'Italian garden vegetable soup' },
    },
  ],

  'Вторые': [
    {
      id: 101,
      usdPrice: 18.00, img: food2,
      name: { ru: 'Говядина-Специал',    uz: "Maxsus mol go'shti",    en: 'Beef Special' },
      desc: { ru: 'Нежная говяжья вырезка', uz: "Yumshoq mol go'shti",  en: 'Tender beef tenderloin' },
    },
    {
      id: 102,
      usdPrice: 22.00, img: fod,
      name: { ru: 'Стейк из лосося',     uz: 'Losos biftek',          en: 'Grilled Salmon Steak' },
      desc: { ru: 'Норвежский лосось',    uz: 'Norvegiya lososi',       en: 'Fresh Norwegian salmon' },
    },
    {
      id: 103,
      usdPrice: 14.00, img: food3,
      name: { ru: 'Паста Карбонара',     uz: 'Pasta Karbonara',       en: 'Pasta Carbonara' },
      desc: { ru: 'Сливочный соус',      uz: 'Kremli sous',            en: 'Creamy parmesan sauce with bacon' },
    },
    {
      id: 104,
      usdPrice: 15.50, img: food4,
      name: { ru: 'Куриная Пармиджана', uz: 'Tovuq Parmijana',        en: 'Chicken Parmigiana' },
      desc: { ru: 'Хрустящая курица',   uz: 'Qovurilgan tovuq',       en: 'Crispy chicken with mozzarella' },
    },
    {
      id: 105,
      usdPrice: 26.00, img: food2,
      name: { ru: 'Стейк Рибай',        uz: 'Ribay biftek',           en: 'Ribeye Steak' },
      desc: { ru: 'Чесночное масло',    uz: 'Sarimsoq moyi bilan',    en: 'Prime cut with garlic butter' },
    },
    {
      id: 106,
      usdPrice: 20.00, img: food1,
      name: { ru: 'Морской окунь',      uz: 'Dengiz okuni',           en: 'Grilled Sea Bass' },
      desc: { ru: 'Средиземноморский стиль', uz: 'O\'rta dengiz usuli',  en: 'Mediterranean style' },
    },
    {
      id: 107,
      usdPrice: 24.00, img: food4,
      name: { ru: 'Бараньи котлеты',    uz: 'Qo\'zi kotleti',          en: 'Lamb Chops' },
      desc: { ru: 'Розмарин и чеснок',  uz: 'Rozmarin va sarimsoq',   en: 'Roasted rosemary and garlic lamb' },
    },
    {
      id: 108,
      usdPrice: 13.50, img: food3,
      name: { ru: 'Паста Болоньезе',    uz: 'Pasta Boloneze',         en: 'Pasta Bolognese' },
      desc: { ru: 'Говяжий рагу',       uz: "Mol go'sht sousi",       en: 'Rich beef ragu' },
    },
  ],

  'Салаты': [
    {
      id: 201,
      usdPrice: 11.00, img: food1,
      name: { ru: 'Салат Цезарь',       uz: 'Sezar salati',           en: 'Caesar Salad' },
      desc: { ru: 'Куриная грудка',     uz: "Tovuq ko'kragi",         en: 'Romaine, grilled chicken' },
    },
    {
      id: 202,
      usdPrice: 9.50, img: food4,
      name: { ru: 'Греческий салат',    uz: 'Grek salati',            en: 'Greek Salad' },
      desc: { ru: 'Фета и оливки',      uz: 'Feta pishloq va zaytun', en: 'Feta cheese, olives, cucumber' },
    },
    {
      id: 203,
      usdPrice: 13.00, img: food2,
      name: { ru: 'Тёплый говяжий',     uz: "Iliq mol go'shtli",      en: 'Warm Beef Salad' },
      desc: { ru: 'Кунжут и говядина',  uz: 'Sezam va mol go\'shti',   en: 'Grilled beef strips with sesame' },
    },
    {
      id: 204,
      usdPrice: 10.00, img: food3,
      name: { ru: 'Капрезе',            uz: 'Kaprese',                en: 'Caprese Special' },
      desc: { ru: 'Моцарелла и томат',  uz: 'Motsarella va pomidor',  en: 'Mozzarella, fresh tomato, pesto' },
    },
  ],

  'Напитки': [
    {
      id: 301,
      usdPrice: 5.00, img: food1,
      name: { ru: 'Лимонад Цитрус',     uz: 'Limon limonadi',         en: 'Fresh Citrus Lemonade' },
      desc: { ru: 'Мята и лимон',       uz: 'Yalpiz va limon',        en: 'Mint, lemon, sparkling water' },
    },
    {
      id: 302,
      usdPrice: 6.50, img: food2,
      name: { ru: 'Ягодный Мохито',     uz: "Mevali Mohito",          en: 'Berry Mojito' },
      desc: { ru: 'Лесные ягоды',       uz: "O'rmon mevalar",         en: 'Wild berries with crushed ice' },
    },
    {
      id: 303,
      usdPrice: 4.50, img: food3,
      name: { ru: 'Карамельный Латте',  uz: 'Karamel Latte',          en: 'Iced Caramel Latte' },
      desc: { ru: 'Двойной эспрессо',   uz: 'Qo\'sh espresso',         en: 'Double espresso with caramel' },
    },
    {
      id: 304,
      usdPrice: 3.50, img: food4,
      name: { ru: 'Жасминовый чай',     uz: 'Yasmin choy',            en: 'Green Jasmine Tea' },
      desc: { ru: 'Ароматный горячий чай', uz: 'Xushbo\'y issiq choy',  en: 'Fragrant hot tea with honey' },
    },
  ],

  'Фаст-Фуд': [
    {
      id: 401,
      usdPrice: 14.00, img: pizza1,
      name: { ru: 'Пицца Маргарита',    uz: 'Margarita Pitsa',        en: 'Pizza Margherita' },
      desc: { ru: 'Моцарелла и базилик', uz: 'Motsarella va rayhon',   en: 'Mozzarella, basil, fresh tomato' },
    },
    {
      id: 402,
      usdPrice: 12.00, img: food2,
      name: { ru: 'BBQ Бургер',         uz: 'BBQ Burger',             en: 'BBQ Bacon Burger' },
      desc: { ru: 'Сочная говядина',     uz: "Shirali mol go'shti",    en: 'Juicy beef patty, cheddar' },
    },
    {
      id: 403,
      usdPrice: 10.00, img: food4,
      name: { ru: 'Куриные крылышки',   uz: "Tovuq qanotlari",        en: 'Crispy Chicken Wings' },
      desc: { ru: 'Острый глазурь',     uz: 'Achchiq krep',           en: 'Buffalo style spicy glaze' },
    },
    {
      id: 404,
      usdPrice: 6.00, img: food3,
      name: { ru: 'Картофель фри',      uz: 'Kartoshka fri',          en: 'Loaded French Fries' },
      desc: { ru: 'Сыр и хрустящий лук', uz: "Pishloq va piyoz",      en: 'Melted cheese and crispy onions' },
    },
  ],
};

const NEWS_IMAGES = [rasm1, rasm2, rasm3];

export default function Menu() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { t, lang, priceFormat } = useLanguage();

  // Ichki kalit (doim Russian key bilan)
  const [activeKey, setActiveKey] = useState('Первые');

  const catLabels = CAT_LABELS[lang] || CAT_LABELS['ru'];
  const items = DISHES[activeKey] || [];

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
              {items.map((item, i) => (
                <div
                  className="card1"
                  key={item.id}
                  onClick={() => navigate(`/product/${item.id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="big">
                    <img src={item.img} alt={item.name[lang] || item.name.en} />
                  </div>
                  <div className="menu-card-main">
                    <h3>{item.name[lang] || item.name.en}</h3>
                  </div>
                  <p>{item.desc[lang] || item.desc.en}</p>
                  <div className="menu-card-footer">
                    <span className="price">{priceFormat(item.usdPrice)}</span>
                    <div
                      className="magazin"
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart({
                          ...item,
                          name: item.name[lang] || item.name.en,
                          price: item.usdPrice,
                        });
                      }}
                      style={{ cursor: 'pointer' }}
                      title={t.addToCart}
                    >
                      <img src={magazin} alt="Cart" />
                    </div>
                  </div>
                </div>
              ))}
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
              <button>{t.viewAll}</button>
            </div>
          </section>
        </main>
      </div>

      <Footer />
    </div>
  );
}
