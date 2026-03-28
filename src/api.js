import axios from 'axios';

const BASE_URL = 'https://mythicscroll-backend.onrender.com/api';

export const api = axios.create({
  baseURL: BASE_URL,
});


api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (email, password) => {
  const { data } = await api.post('/auth/login', { email, password });
  return data;
};

export const getManga = async (params = {}) => {
  const { data } = await api.get('/manga', { params });
  return data;
};

export const getMangaById = async (id) => {
  const { data } = await api.get(`/manga/${id}`);
  return data;
};

export const createManga = async (mangaData) => {
  const { data } = await api.post('/manga', mangaData);
  return data;
};

export const updateManga = async (id, mangaData) => {
  const { data } = await api.put(`/manga/${id}`, mangaData);
  return data;
};

export const getGenres = async () => {
  const { data } = await api.get('/genres');
  return data;
};

export const createGenre = async (genreData) => {
  const { data } = await api.post('/genres', genreData);
  return data;
};

export const updateGenre = async (id, genreData) => {
  const { data } = await api.put(`/genres/${id}`, genreData);
  return data;
};

export const deleteGenre = async (id) => {
  const { data } = await api.delete(`/genres/${id}`);
  return data;
};


export const getChapters = async (mangaId) => {
  const { data } = await api.get(`/chapters/${mangaId}`);
  return data;
};

export const createChapter = async (chapterData) => {
  const { data } = await api.post('/chapters', chapterData);
  return data;
};

export const updateChapter = async (id, chapterData) => {
  const { data } = await api.put(`/chapters/${id}`, chapterData);
  return data;
};

export const uploadSingleFile = async (formData) => {
  const { data } = await api.post('/upload/single', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

export const uploadMultipleFiles = async (formData) => {
  const { data } = await api.post('/upload/multiple', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

export default api;
