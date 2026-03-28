import React, { useState, useEffect } from 'react';
import { getGenres, createGenre, updateGenre, deleteGenre } from '../api.js';

import { motion } from 'framer-motion';
import { Plus, Trash2, Edit2, Check, X, Tags } from 'lucide-react';

const GenreManagement = () => {
    const [genres, setGenres] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newGenre, setNewGenre] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editValue, setEditValue] = useState('');

    useEffect(() => {
        fetchGenres();
    }, []);

    const fetchGenres = async () => {
        setLoading(true);
        try {
            const data = await getGenres();
            setGenres(data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!newGenre.trim()) return;
        try {
            await createGenre({ name: newGenre });
            setNewGenre('');
            fetchGenres();
        } catch (err) { alert('Failed to add genre'); }

    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this genre?')) return;
        try {
            await deleteGenre(id);
            fetchGenres();
        } catch (err) { alert('Failed to delete genre'); }

    };

    const startEdit = (genre) => {
        setEditingId(genre._id);
        setEditValue(genre.name);
    };

    const handleUpdate = async (id) => {
        try {
            await updateGenre(id, { name: editValue });
            setEditingId(null);
            fetchGenres();
        } catch (err) { alert('Failed to update genre'); }

    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <header style={{ marginBottom: '2.5rem' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Genre Management</h1>
                <p style={{ color: 'var(--text-dim)' }}>Manage and organize manga categories.</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '3rem' }}>
                <div className="glass" style={{ padding: '2rem', height: 'fit-content' }}>
                    <h2 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', color: 'var(--primary)' }}>Add New Genre</h2>
                    <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <input
                            type="text"
                            placeholder="Genre Name"
                            value={newGenre}
                            onChange={(e) => setNewGenre(e.target.value)}
                        />
                        <button
                            type="submit"
                            style={{
                                padding: '12px',
                                background: 'var(--primary)',
                                color: '#000',
                                border: 'none',
                                borderRadius: '12px',
                                fontWeight: 700,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px'
                            }}
                        >
                            <Plus size={18} /> Add Genre
                        </button>
                    </form>
                </div>

                <div className="glass" style={{ padding: '2rem' }}>
                    <h2 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Tags size={20} /> Current Genres
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                        {loading ? (
                            <p style={{ gridColumn: 'span 2', textAlign: 'center', padding: '2rem', color: 'var(--text-dim)' }}>Loading genres...</p>
                        ) : genres.map(g => (
                            <div
                                key={g._id}
                                style={{
                                    padding: '12px 16px',
                                    borderRadius: '12px',
                                    background: 'rgba(255,255,255,0.03)',
                                    border: '1px solid rgba(255,255,255,0.05)',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}
                            >
                                {editingId === g._id ? (
                                    <div style={{ display: 'flex', gap: '4px', width: '100%' }}>
                                        <input
                                            type="text"
                                            value={editValue}
                                            onChange={(e) => setEditValue(e.target.value)}
                                            style={{ padding: '4px 8px', fontSize: '0.8rem', flex: 1 }}
                                            autoFocus
                                        />
                                        <button onClick={() => handleUpdate(g._id)} style={{ padding: '4px', background: 'rgba(76,175,80,0.2)', color: '#4caf50', border: 'none', borderRadius: '4px' }}><Check size={14} /></button>
                                        <button onClick={() => setEditingId(null)} style={{ padding: '4px', background: 'rgba(255,0,0,0.1)', color: '#ff4d4d', border: 'none', borderRadius: '4px' }}><X size={14} /></button>
                                    </div>
                                ) : (
                                    <>
                                        <span style={{ fontWeight: 500 }}>{g.name}</span>
                                        <div style={{ display: 'flex', gap: '6px' }}>
                                            <button onClick={() => startEdit(g)} style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', padding: '4px' }}><Edit2 size={14} /></button>
                                            <button onClick={() => handleDelete(g._id)} style={{ background: 'transparent', border: 'none', color: '#ff4d4d', padding: '4px' }}><Trash2 size={14} /></button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default GenreManagement;
