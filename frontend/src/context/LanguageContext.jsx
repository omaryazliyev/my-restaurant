import React, { createContext, useContext, useState } from 'react';
import translations from '../utils/translations';

const LanguageContext = createContext(null);

// Valyuta kurslari (USD base)
const CURRENCY = {
  uz: { symbol: "so'm", rate: 12700, suffix: true },  // 10$ → 127,000 so'm
  ru: { symbol: '₽',    rate: 90,    suffix: true },   // 10$ → 900 ₽
  en: { symbol: '$',    rate: 1,     suffix: false },  // 10$ → $10.00
};

function detectLanguage() {
  // 1) localStorage
  const saved = localStorage.getItem('lang');
  if (saved && translations[saved]) return saved;

  // 2) Browser tili
  const browserLang = (navigator.language || navigator.userLanguage || '').toLowerCase();
  if (browserLang.startsWith('uz')) return 'uz';
  if (browserLang.startsWith('ru')) return 'ru';
  if (browserLang.startsWith('en')) return 'en';

  // 3) Vaqt zonasi
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    if (tz.includes('Tashkent') || tz.includes('Samarkand')) return 'uz';
    if (
      tz.includes('Moscow') || tz.includes('Yekaterinburg') ||
      tz.includes('Novosibirsk') || tz.includes('Krasnoyarsk') ||
      tz.includes('Irkutsk') || tz.includes('Omsk')
    ) return 'ru';
  } catch (_) {}

  // 4) Default
  return 'ru';
}

/**
 * usdAmount — dollar qiymati (raqam)
 * Qaytaradi: "127 000 so'm" yoki "900 ₽" yoki "$10.00"
 */
export function formatPrice(usdAmount, lang) {
  const cur = CURRENCY[lang] || CURRENCY['ru'];
  const converted = usdAmount * cur.rate;

  let formatted;
  if (lang === 'en') {
    formatted = converted.toFixed(2);
  } else if (lang === 'ru') {
    formatted = Math.round(converted).toLocaleString('ru-RU');
  } else {
    // uz — so'm, bo'sh joy ajratuvchi
    formatted = Math.round(converted).toLocaleString('ru-RU');
  }

  return cur.suffix
    ? `${formatted} ${cur.symbol}`
    : `${cur.symbol}${formatted}`;
}

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(detectLanguage);

  const setLang = (newLang) => {
    if (!translations[newLang]) return;
    localStorage.setItem('lang', newLang);
    setLangState(newLang);
  };

  const t = translations[lang] || translations['ru'];

  // Narxni formatlash uchun qulay wrapper
  const priceFormat = (usdAmount) => formatPrice(usdAmount, lang);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, priceFormat }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
