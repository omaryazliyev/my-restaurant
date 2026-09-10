import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Home.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CustomSelect from '../components/CustomSelect';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
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
import wineGlassesImg from '../assets/images/wine_glasses.png';

const popularDishes = [
  {
    id: 1,
    name: { ru: 'Куриный суп', uz: "Tovuq sho'rva", en: 'Chicken Soup' },
    desc: { ru: 'Острый с чесноком', uz: 'Sarimsoqli achchiq', en: 'Spicy with garlic' },
    usdPrice: 10.00,
    img: food1,
    type: 'card',
    imgClass: 'mini',
  },
  {
    id: 2,
    name: { ru: 'Говядина-Специал', uz: "Maxsus mol go'shti", en: 'Beef Special' },
    desc: { ru: 'Нежная и сочная', uz: 'Yumshoq va mazali', en: 'Fresh & Tender' },
    usdPrice: 14.00,
    img: food2,
    type: 'card1',
    imgClass: 'big',
  },
  {
    id: 3,
    name: { ru: 'Паста Карбонара', uz: 'Pasta Karbonara', en: 'Pasta Carbonara' },
    desc: { ru: 'В итальянском стиле', uz: 'Italyancha uslubda', en: 'Italian style' },
    usdPrice: 12.50,
    img: food3,
    type: 'card1',
    imgClass: 'big1',
  },
  {
    id: 4,
    name: { ru: 'Рыба на гриле', uz: 'Grilda baliq', en: 'Grilled Fish' },
    desc: { ru: 'С лимоном и травами', uz: 'Limon va ko\'katlar', en: 'Lemon & Herbs' },
    usdPrice: 16.00,
    img: food4,
    type: 'card',
    imgClass: 'mini',
  },
];

const whyUsRows = [
  [
    {
      img: soup,
      style: {},
      title: { ru: 'Свежая еда', uz: 'Yangi taomlar', en: 'Fresh Food' },
      desc: {
        ru: 'Качественные и натуральные продукты высшего качества для каждого блюда',
        uz: 'Har bir taom uchun yuqori sifatli va tabiiy yangi mahsulotlar',
        en: 'Quality and natural ingredients of the highest standard for every dish',
      },
    },
    {
      img: soup1,
      style: { marginTop: '14px' },
      title: { ru: 'Быстрая доставка', uz: 'Tezkor yetkazib berish', en: 'Fast Delivery' },
      desc: {
        ru: 'Быстрая и аккуратная доставка прямо к вашему порогу в горячем виде',
        uz: 'Issiq va xushbo\'y holda to\'g\'ridan-to\'g\'ri eshigingizgacha yetkazish',
        en: 'Fast and careful delivery right to your door while still hot',
      },
    },
    {
      img: vector,
      style: { marginTop: '10px' },
      title: { ru: 'Авторские рецепты', uz: 'Mualliflik retseptlari', en: 'Signature Recipes' },
      desc: {
        ru: 'Уникальные блюда от наших шеф-поваров с неповторимым вкусом',
        uz: 'Bosh oshpazlarimizdan betakror ta\'mga ega o\'ziga xos taomlar',
        en: 'Unique dishes from our executive chefs with extraordinary flavor',
      },
    },
  ],
  [
    {
      img: soup2,
      style: {},
      title: { ru: 'Уютная атмосфера', uz: 'Shinam muhit', en: 'Cozy Atmosphere' },
      desc: {
        ru: 'Комфортный интерьер и приятная музыка для отдыха с близкими',
        uz: 'Yaqinlaringiz bilan hordiq chiqarish uchun qulay interyer va yoqimli musiqa',
        en: 'Comfortable interior and pleasant music for relaxing with loved ones',
      },
    },
    {
      img: soup3,
      style: { marginTop: '-12px' },
      title: { ru: 'Лучшие повара', uz: 'Eng yaxshi oshpazlar', en: 'Master Chefs' },
      desc: {
        ru: 'Профессиональная команда с многолетним кулинарным опытом',
        uz: 'Ko\'p yillik oshpazlik tajribasiga ega professional jamoa',
        en: 'Professional team with many years of culinary experience',
      },
    },
    {
      img: soup4,
      style: {},
      title: { ru: 'Забота о клиентах', uz: 'Mijozlarga g\'amxo\'rlik', en: 'Caring Service' },
      desc: {
        ru: 'Внимательный персонал и индивидуальный подход к каждому гостю',
        uz: 'Har bir mehmonga e\'tiborli xodimlar va individual yondashuv',
        en: 'Attentive staff and a personalized approach for every guest',
      },
    },
  ],
];

const news = [{ img: rasm1 }, { img: rasm2 }, { img: rasm3 }];

