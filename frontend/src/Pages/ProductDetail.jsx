import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import '../styles/ProductDetail.css';

import barg1  from '../assets/images/barg1.png';
import barg2  from '../assets/images/barg2.png';
import barg3  from '../assets/images/barg3.png';
import barg4  from '../assets/images/barg4.png';
import food1  from '../assets/images/food1.png';
import food2  from '../assets/images/food2.png';
import food3  from '../assets/images/food3.png';
import food4  from '../assets/images/food4.png';
import pizza1 from '../assets/images/pizza1.png';

// ── Asosiy mahsulot ma'lumotlari (barcha tillarda) ───────────
const PRODUCT_DATA = {
  name: {
    ru: 'Дабл бургер',
    uz: 'Dubl Burger',
    en: 'Double Burger',
  },
  category: {
    ru: 'Бургер',
    uz: 'Burger',
    en: 'Burger',
  },
  desc: {
    ru: 'Сочный двойной бургер с двумя говяжьими котлетами, свежими овощами, хрустящим салатом и нашим фирменным соусом. Подаётся в поджаренной булочке бриошь.',
    uz: "Ikki mol go'shtli kotlet, yangi sabzavotlar, qo'pol salat va maxsus sous bilan mazali dubl burger. Qovurilgan briosh bulkasida taqdim etiladi.",
    en: 'A juicy double burger with two beef patties, fresh vegetables, crispy lettuce and our signature sauce. Served in a toasted brioche bun.',
  },
  reviewsLink: {
    ru: '(Смотреть отзывы)',
    uz: "(Sharhlarni ko'rish)",
    en: '(View reviews)',
  },
};

// ── O'xshash mahsulotlar (barcha tillarda) ───────────────────
const SIMILAR_RAW = [
  {
    id: 101, usdPrice: 10.00, img: food2,
    name: { ru: 'Куриный суп',      uz: "Tovuq sho'rva",  en: 'Chicken Soup' },
    sub:  { ru: 'Острый с чесноком', uz: 'Sarimsoqli',     en: 'Spicy with garlic' },
  },
  {
    id: 102, usdPrice: 10.00, img: food1,
    name: { ru: 'Куриный суп',      uz: "Tovuq sho'rva",  en: 'Chicken Soup' },
    sub:  { ru: 'Острый с чесноком', uz: 'Sarimsoqli',     en: 'Spicy with garlic' },
  },
  {
    id: 103, usdPrice: 12.00, img: food3,
    name: { ru: 'Паста Карбонара',  uz: 'Pasta Karbonara', en: 'Pasta Carbonara' },
    sub:  { ru: 'Сливочный соус',   uz: 'Kremli sous',     en: 'Creamy sauce' },
  },
  {
    id: 104, usdPrice: 14.00, img: food4,
    name: { ru: 'Пицца Маргарита', uz: 'Margarita Pitsa', en: 'Pizza Margherita' },
    sub:  { ru: 'Томат и базилик', uz: 'Pomidor, rayhon', en: 'Tomato & basil' },
  },
  {
    id: 105, usdPrice: 9.50, img: pizza1,
    name: { ru: 'Греческий салат', uz: 'Grek salati',     en: 'Greek Salad' },
    sub:  { ru: 'Фета и оливки',   uz: 'Feta va zaytun',  en: 'Feta & olives' },
  },
];

