// src/api.js

import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000/api', // Substitua pela URL base da sua API Laravel
    timeout: 10000, // Define um timeout
    headers: {
        'Content-Type': 'application/json',
    }
});
// Antes de enviar a requisição
api.interceptors.request.use(
    config => {
        // Aqui, você pode por exemplo adicionar um token JWT ao header
        // config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);
// Antes de tratar a resposta
api.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        // Aqui, você pode tratar erros globalmente
        console.error("Erro na requisição:", error);
        return Promise.reject(error);
    }
);
export default api;
