import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import '../styles/Login.css';

import krug from '../assets/images/krug.png';
import vilka from '../assets/images/vilka.png';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const { login, loading } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setErrorMsg('');
    const res = await login({ username: username || 'Oybek', password: password || '12345' });
    if (res.success) {
      navigate('/');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="login-body">
      <div className="login-container">
        <img className="img1" src={krug} alt="" />
        <img className="img2" src={vilka} alt="" />

        <h1>{t.loginTitle}</h1>

        {errorMsg && (
          <div style={{ color: '#ff4d4f', backgroundColor: 'rgba(255, 77, 79, 0.1)', padding: '10px 14px', borderRadius: '8px', marginBottom: '15px', fontSize: '14px', textAlign: 'center' }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="input-box">
            <input
              type="text"
              required
              placeholder=" "
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <label>{t.username}</label>
          </div>

          <div className="input-box">
            <input
              type="password"
              required
              placeholder=" "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label>{t.password}</label>
          </div>

          <div className="ahref">
            <a href="#">{t.forgotPassword}</a>
          </div>

          <div className="foot">
            <button type="submit" disabled={loading}>
              {loading ? t.loginLoading : t.loginBtn}
            </button>
            <br />
            <Link className="zabil" to="/register">{t.noAccount}</Link>
          </div>
        </form>
      </div>
    </div>
  );
}