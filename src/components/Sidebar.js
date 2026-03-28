import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, BookOpen, LogOut, ScrollIcon, Settings, Tags } from 'lucide-react';

import { motion } from 'framer-motion';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const navItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/dashboard' },
    { icon: <BookOpen size={20} />, label: 'Manga List', path: '/manga' },
    { icon: <ScrollIcon size={20} />, label: 'Add Manga', path: '/manga/new' },
    { icon: <Tags size={20} />, label: 'Genres', path: '/genres' },
  ];


  return (
    <motion.aside 
      initial={{ x: -280 }}
      animate={{ x: 0 }}
      className="glass"
      style={{
        width: '280px',
        height: '100vh',
        borderRight: '1px solid rgba(212, 175, 55, 0.2)',
        padding: '2rem 1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
        position: 'sticky',
        top: 0,
        backgroundColor: '#16161a'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingBottom: '2rem', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
        <div style={{ padding: '8px', background: 'var(--primary)', borderRadius: '8px', color: '#000' }}>
          <ScrollIcon size={24} />
        </div>
        <h1 style={{ fontSize: '1.2rem', color: 'var(--primary)', margin: 0 }}>MythicScroll <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>v1</span></h1>
      </div>

      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/manga'}
            style={({ isActive }) => ({

              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              borderRadius: '12px',
              color: isActive ? 'var(--primary)' : 'var(--text-dim)',
              textDecoration: 'none',
              background: isActive ? 'rgba(212, 175, 55, 0.1)' : 'transparent',
              transition: 'var(--transition)',
              border: isActive ? '1px solid rgba(212, 175, 55, 0.2)' : '1px solid transparent'
            })}
          >
            {item.icon}
            <span style={{ fontWeight: 500 }}>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div style={{ pt: '2rem', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            borderRadius: '12px',
            color: '#ff4d4d',
            background: 'transparent',
            border: 'none',
            outline: 'none',
            transition: 'var(--transition)'
          }}
          className="logout-btn"
        >
          <LogOut size={20} />
          <span style={{ fontWeight: 500 }}>Logout</span>
        </button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
