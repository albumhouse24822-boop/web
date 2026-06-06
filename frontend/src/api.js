// API client + auth helpers for Album House Prop Store
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

const TOKEN_KEY = 'ahps_admin_token';

export const auth = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (t) => localStorage.setItem(TOKEN_KEY, t),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

export const api = axios.create({ baseURL: API });

api.interceptors.request.use((config) => {
  const t = auth.get();
  if (t) config.headers.Authorization = `Bearer ${t}`;
  return config;
});

// Public fetchers
export const fetchSiteConfig = () => api.get('/site-config').then(r => r.data);
export const fetchProducts = (category) => api.get('/products', { params: category ? { category } : {} }).then(r => r.data);
export const fetchThemes = () => api.get('/themes').then(r => r.data);
export const fetchBanners = (type) => api.get('/banners', { params: type ? { type } : {} }).then(r => r.data);
export const fetchReviews = () => api.get('/reviews').then(r => r.data);
export const fetchStores = () => api.get('/stores').then(r => r.data);
export const fetchMentorPicks = () => api.get('/mentor-picks').then(r => r.data);
export const fetchStudioBookings = () => api.get('/studio-bookings').then(r => r.data);
export const submitQuiz = (payload) => api.post('/quiz/recommend', payload).then(r => r.data);

// Admin
export const adminLogin = (username, password) =>
  api.post('/admin/login', { username, password }).then(r => r.data);
export const adminMe = () => api.get('/admin/me').then(r => r.data);

export const adminUpdateSiteConfig = (cfg) => api.put('/admin/site-config', cfg).then(r => r.data);
export const adminCreateProduct = (p) => api.post('/admin/products', p).then(r => r.data);
export const adminUpdateProduct = (id, p) => api.put(`/admin/products/${id}`, p).then(r => r.data);
export const adminDeleteProduct = (id) => api.delete(`/admin/products/${id}`).then(r => r.data);
export const adminCreateTheme = (t) => api.post('/admin/themes', t).then(r => r.data);
export const adminUpdateTheme = (id, t) => api.put(`/admin/themes/${id}`, t).then(r => r.data);
export const adminDeleteTheme = (id) => api.delete(`/admin/themes/${id}`).then(r => r.data);
export const adminCreateBanner = (b) => api.post('/admin/banners', b).then(r => r.data);
export const adminUpdateBanner = (id, b) => api.put(`/admin/banners/${id}`, b).then(r => r.data);
export const adminDeleteBanner = (id) => api.delete(`/admin/banners/${id}`).then(r => r.data);

export const formatPrice = (n) =>
  `\u20B9 ${Number(n).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
