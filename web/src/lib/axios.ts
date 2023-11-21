import axios from 'axios';

// Configuração da URL base
const api = axios.create({
  baseURL: 'http://localhost:3000',
});

export default api;
