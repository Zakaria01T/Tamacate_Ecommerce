import axios from 'axios';

export const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: false,
});

// Add a request interceptor to dynamically set the Authorization header
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('csrf_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

