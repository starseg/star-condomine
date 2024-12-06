import axios from "axios";

// Configuração da URL base
const apiBase = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

console.log("NEXT PUBLIC API URL", process.env.NEXT_PUBLIC_API_URL);

export default apiBase;
