import React, { useState, useEffect } from 'react';
import { getManga, getGenres } from '../api.js';
import { motion } from 'framer-motion';
import { BookOpen, UserCheck, TrendingUp, Tags } from 'lucide-react';

const Dashboard = () => {
  const [data, setData] = useState({ mangaCount: 0, genreCount: 0, loading: true });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const manga = await getManga();
        const genres = await getGenres();
        setData({ mangaCount: manga.length, genreCount: genres.length, loading: false });
      } catch (err) {
        setData(prev => ({ ...prev, loading: false }));
      }
    };
    fetchData();
  }, []);

  const stats = [
    { label: 'Total Manga', value: data.mangaCount, icon: <BookOpen />, color: '#d4af37' },
    { label: 'Active Genres', value: data.genreCount, icon: <Tags />, color: '#b8860b' },
    { label: 'Avg Rating', value: '4.8', icon: <TrendingUp />, color: '#ffd700' },
    { label: 'Total Users', value: '128', icon: <UserCheck />, color: '#d4af37' },
  ];

  if (data.loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
      <p style={{ color: 'var(--primary)', fontStyle: 'italic' }}>Gazing into the void...</p>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <header style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Overview</h1>
        <p style={{ color: 'var(--text-dim)' }}>Behold the state of thy mythic scrolls.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            whileHover={{ y: -5, scale: 1.02 }}
            className="glass"
            style={{
              padding: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1.2rem',
              background: 'rgba(255, 255, 255, 0.05)',
              borderBottom: `2px solid ${stat.color}`
            }}
          >
            <div style={{ padding: '12px', background: `${stat.color}15`, borderRadius: '12px', color: stat.color }}>
              {stat.icon}
            </div>
            <div>
              <p style={{ color: 'var(--text-dim)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>{stat.label}</p>
              <h3 style={{ fontSize: '1.8rem', margin: 0 }}>{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        <div className="glass" style={{ padding: '2rem', minHeight: '300px' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>Recent Performance</h2>
          <div style={{ opacity: 0.5, textAlign: 'center', paddingTop: '4rem' }}>
            <p style={{ color: 'var(--text-dim)' }}>Chart of destiny is still being written...</p>
          </div>
        </div>
        <div className="glass" style={{ padding: '2rem', minHeight: '300px' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>Quick Actions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <motion.button whileTap={{ scale: 0.95 }} style={{ border: '1px solid rgba(212, 175, 55, 0.3)', padding: '12px', borderRadius: '8px', background: 'transparent', color: 'var(--text-main)', textAlign: 'left' }}>
              ✦ Add New Manga
            </motion.button>
            <motion.button whileTap={{ scale: 0.95 }} style={{ border: '1px solid rgba(212, 175, 55, 0.3)', padding: '12px', borderRadius: '8px', background: 'transparent', color: 'var(--text-main)', textAlign: 'left' }}>
              ✦ New Genre Entry
            </motion.button>
            <motion.button whileTap={{ scale: 0.95 }} style={{ border: '1px solid rgba(212, 175, 55, 0.3)', padding: '12px', borderRadius: '8px', background: 'transparent', color: 'var(--text-main)', textAlign: 'left' }}>
              ✦ System Status
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
