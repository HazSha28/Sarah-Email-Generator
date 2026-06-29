import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Icon } from './Icons';
import './Layout.css';

const navItems = [
  { to: '/', icon: 'dashboard', label: 'Dashboard', end: true },
  { to: '/customers', icon: 'customers', label: 'Customers' },
  { to: '/drafts', icon: 'drafts', label: 'Email Drafts' },
  { to: '/sent', icon: 'sent', label: 'Sent Emails' },
  { to: '/templates', icon: 'templates', label: 'Templates' },
  { to: '/broadcast', icon: 'broadcast', label: 'Broadcast' },
];

const pageTitles = {
  '/': 'Dashboard',
  '/customers': 'Customer Management',
  '/drafts': 'Email Drafts',
  '/sent': 'Sent Emails',
  '/templates': 'Email Templates',
  '/broadcast': 'Festival Broadcast',
};

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const currentTitle = pageTitles[location.pathname] || 'Admin Panel';

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className={`layout ${collapsed ? 'sidebar-collapsed' : ''}`}>
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon">
            <img src="/logo.png" alt="Sarah Jewellers" style={{ width: 38, height: 38, objectFit: 'contain' }} />
          </div>
          {!collapsed && (
            <div>
              <div className="logo-title">Sarah Jewellers</div>
              <div className="logo-sub">Smart Email Generator</div>
            </div>
          )}
        </div>

        <nav className="sidebar-nav">
          {!collapsed && <div className="nav-section-label">Main Menu</div>}
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''} ${collapsed ? 'nav-item-icon-only' : ''}`}
              title={collapsed ? item.label : ''}
            >
              <span className="nav-icon">
                <Icon name={item.icon} size={16} color="currentColor" />
              </span>
              {!collapsed && item.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          {!collapsed && (
            <div className="admin-info">
              <div className="admin-avatar">
                <Icon name="user" size={16} color="white" />
              </div>
              <div>
                <div className="admin-name">Administrator</div>
                <div className="admin-role">Super Admin</div>
              </div>
            </div>
          )}
          {collapsed && (
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
              <div className="admin-avatar">
                <Icon name="user" size={16} color="white" />
              </div>
            </div>
          )}
          <button className="logout-btn" onClick={logout} title={collapsed ? 'Sign Out' : ''}>
            <Icon name="logout" size={15} color="currentColor" />
            {!collapsed && 'Sign Out'}
          </button>
        </div>
      </aside>

      <main className="main-content">
        <div className="main-topbar">
          <div className="topbar-left">
            {/* Toggle button */}
            <button className="sidebar-toggle" onClick={() => setCollapsed(!collapsed)} title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
              <Icon name={collapsed ? 'arrowRight' : 'close'} size={16} color="#7a5c62" />
            </button>
            <div className="topbar-separator" />
            <img src="/logo.png" alt="" style={{ width: 22, height: 22, objectFit: 'contain', borderRadius: 4 }} />
            <div className="topbar-separator" />
            <span className="topbar-title">Sarah Jewellers &rsaquo; {currentTitle}</span>
          </div>
        </div>
        <div className="main-body">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
