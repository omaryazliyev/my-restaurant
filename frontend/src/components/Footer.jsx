import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/images/logo.png';
import { useLanguage } from '../context/LanguageContext';
import '../styles/Footer.css';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-grid">

          {/* Logo Column */}
          <div className="footer-col-brand">
            <Link to="/home">
              <img src={logo} alt="Logo" className="footer-logo" />
            </Link>
          </div>

          {/* Services */}
          <div className="footer-col">
            <h3 className="footer-col-title">{t.services}</h3>
            <ul className="footer-links-list">
              <li><a href="#" className="footer-link-item">{t.prices}</a></li>
              <li><a href="#" className="footer-link-item">{t.tracking}</a></li>
              <li><a href="#" className="footer-link-item">{t.report}</a></li>
              <li><a href="#" className="footer-link-item">{t.terms}</a></li>
            </ul>
          </div>

          {/* Company */}
          <div className="footer-col">
            <h3 className="footer-col-title">{t.company}</h3>
            <ul className="footer-links-list">
              <li><a href="#" className="footer-link-item">{t.accounting}</a></li>
              <li><Link to="/contacts" className="footer-link-item">{t.contactUs}</Link></li>
              <li><a href="#" className="footer-link-item">{t.governance}</a></li>
            </ul>
          </div>

          {/* Address */}
          <div className="footer-col">
            <h3 className="footer-col-title">{t.address}</h3>
            <ul className="footer-contacts-list">
              <li className="footer-contact-item">
                <span>
                  {t.addressText.split('\n')[0]}<br />
                  {t.addressText.split('\n')[1]}
                </span>
              </li>
              <li className="footer-contact-item">
                <a href="tel:+998907583833" className="footer-contact-link">+998 (90) 758-38-33</a>
              </li>
              <li className="footer-contact-item">
                <a href="mailto:info@bmgsoft.com" className="footer-contact-link">info@bmgsoft.com</a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <p className="footer-copyright">{t.copyright}</p>
          <div className="footer-legal-links">
            <a href="#" className="footer-legal-link">{t.privacy}</a>
            <a href="#" className="footer-legal-link">{t.termsOfService}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
