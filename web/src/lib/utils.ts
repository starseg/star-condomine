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
    }
  }
};

export const searchCEP = async (valor: string) => {
  const cep = valor.replace(/\D/g, "");

  if (cep !== "") {
    const validacep = /^[0-9]{8}$/;

    if (validacep.test(cep)) {
      return callbackCEP({ cep });
    }
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
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  if (currentPage <= 3) {
    return [1, 2, 3, "...", totalPages - 1, totalPages];
  }
  if (currentPage >= totalPages - 2) {
    return [1, 2, "...", totalPages - 2, totalPages - 1, totalPages];
  }
  return [currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
};

export function secondsToHHMM(seconds: number) {
  // Calcula as horas, minutos e segundos
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  // Formata cada componente para ter sempre 2 dígitos
  const formattedHours = String(hours).padStart(2, "0");
  const formattedMinutes = String(minutes).padStart(2, "0");

  // Retorna o resultado no formato "HH:MM:SS"
  return `${formattedHours}:${formattedMinutes}`;
}

export function base64ToFile(base64: string, fileName: string): File {
  // Verifique se a string base64 tem um prefixo e remova-o
  let base64Data = base64;
  const mimeMatch = base64.match(/^data:(.*);base64,(.*)$/);
  let mimeType = "application/octet-stream"; // Tipo padrão

  if (mimeMatch) {
    mimeType = mimeMatch[1];
    base64Data = mimeMatch[2];
  }

  // Decodifique a string base64
  const byteString = atob(base64Data);

  // Crie um array de bytes
  const byteNumbers = new Array(byteString.length);
  for (let i = 0; i < byteString.length; i++) {
    byteNumbers[i] = byteString.charCodeAt(i);
  }

  const byteArray = new Uint8Array(byteNumbers);

  // Crie um Blob a partir do array de bytes
  const blob = new Blob([byteArray], { type: mimeType });

  // Crie um objeto File a partir do Blob
  const file = new File([blob], fileName, { type: mimeType });

  return file;
}

export function isValidURL(str: string): boolean {
  try {
    new URL(str);
    return true;
  } catch (_) {
    return false;
  }
}
