import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const callbackCEP = async (conteudo: any) => {
  if (!("erro" in conteudo)) {
    try {
      const response = await fetch(
        `https://viacep.com.br/ws/${conteudo.cep}/json/`
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Erro ao buscar dados do CEP:", error);
      console.log("Erro ao buscar dados do CEP.");
    }
  } else {
    console.log("CEP não encontrado.");
  }
};

export const searchCEP = async (valor: string) => {
  const cep = valor.replace(/\D/g, "");

  if (cep !== "") {
    const validacep = /^[0-9]{8}$/;

    if (validacep.test(cep)) {
      return callbackCEP({ cep });
    } else {
      console.log("Formato de CEP inválido.");
    }
  } else {
    console.log("CEP sem valor.");
  }
};

export const formatDate = (date: string) => {
  const data = new Date(date);
  return format(data, 'dd/MM/yyyy - HH:mm');
}