import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { menuApi } from '../services/api';
import '../styles/ProductDetail.css';

import barg1 from '../assets/images/barg1.png';
import barg2 from '../assets/images/barg2.png';
import barg3 from '../assets/images/barg3.png';
import barg4 from '../assets/images/barg4.png';
import food1 from '../assets/images/food1.png';
import food2 from '../assets/images/food2.png';
import food3 from '../assets/images/food3.png';
import food4 from '../assets/images/food4.png';
import rasm1 from '../assets/images/rasm1.png';
import rasm2 from '../assets/images/rasm2.png';
import pizza1 from '../assets/images/pizza1.jpg';

const ALL_STATIC_DISHES = [
  { id: 1, name: "Tovuq sho'rva", category: 'Birinchi taomlar', price: 127000, img: food1, desc: "Xushbo'y ziravorlar va yangi tovuq go'shtidan tayyorlangan mazali sho'rva." },
  { id: 2, name: "Qo'ziqorin kremi", category: 'Birinchi taomlar', price: 152400, img: food2, desc: "Qaymoqli qo'ziqorin kremi pishirig'i." },
  { id: 3, name: "Pomidor sho'rva", category: 'Birinchi taomlar', price: 120650, img: food3, desc: "Qovurilgan pomidor va rayhonli sho'rva." },
  { id: 4, name: "Mol go'shtli bulyon", category: 'Birinchi taomlar', price: 139700, img: food4, desc: "Sekin qaynatilgan haqiqiy mol go'shtli bulyon." },
  { id: 101, name: "Maxsus mol go'shti", category: 'Ikkinchi taomlar', price: 228600, img: food2, desc: "Tandirda pishirilgan yumshoq mol go'shti va sabzavotlar." },
  { id: 102, name: "Losos biftek", category: 'Ikkinchi taomlar', price: 279400, img: food3, desc: "Grilda tayyorlangan yangi losos baliq bifteki." },
  { id: 103, name: "Pasta Karbonara", category: 'Ikkinchi taomlar', price: 177800, img: food3, desc: "Kremli parmezan va bekon sousli italyan pastasi." },
  { id: 201, name: "Sezar salati", category: 'Salatlar', price: 114300, img: rasm1, desc: "Tovuq ko'kragi, romano salati va sezar sousi." },
  { id: 202, name: "Grek salati", category: 'Salatlar', price: 120650, img: food4, desc: "Feta pishlog'i, zaytun va yangi bodringlar." },
  { id: 301, name: "Limon limonadi", category: 'Ichimliklar', price: 63500, img: rasm2, desc: "Yangi siqilgan limon va yalpizli muzday limonad." },
  { id: 302, name: "Mevali Mohito", category: 'Ichimliklar', price: 82550, img: food2, desc: "O'rmon mevalari va muz bilan tayyorlangan salqin ichimlik." },
  { id: 401, name: "Margarita Pitsa", category: 'Fast-Food', price: 177800, img: pizza1, desc: "Motsarella pishloq, yangi pomidor va rayhonli qarsillama pitsa." },
  { id: 402, name: "BBQ Burger", category: 'Fast-Food', price: 152400, img: food2, desc: "Shirali mol go'shti kotleti va bbq sousli burger." },
];

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

  const L = LABELS[lang] || LABELS['uz'];

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [favorites, setFavorites] = useState({});
  const [startIndex, setStartIndex] = useState(0);

  useEffect(() => {
    loadProductDetail();
  }, [id]);

  const loadProductDetail = async () => {
    setLoading(true);
    let found = null;

    // 1. Fetch from backend API
    try {
      if (id) {
        const res = await menuApi.getMenuItemById(id).catch(() => null);
        if (res && res.name) {
          found = {
            id: res.id,
            name: res.name,
            category: res.category?.name || 'Taomlar',
            desc: res.description || 'Xushbo\'y ziravorlar va sifatli masaliqlardan tayyorlangan mazali taom.',
            price: Number(res.price),
            img: res.image || food1,
          };
        }
      }
    } catch (err) {
      console.warn("Backend getMenuItemById error:", err.message);
    }

    // 2. Check localStorage custom_menu_items cache
    if (!found && id) {
      const cached = localStorage.getItem('custom_menu_items');
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          const match = parsed.find(item => String(item.id) === String(id));
          if (match) {
            found = {
              id: match.id,
              name: match.name,
              category: match.category || 'Taomlar',
              desc: match.description || 'Xushbo\'y ziravorlar va sifatli masaliqlardan tayyorlangan mazali taom.',
              price: Number(match.price),
              img: match.image || food1,
            };
          }
        } catch (e) {
          console.warn("Cached menu error:", e);
        }
      }
    }

    // 3. Check ALL_STATIC_DISHES
    if (!found) {
      const match = ALL_STATIC_DISHES.find(s => String(s.id) === String(id));
      if (match) {
        found = match;
      } else {
        found = ALL_STATIC_DISHES[0];
      }
    }

    setProduct(found);
    setLoading(false);
  };

  const handleQtyChange = (delta) => setQty((prev) => Math.max(1, prev + delta));

  const handleAddToCart = () => {
    if (!product) return;
    const itemPrice = product.price > 100 ? product.price / 12700 : product.price;
    for (let i = 0; i < qty; i++) {
      addToCart({
        ...product,
        name: product.name,
        price: itemPrice,
        numericPrice: product.price
      });
    }
  };

  const toggleFavorite = (prodId) => {
    setFavorites((prev) => ({ ...prev, [prodId]: !prev[prodId] }));
  };

  // Similar dishes list filtered by category
  const similarItems = ALL_STATIC_DISHES.filter(d => String(d.id) !== String(product?.id));
  const visibleSimilar = similarItems.slice(startIndex, startIndex + 4);

  const nextSlide = () => setStartIndex((prev) => Math.min(prev + 1, similarItems.length - 4));
  const prevSlide = () => setStartIndex((prev) => Math.max(prev - 1, 0));

  if (loading || !product) {
    return (
      <div className="product-detail-wrapper">
        <Header />
        <div className="product-detail-container" style={{ textAlign: 'center', padding: '100px 20px', color: '#888' }}>
          🔄 Taom ma'lumotlari yuklanmoqda...
        </div>
        <Footer />
      </div>
    );
  }

  const displayPriceText = priceFormat(product.price > 100 ? product.price / 12700 : product.price);

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
            <span>{product.name}</span>
          </div>

          <h1 className="pd-main-title">{product.name}</h1>

          {/* Main Grid */}
          <div className="pd-grid">
            <div className="pd-image-box">
              <img
                src={product.img}
                alt={product.name}
                className="pd-main-img"
                onError={(e) => { e.target.src = food1; }}
              />
            </div>

            <div className="pd-info-box">
              <h2 className="pd-title">{product.name}</h2>

              {/* Price & Rating */}
              <div className="pd-price-rating-row">
                <span className="pd-price">{displayPriceText}</span>
                <div className="pd-rating-wrap">
                  <div className="pd-stars">★★★★☆</div>
                  <span className="pd-rating-text">4.8</span>
                  <span className="pd-reviews-link">
                    (Sharhlarni ko'rish)
                  </span>
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
                  <div key={item.id} className="pd-similar-card" onClick={() => navigate(`/product/${item.id}`)} style={{ cursor: 'pointer' }}>
                    <div className="pd-similar-img-box">
                      <img src={item.img} alt={item.name} onError={(e) => { e.target.src = food1; }} />
                    </div>

                    <div className="pd-similar-info">
                      <span className="pd-similar-name">{item.name}</span>
                      <span
                        className={`pd-similar-fav ${favorites[item.id] ? 'active' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(item.id);
                        }}
                        title={L.favorite}
                      >
                        {favorites[item.id] ? '♥' : '♡'}
                      </span>
                    </div>

                    <div className="pd-similar-sub">{item.category}</div>

                    <div className="pd-similar-bottom">
                      <span className="pd-similar-price">{priceFormat(item.price > 100 ? item.price / 12700 : item.price)}</span>
                      <button
                        className="pd-similar-cart-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart({
                            ...item,
                            name: item.name,
                            price: item.price > 100 ? item.price / 12700 : item.price,
                            numericPrice: item.price,
                          });
                        }}
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
                disabled={startIndex >= similarItems.length - 4}
              >›</button>
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}
