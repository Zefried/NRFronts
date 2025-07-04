import React, { useState, useEffect } from 'react';
import './LoginModal.css';
import { AuthAction } from '../../../CustomStateManage/OrgUnits/AuthState';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginModal = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(true);
  const [form, setForm] = useState({ name: '', phone: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post('/api/user-register', { form });

      if (res.data.status === 200) {
        const { id, name } = res.data.data.userData;
        const token = res.data.data.loginData.access_token;

        setTimeout(() => {
          AuthAction.updateState({ isAuthenticated: true, userId: id, name, token });
          setShow(false);
  
          window.dispatchEvent(new Event('reload')); // 🔥 dispatch here
          setShow(false);
        }, 300); // delay auth state update

        navigate('/');
      }
    } catch (err) {
      if (err.response?.status === 422) {
        const msg = err.response.data.errors?.phone?.[0] || 'Validation failed';
        setError(`${msg}. If this is your number, please login.`);
        setTimeout(() => navigate('/login'), 2500);
      } else {
        setError('Something went wrong. Try again.');
      }
    }
    setLoading(false);
  };

  if (!show) return null;
  let authState = AuthAction.getState('auth');
  let isAuth = authState.isAuthenticated;

  return (
    <div className="custom-signup overlay active">
      <div className="form-container">
        {isAuth && <button className="close-btn" onClick={() => setShow(false)}>×</button>}
        <h2>SignUp</h2>
        {error && <p className="error-message">{error}</p>}

        <form id="registerForm" onSubmit={handleSubmit}>
          <>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              required
              id="name"
              name="name"
              placeholder="Enter your name"
              value={form.name}
              onChange={handleChange}
            />

            <label htmlFor="phone">Phone No</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              required
              placeholder="Enter your phone number"
              maxLength="10"
              value={form.phone}
              onChange={handleChange}
            />

            <button type="submit" className="submit-btn">
              Sign-up in One Click
            </button>
          </>
        </form>
        <div className="btnClick" onClick={() => { navigate('/login') }}>
          OR LOGIN NOW
        </div>
      </div>
    </div>
  );
};

export default LoginModal;