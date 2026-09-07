import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Register.css';

export default function Register() {
  const [form, setForm] = useState({
    firstName: '', lastName: '', phone: '',
    username: '', password: '', confirmPassword: '', agree: false,
  });
  const [errorMsg, setErrorMsg] = useState('');
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setErrorMsg('');

    if (!form.firstName || !form.lastName || !form.phone || !form.username || !form.password) {
      setErrorMsg('Пожалуйста, заполните все обязательные поля!');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setErrorMsg('Пароли не совпадают!');
      return;
    }
    if (!form.agree) {
      setErrorMsg('Вы должны принять Условия пользования!');
      return;
    }

    const res = await register({
      firstName: form.firstName,
      lastName: form.lastName,
      phone: form.phone,
      username: form.username,
      password: form.password,
    });

    if (res.success) {
      navigate('/home');
    } else {
      setErrorMsg(res.message || 'Ошибка регистрации');
    }
  };

  return (
    <div className="register-body">
      <div className="register-container">
        <h1>Зарегистрироваться</h1>

        {errorMsg && (
          <div style={{ color: '#ff4d4f', backgroundColor: 'rgba(255, 77, 79, 0.1)', padding: '10px 14px', borderRadius: '8px', marginBottom: '15px', fontSize: '14px', textAlign: 'center' }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {[
            { name: 'firstName', type: 'text', label: 'Ваше имя' },
            { name: 'lastName', type: 'text', label: 'Фамилия' },
            { name: 'phone', type: 'text', label: 'Ваш номер телефона' },
            { name: 'username', type: 'text', label: 'Ваше имя пользователя' },
            { name: 'password', type: 'password', label: 'Пароль' },
            { name: 'confirmPassword', type: 'password', label: 'Подтвердите пароль' },
          ].map((field) => (
            <div className="input-box" key={field.name}>
              <input
                type={field.type}
                name={field.name}
                required
                placeholder=" "
                value={form[field.name]}
                onChange={handleChange}
              />
              <label>{field.label}</label>
            </div>

          ))}

          <div className="checkbox-row">
            <input
              type="checkbox"
              name="agree"
              className="check"
              checked={form.agree}
              onChange={handleChange}
            />
            <p>Я прочитал и принял Политику конфиденциальности и Условия*</p>
          </div>

          <div className="foot">
            <button type="submit" disabled={loading}>
              {loading ? 'Регистрация...' : 'Зарегистрироваться'}
            </button>
            <br />
            <Link className="zabil" to="/">Уже есть аккаунт?</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

