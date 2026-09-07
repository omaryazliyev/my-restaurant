import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import '../styles/ProductDetail.css';

// Leaf Images
import barg1 from '../assets/images/barg1.png';
import barg2 from '../assets/images/barg2.png';
import barg3 from '../assets/images/barg3.png';
import barg4 from '../assets/images/barg4.png';

// Food images
import food1 from '../assets/images/food1.png';
import food2 from '../assets/images/food2.png';
import food3 from '../assets/images/food3.png';
import food4 from '../assets/images/food4.png';
import pizza1 from '../assets/images/pizza1.png';

// Similar items data
const SIMILAR_PRODUCTS = [
  { id: 101, name: 'Chicken soup', sub: 'Spicy with garlic', price: '$10.00', img: food2 },
  { id: 102, name: 'Chicken soup', sub: 'Spicy with garlic', price: '$10.00', img: food1 },
  { id: 103, name: 'Chicken soup', sub: 'Spicy with garlic', price: '$10.00', img: food3 },
  { id: 104, name: 'Chicken soup', sub: 'Spicy with garlic', price: '$10.00', img: food4 },
  { id: 105, name: 'Chicken soup', sub: 'Spicy with garlic', price: '$10.00', img: pizza1 },
];

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [qty, setQty] = useState(1);
  const [favorites, setFavorites] = useState({});
  const [startIndex, setStartIndex] = useState(0);

  // Main Product details matching Figma screenshot
  const product = {
    id: id || 'burger-double',
    name: 'Дабл бургер',
    category: 'Бургер',
    price: '$4.00',
    numericPrice: 4.0,
    rating: 4.0,
    reviewsCount: '(Смотреть отзывы)',
    img: food1, // High resolution burger/food image
    desc: 'Эти двусторонние шелковые брюки с запахом икат сочетают в себе универсальность двух потрясающих рисунков ткани. Эти брюки, изготовленные из очаровательной ткани икат, позволят вам выбрать предпочтительный узор, что делает их универсальным дополнением к вашему гардеробу.',
  };

  const handleQtyChange = (delta) => {
    setQty((prev) => Math.max(1, prev + delta));
  };

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) {
      addToCart(product);
    }
  };

  const toggleFavorite = (prodId) => {
    setFavorites((prev) => ({ ...prev, [prodId]: !prev[prodId] }));
  };

  const nextSlide = () => {
    setStartIndex((prev) => Math.min(prev + 1, SIMILAR_PRODUCTS.length - 4));
  };

  const prevSlide = () => {
    setStartIndex((prev) => Math.max(prev - 1, 0));
  };

  const visibleSimilar = SIMILAR_PRODUCTS.slice(startIndex, startIndex + 4);

  return (
    <div className="product-detail-wrapper">
      <Header />

      <div className="product-detail-container">
        {/* Decorative Leaves */}
        <img src={barg1} alt="" className="pd-leaf-left" />
        <img src={barg2} alt="" className="pd-leaf-right" />

        <div className="pd-glass-card">
          <img
            src={barg3}
            alt=""
            style={{
              position: 'absolute', right: '-25px', top: '70px',
              width: '110px', opacity: 0.85, pointerEvents: 'none', zIndex: 0
            }}
          />
          <img
            src={barg4}
            alt=""
            style={{
              position: 'absolute', left: '-25px', bottom: '50px',
              width: '90px', opacity: 0.8, pointerEvents: 'none', zIndex: 0
            }}
          />

          {/* Breadcrumb */}
          <div className="pd-breadcrumb">
            <Link to="/home">Главная</Link>
            <span>›</span>
            <Link to="/menu">Меню</Link>
            <span>›</span>
            <span>{product.category}</span>
          </div>

          {/* Main Title */}
          <h1 className="pd-main-title">{product.category}</h1>

          {/* 2 Column Details */}
          <div className="pd-grid">
            {/* Left: Image */}
            <div className="pd-image-box">
              <img src={product.img} alt={product.name} className="pd-main-img" />
            </div>

            {/* Right: Product Info */}
            <div className="pd-info-box">
              <h2 className="pd-title">{product.name}</h2>

              {/* Price & Rating */}
              <div className="pd-price-rating-row">
                <span className="pd-price">{product.price}</span>
                <div className="pd-rating-wrap">
                  <div className="pd-stars">★★★★☆</div>
                  <span className="pd-rating-text">4,0</span>
                  <a href="#reviews" className="pd-reviews-link" onClick={(e) => e.preventDefault()}>
                    {product.reviewsCount}
                  </a>
                </div>
              </div>

              {/* Description */}
              <div className="pd-desc-label">Описание:</div>
              <p className="pd-desc-text">{product.desc}</p>

              {/* Quantity & Add to Cart */}
              <div className="pd-actions-row">
                <div className="pd-qty-picker">
                  <button className="pd-qty-btn" onClick={() => handleQtyChange(-1)}>−</button>
                  <span className="pd-qty-val">{qty}</span>
                  <button className="pd-qty-btn" onClick={() => handleQtyChange(1)}>+</button>
                </div>

                <button className="pd-add-btn" onClick={handleAddToCart}>
                  В корзину
                </button>
              </div>
            </div>
          </div>

          {/* Similar Products Carousel */}
          <div className="pd-similar-section">
            <h3 className="pd-similar-title">Похожие:</h3>

            <div className="pd-carousel-wrapper">
              <button className="pd-carousel-arrow left" onClick={prevSlide} disabled={startIndex === 0}>
                ‹
              </button>

              <div className="pd-similar-grid">
                {visibleSimilar.map((item) => (
                  <div key={item.id} className="pd-similar-card">
                    <div className="pd-similar-img-box">
                      <img src={item.img} alt={item.name} />
                    </div>

                    <div className="pd-similar-info">
                      <span className="pd-similar-name">{item.name}</span>
                      <span
                        className={`pd-similar-fav ${favorites[item.id] ? 'active' : ''}`}
                        onClick={() => toggleFavorite(item.id)}
                        title="В избранное"
                      >
                        {favorites[item.id] ? '♥' : '♡'}
                      </span>
                    </div>

                    <div className="pd-similar-sub">{item.sub}</div>

                    <div className="pd-similar-bottom">
                      <span className="pd-similar-price">{item.price}</span>
                      <button
                        className="pd-similar-cart-btn"
                        onClick={() => addToCart(item)}
                        title="Добавить в корзину"
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
                disabled={startIndex >= SIMILAR_PRODUCTS.length - 4}
              >
                ›
              </button>
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}
