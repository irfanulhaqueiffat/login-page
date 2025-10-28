import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { setCookie } from '../utils/cookies';

const LoginPage = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState({});
  const [bgUrl, setBgUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const keywords = ['nature', 'city', 'mountains', 'abstract', 'sunrise', 'forest', 'beach', 'technology', 'architecture'];
    const pick = keywords[Math.floor(Math.random() * keywords.length)];
    const url = `https://source.unsplash.com/1600x900/?${encodeURIComponent(pick)}`;
    setBgUrl(url);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: false }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.username || !form.username.trim()) newErrors.username = 'Username is required';
    if (!form.password || !form.password.trim()) newErrors.password = 'Password is required';
    setErrors(newErrors);
    const valid = Object.keys(newErrors).length === 0;
    return { valid };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { valid } = validate();
    if (!valid) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('https://api.freeapi.app/api/v1/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: form.username, password: form.password }),
      });
      const result = await res.json();

  if (res.ok && (result.data || result.token || result.accessToken)) {
        // Support multiple response shapes
        const accessToken = result.data?.token || result.token || result.accessToken;
        const refreshToken = result.data?.refreshToken || result.refreshToken;

  // Store tokens in cookies
  // Access token short-lived (50s)
  setCookie('accessToken', accessToken, { maxAge: 50, sameSite: 'Lax', secure: false });
  if (refreshToken) setCookie('refreshToken', refreshToken, { maxAge: 60 * 60 * 24 * 7, sameSite: 'Lax', secure: false });

  // Set login expiration cookie as timestamp (50s)
  const loginExpiration = new Date().getTime() + 50 * 1000;
  setCookie('loginExpiration', String(loginExpiration), { maxAge: 50, sameSite: 'Lax', secure: false });

        toast.success('Login successful!');
        navigate('/home');
      } else {
        toast.error(result.message || 'Login failed');
      }
    } catch (err) {
      console.error('Login error', err);
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page" style={bgUrl ? { backgroundImage: `url(${bgUrl})` } : {}}>
      <form className="card form" onSubmit={handleSubmit} noValidate>
        <h2>Login</h2>

        <div className="field">
          <label htmlFor="username">Username</label>
          <input id="username" name="username" value={form.username} onChange={handleChange} className={errors.username ? 'input invalid' : 'input'} placeholder="Username" />
          {errors.username && <span className="error-message">{errors.username}</span>}
        </div>

        <div className="field">
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" value={form.password} onChange={handleChange} className={errors.password ? 'input invalid' : 'input'} placeholder="••••••••" />
          {errors.password && <span className="error-message">{errors.password}</span>}
        </div>

        <div className="actions">
          <button type="submit" className="btn primary" disabled={loading}>{loading ? 'Logging in…' : 'Login'}</button>
        </div>

        <p style={{ marginTop: 12, textAlign: 'center' }}>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;