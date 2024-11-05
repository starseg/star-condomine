import { Session } from "next-auth";
import api from "./axios";

/* função para buscar dado específico pelo id
   parâmetros:
       path = caminho da requisição + id
       token = código salvo na sessão do usuário
         - session?.token.user.token
   retorno: resposta da api à requisição
        guardar num useState
*/
const find = async (path: string, token: Session) => {
  try {
    const response = await api.get(path);
    return response.data;
  } catch (error) {
    console.error("Erro ao obter dados:", error);
  }
};

/* função para buscar dados com filtros
   parâmetros:
        query = parametros de busca informados pela url
        url1 = caminho da requisição, caso não tenha uma query
        url2 = caminho da requisição, caso tenha uma query
        token = código salvo na sessão do usuário
          - session?.token.user.token
   retorno: resposta da api à requisição
        guardar num useState
*/
const filtered = async (
  query: string,
  url1: string,
  url2: string,
  token: Session
) => {
  try {
    let path;
    if (!query) path = url1;
    else path = url2;
    const response = await api.get(path);
    return response.data;
  } catch (error) {
    console.error("Erro ao obter dados:", error);
  }
};

export const apiFunctions = {
  find,
  filtered,
};
