import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMangaById, createManga, updateManga, getGenres, uploadSingleFile } from '../api.js';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Upload, X, Trash } from 'lucide-react';

const MangaEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [genres, setGenres] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    genres: [],
    coverUrl: '',
    status: 'ongoing',
    year: new Date().getFullYear(),
    isDisplayed: true
  });
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    fetchGenres();
    if (id) fetchManga();
  }, [id]);

  const fetchGenres = async () => {
    try {
      const data = await getGenres();
      setGenres(data);
    } catch (err) { console.error(err); }
  };

  const fetchManga = async () => {
    setLoading(true);
    try {
      const data = await getMangaById(id);
      setFormData(data);
      setPreview(data.coverUrl);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fd = new FormData();
    fd.append('image', file);
    try {
      const { url } = await uploadSingleFile(fd);
      setFormData({ ...formData, coverUrl: url });
      setPreview(url);
    } catch (err) { alert('Upload failed'); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (id) await updateManga(id, formData);
      else await createManga(formData);
      navigate('/manga');
    } catch (err) { alert(err.response?.data?.error || 'Save failed'); }
    finally { setLoading(false); }
  };

  const toggleGenre = (genreId) => {
    const updated = formData.genres.includes(genreId)
      ? formData.genres.filter(g => g !== genreId)
      : [...formData.genres, genreId];
    setFormData({ ...formData, genres: updated });
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
        <button onClick={() => navigate('/manga')} style={{ padding: '8px', borderRadius: '12px', background: 'var(--glass)', border: '1px solid var(--glass-border)', color: 'var(--primary)' }}>
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 style={{ fontSize: '2rem' }}>{id ? 'Refine Scroll' : 'Summon New Scroll'}</h1>
          <p style={{ color: 'var(--text-dim)' }}>{id ? `Editing sacred text for: ${formData.title}` : 'Creating a new mythic record.'}</p>
        </div>
      </header>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '3rem' }}>
        {/* Cover Upload Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass" style={{ padding: '1.5rem', textAlign: 'center' }}>
            <h3 style={{ fontSize: '0.9rem', marginBottom: '1rem', textTransform: 'uppercase' }}>Cover Image</h3>
            <div style={{
              width: '100%',
              aspectRatio: '5/7',
              borderRadius: '8px',
              border: preview ? '1px solid var(--glass-border)' : '2px dashed var(--glass-border)',
              background: 'rgba(255, 255, 255, 0.02)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              position: 'relative'
            }}>
              {preview ? (
                <>
                  <img src={preview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', bottom: 10, right: 10, display: 'flex', gap: '4px' }}>
                    <label style={{ padding: '10px', background: 'rgba(0,0,0,0.7)', borderRadius: '12px', color: 'var(--primary)', cursor: 'pointer' }}>
                      <Upload size={16} />
                      <input type="file" hidden onChange={handleFileChange} />
                    </label>
                  </div>
                </>
              ) : (
                <label style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Upload size={32} style={{ marginBottom: '1rem', color: 'var(--primary)' }} />
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Cast Thy Cover Here</span>
                  <input type="file" hidden onChange={handleFileChange} />
                </label>
              )}
            </div>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '1rem' }}>Recommended: 1000x1400px</p>
          </div>

          <div className="glass" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '0.9rem', marginBottom: '1.2rem', textTransform: 'uppercase' }}>Genre Selection</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {genres.map(g => (
                <button
                  type="button"
                  key={g._id}
                  onClick={() => toggleGenre(g._id)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    background: formData.genres.includes(g._id) ? 'rgba(212, 175, 55, 0.2)' : 'transparent',
                    color: formData.genres.includes(g._id) ? 'var(--primary)' : 'var(--text-dim)',
                    border: `1px solid ${formData.genres.includes(g._id) ? 'var(--primary)' : 'rgba(255,255,255,0.1)'}`
                  }}
                >
                  {g.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Form Details Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass" style={{ padding: '2.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', gridColumn: 'span 2' }}>
                <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-dim)' }}>Scroll Title</label>
                <input
                  type="text"
                  placeholder="Legendary Name..."
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-dim)' }}>Current Status</label>
                <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                  <option value="ongoing">🔱 Ongoing</option>
                  <option value="completed">📜 Completed</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-dim)' }}>Publication Year</label>
                <input
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', gridColumn: 'span 2' }}>
                <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-dim)' }}>Chronicle Description</label>
                <textarea
                  rows={6}
                  placeholder="Record history here..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  style={{ background: 'rgba(255, 255, 255, 0.05)', resize: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <input
                  type="checkbox"
                  id="isVisible"
                  checked={formData.isDisplayed}
                  onChange={(e) => setFormData({ ...formData, isDisplayed: e.target.checked })}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <label htmlFor="isVisible" style={{ fontSize: '0.9rem', cursor: 'pointer' }}>Visible to Pilgrims</label>
              </div>
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <button
                type="button"
                onClick={() => navigate('/manga')}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', padding: '12px 24px' }}>
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                style={{
                  background: 'var(--primary)',
                  color: '#000',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '12px 32px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 5px 15px rgba(212, 175, 55, 0.3)'
                }}
              >
                <Save size={18} /> {loading ? 'Binding...' : 'Inscribe Record'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </motion.div>
  );
};

export default MangaEditor;
