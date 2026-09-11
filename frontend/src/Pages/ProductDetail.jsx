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

const LABELS = {
  ru: { home: 'Главная', menu: 'Меню', description: 'Описание:', addToCart: 'В корзину', similar: 'Похожие блюда:', favorite: 'В избранное' },
  uz: { home: 'Bosh sahifa', menu: 'Menyu', description: 'Tavsif:', addToCart: 'Savatga', similar: "O'xshash taomlar:", favorite: 'Sevimli' },
  en: { home: 'Home', menu: 'Menu', description: 'Description:', addToCart: 'Add to Cart', similar: 'Similar dishes:', favorite: 'Favorites' },
};

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { lang, priceFormat } = useLanguage();

  const L = LABELS[lang] || LABELS['uz'];

  const [product, setProduct] = useState(null);
  const [similarItems, setSimilarItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [favorites, setFavorites] = useState({});
  const [startIndex, setStartIndex] = useState(0);

  useEffect(() => {
    if (id) loadProduct();
  }, [id]);

  const loadProduct = async () => {
    setLoading(true);
    try {
      // 1. Backenddan shu ID bo'yicha taomni olish
      const res = await menuApi.getMenuItemById(id).catch(() => null);
      if (res && res.name) {
        const usdPrice = Number(res.price) > 100
          ? Number(res.price) / 12700
          : Number(res.price);

        setProduct({
          id: res.id,
          name: res.name,
          category: res.category?.name || '',
          desc: res.description || '',
          price: Number(res.price),
          usdPrice,
          img: res.image || food1,
        });

        // 2. O'xshash taomlar — bir xil kategoriyadan boshqalari
        const allData = await menuApi.getMenuItems().catch(() => []);
        if (Array.isArray(allData)) {
          const similar = allData
            .filter(d => String(d.id) !== String(id))
            .map(d => ({
              id: d.id,
              name: d.name,
              category: d.category?.name || '',
              desc: d.description || '',
              price: Number(d.price),
              usdPrice: Number(d.price) > 100 ? Number(d.price) / 12700 : Number(d.price),
              img: d.image || food1,
            }));
          setSimilarItems(similar);
        }
      } else {
        // Backend javob bermasa — 404
        setProduct(null);
      }
    } catch (err) {
      console.warn('ProductDetail error:', err);
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  const handleQtyChange = (delta) => setQty(prev => Math.max(1, prev + delta));

  const handleAddToCart = () => {
    if (!product) return;
    for (let i = 0; i < qty; i++) {
      addToCart({
        id: product.id,
        name: product.name,
        img: product.img,
        price: product.usdPrice,
        usdPrice: product.usdPrice,
      });
    }
  };

  const toggleFavorite = (prodId) => setFavorites(prev => ({ ...prev, [prodId]: !prev[prodId] }));

  const visibleSimilar = similarItems.slice(startIndex, startIndex + 4);
  const nextSlide = () => setStartIndex(prev => Math.min(prev + 1, Math.max(0, similarItems.length - 4)));
  const prevSlide = () => setStartIndex(prev => Math.max(prev - 1, 0));

  if (loading) {
    return (
      <div className="product-detail-wrapper">
        <Header />
        <div className="product-detail-container" style={{ textAlign: 'center', padding: '100px 20px', color: '#888' }}>
          🔄 Yuklanmoqda...
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-detail-wrapper">
        <Header />
        <div className="product-detail-container" style={{ textAlign: 'center', padding: '100px 20px', color: '#888' }}>
          <h2>Taom topilmadi</h2>
          <button onClick={() => navigate('/menu')} style={{ marginTop: 20, padding: '12px 30px', borderRadius: 12, background: '#ffb703', border: 'none', fontWeight: 700, cursor: 'pointer' }}>
            Menyuga qaytish
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const displayPriceText = priceFormat(product.usdPrice);

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
                  <span className="pd-reviews-link">(Sharhlarni ko'rish)</span>
                </div>
              </div>

              {/* Description */}
              <div className="pd-desc-label">{L.description}</div>
              <p className="pd-desc-text">{product.desc || "Xushbo'y ziravorlar va sifatli masaliqlardan tayyorlangan mazali taom."}</p>

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
          {similarItems.length > 0 && (
            <div className="pd-similar-section">
              <h3 className="pd-similar-title">{L.similar}</h3>

              <div className="pd-carousel-wrapper">
                <button className="pd-carousel-arrow left" onClick={prevSlide} disabled={startIndex === 0}>‹</button>

                <div className="pd-similar-grid">
                  {visibleSimilar.map((item) => (
                    <div
                      key={item.id}
                      className="pd-similar-card"
                      onClick={() => navigate(`/product/${item.id}`)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="pd-similar-img-box">
                        <img src={item.img} alt={item.name} onError={(e) => { e.target.src = food1; }} />
                      </div>

                      <div className="pd-similar-info">
                        <span className="pd-similar-name">{item.name}</span>
                        <span
                          className={`pd-similar-fav ${favorites[item.id] ? 'active' : ''}`}
                          onClick={(e) => { e.stopPropagation(); toggleFavorite(item.id); }}
                          title={L.favorite}
                        >
                          {favorites[item.id] ? '♥' : '♡'}
                        </span>
                      </div>

                      <div className="pd-similar-sub">{item.category}</div>

                      <div className="pd-similar-bottom">
                        <span className="pd-similar-price">{priceFormat(item.usdPrice)}</span>
                        <button
                          className="pd-similar-cart-btn"
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
          )}

        </div>
      </div>

      <Footer />
    </div>
  );
}
