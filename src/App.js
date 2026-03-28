import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import MangaList from './pages/MangaList';
import MangaEditor from './pages/MangaEditor';
import ChapterManager from './pages/ChapterManager';
import GenreManagement from './pages/GenreManagement';
import { useState, useEffect } from 'react';



const ProtectedLayout = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" />;

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '2rem', backgroundColor: '#0a0a0c', color: '#e0e0e0', overflowY: 'auto' }}>
        {children}
      </main>
    </div>
  );
};

function App() {
  const [isAuth, setIsAuth] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    const checkAuth = () => {
      setIsAuth(!!localStorage.getItem('token'));
    };
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage onLogin={() => setIsAuth(true)} />} />
        
        <Route path="/dashboard" element={
          <ProtectedLayout>
            <Dashboard />
          </ProtectedLayout>
        } />

        <Route path="/manga" element={
          <ProtectedLayout>
            <MangaList />
          </ProtectedLayout>
        } />

        <Route path="/manga/new" element={
          <ProtectedLayout>
            <MangaEditor />
          </ProtectedLayout>
        } />

        <Route path="/manga/edit/:id" element={
          <ProtectedLayout>
            <MangaEditor />
          </ProtectedLayout>
        } />

        <Route path="/manga/:id/chapters" element={
          <ProtectedLayout>
            <ChapterManager />
          </ProtectedLayout>
        } />

        <Route path="/genres" element={
          <ProtectedLayout>
            <GenreManagement />
          </ProtectedLayout>
        } />

        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}

export default App;
