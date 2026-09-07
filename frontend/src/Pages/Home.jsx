import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { reservationApi } from '../services/api';

import fod from '../assets/images/fod.png';
import barg1 from '../assets/images/barg1.png';
import barg2 from '../assets/images/barg2.png';
import barg3 from '../assets/images/barg3.png';
import barg4 from '../assets/images/barg4.png';
import barg5 from '../assets/images/barg5.png';
import barg6 from '../assets/images/barg6.png';
import barg7 from '../assets/images/barg7.png';
import barg8 from '../assets/images/barg8.png';
import leftArrow from '../assets/images/left.png';
import rightArrow from '../assets/images/right.png';
import food1 from '../assets/images/food1.png';
import food2 from '../assets/images/food2.png';
import food3 from '../assets/images/food3.png';
import food4 from '../assets/images/food4.png';
import heard from '../assets/images/heard.png';
import magazin from '../assets/images/magazin.png';
import krug from '../assets/images/krug.png';
import vilka from '../assets/images/vilka.png';
import pizza1 from '../assets/images/pizza1.png';
import soup from '../assets/images/soup.png';
import soup1 from '../assets/images/soup1.png';
import soup2 from '../assets/images/soup2.png';
import soup3 from '../assets/images/soup3.png';
import soup4 from '../assets/images/soup4.png';
import vector from '../assets/images/Vector.png';
import rasm1 from '../assets/images/rasm1.png';
import rasm2 from '../assets/images/rasm2.png';
import rasm3 from '../assets/images/rasm3.png';
import sergey from '../assets/images/sergey.png';

const popularDishes = [
  { id: 1, name: 'Chicken Soup', desc: 'Spicy with garlic', price: '$10.00', img: food1, type: 'card', imgClass: 'mini' },
  { id: 2, name: 'Beef Special', desc: 'Fresh & Tender', price: '$14.00', img: food2, type: 'card1', imgClass: 'big' },
  { id: 3, name: 'Pasta Carbonara', desc: 'Italian style', price: '$12.50', img: food3, type: 'card1', imgClass: 'big1' },
  { id: 4, name: 'Grilled Fish', desc: 'Lemon & Herbs', price: '$16.00', img: food4, type: 'card', imgClass: 'mini' },
];

const whyUsRows = [
  [
    { img: soup, style: {} },
    { img: soup1, style: { marginTop: '14px' } },
    { img: vector, style: { marginTop: '10px' } },
  ],
  [
    { img: soup2, style: {} },
    { img: soup3, style: { marginTop: '-12px' } },
    { img: soup4, style: {} },
  ],
];

const news = [{ img: rasm1 }, { img: rasm2 }, { img: rasm3 }];

