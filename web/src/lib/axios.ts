import axios from "axios";

// Configuração da URL base
const api = axios.create({
  baseURL: process.env.API_URL,
});

export default api;
