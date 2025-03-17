import axios from 'axios'

export const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: false
})

// Intercepteur pour les erreurs
API.interceptors.response.use(
    response => response,
    error => {
        return Promise.reject(error.response?.data?.message || 'Erreur réseau')
    }
)