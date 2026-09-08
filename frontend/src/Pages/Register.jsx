import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import '../styles/Register.css';

export default function Register() {
  const [form, setForm] = useState({
    firstName: '', lastName: '', phone: '',
    username: '', password: '', confirmPassword: '', agree: false,
  });
  const [errorMsg, setErrorMsg] = useState('');
  const { register, loading } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setErrorMsg('');

    if (!form.firstName || !form.lastName || !form.phone || !form.username || !form.password) {
      setErrorMsg(t.fillAllFields);
      return;
    }
    if (form.password !== form.confirmPassword) {
      setErrorMsg(t.passwordMismatch);
      return;
    }
    if (!form.agree) {
      setErrorMsg(t.mustAgree);
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
      setErrorMsg(res.message || t.registerError);
    }
  };

  const fields = [
    { name: 'firstName',       type: 'text',     label: t.firstName },
    { name: 'lastName',        type: 'text',     label: t.lastName },
    { name: 'phone',           type: 'text',     label: t.phone },
    { name: 'username',        type: 'text',     label: t.username },
    { name: 'password',        type: 'password', label: t.password },
    { name: 'confirmPassword', type: 'password', label: t.confirmPassword },
  ];

  return (
    <div className="register-body">
      <div className="register-container">
        <h1>{t.registerTitle}</h1>

        {errorMsg && (
          <div style={{ color: '#ff4d4f', backgroundColor: 'rgba(255, 77, 79, 0.1)', padding: '10px 14px', borderRadius: '8px', marginBottom: '15px', fontSize: '14px', textAlign: 'center' }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {fields.map((field) => (
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
            <p>{t.agreeText}</p>
          </div>

          <div className="foot">
            <button type="submit" disabled={loading}>
              {loading ? t.registerLoading : t.registerBtn}
            </button>
            <br />
            <Link className="zabil" to="/login">{t.hasAccount}</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
