import { firebaseConfig } from "./firebase";
import { initializeApp } from "firebase/app";
import {
  StorageError,
  deleteObject,
  getDownloadURL,
  getMetadata,
  getStorage,
  ref,
  uploadBytes,
} from "firebase/storage";

type UploadFunction = (file: File, fileName: string) => Promise<string>;
const uploadFile: UploadFunction = async (file, fileName) => {
  initializeApp(firebaseConfig);
  const storage = getStorage();
  const fileRef = ref(storage, fileName);
  try {
    await uploadBytes(fileRef, file).then((snapshot) => {});
    const downloadURL = await getDownloadURL(fileRef);
    return downloadURL;
  } catch (error) {
    console.error("Erro ao enviar o arquivo:", error);
    throw error;
  }
};

export const handleFileUpload = async (file: File, fileName: string) => {
  try {
    const url = await uploadFile(file, fileName);
    return url;
  } catch (error) {
    console.error("Erro durante o upload:", error);
  }
};

type DeleteFunction = (fileUrl: string) => Promise<void>;
export const deleteFile: DeleteFunction = async (fileUrl) => {
  initializeApp(firebaseConfig);
  const storage = getStorage();
  try {
    // Extrai o caminho do arquivo da URL
    const path = getPathFromUrl(fileUrl);
    // Obtém a referência do arquivo com base no caminho
    const fileRef = ref(storage, path);
    // Obtém metadados do arquivo para verificar se ele existe
    await getMetadata(fileRef);
    // Se chegou até aqui, o arquivo existe e pode ser excluído
    await deleteObject(fileRef);
    // Arquivo excluído com sucesso!
  } catch (error) {
    if (
      error instanceof StorageError &&
      error.code === "storage/object-not-found"
    ) {
      console.warn("O arquivo não foi encontrado e não pôde ser excluído.");
    } else {
      console.error("Erro ao excluir o arquivo:", error);
      throw error;
    }
  }
};

function getPathFromUrl(url: string): string {
  // Encontra o início do caminho após '/o/'
  const startIndex = url.indexOf("/o/") + 3;
  // Encontra o fim do caminho antes do ponto de interrogação
  const endIndex = url.indexOf("?");
  // Obtém o caminho completo
  const fullPath = url.substring(startIndex, endIndex);
  // Decodifica os caracteres especiais na URL
  return decodeURIComponent(fullPath);
}
