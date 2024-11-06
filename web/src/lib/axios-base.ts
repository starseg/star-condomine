import axios from "axios";

// Configuração da URL base
const apiBase = axios.create({
  baseURL: "http://localhost:3333",
});
export default apiBase;
