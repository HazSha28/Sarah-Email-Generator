import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import toast from 'react-hot-toast';
import { Icon } from '../components/Icons';
import './Login.css';

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/login', form);
      localStorage.setItem('token', res.data.token);
      navigate('/');
    } catch {
      toast.error('Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      {/* LEFT PANEL */}
      <div className="login-left">
        <div className="login-deco">
          <span /><span /><span /><span />
        </div>

        <div className="login-logo-wrap">
          <img src="/logo.png" alt="Sarah Jewellers" className="login-logo-img" />
          <div className="login-logo-text">
            Sarah Jewellers
            <span>Admin Portal</span>
          </div>
        </div>

        <div className="login-hero">
          <div className="login-hero-eyebrow">Smart Email Generator</div>
          <h1>Crafted for<br /><em>Every Occasion</em></h1>
          <p>
            Automate personalized jewellery emails for birthdays, anniversaries,
            and festive campaigns — all from one elegant dashboard.
          </p>
        </div>

        <div className="login-pills">
          <span className="login-pill">
            <Icon name="calendar" size={13} color="rgba(232,221,208,0.7)" />
            Birthday &amp; Anniversary Emails
          </span>
          <span className="login-pill">
            <Icon name="broadcast" size={13} color="rgba(232,221,208,0.7)" />
            Festival Broadcast Campaigns
          </span>
          <span className="login-pill">
            <Icon name="chart" size={13} color="rgba(232,221,208,0.7)" />
            Customer Dashboard
          </span>
          <span className="login-pill">
            <Icon name="download" size={13} color="rgba(232,221,208,0.7)" />
            Excel Import &amp; Management
          </span>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="login-right">
        <div className="login-form-eyebrow">Welcome Back</div>
        <h2 className="login-form-title">Sign in to<br />your account</h2>
        <p className="login-form-subtitle">Enter your credentials to access the admin panel</p>

        <form onSubmit={handleSubmit}>
          <div className="login-field">
            <label>Username</label>
            <div className="login-input-wrap">
              <span className="login-input-icon">
                <Icon name="user" size={15} color="#b09090" />
              </span>
              <input
                type="text"
                placeholder="Enter your username"
                value={form.username}
                onChange={e => setForm({ ...form, username: e.target.value })}
                required
                autoFocus
              />
            </div>
          </div>

          <div className="login-field">
            <label>Password</label>
            <div className="login-input-wrap">
              <span className="login-input-icon">
                <Icon name="lock" size={15} color="#b09090" />
              </span>
              <input
                type="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>
          </div>

          <button className="login-submit-btn" type="submit" disabled={loading}>
            <span>{loading ? 'Signing in...' : 'Sign In'}</span>
            {!loading && <Icon name="arrowRight" size={16} color="white" />}
          </button>
        </form>

        <div className="login-divider"><span>default credentials</span></div>

        <div className="login-hint">
          Username: <strong>admin</strong> &nbsp;&middot;&nbsp; Password: <strong>admin123</strong>
        </div>

        <div className="login-copyright">
          &copy; 2026 Sarah Jewellers &middot; All rights reserved
        </div>
      </div>

    </div>
  );
}
