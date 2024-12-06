import axios, { AxiosInstance } from "axios";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";

// Configuração da URL base
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

let cachedSession: Session | null = null;

api.interceptors.request.use(
  async (config) => {
    // Se a sessão já foi carregada antes, use o cache
    if (!cachedSession) {
      cachedSession = await getSession();
    }
    if (cachedSession && cachedSession.token.user.token) {
      config.headers.Authorization = `Bearer ${cachedSession.token.user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Adiciona o método `clearSessionCache` ao `api` e define o tipo do método
(api as AxiosInstance & { clearSessionCache: () => void }).clearSessionCache =
  () => {
    cachedSession = null;
  };

export default api as AxiosInstance & { clearSessionCache: () => void };