// ── Label kalitlari ───────────────────────────────────────────
const LABELS = {
  ru: {
    home: 'Главная',
    menu: 'Меню',
    description: 'Описание:',
    addToCart: 'В корзину',
    similar: 'Похожие:',
    favorite: 'В избранное',
  },
  uz: {
    home: 'Bosh sahifa',
    menu: 'Menyu',
    description: 'Tavsif:',
    addToCart: 'Savatga',
    similar: "O'xshash taomlar:",
    favorite: 'Sevimli',
  },
  en: {
    home: 'Home',
    menu: 'Menu',
    description: 'Description:',
    addToCart: 'Add to Cart',
    similar: 'Similar dishes:',
    favorite: 'Add to favorites',
  },
};

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { lang, priceFormat } = useLanguage();

  const L = LABELS[lang] || LABELS['ru'];

  const [qty, setQty] = useState(1);
  const [favorites, setFavorites] = useState({});
  const [startIndex, setStartIndex] = useState(0);

  const product = {
    id: id || 'burger-double',
    name:         PRODUCT_DATA.name[lang]        || PRODUCT_DATA.name.en,
    category:     PRODUCT_DATA.category[lang]    || PRODUCT_DATA.category.en,
    desc:         PRODUCT_DATA.desc[lang]        || PRODUCT_DATA.desc.en,
    reviewsCount: PRODUCT_DATA.reviewsLink[lang] || PRODUCT_DATA.reviewsLink.en,
    usdPrice:     4.00,
    img:          food1,
  };

  const handleQtyChange = (delta) => setQty((prev) => Math.max(1, prev + delta));

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) {
      addToCart({ ...product, price: product.usdPrice, numericPrice: product.usdPrice });
    }
  };

  const toggleFavorite = (prodId) => {
    setFavorites((prev) => ({ ...prev, [prodId]: !prev[prodId] }));
  };

  const nextSlide = () => setStartIndex((prev) => Math.min(prev + 1, SIMILAR_RAW.length - 4));
  const prevSlide = () => setStartIndex((prev) => Math.max(prev - 1, 0));
  const visibleSimilar = SIMILAR_RAW.slice(startIndex, startIndex + 4);

  return (
    <div className="product-detail-wrapper">
      <Header />

      <div className="product-detail-container">
        <img src={barg1} alt="" className="pd-leaf-left" />
        <img src={barg2} alt="" className="pd-leaf-right" />

        <div className="pd-glass-card">
          <img src={barg3} alt="" style={{ position: 'absolute', right: '-25px', top: '70px', width: '110px', opacity: 0.85, pointerEvents: 'none', zIndex: 0 }} />
          <img src={barg4} alt="" style={{ position: 'absolute', left: '-25px', bottom: '50px', width: '90px', opacity: 0.8, pointerEvents: 'none', zIndex: 0 }} />

          {/* Breadcrumb */}
          <div className="pd-breadcrumb">
            <Link to="/home">{L.home}</Link>
            <span>›</span>
            <Link to="/menu">{L.menu}</Link>
            <span>›</span>
            <span>{product.category}</span>
          </div>

          <h1 className="pd-main-title">{product.category}</h1>

          {/* Main Grid */}
          <div className="pd-grid">
            <div className="pd-image-box">
              <img src={product.img} alt={product.name} className="pd-main-img" />
            </div>

            <div className="pd-info-box">
              <h2 className="pd-title">{product.name}</h2>

              {/* Price & Rating */}
              <div className="pd-price-rating-row">
                <span className="pd-price">{priceFormat(product.usdPrice)}</span>
                <div className="pd-rating-wrap">
                  <div className="pd-stars">★★★★☆</div>
                  <span className="pd-rating-text">4.0</span>
                  <a href="#reviews" className="pd-reviews-link" onClick={(e) => e.preventDefault()}>
                    {product.reviewsCount}
                  </a>
                </div>
              </div>

              {/* Description */}
              <div className="pd-desc-label">{L.description}</div>
              <p className="pd-desc-text">{product.desc}</p>

              {/* Qty + Add to Cart */}
              <div className="pd-actions-row">
                <div className="pd-qty-picker">
                  <button className="pd-qty-btn" onClick={() => handleQtyChange(-1)}>−</button>
                  <span className="pd-qty-val">{qty}</span>
                  <button className="pd-qty-btn" onClick={() => handleQtyChange(1)}>+</button>
                </div>
                <button className="pd-add-btn" onClick={handleAddToCart}>
                  {L.addToCart}
                </button>
              </div>
            </div>
          </div>

          {/* Similar Products */}
          <div className="pd-similar-section">
            <h3 className="pd-similar-title">{L.similar}</h3>

            <div className="pd-carousel-wrapper">
              <button className="pd-carousel-arrow left" onClick={prevSlide} disabled={startIndex === 0}>‹</button>

              <div className="pd-similar-grid">
                {visibleSimilar.map((item) => (
                  <div key={item.id} className="pd-similar-card">
                    <div className="pd-similar-img-box">
                      <img src={item.img} alt={item.name[lang] || item.name.en} />
                    </div>

                    <div className="pd-similar-info">
                      <span className="pd-similar-name">{item.name[lang] || item.name.en}</span>
                      <span
                        className={`pd-similar-fav ${favorites[item.id] ? 'active' : ''}`}
                        onClick={() => toggleFavorite(item.id)}
                        title={L.favorite}
                      >
                        {favorites[item.id] ? '♥' : '♡'}
                      </span>
                    </div>

                    <div className="pd-similar-sub">{item.sub[lang] || item.sub.en}</div>

                    <div className="pd-similar-bottom">
                      <span className="pd-similar-price">{priceFormat(item.usdPrice)}</span>
                      <button
                        className="pd-similar-cart-btn"
                        onClick={() => addToCart({
                          ...item,
                          name: item.name[lang] || item.name.en,
                          price: item.usdPrice,
                          numericPrice: item.usdPrice,
                        })}
                        title={L.addToCart}
                      >
                        🛒
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button
                className="pd-carousel-arrow right"
                onClick={nextSlide}
                disabled={startIndex >= SIMILAR_RAW.length - 4}
              >›</button>
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}
