import React, { useState, useEffect } from 'react';
import { getManga } from '../api.js';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Edit2, Plus, BookOpen, Search, ArrowUpDown, ChevronRight } from 'lucide-react';

const MangaList = () => {
  const [manga, setManga] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchManga();
  }, []);

  const fetchManga = async () => {
    setLoading(true);
    try {
      const data = await getManga();
      setManga(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredManga = manga.filter(m =>
    m.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Manga Management</h1>
          <p style={{ color: 'var(--text-dim)' }}>Manage and organize your manga collection.</p>
        </div>
        <button
          onClick={() => navigate('/manga/new')}
          className="glass"
          style={{
            padding: '12px 24px',
            background: 'var(--primary)',
            color: '#000',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            borderRadius: '12px',
            boxShadow: '0 0 15px rgba(212, 175, 55, 0.2)'
          }}
        >
          <Plus size={20} /> Add Manga
        </button>
      </header>

      <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
          <input
            type="text"
            placeholder="Search by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', paddingLeft: '44px', background: 'rgba(255, 255, 255, 0.05)' }}
          />
        </div>
      </div>

      <div className="glass" style={{ overflow: 'hidden', background: 'rgba(255, 255, 255, 0.02)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: 'rgba(212, 175, 55, 0.1)' }}>
            <tr>
              <th style={{ padding: '16px 24px', color: 'var(--primary)', textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 600 }}>Cover</th>
              <th style={{ padding: '16px 24px', color: 'var(--primary)', textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 600 }}>Title</th>
              <th style={{ padding: '16px 24px', color: 'var(--primary)', textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 600 }}>Status</th>
              <th style={{ padding: '16px 24px', color: 'var(--primary)', textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 600 }}>Year</th>
              <th style={{ padding: '16px 24px', color: 'var(--primary)', textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 600 }}>Visible</th>
              <th style={{ padding: '16px 24px', textAlign: 'right', color: 'var(--primary)', textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 600 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-dim)' }}>Loading data...</td></tr>
            ) : filteredManga.length === 0 ? (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-dim)' }}>No entries found.</td></tr>
            ) : filteredManga.map((item) => (
              <motion.tr
                key={item._id}
                whileHover={{ background: 'rgba(255, 255, 255, 0.03)' }}
                style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', transition: 'var(--transition)' }}
              >
                <td style={{ padding: '16px 24px' }}>
                  <img
                    src={item.coverUrl}
                    alt={item.title}
                    style={{ width: '50px', height: '70px', borderRadius: '4px', objectFit: 'cover', boxShadow: '0 4px 10px rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)' }}
                  />
                </td>
                <td style={{ padding: '16px 24px' }}>
                  <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{item.title}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.description}</div>
                </td>
                <td style={{ padding: '16px 24px' }}>
                  <span style={{
                    padding: '4px 10px',
                    borderRadius: '20px',
                    fontSize: '0.7rem',
                    textTransform: 'uppercase',
                    fontWeight: 700,
                    background: item.status === 'ongoing' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(33, 150, 243, 0.1)',
                    color: item.status === 'ongoing' ? '#4caf50' : '#2196f3',
                    border: `1px solid ${item.status === 'ongoing' ? 'rgba(76, 175, 80, 0.2)' : 'rgba(33, 150, 243, 0.2)'}`
                  }}>
                    {item.status}
                  </span>
                </td>
                <td style={{ padding: '16px 24px', color: 'var(--text-dim)' }}>{item.year || 'Unknown'}</td>
                <td style={{ padding: '16px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: item.isDisplayed ? '#4caf50' : '#ff4d4d' }}></div>
                    <span style={{ fontSize: '0.8rem' }}>{item.isDisplayed ? 'Visible' : 'Hidden'}</span>
                  </div>
                </td>
                <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                    <button
                      onClick={() => navigate(`/manga/${item._id}/chapters`)}
                      style={{ padding: '8px 14px', borderRadius: '8px', background: 'rgba(212, 175, 55, 0.05)', color: 'var(--primary)', border: '1px solid rgba(212, 175, 55, 0.2)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      <BookOpen size={14} /> Chapters
                    </button>
                    <button
                      onClick={() => navigate(`/manga/edit/${item._id}`)}
                      style={{ padding: '8px', borderRadius: '8px', background: 'var(--bg-card)', color: 'var(--primary)', border: '1px solid rgba(212, 175, 55, 0.2)' }}
                    >
                      <Edit2 size={14} />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default MangaList;
