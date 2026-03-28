import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMangaById, getChapters, createChapter, updateChapter, uploadMultipleFiles } from '../api.js';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, Save, Upload, Trash2, Eye, EyeOff, X, Image as ImageIcon, Reorder } from 'lucide-react';

const ChapterManager = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [manga, setManga] = useState(null);
    const [chapters, setChapters] = useState([]);
    const [editingChapter, setEditingChapter] = useState(null);
    const [formData, setFormData] = useState({ chapterNumber: 1, title: '', pages: [], isDisplayed: true });
    const [isUploading, setIsUploading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            const m = await getMangaById(id);
            const c = await getChapters(id);

            const sorted = [...c].sort((a, b) => b.chapterNumber - a.chapterNumber);

            setManga(m);
            setChapters(sorted);
            setFormData(prev => ({ ...prev, chapterNumber: (c.length > 0 ? Math.max(...c.map(ch => ch.chapterNumber)) + 1 : 1) }));
        } catch (err) { console.error(err); }
    };

    const handleUploadPages = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        setIsUploading(true);
        const fd = new FormData();
        files.forEach(f => fd.append('images', f));

        try {
            const { urls } = await uploadMultipleFiles(fd);
            setFormData({ ...formData, pages: [...formData.pages, ...urls] });
        } catch (err) { alert('Upload failed'); }
        finally { setIsUploading(false); }
    };

    const handleSave = async (e) => {
        e.preventDefault();

        const isDuplicate = chapters.some(ch =>
            ch.chapterNumber === formData.chapterNumber &&
            (!editingChapter || ch._id !== editingChapter._id)
        );

        if (isDuplicate) {
            alert(`Chapter ${formData.chapterNumber} already exists for this manga. Please use a unique number.`);
            return;
        }

        setIsSaving(true);
        try {
            if (editingChapter) {
                await updateChapter(editingChapter._id, { ...formData, mangaId: id });
            } else {
                await createChapter({ ...formData, mangaId: id });
            }
            fetchData();
            handleCancel();
        } catch (err) { alert('Save failed'); }
        finally { setIsSaving(false); }
    };

    const handleEdit = (chapter) => {
        setEditingChapter(chapter);
        setFormData({
            chapterNumber: chapter.chapterNumber,
            title: chapter.title,
            pages: chapter.pages || [],
            isDisplayed: chapter.isDisplayed
        });
    };

    const handleCancel = () => {
        setEditingChapter(null);
        setFormData({
            chapterNumber: (chapters.length > 0 ? Math.max(...chapters.map(ch => ch.chapterNumber)) + 1 : 1),
            title: '',
            pages: [],
            isDisplayed: true
        });
    };

    const removePage = (index) => {
        const updated = formData.pages.filter((_, i) => i !== index);
        setFormData({ ...formData, pages: updated });
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <header style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
                <button onClick={() => navigate('/manga')} style={{ padding: '8px', borderRadius: '12px', background: 'var(--glass)', border: '1px solid var(--glass-border)', color: 'var(--primary)' }}>
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 style={{ fontSize: '2rem' }}>Chapter Management</h1>
                    <p style={{ color: 'var(--text-dim)' }}>Managing chapters for: <span style={{ color: 'var(--primary)' }}>{manga?.title || 'Loading...'}</span></p>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem' }}>
                {/* Chapter List */}
                <div className="glass" style={{ padding: '2rem', background: 'rgba(255, 255, 255, 0.02)' }}>
                    <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <ImageIcon size={20} /> Chapter List
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {chapters.length === 0 ? (
                            <p style={{ color: 'var(--text-dim)', textAlign: 'center', padding: '3rem' }}>No chapters added yet.</p>
                        ) : chapters.map(ch => (
                            <div
                                key={ch._id}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '16px',
                                    borderRadius: '12px',
                                    background: editingChapter?._id === ch._id ? 'rgba(212, 175, 55, 0.1)' : 'rgba(255, 255, 255, 0.03)',
                                    border: editingChapter?._id === ch._id ? '1px solid var(--primary)' : '1px solid rgba(255, 255, 255, 0.05)',
                                    transition: 'var(--transition)'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ padding: '8px 12px', background: 'var(--bg-dark)', borderRadius: '8px', color: 'var(--primary)', fontWeight: 700, minWidth: '45px', textAlign: 'center' }}>
                                        {ch.chapterNumber}
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 600 }}>{ch.title}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{ch.pages?.length || 0} Pages • {ch.isDisplayed ? 'Visible' : 'Hidden'}</div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleEdit(ch)}
                                    style={{ padding: '8px 12px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-dim)', borderRadius: '8px' }}
                                >
                                    Edit
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Chapter Editor / Add */}
                <div className="glass" style={{ padding: '2rem', height: 'fit-content', position: 'sticky', top: '2rem' }}>
                    <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {editingChapter ? '🔨 Edit Chapter' : '✨ Add New Chapter'}
                    </h2>

                    <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <label style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Chapter Number</label>
                                <input
                                    type="number"
                                    value={formData.chapterNumber}
                                    onChange={(e) => setFormData({ ...formData, chapterNumber: parseInt(e.target.value) })}
                                />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <label style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Chapter Title</label>
                                <input
                                    type="text"
                                    placeholder="Chapter Name..."
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <label style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Chapter Pages ({formData.pages?.length || 0})</label>
                                <label style={{ fontSize: '0.8rem', color: 'var(--primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <Plus size={16} /> <span>Upload Pages</span>
                                    <input type="file" multiple hidden onChange={handleUploadPages} disabled={isUploading} />
                                </label>
                            </div>

                            <div style={{
                                maxHeight: '350px',
                                overflowY: 'auto',
                                display: 'grid',
                                gridTemplateColumns: 'repeat(3, 1fr)',
                                gap: '10px',
                                padding: '10px',
                                background: 'rgba(0,0,0,0.2)',
                                borderRadius: '12px',
                                minHeight: '100px'
                            }}>
                                {isUploading && <div style={{ gridColumn: 'span 3', textAlign: 'center', padding: '1rem', color: 'var(--primary)' }}>Uploading images...</div>}
                                {formData.pages.length === 0 && !isUploading && <div style={{ gridColumn: 'span 3', textAlign: 'center', padding: '1rem', color: 'var(--text-dim)', fontSize: '0.8rem' }}>No pages uploaded yet.</div>}
                                {formData.pages.map((url, idx) => (
                                    <div key={idx} style={{ position: 'relative', borderRadius: '4px', overflow: 'hidden', aspectRatio: '2/3', border: '1px solid rgba(255,255,255,0.05)' }}>
                                        <img src={url} alt={`page ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        <button
                                            type="button"
                                            onClick={() => removePage(idx)}
                                            style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(255,0,0,0.7)', border: 'none', borderRadius: '4px', padding: '2px', color: '#fff' }}
                                        >
                                            <X size={12} />
                                        </button>
                                        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.5)', fontSize: '8px', textAlign: 'center' }}>{idx + 1}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <input
                                type="checkbox"
                                id="chapVisible"
                                checked={formData.isDisplayed}
                                onChange={(e) => setFormData({ ...formData, isDisplayed: e.target.checked })}
                            />
                            <label htmlFor="chapVisible" style={{ fontSize: '0.8rem' }}>Visible to Users</label>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            {editingChapter && (
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: "white" }}
                                >
                                    Cancel
                                </button>
                            )}
                            <button
                                type="submit"
                                disabled={isSaving || isUploading}
                                style={{
                                    flex: 2,
                                    padding: '12px',
                                    borderRadius: '12px',
                                    border: 'none',
                                    background: 'var(--primary)',
                                    color: '#000',
                                    fontWeight: 700,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px'
                                }}
                            >
                                <Save size={18} /> {isSaving ? 'Saving...' : (editingChapter ? 'Update Chapter' : 'Create Chapter')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </motion.div>
    );
};

export default ChapterManager;
