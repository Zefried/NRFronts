import React, { useState } from 'react';
import '../LoginModal.css';
import axios from 'axios';
import { AuthAction } from '../../../../CustomStateManage/OrgUnits/AuthState';
import { useNavigate } from 'react-router-dom';

const SignupModal = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(true);
  const [form, setForm] = useState({ phone: '', password: '' });
  const [error, setError] = useState('');

  if (!show) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
      e?.preventDefault();
      setError('');
      try {
          const res = await axios.post('/api/user-login', {
            phone: form.phone,
          });

          if (res.data.status === 200) {
           
            const { id, name } = res.data.data.userData;
            const { access_token } = res.data.data.loginData;

            AuthAction.updateState({
              isAuthenticated: true,
              userId: id,
              name: name,
              token: `${access_token}`,
            });

            if (AuthAction.getState('auth').isAuthenticated && AuthAction.getState('auth').busId) {
              const busId = AuthAction.getState('auth').busId;
              setTimeout(() => navigate('/', { state: { bus_id: busId } }), 100);
            } else{
              setTimeout(() => navigate('/'), 100)
            }
          } else {
            
            setError(res.data.message);
          }
      } catch (err) {
        console.error(err.message);
        setError('Login failed. Please try again.');
      }
  };



  return (
    <div className="custom-signup overlay active">
      <div className="form-container">
        <button className="close-btn" onClick={() => setShow(false)}>×</button>
        <h2>YOU CAN LOGIN</h2>
        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit}>
          <label htmlFor="phone">Phone</label>
          <input type="tel" id="phone" name="phone" value={form.phone} onChange={handleChange} required placeholder="Enter phone" />

          {/* <label htmlFor="password">Enter Name</label>
          <input type="password" id="password" name="password" value={form.password} onChange={handleChange} required placeholder="Enter password" /> */}

          <button type="submit" className="submit-btn">One Click Login</button>
        </form>
      </div>
    </div>
  );
};

export default SignupModal;
