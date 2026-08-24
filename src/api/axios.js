import axios from 'axios';

const api = axios.create({
    // Cambia esta URL según tu configuración local o de producción
    baseURL: import.meta.env.VITE_API_URL,
});

export default api;