export default function Home() {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const [bookingForm, setBookingForm] = useState({
    phone: '',
    guests: 2,
    date: '',
    time: '18:00',
    tableId: 1,
  });
  const [bookingStatus, setBookingStatus] = useState(null);
  const [bookingError, setBookingError] = useState('');
  const [submittingBooking, setSubmittingBooking] = useState(false);

  const handleBookingChange = (e) => {
    const { name, value } = e.target;
    setBookingForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleBookingSubmit = async (e) => {
    if (e) e.preventDefault();
    setBookingError('');
    setBookingStatus(null);

    if (!isAuthenticated) {
      setBookingError('Стол бронировать могут только авторизованные пользователи!');
      return;
    }
    if (!bookingForm.phone || !bookingForm.date) {
      setBookingError('Пожалуйста, заполните ваш номер и дату!');
      return;
    }

    setSubmittingBooking(true);
    try {
      const payload = {
        phone: bookingForm.phone,
        guests: Number(bookingForm.guests),
        tableId: Number(bookingForm.tableId),
        date: bookingForm.date,
        startTime: `${bookingForm.date}T${bookingForm.time}:00.000Z`,
      };

      await reservationApi.createReservation(payload);
      setBookingStatus('🎉 Стол успешно забронирован!');
      setBookingForm({ phone: '', guests: 2, date: '', time: '18:00', tableId: 1 });
    } catch (err) {
      setBookingError(err.message || 'Ошибка при бронировании стола');
    } finally {
      setSubmittingBooking(false);
    }
  };

  return (
    <div className="home-body">
      <div className="home-container">
        <Header />

        <main>
          {/* Section 1 - Hero */}
          <section className="s1">
            <div className="s1-main" style={{ marginTop: '79px' }}>
              <div className="s1-main-left">
                <h1>Вкусная еда ждет тебя!</h1>
                <Link to="/menu">
                  <button>Посмотреть меню</button>
                </Link>
              </div>
              <img src={fod} alt="food" />
            </div>
            <img className="barg1" src={barg1} alt="" />
            <img className="barg2" src={barg2} alt="" />
            <img className="barg3" src={barg3} alt="" />
            <img className="barg4-s1" src={barg4} alt="" />
          </section>

          {/* Section 2 - Popular Dishes */}
          <section className="s2">
            <h2>Популярные блюда</h2>
            <div className="cards-wrapper">
              <img src={leftArrow} alt="" style={{ width: 31, height: 31, cursor: 'pointer' }} />
              {popularDishes.map((dish) => (
                <div key={dish.id} className={dish.type}>
                  <div className={dish.imgClass}>
                    <img src={dish.img} alt={dish.name} />
                  </div>
                  <div className="card-main">
                    <h3>{dish.name}</h3>
                    <img src={heard} alt="Favorite" style={{ cursor: 'pointer' }} />
                  </div>
                  <p className="card-desc">{dish.desc}</p>
                  <div className="card-footer">
                    <span className="price">{dish.price}</span>
                    <div
                      className="magazin"
                      onClick={() => addToCart(dish)}
                      style={{ cursor: 'pointer' }}
                      title="Добавить в корзину"
                    >
                      <img src={magazin} alt="Cart" />
                    </div>
                  </div>
                </div>
              ))}
              <img src={rightArrow} alt="" style={{ width: 31, height: 31, cursor: 'pointer' }} />
            </div>
            <div className="s2-btn-row">
              <Link to="/menu">
                <button>Посмотреть меню</button>
              </Link>
            </div>
          </section>

          {/* Section 3 - Table Booking */}
          <section className="s3" id="s3-booking">
            <div className="s3-main">
              <div className="s3-left">
                <div className="im"><img src={krug} alt="" /></div>
                <div className="imm"><img src={vilka} alt="" /></div>
                <h4>Забронировать стол</h4>

                {bookingStatus && (
                  <div style={{ color: '#4caf50', backgroundColor: 'rgba(76, 175, 80, 0.15)', padding: '10px 14px', borderRadius: '8px', marginBottom: '15px', fontWeight: 'bold' }}>
                    {bookingStatus}
                  </div>
                )}

                {bookingError && (
                  <div style={{ color: '#ff4d4f', backgroundColor: 'rgba(255, 77, 79, 0.15)', padding: '10px 14px', borderRadius: '8px', marginBottom: '15px' }}>
                    {bookingError}
                  </div>
                )}

                <form onSubmit={handleBookingSubmit}>
                  <div className="inpu">
                    <div className="input-box">
                      <input
                        type="text"
                        name="phone"
                        required
                        value={bookingForm.phone}
                        onChange={handleBookingChange}
                        placeholder="Ваш номер"
                      />
                    </div>

                    <div className="input-box">
                      <input
                        type="number"
                        name="guests"
                        min="1"
                        max="20"
                        required
                        value={bookingForm.guests}
                        onChange={handleBookingChange}
                        placeholder="На сколько человек?"
                      />
                    </div>

                    <div className="input-box">
                      <input
                        type="date"
                        name="date"
                        required
                        value={bookingForm.date}
                        onChange={handleBookingChange}
                      />
                    </div>

                    <div className="input-box">
                      <input
                        type="time"
                        name="time"
                        required
                        value={bookingForm.time}
                        onChange={handleBookingChange}
                      />
                    </div>

                    <div className="input-box">
                      <select
                        name="tableId"
                        value={bookingForm.tableId}
                        onChange={handleBookingChange}
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.3)' }}
                      >
                        <option value="1" style={{ color: '#000' }}>Стол #1 (VIP)</option>
                        <option value="2" style={{ color: '#000' }}>Стол #2 (Окна)</option>
                        <option value="3" style={{ color: '#000' }}>Стол #3 (Терраса)</option>
                      </select>
                    </div>

                    <a href="#s3-booking" className="map-link">Выбрать места на карте</a>
                  </div>
                  <button type="submit" disabled={submittingBooking}>
                    {submittingBooking ? 'Бронирование...' : 'Забронировать'}
                  </button>
                </form>
              </div>
              <div className="s3-right">
                <img src={pizza1} alt="" />
              </div>
            </div>
            <img className="barg5" src={barg5} alt="" />
            <img className="barg6" src={barg6} alt="" />
            <img className="barg7" src={barg7} alt="" />
            <img className="barg8" src={barg8} alt="" />
          </section>

          {/* Section 4 - Why Us */}
          <section className="s4" id="s4-why-us">
            <h2>Почему именно мы?</h2>
            {whyUsRows.map((row, ri) => (
              <div className="items-row" key={ri}>
                {row.map((item, ii) => (
                  <div className="item" key={ii} style={item.style}>
                    <img src={item.img} alt="" />
                    <h4>Качественные продукты</h4>
                    <p>Входные билеты в музеи, для посещения достопримечательностей, памятников</p>
                  </div>
                ))}
              </div>
            ))}
          </section>

          {/* Section 5 - News */}
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

