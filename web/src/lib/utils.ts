import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";

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
  return format(data, "dd/MM/yyyy - HH:mm");
};

export const simpleDateFormat = (value: string) => {
  const date = new Date(value);
  return format(date, "dd/MM/yyyy");
};

export const generatePagination = (currentPage: number, totalPages: number) => {
  // If the total number of pages is 7 or less,
  // display all pages without any ellipsis.
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // If the current page is among the first 3 pages,
  // show the first 3, an ellipsis, and the last 2 pages.
  if (currentPage <= 3) {
    return [1, 2, 3, "...", totalPages - 1, totalPages];
  }

  // If the current page is among the last 3 pages,
  // show the first 2, an ellipsis, and the last 3 pages.
  if (currentPage >= totalPages - 2) {
    return [1, 2, "...", totalPages - 2, totalPages - 1, totalPages];
  }

  // If the current page is somewhere in the middle,
  // show the first page, an ellipsis, the current page and its neighbors,
  // another ellipsis, and the last page.
  return [currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
};
