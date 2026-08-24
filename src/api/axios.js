import axios from 'axios';

const api = axios.create({
    // Cambia esta URL según tu configuración local o de producción
    baseURL: 'http://localhost:8000/api',
    //baseURL: 'https://g6q4l19k-8000.usw3.devtunnels.ms/api',
});

export default api;