export default function Home() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { t, lang, priceFormat } = useLanguage();

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
      setBookingError(t.needLoginToBook);
      return;
    }
    if (!bookingForm.phone || !bookingForm.date) {
      setBookingError('Пожалуйста, заполните ваш номер и дату!');
      return;
    }

    setSubmittingBooking(true);
    /*
    // Backend API vaqtincha izohga olindi:
    try {
      const payload = {
        phone: bookingForm.phone,
        guests: Number(bookingForm.guests),
        tableId: Number(bookingForm.tableId),
        date: bookingForm.date,
        startTime: `${bookingForm.date}T${bookingForm.time}:00.000Z`,
      };
      await reservationApi.createReservation(payload);
    } catch (err) { ... }
    */
    setTimeout(() => {
      setBookingStatus('🎉 Стол успешно забронирован!');
      setBookingForm({ phone: '', guests: 2, date: '', time: '18:00', tableId: 1 });
      setSubmittingBooking(false);
    }, 400);
  };

  return (
    <div className="home-body">
      <Header />
      <div className="home-container">
        <main>
          {/* Section 1 - Hero */}
          <section className="s1">
            <div className="s1-main" style={{ marginTop: '79px' }}>
              <div className="s1-main-left">
                <h1>{t.heroTitle}</h1>
                <Link to="/menu">
                  <button>{t.viewMenuBtn}</button>
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
            <h2>{t.popularDishes}</h2>
            <div className="cards-wrapper">
              <img src={leftArrow} alt="" style={{ width: 31, height: 31, cursor: 'pointer' }} />
              {popularDishes.map((dish) => (
                <div
                  key={dish.id}
                  className={dish.type}
                  onClick={() => navigate(`/product/${dish.id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className={dish.imgClass}>
                    <img src={dish.img} alt={dish.name[lang] || dish.name.ru} />
                  </div>
                  <div className="card-main">
                    <h3>{dish.name[lang] || dish.name.ru}</h3>
                  </div>
                  <p className="card-desc">{dish.desc[lang] || dish.desc.ru}</p>
                  <div className="card-footer">
                    <span className="price">{priceFormat(dish.usdPrice)}</span>
                    <div
                      className="magazin"
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart({
                          ...dish,
                          name: dish.name[lang] || dish.name.ru,
                          price: dish.usdPrice,
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
              <img src={rightArrow} alt="" style={{ width: 31, height: 31, cursor: 'pointer' }} />
            </div>
            <div className="s2-btn-row">
              <Link to="/menu">
                <button>{t.viewMenuBtn}</button>
              </Link>
            </div>
          </section>

          {/* Section 3 - Table Booking */}
          <section className="s3" id="s3-booking">
            <div className="s3-main">
              <div className="s3-left">
                <div className="im"><img src={krug} alt="" /></div>
                <div className="imm"><img src={vilka} alt="" /></div>
                <h4>{t.bookTable}</h4>

                {bookingStatus && (
                  <div style={{ color: '#4caf50', backgroundColor: 'rgba(76, 175, 80, 0.15)', padding: '10px 14px', borderRadius: '8px', marginBottom: '15px', fontWeight: 'bold' }}>
                    {bookingStatus}
                  </div>
                )}

                {bookingError && (
                  <div style={{ color: '#ff4d4f', backgroundColor: 'rgba(255, 77, 79, 0.15)', padding: '12px 16px', borderRadius: '10px', marginBottom: '15px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                    <span>{bookingError}</span>
                    {!isAuthenticated && (
                      <button
                        type="button"
                        onClick={() => navigate('/login')}
                        style={{
                          backgroundColor: '#000', color: '#fff', border: 'none',
                          padding: '6px 14px', borderRadius: '8px', cursor: 'pointer',
                          fontSize: '13px', fontWeight: 'bold',
                        }}
                      >
                        {t.login} →
                      </button>
                    )}
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
                        placeholder={t.yourNumber}
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
                        placeholder={t.howManyGuests}
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
                      <CustomSelect
                        value={String(bookingForm.tableId)}
                        onChange={(val) => setBookingForm((p) => ({ ...p, tableId: Number(val) }))}
                        variant="light"
                        placeholder={t.selectTable}
                        options={[
                          { value: '1', label: `🪑 ${t.table} #1 (VIP)` },
                          { value: '2', label: `🪟 ${t.table} #2` },
                          { value: '3', label: `🌿 ${t.table} #3` },
                        ]}
                      />
                    </div>

                    <a href="#s3-booking" className="map-link">{t.chooseOnMap}</a>
                  </div>
                  <button type="submit" disabled={submittingBooking}>
                    {submittingBooking ? t.sending : t.bookBtn}
                  </button>
                </form>
              </div>
              <div className="s3-right">
                <img src={wineGlassesImg} alt="Wine glasses" />
              </div>
            </div>
            <img className="barg5" src={barg5} alt="" />
            <img className="barg6" src={barg6} alt="" />
            <img className="barg7" src={barg7} alt="" />
            <img className="barg8" src={barg8} alt="" />
          </section>

          {/* Section 4 - Why Us */}
          <section className="s4" id="s4-why-us">
            <h2>{t.whyUs || 'Почему именно мы?'}</h2>
            {whyUsRows.map((row, ri) => (
              <div className="items-row" key={ri}>
                {row.map((item, ii) => (
                  <div className="item" key={ii} style={item.style}>
                    <img src={item.img} alt="" />
                    <h4>{item.title ? (item.title[lang] || item.title.ru) : (t.qualityProducts || 'Качественные продукты')}</h4>
                    <p>{item.desc ? (item.desc[lang] || item.desc.ru) : (t.qualityDesc || 'Входные билеты в музеи, для посещения достопримечательностей, памятников')}</p>
                  </div>
                ))}
              </div>
            ))}
          </section>

          {/* Section 5 - News */}
          <section className="s5">
            <h2>{t.newsTitle}</h2>
            <div className="galareya">
              {news.map((n, i) => (
                <div className="gala" key={i}>
                  <div className="gala-img"><img src={n.img} alt="" /></div>
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

