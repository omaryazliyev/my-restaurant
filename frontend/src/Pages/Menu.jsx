import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Menu.css';
import '../styles/Home.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import { menuApi } from '../services/api';

import food2 from '../assets/images/food2.png';
import heard from '../assets/images/heard.png';
import magazin from '../assets/images/magazin.png';
import barg4 from '../assets/images/barg4.png';
import rasm1 from '../assets/images/rasm1.png';
import rasm2 from '../assets/images/rasm2.png';
import rasm3 from '../assets/images/rasm3.png';
import sergey from '../assets/images/sergey.png';

const fallbackCategories = ['Первые', 'Вторые', 'Салаты', 'Напитки', 'Фаст-Фуд'];

const fallbackMenuItems = Array(12).fill({
  id: 1,
  name: 'Chicken soup',
  description: 'Spicy with garlic',
  price: '$10.00',
  img: food2,
});

const news = [{ img: rasm1 }, { img: rasm2 }, { img: rasm3 }];

export default function Menu() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState(fallbackCategories);
  const [activeCategory, setActiveCategory] = useState('Первые');
  const [items, setItems] = useState(fallbackMenuItems);
  const [loading, setLoading] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await menuApi.getCategories();
        if (data && Array.isArray(data) && data.length > 0) {
          const catNames = data.map((c) => (typeof c === 'string' ? c : c.name));
          setCategories(catNames);
          if (catNames.length > 0) setActiveCategory(catNames[0]);
        }
      } catch (err) {
        console.warn('Categories API error:', err);
      }
    }
    loadCategories();
  }, []);

  useEffect(() => {
    async function loadItems() {
      setLoading(true);
      try {
        const data = await menuApi.getMenuItems(activeCategory);
        if (data && Array.isArray(data) && data.length > 0) {
          setItems(
            data.map((item) => ({
              ...item,
              img: item.image || food2,
              price: item.price ? `$${Number(item.price).toFixed(2)}` : '$10.00',
            }))
          );
        } else {
          setItems(fallbackMenuItems);
        }
      } catch {
        setItems(fallbackMenuItems);
      } finally {
        setLoading(false);
      }
    }
    loadItems();
  }, [activeCategory]);

  return (
    <div className="menu-body">
      <div className="menu-container">
        <Header showNav={true} />

        <main>
          <section className="s1-menu">
            <div className="page-breadcrumb" style={{ marginTop: '20px' }}>
              <Link className="glavni" to="/home">Главная &gt;</Link>
              <a className="menu-link" href="#">Меню</a>
            </div>

            <h1>Меню</h1>

            <div className="menyu1">
              <div className="menyu">
                {categories.map((cat) => (
                  <a
                    key={cat}
                    href="#"
                    className={activeCategory === cat ? 'pervi' : ''}
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveCategory(cat);
                    }}
                  >
                    {cat}
                  </a>
                ))}
              </div>
            </div>

            {/* Cards grid */}
            {loading ? (
              <div style={{ textAlign: 'center', color: '#ffb703', padding: '40px', fontSize: '18px' }}>
                Загрузка блюд...
              </div>
            ) : (
              <div className="menu-cards">
                {items.map((item, i) => (
                  <div
                    className="card1"
                    key={item.id || i}
                    onClick={() => navigate(`/product/${item.id || i}`)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="big">
                      <img src={item.img || food2} alt={item.name} />
                    </div>
                    <div className="menu-card-main">
                      <h3>{item.name}</h3>
                      <img
                        src={heard}
                        alt="Favorite"
                        style={{ cursor: 'pointer' }}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    <p>{item.description || item.desc}</p>
                    <div className="menu-card-footer">
                      <span className="price">{item.price}</span>
                      <div
                        className="magazin"
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(item);
                        }}
                        style={{ cursor: 'pointer' }}
                        title="Добавить в корзину"
                      >
                        <img src={magazin} alt="Cart" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <img className="barg4-menu" src={barg4} alt="" />
          </section>

          {/* News section */}
          <section className="s5">
            <h2>Новости/Галерея</h2>
            <div className="galareya">
              {news.map((n, i) => (
                <div className="gala" key={i}>
                  <div className="gala-img"><img src={n.img} alt="" /></div>
                  <p>Используйте гибкие структуры, чтобы предоставить надежный обзор для обзоров высокого уровня. Итеративные подходы к данным корпоративной.</p>
                  <div className="gala-author">
                    <img src={sergey} alt="" />
                    <h5>Сергей</h5>
                  </div>
                </div>
              ))}
            </div>
            <div className="pros">
              <button>Посмотреть все</button>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </div>
  );
}

