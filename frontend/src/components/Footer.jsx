import React from 'react';
import logo from '../assets/images/logo.png';

export default function Footer() {
  return (
    <footer className="w-full bg-white/50 backdrop-blur-md py-[76px] px-[20px] md:px-[140px]">
      <div className="flex flex-col md:flex-row justify-between items-start w-full">
        
        {/* LOGO Column */}
        <div className="flex flex-col mb-8 md:mb-0">
          <img src={logo} alt="Logo" className="w-[120px] object-contain" />
        </div>

        {/* Наши услуги Column */}
        <div className="flex flex-col gap-4">
          <h3 className="text-[20px] font-bold text-black">Наши услуги</h3>
          <ul className="flex flex-col gap-2">
            <li><a href="#" className="text-[14px] font-medium text-black hover:text-black/70">Цены</a></li>
            <li><a href="#" className="text-[14px] font-medium text-black hover:text-black/70">Отслеживание</a></li>
            <li><a href="#" className="text-[14px] font-medium text-black hover:text-black/70">Cообщить об ошибке</a></li>
            <li><a href="#" className="text-[14px] font-medium text-black hover:text-black/70">Условия услуг</a></li>
          </ul>
        </div>

        {/* Наша компания Column */}
        <div className="flex flex-col gap-4">
          <h3 className="text-[20px] font-bold text-black">Наша компания</h3>
          <ul className="flex flex-col gap-2">
            <li><a href="#" className="text-[14px] font-medium text-black hover:text-black/70">Отчетность</a></li>
            <li><a href="#" className="text-[14px] font-medium text-black hover:text-black/70">Cвяжитесь с нами</a></li>
            <li><a href="#" className="text-[14px] font-medium text-black hover:text-black/70">Управление</a></li>
          </ul>
        </div>

        {/* Адрес Column */}
        <div className="flex flex-col gap-4">
          <h3 className="text-[20px] font-bold text-black">Адрес</h3>
          <ul className="flex flex-col gap-2">
            <li><span className="text-[14px] font-medium text-black">Узбекистан, Ташкент <br /> Улица, 24</span></li>
            <li><a href="tel:+99894848844848" className="text-[14px] font-medium text-black hover:text-black/70">+99894848844848</a></li>
            <li><a href="mailto:info@bmgsoft.com" className="text-[14px] font-medium text-black hover:text-black/70">info@bmgsoft.com</a></li>
          </ul>
        </div>

      </div>
    </footer>
  );
}
