import axios from "axios";

// Configuração da URL base
const apiBase = axios.create({
  baseURL: process.env.API_URL,
});

export default apiBase;
