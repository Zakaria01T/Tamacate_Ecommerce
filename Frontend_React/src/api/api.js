import axios from 'axios';

export const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { Authorization: `Bearer ${localStorage.getItem('csrf_token')}` },
  withCredentials: false,
});

