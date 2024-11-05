import axios from "axios";
import { getSession } from "next-auth/react";

// Configuração da URL base
const api = axios.create({
  baseURL: "http://localhost:3333",
});

// Intercepta todas as requisições e adiciona o token de autenticação
api.interceptors.request.use(async (config) => {
  const session = await getSession();
  if (session && session.token.user.token) {
    config.headers.Authorization = `Bearer ${session.token.user.token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
